import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Inbox as InboxIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Task, Category } from '../../types';
import { startOfDay } from 'date-fns';
import InlineTaskEditorQuickActions from './inline-task-editor/InlineTaskEditorQuickActions';
import InlineTaskEditorFooter from './inline-task-editor/InlineTaskEditorFooter';
import InlineTaskEditorCategoryMenu from './inline-task-editor/InlineTaskEditorCategoryMenu';
import InlineTaskEditorMoreMenu from './inline-task-editor/InlineTaskEditorMoreMenu';
import { TaskPriority } from './inline-task-editor/inlineTaskEditorPriority';
import { useTaskMetadata } from '../../contexts/TaskMetadataContext';
import { logger } from '../../utils/logger';

const inlineEditorLogger = logger.component('InlineTaskEditor');

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
  categories: categoriesProp,
  defaultCategoryId,
}) => {
  const theme = useTheme();
  const { categories: metadataCategories } = useTaskMetadata();
  const categories = categoriesProp ?? metadataCategories;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<TaskPriority | ''>('');
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
      setDueDate(startOfDay(new Date()));
      setShowQuickActions(true);
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

  // Warn on reload/close when form has unsaved changes
  const isDirty = useMemo(() => {
    if (initialTask) {
      const descMatch = (initialTask.description || '') === description;
      const dateMatch = (initialTask.dueDate == null && dueDate == null) ||
        (initialTask.dueDate != null && dueDate != null && new Date(initialTask.dueDate).getTime() === dueDate.getTime());
      return title !== initialTask.title || !descMatch || !dateMatch ||
        (initialTask.priority || '') !== priority ||
        (initialTask.categoryId || defaultCategoryId) !== selectedCategoryId;
    }
    return title.trim() !== '' || description.trim() !== '' || priority !== '' ||
      selectedCategoryId !== defaultCategoryId;
  }, [initialTask, title, description, dueDate, priority, selectedCategoryId, defaultCategoryId]);

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
      // Create-mode: reset for quick entry.
      // Edit-mode: parent will close the editor; avoid clearing fields (prevents flicker).
      if (!initialTask) {
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
      }
    } catch (error) {
      inlineEditorLogger.error('Failed to submit task', { error });
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, dueDate, priority, selectedCategoryId, onSubmit, initialTask, isSubmitting, defaultCategoryId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        // Submit the form from either field
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
      }
    },
    [handleSubmit, onCancel]
  );

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      sx={{ mb: 2 }}
    >
      <Box
        ref={containerRef}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit();
        }}
        sx={{
          display: 'block',
          bgcolor: 'transparent',
          borderRadius: 0,
          border: 'none',
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 1.5, gap: 1.5 }}>
        {/* Checkbox placeholder (create-mode only; no checkbox UI while editing an existing task) */}
        {!initialTask && (
          <Box sx={{ 
            width: 20, 
            height: 20, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mt: 0.5,
          }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                border: `2px solid ${alpha(theme.palette.text.secondary, 0.4)}`,
                borderRadius: '50%',
                transition: 'all 0.2s ease',
              }}
            />
          </Box>
        )}

        {/* Editor area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Task name input */}
          <Box
            ref={titleRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleTitleInput}
            onKeyDown={handleKeyDown}
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
            onKeyDown={handleKeyDown}
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

          <InlineTaskEditorQuickActions
            initialTask={Boolean(initialTask)}
            show={showQuickActions}
            dueDate={dueDate}
            priority={priority}
            onDueDateChange={(d) => setDueDate(d)}
            onPriorityChange={(p) => setPriority(p)}
            onMoreMenuOpen={(el) => setMoreMenuAnchor(el)}
          />

          {/* Project/Category selector */}
          <InlineTaskEditorCategoryMenu
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            selectedCategoryName={selectedCategory?.name}
            anchorEl={categoryMenuAnchor}
            onOpen={(el) => setCategoryMenuAnchor(el)}
            onClose={() => setCategoryMenuAnchor(null)}
            onSelect={(id) => setSelectedCategoryId(id)}
          />

          <InlineTaskEditorFooter
            show={Boolean(initialTask)}
            isSubmitting={isSubmitting}
            isSaveDisabled={title.trim() === ''}
            onCancel={onCancel}
          />
        </Box>
      </Box>

      <InlineTaskEditorMoreMenu
        anchorEl={moreMenuAnchor}
        onClose={() => setMoreMenuAnchor(null)}
      />
      </Box>
    </Box>
  );
};

export default InlineTaskEditor;
