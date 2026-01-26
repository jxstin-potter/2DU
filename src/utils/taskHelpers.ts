import { Timestamp } from 'firebase/firestore';
import { Task } from '../types';
import { TaskDocument } from '../types/firestore';

/**
 * Helper to safely convert Timestamp or Date to Date
 */
const toDate = (value: any): Date => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (value && typeof value.toDate === 'function') return value.toDate();
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  return new Date();
};

/**
 * Convert Firestore TaskDocument to app Task type (robust version)
 */
export const taskDocumentToTask = (doc: any): Task => {
  return {
    id: doc.id || '',
    title: doc.title || '',
    description: doc.description,
    completed: doc.completed ?? false,
    userId: doc.userId || '',
    createdAt: toDate(doc.createdAt),
    updatedAt: toDate(doc.updatedAt),
    dueDate: doc.dueDate ? toDate(doc.dueDate) : undefined,
    tags: doc.tags || [],
    order: doc.order ?? 0,
    notes: doc.notes,
    categoryId: doc.categoryId,
    category: doc.category,
    status: doc.status,
    subtasks: doc.subtasks?.map((subtask: any) => ({
      ...subtask,
      createdAt: toDate(subtask.createdAt),
      updatedAt: toDate(subtask.updatedAt),
    })),
    comments: doc.comments?.map((comment: any) => ({
      ...comment,
      createdAt: toDate(comment.createdAt),
      updatedAt: toDate(comment.updatedAt),
    })),
    attachments: doc.attachments?.map((attachment: any) => ({
      ...attachment,
      uploadedAt: toDate(attachment.uploadedAt),
    })),
    sharedWith: doc.sharedWith,
    isShared: doc.isShared,
    lastSharedAt: doc.lastSharedAt ? toDate(doc.lastSharedAt) : undefined,
    estimatedTime: doc.estimatedTime,
    actualTime: doc.actualTime,
    assignedTo: doc.assignedTo,
  };
};

/**
 * Convert app Task to Firestore TaskDocument (for creating/updating)
 */
export const taskToTaskDocument = (task: Partial<Task>): Partial<TaskDocument> => {
  const doc: Partial<TaskDocument> = {};
  
  if (task.title !== undefined) doc.title = task.title;
  if (task.description !== undefined) doc.description = task.description || undefined;
  if (task.completed !== undefined) doc.completed = task.completed;
  if (task.userId !== undefined) doc.userId = task.userId;
  if (task.dueDate !== undefined) {
    doc.dueDate = task.dueDate ? Timestamp.fromDate(task.dueDate) : null;
  }
  if (task.tags !== undefined) doc.tags = task.tags;
  if (task.order !== undefined) doc.order = task.order;
  if (task.notes !== undefined) doc.notes = task.notes;
  if (task.categoryId !== undefined) doc.categoryId = task.categoryId;
  if (task.category !== undefined) doc.category = task.category;
  if (task.status !== undefined) doc.status = task.status;
  
  // Only include fields that are defined (not undefined)
  return Object.fromEntries(
    Object.entries(doc).filter(([_, value]) => value !== undefined)
  ) as Partial<TaskDocument>;
};
