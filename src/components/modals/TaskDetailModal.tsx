import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  TextField,
  useTheme,
  useMediaQuery,
  alpha,
  Checkbox,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Close as CloseIcon,
  Inbox as InboxIcon,
  Assignment as ProjectIcon,
  CalendarToday as DateIcon,
  Flag as FlagIcon,
  Label as LabelIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
} from '@mui/icons-material';
import { format, isToday, startOfDay } from 'date-fns';
import { Task, Tag } from '../../types';
import InlineTaskEditorDatePopover from '../task-management/inline-task-editor/InlineTaskEditorDatePopover';
import { useTaskMetadata } from '../../contexts/TaskMetadataContext';

const PRIORITY_OPTIONS: { value: 'high' | 'medium' | 'low' | ''; label: string; color: string }[] = [
  { value: 'high', label: 'P1', color: '#e53935' },
  { value: 'medium', label: 'P2', color: '#fb8c00' },
  { value: 'low', label: 'P3', color: '#1e88e5' },
  { value: '', label: 'P4', color: '#ffffff' },
];

interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onToggleComplete: (taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  open,
  onClose,
  task,
  onUpdate,
  onToggleComplete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { tags, categories } = useTaskMetadata();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState<Date | null>(task.dueDate ? new Date(task.dueDate) : null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>(task.priority || '');
  const [isSaving, setIsSaving] = useState(false);
  const [tagMenuAnchor, setTagMenuAnchor] = useState<null | HTMLElement>(null);
  const [priorityMenuAnchor, setPriorityMenuAnchor] = useState<null | HTMLElement>(null);
  const [datePopoverAnchor, setDatePopoverAnchor] = useState<null | HTMLElement>(null);

  const category = useMemo(() => {
    const id = task.categoryId ?? task.category;
    return id ? categories.find((c) => c.id === id) : undefined;
  }, [task.categoryId, task.category, categories]);

  const taskTags = useMemo(() => {
    return (task.tags ?? [])
      .map((id) => tags.find((t) => t.id === id))
      .filter(Boolean) as Tag[];
  }, [task.tags, tags]);

  const availableTags = useMemo(
    () => tags.filter((t) => !(task.tags ?? []).includes(t.id)),
    [tags, task.tags]
  );

  const handleAddTag = useCallback(
    (tagId: string) => {
      const currentTags = task.tags ?? [];
      if (currentTags.includes(tagId)) return;
      onUpdate(task.id, { tags: [...currentTags, tagId], updatedAt: new Date() });
      setTagMenuAnchor(null);
    },
    [task.id, task.tags, onUpdate]
  );

  const handleRemoveTag = useCallback(
    (tagId: string) => {
      const currentTags = (task.tags ?? []).filter((id) => id !== tagId);
      onUpdate(task.id, { tags: currentTags, updatedAt: new Date() });
    },
    [task.id, task.tags, onUpdate]
  );

  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setPriority(task.priority || '');
    }
  }, [open, task]);

  const currentPriorityOption = useMemo(
    () => PRIORITY_OPTIONS.find((p) => p.value === priority) ?? PRIORITY_OPTIONS[3],
    [priority]
  );

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

  const handlePrioritySelect = useCallback(
    (value: 'low' | 'medium' | 'high' | '') => {
      setPriority(value);
      onUpdate(task.id, {
        priority: value ? (value as 'low' | 'medium' | 'high') : undefined,
        updatedAt: new Date(),
      });
      setPriorityMenuAnchor(null);
    },
    [task.id, onUpdate]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : '90vw',
          maxWidth: isMobile ? '100%' : 720,
          minHeight: isMobile ? '100%' : 400,
          maxHeight: isMobile ? '100%' : '85vh',
          borderRadius: isMobile ? 0 : 2,
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

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: isMobile ? 'auto' : 'hidden' }}>
          {/* Left pane: content */}
          <Box
            sx={{
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              ...(!isMobile && { borderRight: 1, borderColor: 'divider' }),
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

          </Box>

          {/* Right pane: metadata */}
          <Box
            sx={{
              flex: isMobile ? 'none' : 1,
              ...(isMobile ? {} : { minWidth: 200, maxWidth: 260 }),
              ...(isMobile && { borderTop: 1, borderColor: 'divider' }),
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

            {/* Priority */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <FlagIcon sx={{ fontSize: '1.125rem', color: 'text.secondary', flexShrink: 0 }} />
              <Box
                component="button"
                onClick={(e: React.MouseEvent<HTMLElement>) => setPriorityMenuAnchor(e.currentTarget)}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  py: 0.75,
                  px: 1,
                  border: `1px solid transparent`,
                  borderRadius: 1,
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: 'text.primary',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'background-color 0.15s, border-color 0.15s',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.text.primary, 0.04),
                    borderColor: 'divider',
                  },
                }}
              >
                <FlagIcon
                  sx={{
                    fontSize: '1rem',
                    color:
                      currentPriorityOption.color === '#ffffff'
                        ? theme.palette.divider
                        : currentPriorityOption.color,
                  }}
                />
                <Typography variant="body2" sx={{ flex: 1 }}>{currentPriorityOption.label}</Typography>
              </Box>
              <Menu
                anchorEl={priorityMenuAnchor}
                open={Boolean(priorityMenuAnchor)}
                onClose={() => setPriorityMenuAnchor(null)}
                PaperProps={{ sx: { minWidth: 140 } }}
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <MenuItem
                    key={opt.value || 'p4'}
                    onClick={() => handlePrioritySelect(opt.value)}
                    selected={priority === opt.value}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FlagIcon
                        sx={{
                          fontSize: '1.125rem',
                          color:
                            opt.color === '#ffffff'
                              ? theme.palette.divider
                              : opt.color,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText>{opt.label}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <DateIcon sx={{ fontSize: '1.125rem', color: 'text.secondary', flexShrink: 0 }} />
              <Box
                component="button"
                onClick={(e: React.MouseEvent<HTMLElement>) => setDatePopoverAnchor(e.currentTarget)}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  py: 0.75,
                  px: 1,
                  border: '1px solid transparent',
                  borderRadius: 1,
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: 'text.primary',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'background-color 0.15s, border-color 0.15s',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.text.primary, 0.04),
                    borderColor: 'divider',
                  },
                }}
              >
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {dueDate
                    ? isToday(dueDate)
                      ? 'Today'
                      : format(dueDate, 'MMM d')
                    : 'No date'}
                </Typography>
              </Box>
              <InlineTaskEditorDatePopover
                anchorEl={datePopoverAnchor}
                value={dueDate}
                onClose={() => setDatePopoverAnchor(null)}
                onChange={(newDate) => {
                  setDueDate(newDate ? startOfDay(newDate) : null);
                  onUpdate(task.id, {
                    dueDate: newDate ? startOfDay(newDate) : undefined,
                    updatedAt: new Date(),
                  });
                }}
              />
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
                    onDelete={() => handleRemoveTag(t.id)}
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
                  onClick={(e) => setTagMenuAnchor(e.currentTarget)}
                  sx={{ fontSize: '0.75rem', height: 24, cursor: 'pointer' }}
                />
                <Menu
                  anchorEl={tagMenuAnchor}
                  open={Boolean(tagMenuAnchor)}
                  onClose={() => setTagMenuAnchor(null)}
                  PaperProps={{
                    sx: { minWidth: 180, maxHeight: 280 },
                  }}
                >
                  {availableTags.length === 0 ? (
                    <MenuItem disabled>
                      <ListItemText>{tags.length === 0 ? 'No tags yet' : 'All tags added'}</ListItemText>
                    </MenuItem>
                  ) : (
                    availableTags.map((t) => (
                      <MenuItem key={t.id} onClick={() => handleAddTag(t.id)}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: t.color || theme.palette.divider,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText>{t.name}</ListItemText>
                      </MenuItem>
                    ))
                  )}
                </Menu>
              </Box>
            </Box>

          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
