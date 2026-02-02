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
    priority: doc.priority,
  };
};

/**
 * Parse time from natural language text and return the time and cleaned text
 * Supports formats like "3pm", "3 pm", "at 3pm", "3:00pm", "3am", etc.
 * @param text - The text to parse
 * @returns Object with time (Date for today at parsed time, or null) and cleanedText
 */
export const parseTimeFromText = (text: string): { time: Date | null; cleanedText: string; matchInfo?: { start: number; end: number; text: string } } => {
  // Regex pattern matches: "at 3pm", "3pm", "3 pm", "3:00pm", "3:00 pm", "at 3:30pm", "Trash 3pm", etc.
  // Pattern breakdown:
  // - (?:^|\s) - start of string or whitespace (captured for removal)
  // - (?:at\s+)? - optional "at" followed by spaces
  // - (\d{1,2}) - hour (1-2 digits)
  // - (?::(\d{2}))? - optional colon and minutes
  // - \s* - optional whitespace
  // - (am|pm) - am or pm
  // - \b - word boundary
  // Note: "at" is optional - just typing "3pm" or "Trash 3pm" works fine
  const timePattern = /(?:^|\s)(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/gi;
  
  const match = timePattern.exec(text);

  if (!match) {
    return { time: null, cleanedText: text };
  }
  
  // Store match info for highlighting
  const matchStart = match.index!;
  const matchEnd = matchStart + match[0].length;
  const matchText = match[0].trim();
  
  const hour = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3].toLowerCase();

  // Validate hour and minutes
  if (hour < 1 || hour > 12 || minutes < 0 || minutes > 59) {
    return { time: null, cleanedText: text };
  }
  
  // Convert to 24-hour format
  let hour24 = hour;
  if (period === 'pm' && hour !== 12) {
    hour24 = hour + 12;
  } else if (period === 'am' && hour === 12) {
    hour24 = 0;
  }

  // Create date for today at the parsed time
  const today = new Date();
  const time = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour24, minutes, 0);

  // Keep the original text - don't remove the time expression
  // Like Todoist, we keep "3pm" visible in the input but parse and set the time
  // The time text stays in the title so users can see what they typed
  const cleanedText = text;

  return { 
    time, 
    cleanedText,
    matchInfo: {
      start: matchStart,
      end: matchEnd,
      text: matchText
    }
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
  if (task.priority !== undefined) doc.priority = task.priority;
  
  // Only include fields that are defined (not undefined)
  return Object.fromEntries(
    Object.entries(doc).filter(([_, value]) => value !== undefined)
  ) as Partial<TaskDocument>;
};
