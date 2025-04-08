import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { Task } from '../../types';
import EmptyState from '../common/EmptyState';

interface CalendarViewProps {
  tasks: Task[];
  onTaskAction: {
    toggle: (taskId: string) => void;
    delete: (taskId: string) => void;
    update: (taskId: string, updates: Partial<Task>) => void;
    edit: (task: Task) => void;
    share: (task: Task) => void;
  };
  onCreateTask?: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskAction, onCreateTask }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => {
      // Skip tasks with missing or invalid dueDate
      if (!task.dueDate) return false;
      
      try {
        return isSameDay(new Date(task.dueDate), date);
      } catch (error) {
        console.error('Invalid date for task:', task.id, error);
        return false;
      }
    });
  };

  // Check if there are any tasks in the current month
  const hasTasksInMonth = days.some(day => getTasksForDay(day).length > 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {format(today, 'MMMM yyyy')}
      </Typography>
      
      {hasTasksInMonth ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Paper
              key={day}
              sx={{
                p: 1,
                textAlign: 'center',
                bgcolor: 'background.paper',
                fontWeight: 'bold',
              }}
            >
              {day}
            </Paper>
          ))}
          
          {days.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, today);
            const isCurrentDay = isToday(day);

            return (
              <Paper
                key={day.toString()}
                sx={{
                  p: 1,
                  minHeight: '100px',
                  bgcolor: isCurrentMonth ? 'background.paper' : 'action.disabledBackground',
                  border: isCurrentDay ? '2px solid primary.main' : 'none',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: isCurrentMonth ? 'text.primary' : 'text.disabled',
                    fontWeight: isCurrentDay ? 'bold' : 'normal',
                  }}
                >
                  {format(day, 'd')}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {dayTasks.map(task => (
                    <Paper
                      key={task.id}
                      sx={{
                        p: 0.5,
                        mb: 0.5,
                        fontSize: '0.75rem',
                        bgcolor: task.completed ? 'action.disabledBackground' : 'primary.light',
                        color: task.completed ? 'text.disabled' : 'primary.contrastText',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: task.completed ? 'action.disabledBackground' : 'primary.main',
                        },
                      }}
                      onClick={() => onTaskAction.toggle(task.id)}
                    >
                      {task.title}
                    </Paper>
                  ))}
                </Box>
              </Paper>
            );
          })}
        </Box>
      ) : (
        <EmptyState type="calendar" onCreateTask={onCreateTask} />
      )}
    </Box>
  );
};

export default CalendarView; 