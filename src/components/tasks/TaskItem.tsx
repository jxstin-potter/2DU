import React from 'react';
import { 
  ListItem, 
  ListItemText, 
  Checkbox, 
  IconButton, 
  Box 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onEdit 
}) => {
  return (
    <ListItem
      secondaryAction={
        <Box>
          <IconButton 
            edge="end" 
            aria-label="edit"
            onClick={() => onEdit(task)}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            edge="end" 
            aria-label="delete"
            onClick={() => onDelete(task.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      }
    >
      <Checkbox
        edge="start"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id, !task.completed)}
        inputProps={{ 'aria-labelledby': `task-${task.id}` }}
      />
      <ListItemText 
        id={`task-${task.id}`}
        primary={task.title}
        sx={{
          textDecoration: task.completed ? 'line-through' : 'none',
          color: task.completed ? 'text.secondary' : 'text.primary'
        }}
      />
    </ListItem>
  );
};

export default TaskItem; 