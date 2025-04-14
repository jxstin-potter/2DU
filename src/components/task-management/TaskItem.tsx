import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Label as LabelIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Task, Tag, Category } from '../../types';
import { useTheme } from '@mui/material/styles';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  tags: Tag[];
  categories: Category[];
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  tags,
  categories,
}) => {
  const theme = useTheme();

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getCategory = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <ListItem
      sx={{
        mb: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          bgcolor: 'action.hover',
        },
        '& .MuiListItemSecondaryAction-root': {
          opacity: 0,
          transition: 'opacity 0.2s ease',
        },
        '&:hover .MuiListItemSecondaryAction-root': {
          opacity: 1,
        },
      }}
    >
      <Checkbox
        edge="start"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        sx={{
          color: task.completed ? 'success.main' : 'action.active',
          '&.Mui-checked': {
            color: 'success.main',
          },
        }}
      />
      <ListItemText
        primary={
          <Typography
            variant="body1"
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary',
              fontWeight: task.priority === 'high' ? 600 : 400,
            }}
          >
            {task.title}
          </Typography>
        }
        secondary={
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            {task.dueDate && (
              <Tooltip title="Due Date">
                <Chip
                  size="small"
                  icon={<CalendarIcon fontSize="small" />}
                  label={new Date(task.dueDate).toLocaleDateString()}
                  sx={{
                    bgcolor: 'background.default',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              </Tooltip>
            )}
            {task.priority && (
              <Tooltip title={`Priority: ${task.priority}`}>
                <Chip
                  size="small"
                  icon={<FlagIcon fontSize="small" />}
                  label={task.priority}
                  sx={{
                    bgcolor: getPriorityColor(task.priority),
                    color: 'white',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              </Tooltip>
            )}
            {task.category && (
              <Tooltip title="Category">
                <Chip
                  size="small"
                  icon={<LabelIcon fontSize="small" />}
                  label={getCategory(task.category)?.name || 'Uncategorized'}
                  sx={{
                    bgcolor: 'background.default',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              </Tooltip>
            )}
            {task.tags?.map((tagId) => {
              const tag = tags.find(t => t.id === tagId);
              return tag ? (
                <Tooltip key={tagId} title={tag.name}>
                  <Chip
                    size="small"
                    label={tag.name}
                    sx={{
                      bgcolor: tag.color || 'background.default',
                      color: 'white',
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                </Tooltip>
              ) : null;
            })}
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={() => onEdit(task)}
          sx={{ mr: 1 }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          edge="end"
          onClick={() => onDelete(task.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default TaskItem; 