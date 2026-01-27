import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Task } from '../../types';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<Task>) => Promise<void>;
  initialTask?: Task | null;
  loading?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialTask,
  loading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
      setPriority(initialTask.priority || '');
    } else {
      resetForm();
    }
  }, [initialTask, open]);

  // Auto-focus the title input when modal opens (backup mechanism)
  useEffect(() => {
    if (open && titleInputRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        setTimeout(() => {
          titleInputRef.current?.focus();
        }, 0);
      });
    }
  }, [open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setPriority('');
    setErrors({});
    setIsSubmitting(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Task name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const taskData: Partial<Task> = {
        title,
        description: description || undefined,
        dueDate: dueDate || undefined,
        priority: priority ? (priority as 'low' | 'medium' | 'high') : undefined,
        status: 'todo',
        createdAt: initialTask?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      await onSubmit(taskData);
      resetForm();
      onClose();
    } catch (error) {
      setErrors({
        submit: 'Failed to save task. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: '550px',
          height: '190px',
          maxWidth: '550px',
          maxHeight: '190px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          m: 0,
          backgroundColor: '#2d2d2d',
          color: '#ffffff',
          boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.5), 0 8px 24px -4px rgba(0, 0, 0, 0.4)',
          borderRadius: '12px',
        }
      }}
      TransitionProps={{
        onEntered: () => {
          titleInputRef.current?.focus();
        }
      }}
      disableEscapeKeyDown={isSubmitting}
    >
      <DialogContent sx={{ 
        p: 2, 
        height: '100%', 
        backgroundColor: '#2d2d2d',
        '&.MuiDialogContent-root': { 
          paddingTop: 2,
        } 
      }}>
        <form onSubmit={handleSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
            {errors.submit && (
              <Alert 
                severity="error" 
                sx={{ 
                  py: 0.5,
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#ffffff',
                  '& .MuiAlert-icon': {
                    color: '#ef4444',
                  },
                }}
              >
                {errors.submit}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                inputRef={titleInputRef}
                autoFocus
                label="Task name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                size="small"
                required
                disabled={isSubmitting}
                sx={{ 
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#3b82f6',
                  },
                  '& .MuiInputBase-input': {
                    color: '#ffffff',
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'rgba(255, 255, 255, 0.6)',
                  },
                }}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { 
                        width: '140px',
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#3b82f6',
                        },
                        '& .MuiInputBase-input': {
                          color: '#ffffff',
                        },
                      },
                    },
                  }}
                  disabled={isSubmitting}
                />
              </LocalizationProvider>

              <FormControl size="small" sx={{ width: '120px' }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | '')}
                  label="Priority"
                  disabled={isSubmitting}
                  sx={{
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#2d2d2d',
                        '& .MuiMenuItem-root': {
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(59, 130, 246, 0.3)',
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={1}
              size="small"
              fullWidth
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#3b82f6',
                },
                '& .MuiInputBase-input': {
                  color: '#ffffff',
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 'auto' }}>
              <Button 
                onClick={handleClose} 
                disabled={isSubmitting}
                size="small"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isSubmitting || loading}
                size="small"
                sx={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Add Task'
                )}
              </Button>
            </Box>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
