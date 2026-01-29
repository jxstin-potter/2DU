import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  useTheme,
  alpha,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Today as TodayIcon,
  Flag as FlagIcon,
  NotificationsNone as RemindersIcon,
  MoreVert as MoreVertIcon,
  Inbox as InboxIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Task, Category } from '../../types';
import { format, isToday, startOfDay } from 'date-fns';

interface InlineTaskEditorProps {
  onSubmit: (taskData: Partial<Task>) => Promise<void>;
  onCancel: () => void;
  initialTask?: Task | null;
  autoFocus?: boolean;
  categories?: Category[];
  defaultCategoryId?: string;
}

const InlineTaskEditor: React.FC<InlineTaskEditorProps> = ({
  onSubmit,
  onCancel,
  initialTask,
  autoFocus = true,
  categories = [],
  defaultCategoryId,
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(defaultCategoryId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState<null | HTMLElement>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize form from initialTask if editing
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
      setPriority(initialTask.priority || '');
      setSelectedCategoryId(initialTask.categoryId || defaultCategoryId);
      setShowQuickActions(true);
      if (titleRef.current) {
        titleRef.current.textContent = initialTask.title;
      }
      if (descriptionRef.current) {
        descriptionRef.current.textContent = initialTask.description || '';
      }
    } else {
      if (titleRef.current) {
        titleRef.current.textContent = '';
      }
      if (descriptionRef.current) {
        descriptionRef.current.textContent = '';
      }
    }
  }, [initialTask, defaultCategoryId]);

  // Auto-focus the title input when it opens
  useEffect(() => {
    if (autoFocus && titleRef.current && !initialTask) {
      requestAnimationFrame(() => {
        titleRef.current?.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        if (titleRef.current && selection) {
          range.selectNodeContents(titleRef.current);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      });
    }
  }, [autoFocus, initialTask]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !isSubmitting &&
        title.trim() === '' &&
        description.trim() === ''
      ) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel, isSubmitting, title, description]);

  // Parse time from title text
  useEffect(() => {
    const parseTime = async () => {
      if (!title.trim() || initialTask) return;
      const { parseTimeFromText } = await import('../../utils/taskHelpers');
      const { time } = await parseTimeFromText(title);
      if (time && !dueDate) {
        setDueDate(time);
      }
    };
    parseTime();
  }, [title, dueDate, initialTask]);

  const handleTitleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    setTitle(text);
    setShowQuickActions(text.length > 0 || description.length > 0);
  }, [description]);

  const handleDescriptionInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    setDescription(text);
    setShowQuickActions(text.length > 0 || title.length > 0);
  }, [title]);

  const handleSubmit = useCallback(async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const taskData: Partial<Task> = {
        title: trimmedTitle,
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        priority: priority ? (priority as 'low' | 'medium' | 'high') : undefined,
        categoryId: selectedCategoryId,
        status: 'todo',
        createdAt: initialTask?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      await onSubmit(taskData);
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate(null);
      setPriority('');
      setSelectedCategoryId(defaultCategoryId);
      setShowQuickActions(false);
      // Clear and focus title for next task
      if (titleRef.current) {
        titleRef.current.textContent = '';
        requestAnimationFrame(() => {
          titleRef.current?.focus();
        });
      }
      if (descriptionRef.current) {
        descriptionRef.current.textContent = '';
      }
    } catch (error) {
      console.error('Failed to submit task:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, dueDate, priority, selectedCategoryId, onSubmit, initialTask, isSubmitting, defaultCategoryId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, field: 'title' | 'description') => {
      if (e.key === 'Enter' && !e.shiftKey) {
        // Submit the form from either field
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    },
    [handleSubmit, onCancel]
  );

  const handleSetToday = () => {
    if (dueDate && isToday(dueDate)) {
      setDueDate(null);
    } else {
      setDueDate(startOfDay(new Date()));
    }
  };

  const handleSetPriority = (newPriority: 'low' | 'medium' | 'high') => {
    if (priority === newPriority) {
      setPriority('');
    } else {
      setPriority(newPriority);
    }
  };

  const handleRemoveDate = () => {
    setDueDate(null);
  };

  const handleRemovePriority = () => {
    setPriority('');
  };

  const priorityColors = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336',
  };

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const isTodaySelected = dueDate && isToday(dueDate);

  return (
    <Box
      ref={containerRef}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      sx={{
        mb: 2,
        bgcolor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.95)
          : theme.palette.background.paper,
        borderRadius: '8px',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 2px 8px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        '&:focus-within': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}, 0 4px 12px rgba(0,0,0,0.1)`,
        },
      }}
    >
      {/* Checkbox placeholder */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 1.5, gap: 1.5 }}>
        <Box sx={{ 
          width: 24, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mt: 0.5,
        }}>
          <Box
            sx={{
              width: 18,
              height: 18,
              border: `2px solid ${alpha(theme.palette.text.secondary, 0.4)}`,
              borderRadius: '50%',
              transition: 'all 0.2s ease',
            }}
          />
        </Box>

        {/* Editor area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Task name input */}
          <Box
            ref={titleRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleTitleInput}
            onKeyDown={(e) => handleKeyDown(e, 'title')}
            data-placeholder="Task name"
            sx={{
              minHeight: '28px',
              maxHeight: '200px',
              overflowY: 'auto',
              outline: 'none',
              fontSize: '0.9375rem',
              lineHeight: 1.5,
              fontWeight: 500,
              color: theme.palette.text.primary,
              wordBreak: 'break-word',
              '&:empty:before': {
                content: 'attr(data-placeholder)',
                color: theme.palette.text.secondary,
                opacity: 0.6,
                fontWeight: 400,
              },
              '&:focus': {
                outline: 'none',
              },
            }}
          />

          {/* Description input */}
          <Box
            ref={descriptionRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleDescriptionInput}
            onKeyDown={(e) => handleKeyDown(e, 'description')}
            data-placeholder="Description"
            sx={{
              minHeight: '24px',
              maxHeight: '150px',
              overflowY: 'auto',
              outline: 'none',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              color: theme.palette.text.secondary,
              wordBreak: 'break-word',
              '&:empty:before': {
                content: 'attr(data-placeholder)',
                color: theme.palette.text.secondary,
                opacity: 0.5,
                fontStyle: 'italic',
              },
              '&:focus': {
                outline: 'none',
                color: theme.palette.text.primary,
              },
            }}
          />

          {/* Quick actions bar */}
          {(showQuickActions || dueDate || priority) && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                flexWrap: 'wrap',
                mt: 0.5,
              }}
            >
              {/* Today button/tag */}
              {isTodaySelected ? (
                <Chip
                  icon={<TodayIcon sx={{ fontSize: '0.875rem !important', color: '#4caf50 !important' }} />}
                  label="Today"
                  size="small"
                  onDelete={handleRemoveDate}
                  sx={{
                    height: '28px',
                    fontSize: '0.8125rem',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': {
                      color: 'white !important',
                    },
                    '& .MuiChip-deleteIcon': {
                      fontSize: '1rem',
                      color: 'white',
                      '&:hover': {
                        color: 'rgba(255,255,255,0.8)',
                      },
                    },
                  }}
                />
              ) : (
                <Button
                  size="small"
                  startIcon={<TodayIcon sx={{ fontSize: '0.875rem' }} />}
                  onClick={handleSetToday}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.8125rem',
                    color: theme.palette.text.secondary,
                    minWidth: 'auto',
                    px: 1.25,
                    py: 0.5,
                    height: '28px',
                    borderRadius: '6px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.action.hover, 0.5),
                      borderColor: alpha(theme.palette.divider, 0.8),
                    },
                  }}
                >
                  Today
                </Button>
              )}

              {/* Priority button */}
              <Button
                size="small"
                startIcon={<FlagIcon sx={{ fontSize: '0.875rem' }} />}
                onClick={() => {
                  // Cycle through priorities or open menu
                  if (!priority) {
                    handleSetPriority('medium');
                  } else if (priority === 'medium') {
                    handleSetPriority('high');
                  } else if (priority === 'high') {
                    handleSetPriority('low');
                  } else {
                    handleSetPriority('medium');
                  }
                }}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.8125rem',
                  color: priority ? priorityColors[priority] : theme.palette.text.secondary,
                  minWidth: 'auto',
                  px: 1.25,
                  py: 0.5,
                  height: '28px',
                  borderRadius: '6px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  backgroundColor: 'transparent',
                  '& .MuiButton-startIcon': {
                    color: priority ? priorityColors[priority] : theme.palette.text.secondary,
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.5),
                    borderColor: alpha(theme.palette.divider, 0.8),
                  },
                }}
              >
                Priority
              </Button>

              {/* Selected priority chip */}
              {priority && (
                <Chip
                  icon={<FlagIcon sx={{ fontSize: '0.875rem !important', color: `${priorityColors[priority]} !important` }} />}
                  label={priorityLabels[priority]}
                  size="small"
                  onDelete={handleRemovePriority}
                  sx={{
                    height: '28px',
                    fontSize: '0.8125rem',
                    backgroundColor: alpha(priorityColors[priority], 0.15),
                    color: priorityColors[priority],
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      fontSize: '1rem',
                      color: priorityColors[priority],
                    },
                  }}
                />
              )}

              {/* Reminders button */}
              <Button
                size="small"
                startIcon={<RemindersIcon sx={{ fontSize: '0.875rem' }} />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.8125rem',
                  color: theme.palette.text.secondary,
                  minWidth: 'auto',
                  px: 1.25,
                  py: 0.5,
                  height: '28px',
                  borderRadius: '6px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.5),
                    borderColor: alpha(theme.palette.divider, 0.8),
                  },
                }}
              >
                Reminders
              </Button>

              {/* More options button */}
              <IconButton
                size="small"
                onClick={(e) => setMoreMenuAnchor(e.currentTarget)}
                sx={{
                  width: '28px',
                  height: '28px',
                  color: theme.palette.text.secondary,
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  borderRadius: '6px',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.5),
                  },
                }}
              >
                <MoreVertIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Box>
          )}

          {/* Project/Category selector */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              mt: 0.5,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={(e) => setCategoryMenuAnchor(e.currentTarget)}
          >
            <InboxIcon sx={{ fontSize: '1rem', color: theme.palette.text.secondary }} />
            <Box
              component="span"
              sx={{
                fontSize: '0.8125rem',
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              {selectedCategory?.name || 'Inbox'}
            </Box>
            <KeyboardArrowDownIcon sx={{ fontSize: '1rem', color: theme.palette.text.secondary }} />
          </Box>
        </Box>
      </Box>

      {/* Category menu */}
      <Menu
        anchorEl={categoryMenuAnchor}
        open={Boolean(categoryMenuAnchor)}
        onClose={() => setCategoryMenuAnchor(null)}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setSelectedCategoryId(undefined);
            setCategoryMenuAnchor(null);
          }}
          selected={!selectedCategoryId}
        >
          <ListItemIcon>
            <InboxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Inbox</ListItemText>
        </MenuItem>
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            onClick={() => {
              setSelectedCategoryId(category.id);
              setCategoryMenuAnchor(null);
            }}
            selected={selectedCategoryId === category.id}
          >
            <ListItemText>{category.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* More options menu */}
      <Menu
        anchorEl={moreMenuAnchor}
        open={Boolean(moreMenuAnchor)}
        onClose={() => setMoreMenuAnchor(null)}
        PaperProps={{
          sx: {
            minWidth: 180,
            mt: 1,
          },
        }}
      >
        <MenuItem onClick={() => setMoreMenuAnchor(null)}>
          <ListItemText>Add subtask</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setMoreMenuAnchor(null)}>
          <ListItemText>Add comment</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default InlineTaskEditor;
