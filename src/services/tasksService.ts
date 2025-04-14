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
  QueryDocumentSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { TaskDocument, COLLECTIONS, TaskFilterParams, TaskQueryResult, TaskCache, CACHE_DURATION } from '../types/firestore';
import { logger } from '../utils/logger';
import { logServiceError } from '../utils/errorLogging';

// Create a service-specific logger
const tasksLogger = logger.service('tasksService');

/**
 * Validate user ID is provided and is a non-empty string
 */
const validateUserId = (userId: string): void => {
  if (!userId) {
    tasksLogger.error('User ID validation failed: ID is required');
    throw new Error('User ID is required');
  }
  if (typeof userId !== 'string') {
    tasksLogger.error('User ID validation failed: ID must be a string', { userId });
    throw new Error('User ID must be a string');
  }
  if (userId.trim() === '') {
    tasksLogger.error('User ID validation failed: ID cannot be empty');
    throw new Error('User ID cannot be empty');
  }
};

/**
 * Validate task ID is provided and is a non-empty string
 */
const validateTaskId = (taskId: string): void => {
  if (!taskId) {
    tasksLogger.error('Task ID validation failed: ID is required');
    throw new Error('Task ID is required');
  }
  if (typeof taskId !== 'string') {
    tasksLogger.error('Task ID validation failed: ID must be a string', { taskId });
    throw new Error('Task ID must be a string');
  }
  if (taskId.trim() === '') {
    tasksLogger.error('Task ID validation failed: ID cannot be empty');
    throw new Error('Task ID cannot be empty');
  }
};

/**
 * Handle Firestore-specific errors
 */
const handleFirestoreError = (error: FirestoreError, operation: string, context: Record<string, any>): never => {
  let errorMessage = `Firestore error during ${operation}`;
  
  switch (error.code) {
    case 'permission-denied':
      errorMessage = `Permission denied while ${operation}`;
      break;
    case 'not-found':
      errorMessage = `Resource not found while ${operation}`;
      break;
    case 'unavailable':
      errorMessage = `Firestore service unavailable while ${operation}`;
      break;
    case 'failed-precondition':
      errorMessage = `Operation failed due to invalid state while ${operation}`;
      break;
  }
  
  logServiceError(error, 'tasksService', errorMessage, { ...context, errorCode: error.code });
  throw new Error(errorMessage);
};

/**
 * Create a new task in Firestore
 */
export const createTask = async (
  userId: string,
  text: string,
  dueDate?: Date
): Promise<string> => {
  try {
    validateUserId(userId);
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      tasksLogger.error('Task creation failed: Invalid text', { userId });
      throw new Error('Task text is required and cannot be empty');
    }

    tasksLogger.info('Creating new task', { userId, textLength: text.length, hasDueDate: !!dueDate });

    const taskData: Omit<TaskDocument, 'createdAt'> & { createdAt: any } = {
      userId,
      text: text.trim(),
      isCompleted: false,
      createdAt: serverTimestamp()
    };

    if (dueDate instanceof Date) {
      taskData.dueDate = Timestamp.fromDate(dueDate);
    }

    const docRef = await addDoc(
      collection(db, COLLECTIONS.TASKS),
      taskData
    );
    
    tasksLogger.info('Task created successfully', { taskId: docRef.id, userId });
    return docRef.id;
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, 'creating task', { userId, text });
    }
    logServiceError(error as Error, 'tasksService', 'Failed to create task', { userId, text });
    throw new Error('Failed to create task. Please try again.');
  }
};

/**
 * Get all tasks for a specific user
 */
export const getUserTasks = async (userId: string): Promise<(TaskDocument & { id: string })[]> => {
  try {
    validateUserId(userId);
    
    tasksLogger.info('Fetching user tasks', { userId });
    
    const q = query(
      collection(db, COLLECTIONS.TASKS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as TaskDocument
    }));

    tasksLogger.info('Successfully fetched user tasks', { 
      userId, 
      taskCount: tasks.length 
    });
    
    return tasks;
  } catch (error) {
    logServiceError(error as Error, 'tasksService', 'Failed to fetch user tasks', { userId });
    throw new Error('Failed to fetch tasks');
  }
};

/**
 * Filter and sort parameters for tasks
 */
export interface TaskFilterParams {
  completionStatus?: 'all' | 'active' | 'completed';
  sortBy?: 'creationDate' | 'dueDate';
  sortOrder?: 'asc' | 'desc';
  view?: 'today' | 'upcoming' | 'calendar' | 'completed';
  filterFutureDates?: boolean;
  limit?: number;
}

/**
 * Get filtered and sorted tasks for a specific user
 */
