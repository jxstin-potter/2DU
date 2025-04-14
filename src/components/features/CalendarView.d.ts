import { Task } from '../../types';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  loading?: boolean;
}

declare const CalendarView: React.FC<CalendarViewProps>;
export default CalendarView; 