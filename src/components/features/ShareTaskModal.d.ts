import { Task, SharedUser } from '../../types';

interface ShareTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  onShare: (taskId: string, sharedUsers: SharedUser[]) => void;
}

declare const ShareTaskModal: React.FC<ShareTaskModalProps>;
export default ShareTaskModal; 