export const getFilteredTasks = async (
  userId: string,
  filterParams: TaskFilterParams = {}
): Promise<(TaskDocument & { id: string })[]> => {
  try {
    // Validate userId
    validateUserId(userId);
    
    // Start building query with user filter
    let conditions: any[] = [
      where('userId', '==', userId),
    ];
    
    // Add completion status filter
    if (filterParams.completionStatus === 'active') {
      conditions.push(where('isCompleted', '==', false));
    } else if (filterParams.completionStatus === 'completed') {
      conditions.push(where('isCompleted', '==', true));
    }
    
    // Determine sort direction
    const sortDirection = filterParams.sortOrder === 'asc' ? 'asc' : 'desc';
    
    // Create and execute the query
    let q = query(
      collection(db, COLLECTIONS.TASKS),
      ...conditions,
      filterParams.sortBy === 'dueDate' ? orderBy('dueDate', sortDirection) : orderBy('createdAt', sortDirection)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Map documents to the expected return type
    let tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as TaskDocument
    }));
    
    // If sorting by dueDate, handle null dueDate values (Firebase can't mix null and non-null in orderBy)
    if (filterParams.sortBy === 'dueDate') {
      // Sort tasks with missing due dates to the end if descending, start if ascending
      tasks.sort((a, b) => {
        // If either task has no dueDate
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return sortDirection === 'asc' ? -1 : 1;
        if (!b.dueDate) return sortDirection === 'asc' ? 1 : -1;
        
        // Both have due dates, compare them
        const dateA = a.dueDate.toDate().getTime();
        const dateB = b.dueDate.toDate().getTime();
        
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
    
    // Apply view-specific filters after Firestore query
    if (filterParams.view === 'upcoming' || filterParams.filterFutureDates) {
      const now = new Date();
      // For upcoming view, filter to only include tasks with future due dates
      tasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = task.dueDate.toDate();
        return taskDate > now;
      });
    } else if (filterParams.view === 'today') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      
      // For today view, only include tasks due today
      tasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = task.dueDate.toDate();
        return taskDate >= today && taskDate < tomorrow;
      });
    }
    
    return tasks;
  } catch (error) {
    console.error('Error fetching filtered tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
};

// Cache management
const getCachedTasks = (userId: string, filterParams: TaskFilterParams): TaskDocument[] | null => {
  const cacheKey = `tasks_${userId}_${JSON.stringify(filterParams)}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp, filterParams: cachedParams }: TaskCache = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION && 
        JSON.stringify(filterParams) === JSON.stringify(cachedParams)) {
      return data;
    }
  }
  return null;
};

const setCachedTasks = (userId: string, filterParams: TaskFilterParams, tasks: TaskDocument[]) => {
  const cacheKey = `tasks_${userId}_${JSON.stringify(filterParams)}`;
  const cache: TaskCache = {
    data: tasks,
    timestamp: Date.now(),
    filterParams
  };
  localStorage.setItem(cacheKey, JSON.stringify(cache));
};

/**
 * Build Firestore query based on filter parameters
 */
const buildTaskQuery = (
  userId: string,
  filterParams: TaskFilterParams = {},
  lastVisible?: DocumentSnapshot
) => {
  let conditions: any[] = [where('userId', '==', userId)];

  // Add completion status filter
  if (filterParams.completionStatus === 'active') {
    conditions.push(where('isCompleted', '==', false));
  } else if (filterParams.completionStatus === 'completed') {
    conditions.push(where('isCompleted', '==', true));
  }

  // Add date-based filters
  if (filterParams.view === 'today') {
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    conditions.push(
      where('dueDate', '>=', Timestamp.fromDate(today)),
      where('dueDate', '<', Timestamp.fromDate(tomorrow))
    );
  } else if (filterParams.view === 'upcoming' || filterParams.filterFutureDates) {
    conditions.push(where('dueDate', '>', Timestamp.fromDate(new Date())));
  }

  // Add sorting
  const sortDirection = filterParams.sortOrder === 'asc' ? 'asc' : 'desc';
  if (filterParams.sortBy === 'dueDate') {
    conditions.push(orderBy('dueDate', sortDirection));
  } else {
    conditions.push(orderBy('createdAt', sortDirection));
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
  callback: (result: TaskQueryResult) => void
): (() => void) => {
  try {
    // Check cache first
    const cachedTasks = getCachedTasks(userId, filterParams);
    if (cachedTasks) {
      callback({
        tasks: cachedTasks,
        lastVisible: null,
        hasMore: false
      });
    }

    const q = buildTaskQuery(userId, filterParams);

    // Subscribe to query results
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        try {
          const tasks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as (TaskDocument & { id: string })[];

          // Update cache
          setCachedTasks(userId, filterParams, tasks);

          callback({
            tasks,
            lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
            hasMore: querySnapshot.docs.length === (filterParams.limit || 20)
          });
        } catch (error) {
          tasksLogger.error('Error processing task data', { 
            userId, 
            filterParams, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          callback({
            tasks: [],
            lastVisible: null,
            hasMore: false
          });
        }
      },
      (error) => {
        if (error instanceof FirestoreError) {
          handleFirestoreError(error, 'task subscription', { userId, filterParams });
        } else {
          tasksLogger.error('Unexpected error in task subscription', { 
            userId, 
            filterParams, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch (error) {
        tasksLogger.error('Error during subscription cleanup', { userId });
      }
    };
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, 'setting up task subscription', { userId, filterParams });
    } else {
      tasksLogger.error('Failed to set up task subscription', { 
        userId, 
        filterParams, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
    return () => {};
  }
};

/**
 * Load more tasks (pagination)
 */
export const loadMoreTasks = async (
  userId: string,
  filterParams: TaskFilterParams,
  lastVisible: DocumentSnapshot
): Promise<TaskQueryResult> => {
  try {
    const q = buildTaskQuery(userId, filterParams, lastVisible);
    const querySnapshot = await getDocs(q);

    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (TaskDocument & { id: string })[];

    return {
      tasks,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
      hasMore: querySnapshot.docs.length === (filterParams.limit || 20)
    };
  } catch (error) {
    tasksLogger.error('Failed to load more tasks', { 
      userId, 
      filterParams, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
};

/**
 * Batch update tasks
 */
export const batchUpdateTasks = async (
  updates: Array<{ id: string; data: Partial<TaskDocument> }>,
  userId: string
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    for (const { id, data } of updates) {
      const taskRef = doc(db, COLLECTIONS.TASKS, id);
      batch.update(taskRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    }

    await batch.commit();
  } catch (error) {
    tasksLogger.error('Failed to batch update tasks', { 
      updates, 
      userId, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
};

/**
 * Verify task ownership before any update/delete operation
 */
const verifyTaskOwnership = async (taskId: string, userId: string): Promise<void> => {
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
      handleFirestoreError(error, 'verifying task ownership', { taskId, userId });
    }
    tasksLogger.error('Failed to verify task ownership', { 
      taskId, 
      userId, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
};

/**
 * Update a task's completion status
 */
export const updateTaskStatus = async (
  taskId: string,
  isCompleted: boolean,
  userId: string
): Promise<void> => {
  try {
    validateTaskId(taskId);
    validateUserId(userId);
    
    await verifyTaskOwnership(taskId, userId);
    
    await updateDoc(doc(db, COLLECTIONS.TASKS, taskId), {
      isCompleted,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, 'updating task status', { taskId, userId, isCompleted });
    }
    tasksLogger.error('Failed to update task status', { 
      taskId, 
      userId, 
      isCompleted, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw new Error('Failed to update task status. Please try again.');
  }
};

/**
 * Update a task's text
 */
export const updateTaskText = async (
  taskId: string,
  text: string,
  userId: string
): Promise<void> => {
  try {
    // Verify task ownership
    await verifyTaskOwnership(taskId, userId);
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      throw new Error('Task text is required');
    }
    
    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
    await updateDoc(taskRef, { text: text.trim() });
  } catch (error) {
    console.error('Error updating task text:', error);
    throw new Error('Failed to update task');
  }
};

/**
 * Update an entire task with all fields
 */
export const updateTask = async (
  taskId: string,
  taskData: Partial<TaskDocument>,
  userId: string
): Promise<void> => {
  try {
    // Verify task ownership
    await verifyTaskOwnership(taskId, userId);
    
    // Validate required fields if they are being updated
    if (taskData.text !== undefined && (!taskData.text || typeof taskData.text !== 'string' || taskData.text.trim() === '')) {
      throw new Error('Task text is required');
    }
    
    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
    
    // Clean up the data before update
    const cleanedData: Partial<TaskDocument> = {};
    
    if (taskData.text !== undefined) {
      cleanedData.text = taskData.text.trim();
    }
    
    if (taskData.isCompleted !== undefined) {
      cleanedData.isCompleted = taskData.isCompleted;
    }
    
    if (taskData.notes !== undefined) {
      cleanedData.notes = taskData.notes.trim();
    }
    
    if (taskData.dueDate !== undefined) {
      cleanedData.dueDate = taskData.dueDate;
    }
    
    await updateDoc(taskRef, cleanedData);
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (
  taskId: string,
  userId: string
): Promise<void> => {
  try {
    validateTaskId(taskId);
    validateUserId(userId);
    
    await verifyTaskOwnership(taskId, userId);
    
    await deleteDoc(doc(db, COLLECTIONS.TASKS, taskId));
  } catch (error) {
    if (error instanceof FirestoreError) {
      handleFirestoreError(error, 'deleting task', { taskId, userId });
    }
    tasksLogger.error('Failed to delete task', { 
      taskId, 
      userId, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw new Error('Failed to delete task. Please try again.');
  }
}; 