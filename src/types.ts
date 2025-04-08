export interface SharedUser {
  userId: string;
  email: string;
  role: 'viewer' | 'editor';
  sharedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  tags: string[];
  order: number;
  userId: string;
  categoryId?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  subtasks: Subtask[];
  reminder?: Date;
  notes?: string;
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  sharedWith?: SharedUser[];
  isShared?: boolean;
  lastSharedAt?: Date;
  projectId?: string;
  estimatedTime?: number;
  actualTime?: number;
  assignedTo?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
  order: number;
}

export interface Tag {
  name: string;
  color: string;
}

export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this would be hashed
  name: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  highContrast: boolean;
  notifications: boolean;
  defaultView: 'today' | 'upcoming' | 'calendar' | 'tags';
} 