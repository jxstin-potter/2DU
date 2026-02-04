import { alpha, Theme } from '@mui/material/styles';

export type TaskPriority = 'low' | 'medium' | 'high';

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'low':
      return '#4caf50';
    case 'medium':
      return '#ff9800';
    case 'high':
      return '#f44336';
  }
};

export const getPriorityChipStyles = (theme: Theme, priority: TaskPriority) => {
  const color = getPriorityColor(priority);
  return {
    backgroundColor: alpha(color, 0.15),
    color,
    '& .MuiChip-deleteIcon': {
      fontSize: '1rem',
      color,
    },
  } as const;
};

