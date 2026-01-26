import React, { useMemo, useCallback } from 'react';
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
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Task, Tag, Category } from '../../types';
import { useTheme } from '@mui/material/styles';
import { format, isBefore, startOfDay } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  tags: Tag[];
  categories: Category[];
  isActionInProgress?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  tags,
  categories,
  isActionInProgress = false,
}) => {
  const category = useMemo(() => {
    return task.category ? categories.find(c => c.id === task.category) : undefined;
  }, [task.category, categories]);

  const taskTags = useMemo(() => {
    return task.tags?.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean) as Tag[] || [];
  }, [task.tags, tags]);

  const isOverdue = useMemo(() => {
    if (!task.dueDate || task.completed) return false;
    const taskDate = startOfDay(new Date(task.dueDate));
    const today = startOfDay(new Date());
    return isBefore(taskDate, today);
  }, [task.dueDate, task.completed]);

  const formattedDate = useMemo(() => {
    if (!task.dueDate) return '';
    return format(new Date(task.dueDate), 'MMM d yyyy');
  }, [task.dueDate]);

  const handleToggleComplete = useCallback(() => {
    onToggleComplete(task.id);
  }, [onToggleComplete, task.id]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [onDelete, task.id]);

  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [onEdit, task]);

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
        onChange={handleToggleComplete}
        disabled={isActionInProgress}
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
            }}
          >
            {task.title}
          </Typography>
        }
        secondary={
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            {task.dueDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarIcon fontSize="small" sx={{ fontSize: '0.875rem' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: isOverdue ? 'error.main' : 'text.secondary',
                    fontSize: '0.875rem',
                  }}
                >
                  {formattedDate}
                </Typography>
              </Box>
            )}
            {category && (
              <Tooltip title="Category">
                <Chip
                  size="small"
                  icon={<LabelIcon fontSize="small" />}
                  label={category.name}
                  sx={{
                    bgcolor: 'background.default',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              </Tooltip>
            )}
            {taskTags.map((tag) => (
              <Tooltip key={tag.id} title={tag.name}>
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
            ))}
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={handleEdit}
          disabled={isActionInProgress}
          sx={{ mr: 1 }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          edge="end"
          onClick={handleDelete}
          disabled={isActionInProgress}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default React.memo(TaskItem); 