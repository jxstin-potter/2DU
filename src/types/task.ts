import { SharedUser } from './user';
import { Timestamp } from 'firebase/firestore';

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date | null;
  tags?: string[];
  order?: number;
  notes?: string;
  categoryId?: string;
  category?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'done';
  subtasks?: Subtask[];
  comments?: Comment[];
  attachments?: Attachment[];
  sharedWith?: string[];
  isShared?: boolean;
  lastSharedAt?: Date;
  estimatedTime?: number;
  actualTime?: number;
  assignedTo?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

// For backward compatibility with existing code
export interface FullTask extends Task {
  subtasks: Subtask[];
  reminder?: Date;
  attachments?: Attachment[];
  sharedWith?: SharedUser[];
  isShared?: boolean;
  lastSharedAt?: Date;
  estimatedTime?: number;
  actualTime?: number;
  assignedTo?: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface TaskSortOptions {
  field: keyof Task;
  direction: 'asc' | 'desc';
}