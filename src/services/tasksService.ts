import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
  getDoc,
  Timestamp,
  onSnapshot,
  FirestoreError,
  limit,
  startAfter,
  DocumentSnapshot,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  TaskDocument,
  COLLECTIONS,
  TaskFilterParams,
  TaskQueryResult,
  TaskCache,
  CACHE_DURATION,
} from "../types/firestore";
import { logger } from "../utils/logger";
import { logServiceError } from "../utils/errorLogging";

// Create a service-specific logger
const tasksLogger = logger.service("tasksService");

const validateNonEmptyString = (value: string, fieldName: string): void => {
  if (!value) {
    tasksLogger.error(`${fieldName} validation failed: value is required`);
    throw new Error(`${fieldName} is required`);
  }
  if (typeof value !== "string") {
    tasksLogger.error(`${fieldName} validation failed: must be a string`, {
      [fieldName.toLowerCase()]: value,
    });
    throw new Error(`${fieldName} must be a string`);
  }
  if (value.trim() === "") {
    tasksLogger.error(`${fieldName} validation failed: cannot be empty`);
    throw new Error(`${fieldName} cannot be empty`);
  }
};

const validateUserId = (userId: string) => validateNonEmptyString(userId, "User ID");
const validateTaskId = (taskId: string) => validateNonEmptyString(taskId, "Task ID");

/**
 * Handle Firestore-specific errors
 */
const handleFirestoreError = (
  error: FirestoreError,
  operation: string,
  context: Record<string, any>,
): never => {
  let errorMessage = `Firestore error during ${operation}`;

  switch (error.code) {
    case "permission-denied":
      errorMessage = `Permission denied while ${operation}`;
      break;
    case "not-found":
      errorMessage = `Resource not found while ${operation}`;
      break;
    case "unavailable":
      errorMessage = `Firestore service unavailable while ${operation}`;
      break;
    case "failed-precondition":
      errorMessage = `Operation failed due to invalid state while ${operation}`;
      break;
  }

  logServiceError(error, "tasksService", errorMessage, {
    ...context,
    errorCode: error.code,
  });
  throw new Error(errorMessage);
};

/**
 * Create a new task in Firestore (simplified - accepts full task data)
 */
export const createTaskFromData = async (
  userId: string,
  taskData: Partial<TaskDocument>,
): Promise<string> => {
  try {
    validateUserId(userId);

    if (
      !taskData.title ||
      typeof taskData.title !== "string" ||
      taskData.title.trim() === ""
    ) {
      tasksLogger.error("Task creation failed: Invalid title", { userId });
      throw new Error("Task title is required and cannot be empty");
    }

    tasksLogger.info("Creating new task", { userId, title: taskData.title });

    // Prepare task document - filter out undefined values
    const cleanData: Omit<TaskDocument, "createdAt" | "updatedAt"> & {
      createdAt: any;
      updatedAt: any;
    } = {
      userId,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || undefined,
      completed: taskData.completed ?? false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Only add optional fields if they have values
    if (taskData.dueDate) {
      cleanData.dueDate =
        taskData.dueDate instanceof Timestamp
          ? taskData.dueDate
          : Timestamp.fromDate(taskData.dueDate as any);
    }
    if (taskData.tags && taskData.tags.length > 0) {
      cleanData.tags = taskData.tags;
    }
    if (taskData.categoryId) {
      cleanData.categoryId = taskData.categoryId;
    }
    if (taskData.category) {
      cleanData.category = taskData.category;
    }
    if (taskData.order !== undefined) {
      cleanData.order = taskData.order;
    }
    if (taskData.status) {
      cleanData.status = taskData.status;
    }
    if (taskData.priority) {
      cleanData.priority = taskData.priority;
    }

    // Remove undefined values
    const finalData = Object.fromEntries(
      Object.entries(cleanData).filter(([_, value]) => value !== undefined),
    );

    const docRef = await addDoc(collection(db, COLLECTIONS.TASKS), finalData);
    tasksLogger.info("Task created successfully", {
      taskId: docRef.id,
      userId,
    });
    return docRef.id;
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, "creating task", { userId, taskData });
    }
    logServiceError(error as Error, "tasksService", "Failed to create task", {
      userId,
      taskData,
    });
    throw new Error("Failed to create task. Please try again.");
  }
};

/**
 * Create a new task in Firestore (legacy - for backward compatibility)
 */
export const createTask = async (
  userId: string,
  text: string,
  dueDate?: Date,
): Promise<string> => {
  return createTaskFromData(userId, {
    title: text,
    dueDate: dueDate ? Timestamp.fromDate(dueDate) : undefined,
  });
};

