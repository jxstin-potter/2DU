import { Timestamp, DocumentSnapshot, FieldValue } from 'firebase/firestore';
import { Task } from './task';

/**
 * Interface for tasks collection in Firestore
 * This matches the Task interface but uses Firestore types
 */
export interface TaskDocument {
  /** Firestore document id (not stored in doc data). */
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  dueDate?: Timestamp | null;
  tags?: string[];
  order?: number;
  notes?: string;
  categoryId?: string;
  category?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'done';
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }>;
  comments?: Array<{
    id: string;
    userId: string;
    text: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Timestamp;
  }>;
  sharedWith?: string[];
  isShared?: boolean;
  lastSharedAt?: Timestamp;
  estimatedTime?: number;
  actualTime?: number;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskFilterParams {
  completionStatus?: 'all' | 'active' | 'completed';
  sortBy?: 'creationDate' | 'dueDate' | 'manual';
  sortOrder?: 'asc' | 'desc';
  view?: 'today' | 'upcoming' | 'calendar' | 'completed';
  filterFutureDates?: boolean;
  limit?: number;
  lastVisible?: DocumentSnapshot;
  searchQuery?: string;
}

export interface TaskQueryResult {
  tasks: TaskDocument[];
  lastVisible: DocumentSnapshot | null;
  hasMore: boolean;
  /** True when this result is from the server (not local cache). Use to avoid showing empty state before server data loads. */
  fromServer?: boolean;
}

export interface TaskCache {
  data: TaskDocument[];
  timestamp: number;
  filterParams: TaskFilterParams;
}

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Helper function to convert Firestore Timestamp to Date
 */
export const timestampToDate = (timestamp: Timestamp | null | undefined): Date | null => {
  if (!timestamp) return null;
  return timestamp.toDate();
};

/**
 * Helper function to convert Date to Firestore Timestamp
 */
export const dateToTimestamp = (date: Date | null | undefined): Timestamp | null => {
  if (!date) return null;
  return Timestamp.fromDate(date);
};

/**
 * Coerce common Firestore timestamp-like values into a Date.
 * We accept Timestamps, JS Dates, and objects with a `toDate()` method.
 */
export const timestampLikeToDate = (value: Timestamp | FieldValue | Date | null | undefined): Date => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const maybeTimestamp = value as unknown as { toDate?: () => Date };
  return typeof maybeTimestamp.toDate === 'function' ? maybeTimestamp.toDate() : new Date();
};

type TaskDocumentInput = Partial<TaskDocument> & { id?: string };

/**
 * Convert TaskDocument to Task
 */
export const taskDocumentToTask = (doc: TaskDocumentInput): Task => {
  return {
    id: doc.id ?? '',
    title: doc.title ?? '',
    description: doc.description,
    completed: doc.completed ?? false,
    userId: doc.userId ?? '',
    createdAt: timestampLikeToDate(doc.createdAt as any),
    updatedAt: timestampLikeToDate(doc.updatedAt as any),
    dueDate: doc.dueDate ? timestampToDate(doc.dueDate as any) : null,
    tags: doc.tags ?? [],
    order: doc.order ?? 0,
    notes: doc.notes,
    categoryId: doc.categoryId,
    category: doc.category,
    status: doc.status,
    priority: doc.priority,
    sharedWith: doc.sharedWith,
    isShared: doc.isShared,
    estimatedTime: doc.estimatedTime,
    actualTime: doc.actualTime,
    assignedTo: doc.assignedTo,
    subtasks: doc.subtasks?.map(subtask => ({
      ...subtask,
      createdAt: timestampLikeToDate(subtask.createdAt as any),
      updatedAt: timestampLikeToDate(subtask.updatedAt as any),
    })),
    comments: doc.comments?.map(comment => ({
      ...comment,
      createdAt: timestampLikeToDate(comment.createdAt as any),
      updatedAt: timestampLikeToDate(comment.updatedAt as any),
    })),
    attachments: doc.attachments?.map(attachment => ({
      ...attachment,
      uploadedAt: timestampLikeToDate(attachment.uploadedAt as any),
    })),
    lastSharedAt: doc.lastSharedAt ? timestampToDate(doc.lastSharedAt as any) : null,
  };
};

/**
 * Convert a *partial* Task update into a Firestore TaskDocument patch.
 * This is the canonical way to build update payloads for `updateTask(...)`.
 */
export const taskPatchToTaskDocument = (patch: Partial<Task>): Partial<TaskDocument> => {
  const doc: Partial<TaskDocument> = {};

  if (patch.title !== undefined) doc.title = patch.title;
  if (patch.description !== undefined) doc.description = patch.description || undefined;
  if (patch.completed !== undefined) doc.completed = patch.completed;
  if (patch.userId !== undefined) doc.userId = patch.userId;
  if (patch.tags !== undefined) doc.tags = patch.tags;
  if (patch.order !== undefined) doc.order = patch.order;
  if (patch.notes !== undefined) doc.notes = patch.notes;
  if (patch.categoryId !== undefined) doc.categoryId = patch.categoryId;
  if (patch.category !== undefined) doc.category = patch.category;
  if (patch.status !== undefined) doc.status = patch.status;
  if (patch.priority !== undefined) doc.priority = patch.priority;
  if (patch.sharedWith !== undefined) doc.sharedWith = patch.sharedWith as any;
  if (patch.isShared !== undefined) doc.isShared = patch.isShared;
  if (patch.estimatedTime !== undefined) doc.estimatedTime = patch.estimatedTime;
  if (patch.actualTime !== undefined) doc.actualTime = patch.actualTime;
  if (patch.assignedTo !== undefined) doc.assignedTo = patch.assignedTo;

  if (patch.dueDate !== undefined) {
    doc.dueDate = patch.dueDate ? Timestamp.fromDate(patch.dueDate) : null;
  }
  if (patch.lastSharedAt !== undefined) {
    doc.lastSharedAt = patch.lastSharedAt ? Timestamp.fromDate(patch.lastSharedAt) : undefined;
  }
  if (patch.subtasks !== undefined) {
    doc.subtasks = patch.subtasks?.map(subtask => ({
      ...subtask,
      createdAt: Timestamp.fromDate(subtask.createdAt),
      updatedAt: Timestamp.fromDate(subtask.updatedAt),
    }));
  }
  if (patch.comments !== undefined) {
    doc.comments = patch.comments?.map(comment => ({
      ...comment,
      createdAt: Timestamp.fromDate(comment.createdAt),
      updatedAt: Timestamp.fromDate(comment.updatedAt),
    }));
  }
  if (patch.attachments !== undefined) {
    doc.attachments = patch.attachments?.map(attachment => ({
      ...attachment,
      uploadedAt: Timestamp.fromDate(attachment.uploadedAt),
    }));
  }

  return Object.fromEntries(Object.entries(doc).filter(([, value]) => value !== undefined)) as Partial<TaskDocument>;
};

/**
 * Collection paths in Firestore
 */
export const COLLECTIONS = {
  TASKS: 'tasks',
  USERS: 'users'
} as const; 