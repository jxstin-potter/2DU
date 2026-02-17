import { Task, Tag, Category } from './index';

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
