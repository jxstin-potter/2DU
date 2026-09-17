import { alpha, Theme } from '@mui/material/styles';
import { colors } from '../../../styles/theme';

export type TaskPriority = 'low' | 'medium' | 'high';

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

// The one priority palette. Three different sets used to exist - here, in
// TodayView and in TaskDetailModal - so the same priority rendered in three
// different reds depending on which surface you were looking at. All of them
// now read these tokens, which are checked against the ground (high 5.76:1,
// medium 7.91:1, low 6.99:1).
export const getPriorityColor = (priority: TaskPriority) => colors.priority[priority];

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

