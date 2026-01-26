import { Task, Tag, Category, SharedUser } from './index';

declare module '*/TaskModal' {
  interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (taskData: { 
      id?: string; 
      title: string; 
      description?: string;
      dueDate?: Date;
    }) => void;
    initialTask: Task | null;
    tags: Tag[];
    categories: Category[];
  }
  
  const TaskModal: React.FC<TaskModalProps>;
  export default TaskModal;
}

declare module '*/ShareTaskModal' {
  interface ShareTaskModalProps {
    open: boolean;
    onClose: () => void;
    task: Task;
    onShare: (taskId: string, sharedUsers: SharedUser[]) => void;
  }
  
  const ShareTaskModal: React.FC<ShareTaskModalProps>;
  export default ShareTaskModal;
}

declare module '*/CalendarView' {
  interface CalendarViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    loading?: boolean;
  }
  
  const CalendarView: React.FC<CalendarViewProps>;
  export default CalendarView;
}
