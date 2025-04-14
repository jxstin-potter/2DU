import React from 'react';
import { useTheme, Typography, Button, Box, SxProps, Theme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InboxIcon from '@mui/icons-material/Inbox';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LabelIcon from '@mui/icons-material/Label';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  type: 'today' | 'upcoming' | 'completed' | 'tags' | 'calendar';
  onCreateTask?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, onCreateTask }) => {
  const theme = useTheme();
  
  const getIconContainerClass = () => {
    switch (type) {
      case 'today':
        return styles.iconToday;
      case 'upcoming':
        return styles.iconUpcoming;
      case 'completed':
        return styles.iconCompleted;
      case 'tags':
        return styles.iconTags;
      case 'calendar':
        return styles.iconCalendar;
      default:
        return styles.iconToday;
    }
  };
  
  const getIcon = () => {
    const iconSx: SxProps<Theme> = { 
      fontSize: 60,
      color: type === 'completed' 
        ? theme.palette.success.main 
        : theme.palette.primary.main
    };
    
    switch (type) {
      case 'today':
        return <InboxIcon sx={iconSx} />;
      case 'upcoming':
        return <EventIcon sx={iconSx} />;
      case 'completed':
        return <CheckCircleIcon sx={iconSx} />;
      case 'tags':
        return <LabelIcon sx={iconSx} />;
      case 'calendar':
        return <CalendarMonthIcon sx={iconSx} />;
      default:
        return <InboxIcon sx={iconSx} />;
    }
  };
  
  const getTitle = () => {
    switch (type) {
      case 'today':
        return 'No tasks for today';
      case 'upcoming':
        return 'No upcoming tasks';
      case 'completed':
        return 'No completed tasks';
      case 'tags':
        return 'No tagged tasks';
      case 'calendar':
        return 'No tasks scheduled';
      default:
        return 'No tasks';
    }
  };
  
  const getDescription = () => {
    switch (type) {
      case 'today':
        return 'You have no tasks scheduled for today. Add a new task to get started.';
      case 'upcoming':
        return 'You have no upcoming tasks. Plan ahead by adding tasks with future due dates.';
      case 'completed':
        return 'You haven\'t completed any tasks yet. Complete tasks to see them here.';
      case 'tags':
        return 'You haven\'t tagged any tasks yet. Add tags to your tasks to organize them.';
      case 'calendar':
        return 'You have no tasks scheduled. Add tasks with due dates to see them in your calendar.';
      default:
        return 'You have no tasks. Add a new task to get started.';
    }
  };
  
  return (
    <Box className={styles.container} sx={{
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.03)' 
        : 'rgba(0, 0, 0, 0.02)'
    }}>
      <div className={getIconContainerClass()}>
        {getIcon()}
      </div>
      
      <Typography variant="h5" className={styles.title} sx={{ 
        color: theme.palette.text.primary,
        mb: 0.5
      }}>
        {getTitle()}
      </Typography>
      
      <Typography variant="body2" className={styles.description} sx={{ 
        color: theme.palette.text.secondary,
        mb: 3,
        maxWidth: '400px'
      }}>
        {getDescription()}
      </Typography>
      
      {onCreateTask && (
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={onCreateTask}
          sx={{ 
            borderRadius: '6px',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          Add New Task
        </Button>
      )}
    </Box>
  );
};

export default EmptyState; 