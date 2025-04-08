import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskList from '../features/TaskList';
import EmptyState from '../common/EmptyState';
import { Task } from '../../types';

interface CompletedViewProps {
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

const CompletedView: React.FC<CompletedViewProps> = ({ tasks, onTaskAction, onCreateTask }) => {
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Completed Tasks
      </Typography>
      
      {completedTasks.length > 0 ? (
        <TaskList
          tasks={completedTasks}
          onTaskAction={onTaskAction}
        />
      ) : (
        <EmptyState type="completed" onCreateTask={onCreateTask} />
      )}
    </Box>
  );
};

export default CompletedView; 