// Cache management
const getCachedTasks = (
  userId: string,
  filterParams: TaskFilterParams,
): TaskDocument[] | null => {
  const cacheKey = `tasks_${userId}_${JSON.stringify(filterParams)}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const {
      data,
      timestamp,
      filterParams: cachedParams,
    }: TaskCache = JSON.parse(cached);
    if (
      Date.now() - timestamp < CACHE_DURATION &&
      JSON.stringify(filterParams) === JSON.stringify(cachedParams)
    ) {
      return data;
    }
  }
  return null;
};

const setCachedTasks = (
  userId: string,
  filterParams: TaskFilterParams,
  tasks: TaskDocument[],
) => {
  const cacheKey = `tasks_${userId}_${JSON.stringify(filterParams)}`;
  const cache: TaskCache = {
    data: tasks,
    timestamp: Date.now(),
    filterParams,
  };
  localStorage.setItem(cacheKey, JSON.stringify(cache));
};

/**
 * Invalidate task list cache for a user so the next subscription gets fresh data.
 * Call after creating/updating/deleting tasks so returning to a list view shows the change.
 */
export const invalidateTasksCache = (userId: string): void => {
  const prefix = `tasks_${userId}_`;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) keysToRemove.push(key);
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};

/** Sort tasks by manual order (order ?? Infinity so missing order goes to end), then createdAt as tie-break. */
const sortByManualOrder = <T extends { order?: number; createdAt?: any }>(
  tasks: T[],
): T[] => {
  return [...tasks].sort((a, b) => {
    const orderA = a.order ?? Infinity;
    const orderB = b.order ?? Infinity;
    if (orderA !== orderB) return orderA - orderB;
    const timeA = a.createdAt?.toMillis?.() ?? 0;
    const timeB = b.createdAt?.toMillis?.() ?? 0;
    return timeA - timeB;
  });
};

/**
 * Build Firestore query based on filter parameters
 */
const buildTaskQuery = (
  userId: string,
  filterParams: TaskFilterParams = {},
  lastVisible?: DocumentSnapshot,
) => {
  let conditions: any[] = [where("userId", "==", userId)];

  // Add completion status filter
  if (filterParams.completionStatus === "active") {
    conditions.push(where("completed", "==", false));
  } else if (filterParams.completionStatus === "completed") {
    conditions.push(where("completed", "==", true));
  }

  // Add date-based filters
  if (filterParams.view === "today") {
    const today = new Date();
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );
    conditions.push(
      where("dueDate", ">=", Timestamp.fromDate(today)),
      where("dueDate", "<", Timestamp.fromDate(tomorrow)),
    );
  } else if (
    filterParams.view === "upcoming" ||
    filterParams.filterFutureDates
  ) {
    conditions.push(where("dueDate", ">", Timestamp.fromDate(new Date())));
  }

  // Add sorting. Manual sort is applied in-memory after fetch so tasks without order are included.
  const sortDirection = filterParams.sortOrder === "asc" ? "asc" : "desc";
  if (filterParams.sortBy === "manual") {
    conditions.push(orderBy("createdAt", sortDirection));
  } else if (filterParams.sortBy === "dueDate") {
    conditions.push(orderBy("dueDate", sortDirection));
  } else if (filterParams.completionStatus === "completed") {
    conditions.push(orderBy("updatedAt", sortDirection));
  } else {
    conditions.push(orderBy("createdAt", sortDirection));
  }

  // Add pagination
  if (filterParams.limit) {
    conditions.push(limit(filterParams.limit));
  }

  // Create the query
  let q = query(collection(db, COLLECTIONS.TASKS), ...conditions);

  // Add startAfter for pagination
  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  return q;
};

/**
 * Subscribe to tasks for a user (real-time)
 */
export const subscribeToTasks = (
  userId: string,
  filterParams: TaskFilterParams = {},
  callback: (result: TaskQueryResult) => void,
): (() => void) => {
  try {
    // Check cache first (do not clear loading; server snapshot will)
    const cachedTasks = getCachedTasks(userId, filterParams);
    if (cachedTasks) {
      callback({
        tasks: cachedTasks,
        lastVisible: null,
        hasMore: false,
        fromServer: false,
      });
    }

    const q = buildTaskQuery(userId, filterParams);

    // Subscribe to query results; only treat as "loaded" when we have a server snapshot
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        try {
          let tasks = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as (TaskDocument & { id: string })[];
          if (filterParams.sortBy === "manual") {
            tasks = sortByManualOrder(tasks);
          }
          // Update cache
          setCachedTasks(userId, filterParams, tasks);

          const fromServer = !querySnapshot.metadata.fromCache;
          callback({
            tasks,
            lastVisible:
              querySnapshot.docs[querySnapshot.docs.length - 1] || null,
            hasMore: querySnapshot.docs.length === (filterParams.limit || 20),
            fromServer,
          });
        } catch (error) {
          tasksLogger.error("Error processing task data", {
            userId,
            filterParams,
            error: error instanceof Error ? error.message : "Unknown error",
          });
          callback({
            tasks: [],
            lastVisible: null,
            hasMore: false,
            fromServer: true,
          });
        }
      },
      (error: unknown) => {
        if (error instanceof FirestoreError) {
          handleFirestoreError(error, "task subscription", {
            userId,
            filterParams,
          });
          return;
        }
        tasksLogger.error("Unexpected error in task subscription", {
          userId,
          filterParams,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        callback({
          tasks: [],
          lastVisible: null,
          hasMore: false,
          fromServer: true,
        });
      },
    );

    return () => {
      try {
        unsubscribe();
      } catch (error) {
        tasksLogger.error("Error during subscription cleanup", { userId });
      }
    };
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, "setting up task subscription", {
        userId,
        filterParams,
      });
    } else {
      tasksLogger.error("Failed to set up task subscription", {
        userId,
        filterParams,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    callback({
      tasks: [],
      lastVisible: null,
      hasMore: false,
      fromServer: true,
    });
    return () => {};
  }
};

/**
 * Load more tasks (pagination)
 */
export const loadMoreTasks = async (
  userId: string,
  filterParams: TaskFilterParams,
  lastVisible: DocumentSnapshot,
): Promise<TaskQueryResult> => {
  try {
    const q = buildTaskQuery(userId, filterParams, lastVisible);
    const querySnapshot = await getDocs(q);

    let tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (TaskDocument & { id: string })[];
    if (filterParams.sortBy === "manual") {
      tasks = sortByManualOrder(tasks);
    }

    return {
      tasks,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
      hasMore: querySnapshot.docs.length === (filterParams.limit || 20),
    };
  } catch (error) {
    tasksLogger.error("Failed to load more tasks", {
      userId,
      filterParams,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};

/**
 * Batch update tasks
 */
export const batchUpdateTasks = async (
  updates: Array<{ id: string; data: Partial<TaskDocument> }>,
  userId: string,
): Promise<void> => {
  try {
    const batch = writeBatch(db);

    for (const { id, data } of updates) {
      const taskRef = doc(db, COLLECTIONS.TASKS, id);
      batch.update(taskRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
  } catch (error) {
    tasksLogger.error("Failed to batch update tasks", {
      updates,
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};

/**
 * Verify task ownership before any update/delete operation
 */
const verifyTaskOwnership = async (
  taskId: string,
  userId: string,
): Promise<void> => {
  try {
    validateTaskId(taskId);
    validateUserId(userId);

    const taskDoc = await getDoc(doc(db, COLLECTIONS.TASKS, taskId));

    if (!taskDoc.exists()) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    const taskData = taskDoc.data() as TaskDocument;
    if (taskData.userId !== userId) {
      throw new Error(`User ${userId} does not own task ${taskId}`);
    }
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, "verifying task ownership", {
        taskId,
        userId,
      });
    }
    tasksLogger.error("Failed to verify task ownership", {
      taskId,
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};

/**
 * Update an entire task with all fields
 */
export const updateTask = async (
  taskId: string,
  taskData: Partial<TaskDocument>,
  userId: string,
): Promise<void> => {
  try {
    // Verify task ownership
    await verifyTaskOwnership(taskId, userId);

    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);

    // Clean up the data before update
    const cleanedData: Partial<TaskDocument> = {};

    if (taskData.title !== undefined) {
      cleanedData.title = taskData.title.trim();
    }

    if (taskData.description !== undefined) {
      cleanedData.description = taskData.description?.trim() || undefined;
    }

    if (taskData.completed !== undefined) {
      cleanedData.completed = taskData.completed;
    }

    if (taskData.notes !== undefined) {
      cleanedData.notes = taskData.notes.trim();
    }

    if (taskData.dueDate !== undefined) {
      cleanedData.dueDate = taskData.dueDate;
    }

    if (taskData.priority !== undefined) {
      cleanedData.priority = taskData.priority;
    }

    if (taskData.status !== undefined) {
      cleanedData.status = taskData.status;
    }

    if (taskData.categoryId !== undefined) {
      cleanedData.categoryId = taskData.categoryId;
    }

    if (taskData.tags !== undefined) {
      cleanedData.tags = taskData.tags;
    }

    if (taskData.order !== undefined) {
      cleanedData.order = taskData.order;
    }

    // Always update updatedAt timestamp
    cleanedData.updatedAt = serverTimestamp();

    await updateDoc(taskRef, cleanedData);
  } catch (error) {
    logServiceError(error as Error, "tasksService", "Failed to update task", {
      taskId,
      userId,
      taskData,
    });
    throw new Error("Failed to update task");
  }
};

/**
 * Update a task's manual order (single write). Use for drag reorder.
 */
export const updateTaskOrder = async (
  taskId: string,
  order: number,
  userId: string,
): Promise<void> => {
  try {
    validateTaskId(taskId);
    validateUserId(userId);
    await verifyTaskOwnership(taskId, userId);
    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
    await updateDoc(taskRef, {
      order,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, "updating task order", {
        taskId,
        userId,
        order,
      });
    }
    tasksLogger.error("Failed to update task order", {
      taskId,
      userId,
      order,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw new Error("Failed to update task order. Please try again.");
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (
  taskId: string,
  userId: string,
): Promise<void> => {
  try {
    validateTaskId(taskId);
    validateUserId(userId);

    await verifyTaskOwnership(taskId, userId);

    await deleteDoc(doc(db, COLLECTIONS.TASKS, taskId));
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, "deleting task", { taskId, userId });
    }
    tasksLogger.error("Failed to delete task", {
      taskId,
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw new Error("Failed to delete task. Please try again.");
  }
};
