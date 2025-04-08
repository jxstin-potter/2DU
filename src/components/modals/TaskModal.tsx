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
  FormHelperText,
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
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'order'>) => void;
  initialTask?: Task;
  tags: Tag[];
  categories: Category[];
}

// Define validation schema
const taskSchema = yup.object().shape({
  title: yup.string().required('Task title is required').trim(),
  description: yup.string().trim(),
  dueDate: yup.date().nullable(),
  priority: yup.string().oneOf(['low', 'medium', 'high']).default('medium'),
  tags: yup.array().of(yup.string()),
  category: yup.string().default(''),
  categoryId: yup.string().default(''),
  subtasks: yup.array().of(
    yup.object().shape({
      id: yup.string(),
      title: yup.string().trim(),
      completed: yup.boolean().default(false),
      order: yup.number().default(0),
    })
  ),
  notes: yup.string().trim(),
  attachments: yup.array().of(
    yup.object().shape({
      id: yup.string(),
      name: yup.string(),
      size: yup.number(),
      type: yup.string(),
      url: yup.string(),
      uploadedAt: yup.date().default(() => new Date()),
    })
  ),
  completed: yup.boolean().default(false),
  createdAt: yup.string().default(() => new Date().toISOString()),
  updatedAt: yup.string().default(() => new Date().toISOString()),
  status: yup.string().default('todo'),
  userId: yup.string().default(''),
});

type TaskFormData = yup.InferType<typeof taskSchema>;

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  initialTask,
  tags = [],
  categories = [],
}) => {
  const theme = useTheme();
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

  // Initialize React Hook Form
  const { 
    control, 
    handleSubmit, 
    reset, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: null,
      priority: 'medium',
      tags: [],
      category: '',
      categoryId: '',
      subtasks: [],
      notes: '',
      attachments: [],
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'todo',
      userId: '',
    }
  });

  // Use field array for subtasks
  const { fields: subtaskFields, append: appendSubtask, remove: removeSubtask } = useFieldArray({
    control,
    name: 'subtasks',
  });

  // Watch form values
  const selectedTags = watch('tags');
  const priority = watch('priority');
  const category = watch('category');

  useEffect(() => {
    if (initialTask) {
      // Reset form with initial task data
      reset({
        title: initialTask.title,
        description: initialTask.description || '',
        dueDate: initialTask.dueDate ? new Date(initialTask.dueDate) : null,
        priority: initialTask.priority || 'medium',
        tags: initialTask.tags || [],
        category: initialTask.category || '',
        categoryId: initialTask.categoryId || '',
        subtasks: initialTask.subtasks || [],
        notes: initialTask.notes || '',
        attachments: initialTask.attachments || [],
        completed: initialTask.completed || false,
        createdAt: initialTask.createdAt || new Date().toISOString(),
        updatedAt: initialTask.updatedAt || new Date().toISOString(),
        status: initialTask.status || 'todo',
        userId: initialTask.userId || '',
      });
    } else {
      // Reset form to default values
      reset({
        title: '',
        description: '',
        dueDate: null,
        priority: 'medium',
        tags: [],
        category: '',
        categoryId: '',
        subtasks: [],
        notes: '',
        attachments: [],
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'todo',
        userId: '',
      });
    }
  }, [initialTask, open, reset]);

  const handleTagToggle = (tagName: string) => {
    const currentTags = watch('tags');
    const updatedTags = currentTags.includes(tagName)
      ? currentTags.filter(tag => tag !== tagName)
      : [...currentTags, tagName];
    
    setValue('tags', updatedTags);
  };

  const handleAddSubtask = () => {
    appendSubtask({
      id: `subtask-${Date.now()}`,
      title: '',
      completed: false,
      order: subtaskFields.length,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const currentAttachments = watch('attachments');
    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: `attachment-${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
    }));
    
    setValue('attachments', [...currentAttachments, ...newAttachments]);
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

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const taskData: Omit<Task, 'id' | 'order'> = {
        ...data,
        dueDate: data.dueDate ? startOfDay(data.dueDate).toISOString() : null,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Submitting task data:', taskData);
      await onSubmit(taskData);
      reset();
      onClose();
    } catch (err) {
      setError('Failed to save task. Please try again.');
      console.error('Error saving task:', err);
    } finally {
      setIsSubmitting(false);
    }
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  fullWidth
                  label="Task Title"
                  variant="outlined"
                  required
                  error={!!errors.title}
                  helperText={errors.title?.message}
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
              )}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Priority</InputLabel>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Priority"
                    sx={{ borderRadius: 1 }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
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
                )}
              />
            </FormControl>
            
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Due Date"
                  value={field.value}
                  onChange={(newValue) => field.onChange(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { borderRadius: 1 }
                    }
                  }}
                />
              )}
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
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    variant="outlined"
                    sx={{ mt: 2, borderRadius: 1 }}
                  />
                )}
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
                  {subtaskFields.map((field, index) => (
                    <ListItem key={field.id} sx={{ px: 2, py: 1 }}>
                      <Controller
                        name={`subtasks.${index}.title`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            placeholder="Subtask"
                            variant="outlined"
                            size="small"
                            sx={{ mr: 2, borderRadius: 1 }}
                          />
                        )}
                      />
                      <IconButton 
                        edge="end" 
                        size="small" 
                        onClick={() => removeSubtask(index)}
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
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Notes"
                    variant="outlined"
                    sx={{ mt: 2, borderRadius: 1 }}
                  />
                )}
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
                
                {watch('attachments').length > 0 && (
                  <List>
                    {watch('attachments').map((attachment, index) => (
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
                              const currentAttachments = watch('attachments');
                              setValue('attachments', currentAttachments.filter((_, i) => i !== index));
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