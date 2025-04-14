import { Task, Tag, Category } from '../../types';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'order'>) => void;
  initialTask?: Task | null;
  tags: Tag[];
  categories: Category[];
}

declare const TaskModal: React.FC<TaskModalProps>;
export default TaskModal; 