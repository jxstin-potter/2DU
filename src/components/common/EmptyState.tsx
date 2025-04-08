import React from 'react';
import { Box, Typography, Button, useTheme, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InboxIcon from '@mui/icons-material/Inbox';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LabelIcon from '@mui/icons-material/Label';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface EmptyStateProps {
  type: 'today' | 'upcoming' | 'completed' | 'tags' | 'calendar';
  onCreateTask?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, onCreateTask }) => {
  const theme = useTheme();
  
  const getIcon = () => {
    switch (type) {
      case 'today':
        return <InboxIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />;
      case 'upcoming':
        return <EventIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />;
      case 'completed':
        return <CheckCircleIcon sx={{ fontSize: 60, color: theme.palette.success.main }} />;
      case 'tags':
        return <LabelIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />;
      case 'calendar':
        return <CalendarMonthIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />;
      default:
        return <InboxIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />;
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
        borderRadius: 2,
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        border: `1px dashed ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 100,
          height: 100,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          mb: 3,
        }}
      >
        {getIcon()}
      </Box>
      
      <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
        {getTitle()}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        {getDescription()}
      </Typography>
      
      {onCreateTask && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateTask}
          sx={{ 
            borderRadius: 1,
            px: 3,
            py: 1,
          }}
        >
          Add New Task
        </Button>
      )}
    </Box>
  );
};

export default EmptyState; 