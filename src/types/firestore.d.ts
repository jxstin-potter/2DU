import { Timestamp, DocumentSnapshot } from 'firebase/firestore';
import { Task } from './task';
/**
 * Interface for tasks collection in Firestore
 * This matches the Task interface but uses Firestore types
 */
export interface TaskDocument {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    userId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
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
    sortBy?: 'creationDate' | 'dueDate';
    sortOrder?: 'asc' | 'desc';
    view?: 'today' | 'upcoming' | 'calendar' | 'completed';
    filterFutureDates?: boolean;
    limit?: number;
    lastVisible?: DocumentSnapshot;
    searchQuery?: string;
}
export interface TaskQueryResult {
    tasks: (TaskDocument & {
        id: string;
    })[];
    lastVisible: DocumentSnapshot | null;
    hasMore: boolean;
}
export interface TaskCache {
    data: (TaskDocument & {
        id: string;
    })[];
    timestamp: number;
    filterParams: TaskFilterParams;
}
export declare const CACHE_DURATION: number;
/**
 * Helper function to convert Firestore Timestamp to Date
 */
export declare const timestampToDate: (timestamp: Timestamp | null | undefined) => Date | null;
/**
 * Helper function to convert Date to Firestore Timestamp
 */
export declare const dateToTimestamp: (date: Date | null | undefined) => Timestamp | null;
/**
 * Convert TaskDocument to Task
 */
export declare const taskDocumentToTask: (doc: TaskDocument) => Task;
/**
 * Convert Task to TaskDocument
 */
export declare const taskToTaskDocument: (task: Task) => Omit<TaskDocument, "id">;
/**
 * Collection paths in Firestore
 */
export declare const COLLECTIONS: {
    readonly TASKS: "tasks";
    readonly USERS: "users";
};
