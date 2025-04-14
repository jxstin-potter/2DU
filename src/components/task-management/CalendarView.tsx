import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import { format, isSameDay, parseISO } from 'date-fns';
import { Task } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface CalendarViewProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskToggle: (taskId: string) => void;
  onTaskSelect: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskToggle,
  onTaskSelect,
}) => {
  const theme = useTheme();

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = task.dueDate ? format(parseISO(task.dueDate), 'yyyy-MM-dd') : 'no-date';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as { [key: string]: Task[] });

  // Get all unique dates and sort them
  const dates = Object.keys(tasksByDate).sort((a, b) => {
    if (a === 'no-date') return 1;
    if (b === 'no-date') return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {dates.map((date) => (
        <Paper
          key={date}
          elevation={0}
          sx={{
            mb: 2,
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {date === 'no-date'
              ? 'No Due Date'
              : format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {tasksByDate[date].map((task) => (
              <Paper
                key={task.id}
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => onTaskToggle(task.id)}
                    sx={{ color: task.completed ? theme.palette.success.main : 'inherit' }}
                  >
                    {task.completed ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                  </IconButton>

                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed
                          ? theme.palette.text.disabled
                          : theme.palette.text.primary,
                      }}
                    >
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {task.description}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {task.priority && (
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        backgroundColor: getPriorityColor(task.priority),
                        color: 'white',
                      }}
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => onTaskSelect(task)}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onTaskDelete(task.id)}
                    sx={{ color: theme.palette.error.main }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default CalendarView; 