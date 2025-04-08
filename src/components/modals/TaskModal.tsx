import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Divider,
  Tooltip,
  Paper,
  InputAdornment,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Task, Tag, Category, Subtask, Attachment } from '../../types';
import { startOfDay, format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import NotesIcon from '@mui/icons-material/Notes';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LabelIcon from '@mui/icons-material/Label';
import FolderIcon from '@mui/icons-material/Folder';
import FlagIcon from '@mui/icons-material/Flag';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'order'>) => void;
  initialTask?: Task;
  tags: Tag[];
  categories: Category[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSave,
  initialTask,
  tags = [],
  categories = [],
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [expandedSections, setExpandedSections] = useState<{
    description: boolean;
    subtasks: boolean;
    notes: boolean;
    attachments: boolean;
  }>({
    description: false,
    subtasks: false,
    notes: false,
    attachments: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
      setPriority(initialTask.priority || 'medium');
      setSelectedTags(initialTask.tags || []);
      setCategory(initialTask.category || '');
      setSubtasks(initialTask.subtasks || []);
      setNotes(initialTask.notes || '');
      setAttachments(initialTask.attachments || []);
    } else {
      resetForm();
    }
  }, [initialTask, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setPriority('medium');
    setSelectedTags([]);
    setCategory('');
    setSubtasks([]);
    setNotes('');
    setAttachments([]);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const taskData: Omit<Task, 'id' | 'order'> = {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? startOfDay(dueDate).toISOString() : null,
        priority,
        tags: selectedTags,
        category: category || '',
        categoryId: category || '',
        subtasks: subtasks.map(subtask => ({
          ...subtask,
          order: subtask.order || 0
        })),
        notes: notes.trim(),
        attachments: attachments.map(attachment => ({
          ...attachment,
          uploadedAt: new Date()
        })),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'todo',
        userId: '', // This will be set by the parent component
      };
      
      console.log('Submitting task data:', taskData);
      await onSave(taskData);
      resetForm();
      onClose();
    } catch (err) {
      setError('Failed to save task. Please try again.');
      console.error('Error saving task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(tag => tag !== tagName)
        : [...prev, tagName]
    );
  };

  const handleAddSubtask = () => {
    const newSubtask: Subtask = {
      id: `subtask-${Date.now()}`,
      title: '',
      completed: false,
    };
    setSubtasks(prev => [...prev, newSubtask]);
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(subtask => subtask.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: `attachment-${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return theme.palette.success.main;
      case 'medium': return theme.palette.warning.main;
      case 'high': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const toggleSection = (section: 'description' | 'subtasks' | 'notes' | 'attachments') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
          <Typography variant="h6" component="div">
            {initialTask ? 'Edit Task' : 'Create New Task'}
          </Typography>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={onClose} 
            aria-label="close"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Paper 
              sx={{ 
                p: 2, 
                mb: 2, 
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">{error}</Typography>
            </Paper>
          )}
          
          <Box sx={{ mb: 3 }}>
            <TextField
              autoFocus
              fullWidth
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              required
              error={!!error && !title.trim()}
              InputProps={{
                sx: { 
                  borderRadius: 1,
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                label="Priority"
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="">None</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { borderRadius: 1 }
                }
              }}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Paper 
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
              onClick={() => toggleSection('description')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NotesIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle1">Description</Typography>
                </Box>
                <IconButton size="small">
                  {expandedSections.description ? <CloseIcon /> : <AddIcon />}
                </IconButton>
              </Box>
            </Paper>
            
            {expandedSections.description && (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                sx={{ mt: 2, borderRadius: 1 }}
              />
            )}
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Paper 
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
              onClick={() => toggleSection('subtasks')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SubtitlesIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle1">Subtasks</Typography>
                </Box>
                <IconButton size="small">
                  {expandedSections.subtasks ? <CloseIcon /> : <AddIcon />}
                </IconButton>
              </Box>
            </Paper>
            
            {expandedSections.subtasks && (
              <Box sx={{ mt: 2 }}>
                <List>
                  {subtasks.map((subtask) => (
                    <ListItem key={subtask.id} sx={{ px: 2, py: 1 }}>
                      <TextField
                        fullWidth
                        value={subtask.title}
                        onChange={(e) => {
                          setSubtasks(prev => 
                            prev.map(s => 
                              s.id === subtask.id ? { ...s, title: e.target.value } : s
                            )
                          );
                        }}
                        placeholder="Subtask"
                        variant="outlined"
                        size="small"
                        sx={{ mr: 2, borderRadius: 1 }}
                      />
                      <IconButton 
                        edge="end" 
                        size="small" 
                        onClick={() => handleDeleteSubtask(subtask.id)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddSubtask}
                  sx={{ mt: 1 }}
                >
                  Add Subtask
                </Button>
              </Box>
            )}
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Paper 
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
              onClick={() => toggleSection('notes')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NotesIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle1">Notes</Typography>
                </Box>
                <IconButton size="small">
                  {expandedSections.notes ? <CloseIcon /> : <AddIcon />}
                </IconButton>
              </Box>
            </Paper>
            
            {expandedSections.notes && (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                variant="outlined"
                sx={{ mt: 2, borderRadius: 1 }}
              />
            )}
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Paper 
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
              onClick={() => toggleSection('attachments')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachFileIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle1">Attachments</Typography>
                </Box>
                <IconButton size="small">
                  {expandedSections.attachments ? <CloseIcon /> : <AddIcon />}
                </IconButton>
              </Box>
            </Paper>
            
            {expandedSections.attachments && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  sx={{ mb: 2, borderRadius: 1 }}
                >
                  Upload Files
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileUpload}
                  />
                </Button>
                
                {attachments.length > 0 && (
                  <List>
                    {attachments.map((attachment) => (
                      <ListItem key={attachment.id} sx={{ px: 2, py: 1 }}>
                        <ListItemText 
                          primary={attachment.name}
                          secondary={`${Math.round(attachment.size / 1024)} KB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            size="small" 
                            onClick={() => {
                              setAttachments(prev => 
                                prev.filter(a => a.id !== attachment.id)
                              );
                            }}
                            sx={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag.name}
                  label={tag.name}
                  onClick={() => handleTagToggle(tag.name)}
                  color={selectedTags.includes(tag.name) ? 'primary' : 'default'}
                  sx={{ 
                    borderRadius: 1,
                    '&.MuiChip-colorPrimary': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      color: theme.palette.primary.main,
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={{ 
              borderRadius: 1,
              px: 3,
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal; 