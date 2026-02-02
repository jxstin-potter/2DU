import React from 'react';
import { Task, Tag, Category } from '../../types';
interface TodayViewProps {
    tasks: Task[];
    justAddedTaskId?: string | null;
    onTaskAction: {
        toggle: (taskId: string) => Promise<void>;
        delete: (taskId: string) => Promise<void>;
        update: (taskId: string, updates: Partial<Task>) => Promise<void>;
        edit: (task: Task) => void;
    };
    onCreateTask?: (taskData: Partial<Task>) => Promise<void>;
    tags: Tag[];
    categories: Category[];
    defaultCategoryId?: string;
}
declare const TodayView: React.FC<TodayViewProps>;
export default TodayView;
