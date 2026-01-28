import React, { useState, useEffect } from 'react';
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
  useTheme,
  alpha,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export interface SearchCriteria {
  title?: string;
  description?: string;
  dueDate?: Date | null;
  priority?: 'low' | 'medium' | 'high' | '';
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSearch: (criteria: SearchCriteria) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  open,
  onClose,
  onSearch,
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setPriority('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const criteria: SearchCriteria = {
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority: priority || undefined,
    };
    onSearch(criteria);
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
    >
      <DialogContent sx={{ 
        p: 2, 
        height: '100%', 
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        '&.MuiDialogContent-root': { 
          paddingTop: 2 
        } 
      }}>
        <form onSubmit={handleSearch} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                label="Task name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="small"
                sx={{ 
                  flex: 1,
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
                />
              </LocalizationProvider>

              <FormControl size="small" sx={{ width: '120px' }}>
                <InputLabel sx={{ color: theme.palette.text.secondary }}>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | '')}
                  label="Priority"
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
                size="small"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Search
              </Button>
            </Box>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
