import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import { format } from 'date-fns';
import { Task } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface CompletedTaskItemProps {
  task: Task;
}

const CompletedTaskItem: React.FC<CompletedTaskItemProps> = ({ task }) => {
  const { user } = useAuth();

  const completionTime = useMemo(() => {
    if (!task.updatedAt) return '';
    return format(new Date(task.updatedAt), 'h:mm a');
  }, [task.updatedAt]);

  const userInitials = useMemo(() => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  }, [user?.name]);

  return (
    <Box
      component="div"
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 1.5,
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* User Avatar */}
        <Avatar
          sx={{
            width: 24,
            height: 24,
            fontSize: '0.75rem',
            bgcolor: 'primary.main',
          }}
        >
          {userInitials}
        </Avatar>

        {/* Task Content */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            You completed
          </Typography>

          {/* Empty Checkbox with Red Outline */}
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'error.main',
              flexShrink: 0,
            }}
          />

          {/* Task Title with Strikethrough */}
          <Typography
            variant="body2"
            sx={{
              textDecoration: 'line-through',
              color: 'text.secondary',
              fontSize: '0.875rem',
              flex: 1,
            }}
          >
            {task.title}
          </Typography>

          {/* Project/Inbox Label */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            Inbox
          </Typography>

          {/* Completion Time */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            {completionTime}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CompletedTaskItem;
