import React, { useMemo, useCallback, useState, useRef } from 'react';
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
  Popover,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Label as LabelIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Task, Tag, Category } from '../../types';
import { useTheme, alpha } from '@mui/material/styles';
import { format, isBefore, startOfDay } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  tags: Tag[];
  categories: Category[];
  isActionInProgress?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  onUpdate,
  tags,
  categories,
  isActionInProgress = false,
}) => {
  const theme = useTheme();
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [tempTime, setTempTime] = useState<Date | null>(null);
  const dateDisplayRef = useRef<HTMLDivElement>(null);
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
    const date = new Date(task.dueDate);
    // Check if the date has a specific time (not midnight/start of day)
    const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0;
    if (hasTime) {
      // Include time: "MMM d yyyy h:mm a" (e.g., "Jan 28 2026 3:00 PM")
      return format(date, 'MMM d yyyy h:mm a');
    }
    // Date only: "MMM d yyyy" (e.g., "Jan 28 2026")
    return format(date, 'MMM d yyyy');
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

  const handleDateClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!onUpdate) return;
    event.stopPropagation();
    setDatePickerAnchor(event.currentTarget);
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      setTempDate(date);
      setTempTime(date);
    } else {
      setTempDate(new Date());
      setTempTime(new Date());
    }
  }, [onUpdate, task.dueDate]);

  const handleDatePickerClose = useCallback(() => {
    setDatePickerAnchor(null);
  }, []);

  const handleDateChange = useCallback((newDate: Date | null) => {
    if (!newDate) return;
    setTempDate(newDate);
    
    // If time is already set, combine them immediately
    if (tempTime && onUpdate) {
      const finalDate = new Date(newDate);
      finalDate.setHours(tempTime.getHours());
      finalDate.setMinutes(tempTime.getMinutes());
      finalDate.setSeconds(0);
      finalDate.setMilliseconds(0);
      onUpdate(task.id, { dueDate: finalDate });
      setDatePickerAnchor(null);
    }
  }, [onUpdate, task.id, tempTime]);

  const handleTimeChange = useCallback((newTime: Date | null) => {
    if (!newTime) return;
    setTempTime(newTime);
    
    // Combine with current date
    let finalDate: Date;
    if (tempDate) {
      finalDate = new Date(tempDate);
    } else if (task.dueDate) {
      finalDate = new Date(task.dueDate);
    } else {
      finalDate = new Date();
    }
    
    finalDate.setHours(newTime.getHours());
    finalDate.setMinutes(newTime.getMinutes());
    finalDate.setSeconds(0);
    finalDate.setMilliseconds(0);
    
    if (onUpdate) {
      onUpdate(task.id, { dueDate: finalDate });
      setDatePickerAnchor(null);
    }
  }, [onUpdate, task.id, task.dueDate, tempDate]);

  const handleRemoveDate = useCallback(async () => {
    if (!onUpdate) return;
    await onUpdate(task.id, { dueDate: undefined });
    setDatePickerAnchor(null);
  }, [onUpdate, task.id]);

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
          <Box>
            {task.description && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  mb: task.dueDate || category || (taskTags.length > 0) ? 0.5 : 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {task.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              {task.dueDate && (
                <Box 
                  ref={dateDisplayRef}
                  onClick={handleDateClick}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    cursor: onUpdate ? 'pointer' : 'default',
                    borderRadius: 1,
                    px: 0.5,
                    py: 0.25,
                    '&:hover': onUpdate ? {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    } : {},
                    transition: 'background-color 0.2s ease',
                  }}
                >
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
              {!task.dueDate && onUpdate && (
                <Box 
                  onClick={handleDateClick}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    cursor: 'pointer',
                    borderRadius: 1,
                    px: 0.5,
                    py: 0.25,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <CalendarIcon fontSize="small" sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                    }}
                  >
                    Add due date
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
      
      {onUpdate && (
        <Popover
          open={Boolean(datePickerAnchor)}
          anchorEl={datePickerAnchor}
          onClose={handleDatePickerClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              p: 2,
              minWidth: 280,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                : '0 8px 24px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DatePicker
                label="Date"
                value={tempDate}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.common.white, 0.05)
                          : alpha(theme.palette.common.black, 0.02),
                      },
                    },
                  },
                }}
              />
              <TimePicker
                label="Time"
                value={tempTime}
                onChange={handleTimeChange}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.common.white, 0.05)
                          : alpha(theme.palette.common.black, 0.02),
                      },
                    },
                  },
                }}
              />
              {task.dueDate && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                  <Typography
                    onClick={handleRemoveDate}
                    sx={{
                      cursor: 'pointer',
                      color: 'error.main',
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Remove date
                  </Typography>
                </Box>
              )}
            </Box>
          </LocalizationProvider>
        </Popover>
      )}
    </ListItem>
  );
};

export default React.memo(TaskItem); 