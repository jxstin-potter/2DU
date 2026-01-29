import { DocumentSnapshot } from 'firebase/firestore';
import { TaskDocument, TaskFilterParams, TaskQueryResult } from '../types/firestore';
/**
 * Create a new task in Firestore (simplified - accepts full task data)
 */
export declare const createTaskFromData: (userId: string, taskData: Partial<TaskDocument>) => Promise<string>;
/**
 * Create a new task in Firestore (legacy - for backward compatibility)
 */
export declare const createTask: (userId: string, text: string, dueDate?: Date) => Promise<string>;
/**
 * Get all tasks for a specific user
 */
export declare const getUserTasks: (userId: string) => Promise<(TaskDocument & {
    id: string;
})[]>;
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
export declare const getFilteredTasks: (userId: string, filterParams?: TaskFilterParams) => Promise<(TaskDocument & {
    id: string;
})[]>;
/**
 * Subscribe to tasks for a user (real-time)
 */
export declare const subscribeToTasks: (userId: string, filterParams: TaskFilterParams, callback: (result: TaskQueryResult) => void) => (() => void);
/**
 * Load more tasks (pagination)
 */
export declare const loadMoreTasks: (userId: string, filterParams: TaskFilterParams, lastVisible: DocumentSnapshot) => Promise<TaskQueryResult>;
/**
 * Batch update tasks
 */
export declare const batchUpdateTasks: (updates: Array<{
    id: string;
    data: Partial<TaskDocument>;
}>, userId: string) => Promise<void>;
/**
 * Update a task's completion status
 */
export declare const updateTaskStatus: (taskId: string, isCompleted: boolean, userId: string) => Promise<void>;
/**
 * Update a task's text
 */
export declare const updateTaskText: (taskId: string, text: string, userId: string) => Promise<void>;
/**
 * Update an entire task with all fields
 */
export declare const updateTask: (taskId: string, taskData: Partial<TaskDocument>, userId: string) => Promise<void>;
/**
 * Delete a task
 */
export declare const deleteTask: (taskId: string, userId: string) => Promise<void>;
