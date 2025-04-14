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
  Flag as FlagIcon,
  Notifications as NotificationsIcon,
  Folder as FolderIcon,
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
  const [selectedTags, setSelectedTags] = useState<Tag[]>(task?.tags || []);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task?.priority || 'medium');
  const [category, setCategory] = useState<string>(task?.category || '');

  useEffect(() => {
    // Update parent task when local state changes
    const updates: Partial<Task> = {
      title,
      description,
      dueDate: dueDate || undefined,
      tags: selectedTags.map(tag => tag.id),
      priority,
      category,
    };
    onTaskUpdate(task?.id || '', updates);
  }, [title, description, dueDate, selectedTags, priority, category]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(task?.id || '', newComment.trim());
      setNewComment('');
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(task?.id || '', newSubtask.trim());
      setNewSubtask('');
    }
  };

  const renderPriorityChip = (priority: 'low' | 'medium' | 'high') => {
    const colors = {
      low: theme.palette.success.main,
      medium: theme.palette.warning.main,
      high: theme.palette.error.main,
    };

    return (
      <Chip
        label={priority.charAt(0).toUpperCase() + priority.slice(1)}
        size="small"
        sx={{
          backgroundColor: colors[priority],
          color: 'white',
          fontWeight: 'bold',
        }}
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 3,
          width: { md: `calc(100% - 320px)` },
        }}
      >
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              {title}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

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
                        onChange={() => onToggleSubtask(task?.id || '', subtask.id)}
                      />
                    </ListItemIcon>
                    <ListItemText primary={subtask.title} />
                  </ListItem>
                ))}
              </List>
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
                      <Avatar>{comment.author.charAt(0)}</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={comment.author}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {comment.text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {new Date(comment.timestamp).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
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
            </Collapse>
          </Paper>
        </Stack>
      </Box>

      {/* Right Sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: 320,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 320,
              p: 3,
              borderLeft: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h6">Task Details</Typography>

            {/* Project */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Project
              </Typography>
              <Button
                startIcon={<FolderIcon />}
                sx={{ justifyContent: 'flex-start', width: '100%' }}
              >
                {category || 'Select Project'}
              </Button>
            </Box>

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

            {/* Priority */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Priority
              </Typography>
              <Stack direction="row" spacing={1}>
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <Chip
                    key={p}
                    label={p.charAt(0).toUpperCase() + p.slice(1)}
                    onClick={() => setPriority(p)}
                    sx={{
                      backgroundColor: priority === p ? theme.palette.primary.main : 'transparent',
                      color: priority === p ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: priority === p ? theme.palette.primary.dark : 'action.hover',
                      },
                    }}
                  />
                ))}
              </Stack>
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
        </Drawer>
      )}
    </Box>
  );
};

export default TaskView; 