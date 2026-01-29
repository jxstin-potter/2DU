import React from 'react';
import { Task } from '../../types';
interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (taskData: Partial<Task>) => Promise<void>;
    initialTask?: Task | null;
    loading?: boolean;
}
declare const TaskModal: React.FC<TaskModalProps>;
export default TaskModal;
