import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Paper,
  Divider,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  useTheme,
  useMediaQuery,
  Drawer,
  Checkbox,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Comment as CommentIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  Label as LabelIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Task, Tag, Category, Comment } from '../../types';
import { useI18n } from '../../contexts/I18nContext';

interface TaskViewProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate?: (taskData: Partial<Task>) => Promise<void>;
  onAddComment: (taskId: string, comment: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  tags: Tag[];
  categories: Category[];
}

const TaskView: React.FC<TaskViewProps> = ({
  open,
  onClose,
  task,
  onTaskUpdate,
  onTaskCreate,
  onAddComment,
  onAddSubtask,
  onToggleSubtask,
  tags,
  categories,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useI18n();
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate ? new Date(task.dueDate) : null);
  // Convert tag IDs to Tag objects
  const getTagsFromIds = (tagIds: string[] = []): Tag[] => {
    return tagIds.map(id => tags.find(tag => tag.id === id)).filter((tag): tag is Tag => tag !== undefined);
  };
  const [selectedTags, setSelectedTags] = useState<Tag[]>(getTagsFromIds(task?.tags));
  const [category, setCategory] = useState<string>(task?.category || '');

  // Reset form state when task changes or when opening for new task
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setSelectedTags(getTagsFromIds(task.tags));
      setCategory(task.category || '');
    } else {
      // New task - reset to empty
      setTitle('');
      setDescription('');
      setDueDate(null);
      setSelectedTags([]);
      setCategory('');
    }
  }, [task?.id, open, tags]);

  useEffect(() => {
    // Only update parent task if we have an existing task (not a new one)
    if (task?.id) {
      const updates: Partial<Task> = {
        title,
        description,
        dueDate: dueDate || undefined,
        tags: selectedTags.map(tag => tag.id),
        category,
      };
      onTaskUpdate(task.id, updates);
    }
  }, [title, description, dueDate, selectedTags, category, task?.id]);

  const handleAddComment = () => {
    if (newComment.trim() && task?.id) {
      onAddComment(task.id, newComment.trim());
      setNewComment('');
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim() && task?.id) {
      onAddSubtask(task.id, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const handleSave = async () => {
    if (!task && onTaskCreate) {
      // Creating new task
      const taskData: Partial<Task> = {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        tags: selectedTags.map(tag => tag.id),
        category,
        completed: false,
      };
      
      if (taskData.title) {
        try {
          await onTaskCreate(taskData);
          onClose();
        } catch (error) {
          // Don't close the drawer on error - let user see the error and try again
          // Error is already displayed via setError in TaskManager
          console.error('Failed to create task:', error);
        }
      }
    }
  };

  // Don't render if not open
  if (!open) {
    return null;
  }

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      sx={{
        width: open ? 600 : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 600,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          height: '100vh',
          overflow: 'auto',
          p: 3,
        }}
      >
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              {task ? title : 'New Task'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!task && onTaskCreate && (
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={!title.trim()}
                >
                  Save
                </Button>
              )}
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Title */}
          <TextField
            fullWidth
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            variant="outlined"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />

          {/* Task Details Section */}
          <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Task Details
            </Typography>
            <Stack spacing={3}>
              {/* Due Date */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Due Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={dueDate}
                    onChange={(newValue) => setDueDate(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              {/* Tags */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Tags
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      onClick={() => {
                        const isSelected = selectedTags.some((t) => t.id === tag.id);
                        if (isSelected) {
                          setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      sx={{
                        backgroundColor: selectedTags.some((t) => t.id === tag.id)
                          ? tag.color
                          : 'transparent',
                        color: selectedTags.some((t) => t.id === tag.id) ? 'white' : 'inherit',
                        border: selectedTags.some((t) => t.id === tag.id) ? 'none' : `1px solid ${tag.color}`,
                        '&:hover': {
                          backgroundColor: selectedTags.some((t) => t.id === tag.id)
                            ? tag.color
                            : 'action.hover',
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Assignee */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Assignee
                </Typography>
                <Button
                  startIcon={<PersonIcon />}
                  sx={{ justifyContent: 'flex-start', width: '100%' }}
                >
                  Unassigned
                </Button>
              </Box>

              {/* Reminders */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Reminders
                </Typography>
                <Button
                  startIcon={<NotificationsIcon />}
                  sx={{ justifyContent: 'flex-start', width: '100%' }}
                >
                  Add Reminder
                </Button>
              </Box>
            </Stack>
          </Paper>

          {/* Subtasks */}
          <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Subtasks
              </Typography>
              <IconButton onClick={() => setShowSubtasks(!showSubtasks)}>
                {showSubtasks ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={showSubtasks}>
              <List>
                {task?.subtasks?.map((subtask) => (
                  <ListItem key={subtask.id}>
                    <ListItemIcon>
                      <Checkbox
                        checked={subtask.completed}
                        onChange={() => task?.id && onToggleSubtask(task.id, subtask.id)}
                      />
                    </ListItemIcon>
                    <ListItemText primary={subtask.title} />
                  </ListItem>
                ))}
              </List>
              {task?.id && (
                <Box sx={{ display: 'flex', mt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddSubtask}
                    disabled={!newSubtask.trim()}
                    sx={{ ml: 2 }}
                  >
                    Add
                  </Button>
                </Box>
              )}
            </Collapse>
          </Paper>

          {/* Comments */}
          <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Comments
              </Typography>
              <IconButton onClick={() => setShowComments(!showComments)}>
                {showComments ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={showComments}>
              <List>
                {task?.comments?.map((comment) => (
                  <ListItem key={comment.id} alignItems="flex-start">
                    <ListItemIcon>
                      <Avatar>{comment.userId.charAt(0)}</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={comment.userId}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {comment.text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {new Date(comment.createdAt).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              {task?.id && (
                <Box sx={{ display: 'flex', mt: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    sx={{ ml: 2 }}
                  >
                    Add
                  </Button>
                </Box>
              )}
            </Collapse>
          </Paper>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default TaskView; 