import React from 'react';
import { Task, Tag, Category } from '../../types';
interface TaskListProps {
    tasks: Task[];
    loading?: boolean;
    error?: string | null;
    onTaskAction: {
        toggle: (taskId: string) => Promise<void>;
        delete: (taskId: string) => Promise<void>;
        update: (taskId: string, updates: Partial<Task>) => Promise<void>;
        edit: (task: Task) => Promise<void>;
        share?: (task: Task) => Promise<void>;
    };
    onCreateTask?: (taskData: Partial<Task>) => Promise<void>;
    draggable?: boolean;
    tags: Tag[];
    categories: Category[];
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
    defaultCategoryId?: string;
    justAddedTaskId?: string | null;
    onReorder?: (fromIndex: number, toIndex: number) => void | Promise<void>;
}
declare const TaskList: React.FC<TaskListProps>;
export default TaskList;
