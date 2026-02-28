import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
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
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { Task, Tag } from '../../types';
import { useTheme, alpha } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { format, isBefore, startOfDay } from 'date-fns';
import InlineTaskEditor from './InlineTaskEditor';
import TaskDueDatePopover from './TaskDueDatePopover';
import { useTaskMetadata } from '../../contexts/TaskMetadataContext';
import { useTaskModal } from '../../contexts/TaskModalContext';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  isActionInProgress?: boolean;
  /**
   * When enabled, the completion circle outline is colored based on task priority.
   * Used to replicate Todoist's priority rings in specific views (e.g. Inbox).
   */
  showPriorityRing?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  onUpdate,
  isActionInProgress = false,
  showPriorityRing = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { tags, categories } = useTaskMetadata();
  const { activeInlineTaskId, setActiveInlineTaskId } = useTaskModal();
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const dateDisplayRef = useRef<HTMLDivElement>(null);

  // Show inline editor only when we're the active one; openModal() clears activeInlineTaskId so we never render modal + editor in same frame.
  const showInlineEditor = isInlineEditing && activeInlineTaskId === task.id;

  // Sync local state when context clears active (e.g. modal opened) so we don't stay in "editing" after modal closes. Only update the task that was actually editing to avoid N setState calls.
  useEffect(() => {
    if (activeInlineTaskId !== task.id && isInlineEditing) setIsInlineEditing(false);
  }, [activeInlineTaskId, task.id, isInlineEditing]);

  const category = useMemo(() => {
    const categoryId = task.categoryId ?? task.category;
    return categoryId ? categories.find(c => c.id === categoryId) : undefined;
  }, [task.categoryId, task.category, categories]);

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
    // Project uses date-only due dates.
    return format(date, 'MMM d yyyy');
  }, [task.dueDate]);

  const priorityRingColor = useMemo(() => {
    if (!showPriorityRing || task.completed) return undefined;
    // Priority color mapping (simple + consistent with existing semantics)
    switch (task.priority) {
      case 'high':
        return theme.palette.error.main;      // red
      case 'medium':
        return theme.palette.warning.main;    // orange
      case 'low':
        return theme.palette.info.main;       // blue
      default:
        return undefined;
    }
  }, [showPriorityRing, task.completed, task.priority, theme.palette.error.main, theme.palette.warning.main, theme.palette.info.main]);

  const handleToggleComplete = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    onToggleComplete(task.id);
  }, [onToggleComplete, task.id]);

  const handleDelete = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    onDelete(task.id);
  }, [onDelete, task.id]);

  const handleOpenDetails = useCallback(() => {
    if (showInlineEditor) return;
    onEdit(task);
  }, [onEdit, task, showInlineEditor]);

  const handleInlineEdit = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Prefer inline editing when onUpdate exists; otherwise fall back to opening details
    if (!onUpdate) {
      handleOpenDetails();
      return;
    }
    setActiveInlineTaskId(task.id);
    setIsInlineEditing(true);
  }, [onUpdate, handleOpenDetails, setActiveInlineTaskId, task.id]);

  const handleDateClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!onUpdate) return;
    event.stopPropagation();
    setDatePickerAnchor(event.currentTarget);
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      setTempDate(date);
    } else {
      setTempDate(new Date());
    }
  }, [onUpdate, task.dueDate]);

  const handleDatePickerClose = useCallback(() => {
    setDatePickerAnchor(null);
  }, []);

  const handleDateChange = useCallback((newDate: Date | null) => {
    if (!newDate) return;
    setTempDate(newDate);

    // Normalize to start-of-day (date-only) and save immediately.
    if (onUpdate) {
      const finalDate = startOfDay(new Date(newDate));
      onUpdate(task.id, { dueDate: finalDate });
      setDatePickerAnchor(null);
    }
  }, [onUpdate, task.id]);

  const handleRemoveDate = useCallback(async () => {
    if (!onUpdate) return;
    await onUpdate(task.id, { dueDate: undefined });
    setDatePickerAnchor(null);
  }, [onUpdate, task.id]);

  return (
    <ListItem
      onClick={showInlineEditor ? undefined : handleOpenDetails}
      onKeyDown={(e) => {
        if (showInlineEditor) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenDetails();
        }
      }}
      role={showInlineEditor ? undefined : 'button'}
      tabIndex={showInlineEditor ? -1 : 0}
      aria-label={`Open task: ${task.title}`}
      sx={{
        mb: 2,
        bgcolor: 'transparent',
        transition: 'opacity 0.2s ease',
        cursor: showInlineEditor ? 'default' : 'pointer',
        borderRadius: 1,
        '&:hover': {
          // Task rows are already visually distinct; avoid hover "highlight" background.
          // Also overrides the global theme's MuiListItem hover background.
          backgroundColor: 'transparent !important',
        },
        '& .MuiListItemSecondaryAction-root': {
          opacity: isMobile ? 1 : 0,
          transition: 'opacity 0.2s ease',
        },
        '&:hover .MuiListItemSecondaryAction-root': {
          opacity: 1,
        },
        '&:focus-visible': {
          outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: 2,
        },
      }}
    >
      {!showInlineEditor && (
        <IconButton
          edge="start"
          onClick={(e) => handleToggleComplete(e)}
          disabled={isActionInProgress}
          size="small"
          sx={{
            p: 0.25,
            mr: 0.5,
            backgroundColor: 'transparent',
            '&:hover': { backgroundColor: 'transparent' },
            '&:hover .check-hover': { opacity: 1 },
          }}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed ? (
            <CheckCircleOutlineIcon sx={{ fontSize: 17, color: 'success.main' }} />
          ) : (
            <Box
              component="span"
              sx={{
                position: 'relative',
                display: 'inline-flex',
                width: 17,
                height: 17,
              }}
            >
              <RadioButtonUncheckedIcon
                sx={{
                  fontSize: 17,
                  color: priorityRingColor ?? 'action.active',
                }}
              />
              <CheckCircleOutlineIcon
                className="check-hover"
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  fontSize: 16,
                  color: 'white',
                  opacity: 0,
                  transition: 'opacity 0.15s ease',
                  pointerEvents: 'none',
                  backgroundColor: 'transparent',
                }}
              />
            </Box>
          )}
        </IconButton>
      )}
      {showInlineEditor && onUpdate ? (
        <Box sx={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
          <InlineTaskEditor
            initialTask={task}
            onSubmit={async (taskData) => {
              await onUpdate(task.id, taskData);
              setActiveInlineTaskId(null);
              setIsInlineEditing(false);
            }}
            onCancel={() => {
              setActiveInlineTaskId(null);
              setIsInlineEditing(false);
            }}
            defaultCategoryId={task.categoryId}
            autoFocus
          />
        </Box>
      ) : (
        <ListItemText
          primary={
            <Typography
              variant="body1"
              sx={{
                fontSize: '0.875rem',
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
                    fontSize: '0.8125rem',
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
                    <CalendarIcon fontSize="small" sx={{ fontSize: '0.8125rem' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: isOverdue ? 'error.main' : 'text.secondary',
                        fontSize: '0.8125rem',
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
                      onClick={(e) => e.stopPropagation()}
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
                      onClick={(e) => e.stopPropagation()}
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
      )}
      {!showInlineEditor && (
        <ListItemSecondaryAction>
          <Tooltip title="Edit">
            <span>
              <IconButton
                edge="end"
                onClick={(e) => handleInlineEdit(e)}
                disabled={isActionInProgress}
                sx={{ mr: 0.5 }}
                size="small"
                aria-label="Edit task"
              >
                <EditIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span>
              <IconButton
                edge="end"
                onClick={(e) => handleDelete(e)}
                disabled={isActionInProgress}
                size="small"
                aria-label="Delete task"
              >
                <DeleteIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </span>
          </Tooltip>
        </ListItemSecondaryAction>
      )}
      
      {onUpdate && (
        <TaskDueDatePopover
          anchorEl={datePickerAnchor}
          tempDate={tempDate}
          hasExistingDueDate={Boolean(task.dueDate)}
          onClose={handleDatePickerClose}
          onDateChange={handleDateChange}
          onRemove={handleRemoveDate}
        />
      )}
    </ListItem>
  );
};

export default React.memo(TaskItem); 