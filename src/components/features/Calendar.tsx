import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Tooltip,
  Chip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { Task } from '../types';

interface CalendarProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onShareTask: (task: Task) => void;
  onAddTask?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onShareTask,
  onAddTask,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), date));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handlePreviousMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Grid container spacing={1}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Grid item xs={12/7} key={day}>
            <Typography
              variant="subtitle2"
              sx={{ textAlign: 'center', fontWeight: 'bold' }}
            >
              {day}
            </Typography>
          </Grid>
        ))}

        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <Grid item xs={12/7} key={day.toString()}>
              <Paper
                sx={{
                  p: 1,
                  minHeight: 100,
                  bgcolor: isCurrentDay ? 'action.selected' : 'background.paper',
                  opacity: isCurrentMonth ? 1 : 0.5,
                  cursor: onAddTask ? 'pointer' : 'default',
                }}
                onClick={() => onAddTask?.(day)}
              >
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'right',
                    color: isCurrentDay ? 'primary.main' : 'text.primary',
                  }}
                >
                  {format(day, 'd')}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {dayTasks.map((task) => (
                    <Tooltip
                      key={task.id}
                      title={
                        <Box>
                          <Typography variant="body2">{task.title}</Typography>
                          {task.description && (
                            <Typography variant="caption" color="text.secondary">
                              {task.description}
                            </Typography>
                          )}
                        </Box>
                      }
                    >
                      <Chip
                        label={task.title}
                        size="small"
                        color={task.completed ? 'default' : 'primary'}
                        variant={task.completed ? 'outlined' : 'filled'}
                        sx={{
                          width: '100%',
                          mb: 0.5,
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          opacity: task.completed ? 0.7 : 1,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task);
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Calendar; 