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

const timestampLikeToDate = (value: Timestamp | FieldValue | null | undefined): Date => {
  if (!value) return new Date();
  const maybeTimestamp = value as unknown as { toDate?: () => Date };
  return typeof maybeTimestamp.toDate === 'function' ? maybeTimestamp.toDate() : new Date();
};

/**
 * Convert TaskDocument to Task
 */
export const taskDocumentToTask = (doc: TaskDocument): Task => {
  return {
    ...doc,
    id: doc.id ?? '',
    createdAt: timestampLikeToDate(doc.createdAt),
    updatedAt: timestampLikeToDate(doc.updatedAt),
    dueDate: timestampToDate(doc.dueDate),
    subtasks: doc.subtasks?.map(subtask => ({
      ...subtask,
      createdAt: subtask.createdAt.toDate(),
      updatedAt: subtask.updatedAt.toDate(),
    })),
    comments: doc.comments?.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toDate(),
      updatedAt: comment.updatedAt.toDate(),
    })),
    attachments: doc.attachments?.map(attachment => ({
      ...attachment,
      uploadedAt: attachment.uploadedAt.toDate(),
    })),
    lastSharedAt: timestampToDate(doc.lastSharedAt),
  };
};

/**
 * Convert Task to TaskDocument
 */
export const taskToTaskDocument = (task: Task): Omit<TaskDocument, 'id'> => {
  // `id` is part of the document path, not the stored data.
  const { id: _id, ...taskData } = task;
  return {
    ...taskData,
    // Persist only user ids/emails (strings) in Firestore.
    sharedWith: taskData.sharedWith?.filter((entry): entry is string => typeof entry === 'string'),
    createdAt: dateToTimestamp(task.createdAt) || Timestamp.now(),
    updatedAt: dateToTimestamp(task.updatedAt) || Timestamp.now(),
    dueDate: dateToTimestamp(task.dueDate),
    subtasks: task.subtasks?.map(subtask => ({
      ...subtask,
      createdAt: dateToTimestamp(subtask.createdAt) || Timestamp.now(),
      updatedAt: dateToTimestamp(subtask.updatedAt) || Timestamp.now(),
    })),
    comments: task.comments?.map(comment => ({
      ...comment,
      createdAt: dateToTimestamp(comment.createdAt) || Timestamp.now(),
      updatedAt: dateToTimestamp(comment.updatedAt) || Timestamp.now(),
    })),
    attachments: task.attachments?.map(attachment => ({
      ...attachment,
      uploadedAt: dateToTimestamp(attachment.uploadedAt) || Timestamp.now(),
    })),
    lastSharedAt: dateToTimestamp(task.lastSharedAt),
  };
};

/**
 * Collection paths in Firestore
 */
export const COLLECTIONS = {
  TASKS: 'tasks',
  USERS: 'users'
} as const; 