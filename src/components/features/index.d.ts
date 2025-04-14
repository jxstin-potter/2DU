declare module './TaskModal' {
  import { Task, Tag, Category } from '../../types';
  
  interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (task: Omit<Task, 'id' | 'order'>) => void;
    initialTask?: Task | null;
    tags: Tag[];
    categories: Category[];
  }
  
  const TaskModal: React.FC<TaskModalProps>;
  export default TaskModal;
}

declare module './ShareTaskModal' {
  import { Task, SharedUser } from '../../types';
  
  interface ShareTaskModalProps {
    open: boolean;
    onClose: () => void;
    task: Task;
    onShare: (taskId: string, sharedUsers: SharedUser[]) => void;
  }
  
  const ShareTaskModal: React.FC<ShareTaskModalProps>;
  export default ShareTaskModal;
}

declare module './CalendarView' {
  import { Task } from '../../types';
  
  interface CalendarViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    loading?: boolean;
  }
  
  const CalendarView: React.FC<CalendarViewProps>;
  export default CalendarView;
}

declare module '../tasks/EnhancedTaskList' {
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
  
  const EnhancedTaskList: React.FC<EnhancedTaskListProps>;
  export default EnhancedTaskList;
} 