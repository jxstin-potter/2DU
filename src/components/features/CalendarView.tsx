import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { Task } from '../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  loading?: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onTaskClick,
  loading = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentDate]);

  const tasksByDate = useMemo(() => {
    const taskMap = new Map<string, Task[]>();
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
        if (!taskMap.has(dateKey)) {
          taskMap.set(dateKey, []);
        }
        taskMap.get(dateKey)?.push(task);
      }
    });
    return taskMap;
  }, [tasks]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getTaskColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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

  const renderCalendarHeader = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {format(currentDate, 'MMMM yyyy')}
      </Typography>
      <Box>
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeftIcon />
        </IconButton>
        <IconButton onClick={handleToday} size="small">
          <TodayIcon />
        </IconButton>
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );

  const renderWeekDays = () => (
    <Grid container sx={{ mb: 1 }}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <Grid item xs={12/7} key={day}>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{ fontWeight: 'bold' }}
          >
            {day}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );

  const renderCalendarDays = () => (
    <Grid container spacing={1}>
      {calendarDays.map((day, index) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayTasks = tasksByDate.get(dateKey) || [];
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isCurrentDay = isToday(day);

        return (
          <Grid item xs={12/7} key={dateKey}>
            <Paper
              elevation={0}
              sx={{
                p: 1,
                minHeight: isMobile ? 80 : 100,
                bgcolor: isCurrentDay
                  ? theme.palette.primary.light
                  : isCurrentMonth
                  ? theme.palette.background.paper
                  : theme.palette.action.disabledBackground,
                opacity: isCurrentMonth ? 1 : 0.5,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
              onClick={() => {
                if (dayTasks.length > 0) {
                  onTaskClick(dayTasks[0]);
                }
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isCurrentDay ? 'bold' : 'normal',
                  color: isCurrentDay
                    ? theme.palette.primary.contrastText
                    : 'inherit',
                }}
              >
                {format(day, 'd')}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {dayTasks.slice(0, isMobile ? 2 : 3).map((task, taskIndex) => (
                  <Tooltip
                    key={task.id}
                    title={`${task.title} - ${task.priority} priority`}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: getTaskColor(task.priority),
                          mr: 0.5,
                        }}
                      />
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{
                          maxWidth: '100%',
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {task.title}
                      </Typography>
                    </Box>
                  </Tooltip>
                ))}
                {dayTasks.length > (isMobile ? 2 : 3) && (
                  <Typography variant="caption" color="text.secondary">
                    +{dayTasks.length - (isMobile ? 2 : 3)} more
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {renderCalendarHeader()}
      {renderWeekDays()}
      {renderCalendarDays()}
    </Box>
  );
};

export default CalendarView; 