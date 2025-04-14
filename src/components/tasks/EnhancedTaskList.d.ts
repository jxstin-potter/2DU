import { Task } from '../../types';

interface EnhancedTaskListProps {
  tasks: Task[];
  onTaskAction: {
    toggle: (taskId: string) => void;
    delete: (taskId: string) => void;
    update: (taskId: string, updates: Partial<Task>) => void;
    edit: (task: Task) => void;
    share: (task: Task) => void;
  };
  draggable?: boolean;
}

declare const EnhancedTaskList: React.FC<EnhancedTaskListProps>;
export default EnhancedTaskList; 