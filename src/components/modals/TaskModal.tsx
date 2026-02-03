import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  useTheme,
  alpha,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Task } from '../../types';
import HighlightedTimeInput from '../ui/HighlightedTimeInput';

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
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
      setPriority(initialTask.priority || '');
    } else {
      resetForm();
      setDueDate(new Date());
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

  // Warn on reload/close when modal is open and form has unsaved changes
  const isDirty = useMemo(() => {
    if (!open) return false;
    if (initialTask) {
      const descMatch = (initialTask.description || '') === description;
      const dateMatch = (initialTask.dueDate == null && dueDate == null) ||
        (initialTask.dueDate != null && dueDate != null && new Date(initialTask.dueDate).getTime() === dueDate.getTime());
      return title !== initialTask.title || !descMatch || !dateMatch || (initialTask.priority || '') !== priority;
    }
    return title.trim() !== '' || description.trim() !== '' || priority !== '';
  }, [open, initialTask, title, description, dueDate, priority]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

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

    // Ensure we have the latest title from contentEditable
    const currentTitle = titleInputRef.current?.textContent || title;

    // Update title state if it differs from contentEditable
    if (currentTitle !== title) {
      setTitle(currentTitle);
    }
    
    // Wait a tick for state to update, then validate
    await new Promise(resolve => setTimeout(resolve, 0));
    
    if (!validateForm() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      const finalTitle = titleInputRef.current?.textContent || title;
      const taskData: Partial<Task> = {
        title: finalTitle.trim(),
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
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 20px 60px -12px rgba(0, 0, 0, 0.5), 0 8px 24px -4px rgba(0, 0, 0, 0.4)'
            : '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 8px 24px -4px rgba(0, 0, 0, 0.1)',
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
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
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
                  backgroundColor: alpha(theme.palette.error.main, 0.15),
                  color: theme.palette.text.primary,
                  '& .MuiAlert-icon': {
                    color: theme.palette.error.main,
                  },
                }}
              >
                {errors.submit}
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <HighlightedTimeInput
                inputRef={titleInputRef}
                autoFocus
                label="Task name"
                value={title}
                onChange={(inputValue) => {
                  setTitle(inputValue);
                }}
                onTimeParsed={(time) => {
                  if (time) {
                    setDueDate(time);
                  } else {
                    setDueDate(null);
                  }
                }}
                error={!!errors.title}
                helperText={errors.title}
                required
                disabled={isSubmitting}
                sx={{ flex: 1 }}
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
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? alpha(theme.palette.common.white, 0.05)
                            : alpha(theme.palette.common.black, 0.02),
                          '& fieldset': {
                            borderColor: theme.palette.mode === 'dark'
                              ? alpha(theme.palette.common.white, 0.2)
                              : alpha(theme.palette.common.black, 0.2),
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.mode === 'dark'
                              ? alpha(theme.palette.common.white, 0.3)
                              : alpha(theme.palette.common.black, 0.3),
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.text.secondary,
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: theme.palette.primary.main,
                        },
                        '& .MuiInputBase-input': {
                          color: theme.palette.text.primary,
                        },
                      },
                    },
                  }}
                  disabled={isSubmitting}
                />
              </LocalizationProvider>

              <FormControl size="small" sx={{ width: '120px' }}>
                <InputLabel sx={{ color: theme.palette.text.secondary }}>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | '')}
                  label="Priority"
                  disabled={isSubmitting}
                  sx={{
                    color: theme.palette.text.primary,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.2)
                        : alpha(theme.palette.common.black, 0.2),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.3)
                        : alpha(theme.palette.common.black, 0.3),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '& .MuiSvgIcon-root': {
                      color: theme.palette.text.secondary,
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: theme.palette.background.paper,
                        '& .MuiMenuItem-root': {
                          color: theme.palette.text.primary,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                          '&.Mui-selected': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.3),
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
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.common.white, 0.05)
                    : alpha(theme.palette.common.black, 0.02),
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.2)
                      : alpha(theme.palette.common.black, 0.2),
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.3)
                      : alpha(theme.palette.common.black, 0.3),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.secondary,
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: theme.palette.primary.main,
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.text.primary,
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 'auto' }}>
              <Button 
                onClick={handleClose} 
                disabled={isSubmitting}
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
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
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  '&:disabled': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    color: alpha(theme.palette.primary.contrastText, 0.5),
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
