import { Task } from '../types';
import { TaskFilterParams } from '../services/tasksService';
type TaskError = {
    message: string;
    code: 'AUTH_REQUIRED' | 'INVALID_DATA' | 'NETWORK_ERROR' | 'PROCESSING_ERROR' | 'UNKNOWN_ERROR';
    details?: any;
};
export declare const useTasks: () => {
    tasks: Task[];
    loading: boolean;
    error: TaskError;
    addTask: (title: string) => Promise<void>;
    removeTask: (taskId: string) => Promise<void>;
    toggleComplete: (taskId: string, completed: boolean) => Promise<void>;
    editTask: (task: Partial<Task> & {
        id: string;
    }) => Promise<void>;
    loadMore: () => Promise<void>;
    isLoadingMore: boolean;
    hasMore: boolean;
    setView: (view: "today" | "upcoming" | "calendar" | "completed" | null) => void;
    updateFilters: (newFilters: Partial<TaskFilterParams>) => void;
};
export {};
