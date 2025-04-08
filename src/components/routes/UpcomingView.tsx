import React from 'react';
import { Box, Typography } from '@mui/material';
import { isAfter, isToday } from 'date-fns';
import TaskList from '../features/TaskList';
import EmptyState from '../common/EmptyState';
import { Task } from '../../types';

interface UpcomingViewProps {
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

const UpcomingView: React.FC<UpcomingViewProps> = ({ tasks, onTaskAction, onCreateTask }) => {
  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    
    try {
      const taskDate = new Date(task.dueDate);
      return isAfter(taskDate, new Date()) && !isToday(taskDate);
    } catch (error) {
      console.error('Invalid date for task:', task.id, error);
      return false;
    }
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upcoming Tasks
      </Typography>
      
      {upcomingTasks.length > 0 ? (
        <TaskList
          tasks={upcomingTasks}
          onTaskAction={onTaskAction}
          draggable
        />
      ) : (
        <EmptyState type="upcoming" onCreateTask={onCreateTask} />
      )}
    </Box>
  );
};

export default UpcomingView; 