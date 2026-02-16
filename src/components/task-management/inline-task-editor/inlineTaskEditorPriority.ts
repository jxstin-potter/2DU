import { alpha, Theme } from '@mui/material/styles';

export type TaskPriority = 'low' | 'medium' | 'high';

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

// Muted, studious palette: green = low/calm, amber = medium, muted red = high
export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'low':
      return '#4A9B6D';
    case 'medium':
      return '#B8954A';
    case 'high':
      return '#B85C5C';
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

