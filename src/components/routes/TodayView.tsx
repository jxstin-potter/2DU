import React from 'react';
import { Box, Typography } from '@mui/material';
import { isToday, startOfDay } from 'date-fns';
import TaskList from '../features/TaskList';
import EmptyState from '../common/EmptyState';
import { Task } from '../../types';

interface TodayViewProps {
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

const TodayView: React.FC<TodayViewProps> = ({ tasks, onTaskAction, onCreateTask }) => {
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    
    try {
      return isToday(startOfDay(new Date(task.dueDate)));
    } catch (error) {
      console.error('Invalid date for task:', task.id, error);
      return false;
    }
  });

  console.log('Today tasks:', todayTasks);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Today's Tasks
      </Typography>
      
      {todayTasks.length > 0 ? (
        <TaskList
          tasks={todayTasks}
          onTaskAction={{
            toggle: onTaskAction.toggle,
            delete: onTaskAction.delete,
            update: onTaskAction.update,
            edit: onTaskAction.edit,
            share: onTaskAction.share
          }}
          draggable
        />
      ) : (
        <EmptyState type="today" onCreateTask={onCreateTask} />
      )}
    </Box>
  );
};

export default TodayView; 