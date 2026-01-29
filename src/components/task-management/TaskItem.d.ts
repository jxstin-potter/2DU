import React from 'react';
import { Task, Tag, Category } from '../../types';
interface TaskItemProps {
    task: Task;
    onToggleComplete: (taskId: string) => void;
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onUpdate?: (taskId: string, updates: Partial<Task>) => Promise<void>;
    tags: Tag[];
    categories: Category[];
    isActionInProgress?: boolean;
}
declare const _default: React.NamedExoticComponent<TaskItemProps>;
export default _default;
