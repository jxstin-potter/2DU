import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import TaskList from '../features/TaskList';
import EmptyState from '../common/EmptyState';
import { Task, Tag } from '../../types';

interface TagsViewProps {
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

const TagsView: React.FC<TagsViewProps> = ({ tasks, onTaskAction, onCreateTask }) => {
  // Get all unique tags from tasks
  const allTags = Array.from(
    new Set(tasks.flatMap(task => task.tags.map(tag => tag.name)))
  ).map(name => {
    const tag = tasks.find(task => 
      task.tags.find(t => t.name === name)
    )?.tags.find(t => t.name === name);
    return { name, color: tag?.color || '#1976d2' };
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tasks by Tag
      </Typography>
      
      {allTags.length > 0 ? (
        <Stack spacing={4}>
          {allTags.map(tag => {
            const tagTasks = tasks.filter(task => 
              task.tags.some(t => t.name === tag.name)
            );
            return (
              <Box key={tag.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={tag.name}
                    size="large"
                    sx={{ 
                      backgroundColor: tag.color, 
                      color: 'white',
                      mr: 2,
                    }}
                  />
                  <Typography variant="subtitle1" color="text.secondary">
                    {tagTasks.length} tasks
                  </Typography>
                </Box>
                <TaskList
                  tasks={tagTasks}
                  onTaskAction={onTaskAction}
                />
              </Box>
            );
          })}
        </Stack>
      ) : (
        <EmptyState type="tags" onCreateTask={onCreateTask} />
      )}
    </Box>
  );
};

export default TagsView; 