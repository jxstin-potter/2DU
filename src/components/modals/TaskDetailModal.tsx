import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  TextField,
  useTheme,
  alpha,
  Checkbox,
  Divider,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Inbox as InboxIcon,
  Assignment as ProjectIcon,
  CalendarToday as DateIcon,
  Flag as PriorityIcon,
  Label as LabelIcon,
  Add as AddIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { startOfDay } from 'date-fns';
import { Task, Tag } from '../../types';
import { useTaskMetadata } from '../../contexts/TaskMetadataContext';

interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onToggleComplete: (taskId: string) => void;
}

const PRIORITY_LABELS: Record<string, string> = { high: 'P1', medium: 'P2', low: 'P3', '': 'P4' };

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  open,
  onClose,
  task,
  onUpdate,
  onToggleComplete,
}) => {
  const theme = useTheme();
  const { tags, categories } = useTaskMetadata();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState<Date | null>(task.dueDate ? new Date(task.dueDate) : null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>(task.priority || '');
  const [isSaving, setIsSaving] = useState(false);

  const category = useMemo(() => {
    const id = task.categoryId ?? task.category;
    return id ? categories.find((c) => c.id === id) : undefined;
  }, [task.categoryId, task.category, categories]);

  const taskTags = useMemo(() => {
    return (task.tags ?? [])
      .map((id) => tags.find((t) => t.id === id))
      .filter(Boolean) as Tag[];
  }, [task.tags, tags]);

  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setPriority(task.priority || '');
    }
  }, [open, task]);

  const handleToggleComplete = useCallback(() => {
    onToggleComplete(task.id);
  }, [task.id, onToggleComplete]);

  const handleBlurSave = useCallback(async () => {
    const updates: Partial<Task> = {};
    if (title !== task.title) updates.title = title;
    if (description !== (task.description || '')) updates.description = description || undefined;
    if ((dueDate?.getTime() ?? null) !== (task.dueDate ? new Date(task.dueDate).getTime() : null)) {
      updates.dueDate = dueDate || undefined;
    }
    if ((priority || '') !== (task.priority || '')) {
      updates.priority = priority ? (priority as 'low' | 'medium' | 'high') : undefined;
    }
    if (Object.keys(updates).length === 0) return;
    try {
      setIsSaving(true);
      await onUpdate(task.id, { ...updates, updatedAt: new Date() });
    } finally {
      setIsSaving(false);
    }
  }, [title, description, dueDate, priority, task, onUpdate]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: '90vw',
          maxWidth: 720,
          minHeight: 400,
          maxHeight: '85vh',
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 24px 48px rgba(0, 0, 0, 0.4)'
              : '0 24px 48px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', minHeight: 400 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InboxIcon sx={{ fontSize: '1.25rem', color: 'text.secondary' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
              {category?.name ?? 'Inbox'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <UpIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <DownIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <MoreIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left pane: content */}
          <Box
            sx={{
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              borderRight: 1,
              borderColor: 'divider',
            }}
          >
            {/* Checkbox + title */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, px: 2, py: 2 }}>
              <Checkbox
                checked={task.completed}
                onChange={handleToggleComplete}
                sx={{ p: 0.25, mt: 0.25 }}
              />
              <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleBlurSave}
                variant="standard"
                fullWidth
                multiline
                maxRows={4}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'text.secondary' : 'text.primary',
                  },
                }}
              />
            </Box>

            {/* Description */}
            <Box sx={{ px: 2, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <span style={{ fontSize: '0.875rem', color: theme.palette.text.secondary }}>
                  Description
                </span>
              </Box>
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleBlurSave}
                placeholder="Add a more detailed description..."
                multiline
                minRows={2}
                maxRows={8}
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.text.primary, 0.04),
                    fontSize: '0.875rem',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'divider' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                }}
              />
            </Box>

            {/* Add sub-task placeholder */}
            <Box
              sx={{
                px: 2,
                pb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
                fontSize: '0.875rem',
                cursor: 'default',
              }}
            >
              <AddIcon sx={{ fontSize: '1.125rem' }} />
              Add sub-task
            </Box>

            <Divider />

            {/* Comment section */}
            <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  px: 1.5,
                  py: 1,
                  backgroundColor: alpha(theme.palette.text.primary, 0.02),
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    opacity: 0.5,
                  }}
                />
                <TextField
                  placeholder="Add a comment..."
                  variant="standard"
                  fullWidth
                  size="small"
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: '0.875rem' },
                  }}
                />
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <AttachIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Right pane: metadata */}
          <Box
            sx={{
              flex: 1,
              minWidth: 200,
              maxWidth: 260,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {/* Project */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ProjectIcon sx={{ fontSize: '1.125rem', color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {category?.name ?? 'Inbox'}
              </Typography>
            </Box>

            {/* Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DateIcon sx={{ fontSize: '1.125rem', color: 'text.secondary' }} />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={dueDate}
                  onChange={(newValue) => {
                    setDueDate(newValue ? startOfDay(newValue) : null);
                    if (newValue) {
                      onUpdate(task.id, { dueDate: startOfDay(newValue), updatedAt: new Date() });
                    } else {
                      onUpdate(task.id, { dueDate: undefined, updatedAt: new Date() });
                    }
                  }}
                  slotProps={{
                    textField: {
                      size: 'small',
                      variant: 'standard',
                      sx: {
                        flex: 1,
                        '& .MuiInput-root': { fontSize: '0.875rem' },
                        '& .MuiInput-input': { py: 0 },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            {/* Priority */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PriorityIcon sx={{ fontSize: '1.125rem', color: 'text.secondary' }} />
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  flexWrap: 'wrap',
                }}
              >
                {(['high', 'medium', 'low', ''] as const).map((p) => (
                  <Chip
                    key={p || 'none'}
                    label={PRIORITY_LABELS[p] ?? 'P4'}
                    size="small"
                    onClick={() => {
                      setPriority(p);
                      onUpdate(task.id, {
                        priority: p ? (p as 'low' | 'medium' | 'high') : undefined,
                        updatedAt: new Date(),
                      });
                    }}
                    sx={{
                      fontSize: '0.75rem',
                      height: 24,
                      bgcolor: priority === p ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                      border: `1px solid ${priority === p ? theme.palette.primary.main : theme.palette.divider}`,
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Labels */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <LabelIcon sx={{ fontSize: '1.125rem', color: 'text.secondary' }} />
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {taskTags.map((t) => (
                  <Chip
                    key={t.id}
                    label={t.name}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                      height: 22,
                      bgcolor: t.color || 'default',
                      color: t.color ? 'white' : 'inherit',
                    }}
                  />
                ))}
                <Chip
                  icon={<AddIcon sx={{ fontSize: '0.875rem !important' }} />}
                  label="Add"
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 24, cursor: 'pointer' }}
                />
              </Box>
            </Box>

            {/* Reminders placeholder */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <Typography variant="body2">Reminders</Typography>
              <AddIcon sx={{ fontSize: '1rem' }} />
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
