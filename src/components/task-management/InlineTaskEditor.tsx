import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { Task, Category } from '../../types';
import InlineTaskEditorQuickActions from './inline-task-editor/InlineTaskEditorQuickActions';
import InlineTaskEditorFooter from './inline-task-editor/InlineTaskEditorFooter';
import { TaskPriority } from './inline-task-editor/inlineTaskEditorPriority';
import { useTaskMetadata } from '../../contexts/TaskMetadataContext';
import { logger } from '../../utils/logger';
import TaskNameInput from './TaskNameInput';
import {
  getPlainTitleFromTitleDiv,
  getTagIdsFromTitleDiv,
  getPendingTagNamesFromTitleDiv,
  TAG_COLORS,
} from '../../utils/taskTitleMentions';

const inlineEditorLogger = logger.component('InlineTaskEditor');

interface InlineTaskEditorProps {
  onSubmit: (taskData: Partial<Task>) => Promise<void>;
  onCancel: () => void;
  initialTask?: Task | null;
  autoFocus?: boolean;
  categories?: Category[];
  defaultCategoryId?: string;
  /**
   * Default due date to apply for newly created tasks in this editor.
   * If omitted, new tasks start with no due date.
   */
  defaultDueDate?: Date | null;
  /** Tag IDs to pre-select when creating a task (e.g. from a label page). */
  defaultTagIds?: string[];
}

const InlineTaskEditor: React.FC<InlineTaskEditorProps> = ({
  onSubmit,
  onCancel,
  initialTask,
  autoFocus = true,
  categories: categoriesProp,
  defaultCategoryId,
  defaultDueDate = null,
  defaultTagIds = [],
}) => {
  const theme = useTheme();
  const { categories: metadataCategories, tags, addTag } = useTaskMetadata();
  const categories = categoriesProp ?? metadataCategories;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<TaskPriority | ''>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(defaultCategoryId);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(defaultTagIds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSyncedInitialTaskIdRef = useRef<string | null>(null);
  const createModeDefaultsAppliedRef = useRef(false);

  // Initialize form from initialTask if editing. Only overwrite state when the task we're editing actually changes (by id).
  useEffect(() => {
    const initialTaskId = initialTask?.id ?? null;
    const alreadySyncedThisTask = lastSyncedInitialTaskIdRef.current === initialTaskId;
    if (initialTask) {
      createModeDefaultsAppliedRef.current = false;
      if (!alreadySyncedThisTask) {
        lastSyncedInitialTaskIdRef.current = initialTask.id;
        setTitle(initialTask.title);
        setDescription(initialTask.description || '');
        setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
        setPriority(initialTask.priority || '');
        setSelectedCategoryId(initialTask.categoryId || defaultCategoryId);
        setSelectedTagIds(initialTask.tags ?? []);
        setShowQuickActions(true);
        if (descriptionRef.current) {
          descriptionRef.current.textContent = initialTask.description || '';
        }
      }
    } else {
      lastSyncedInitialTaskIdRef.current = null;
      if (!createModeDefaultsAppliedRef.current) {
        createModeDefaultsAppliedRef.current = true;
        setDueDate(defaultDueDate);
        setSelectedTagIds(defaultTagIds);
      }
      setShowQuickActions(true);
      if (descriptionRef.current) {
        descriptionRef.current.textContent = '';
      }
    }
  }, [initialTask, defaultCategoryId, defaultDueDate, defaultTagIds]);


  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!containerRef.current || containerRef.current.contains(target))
        return;
      // Don't close when click is on the Sidebar "Add task" trigger or inside the task modal (avoids closing modal / race with openModal).
      const el = (event.target as HTMLElement);
      if (el.closest?.('[data-add-task-trigger]') || el.closest?.('[role="dialog"]'))
        return;
      if (!isSubmitting && title.trim() === '' && description.trim() === '')
        onCancel();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel, isSubmitting, title, description]);

  // Warn on reload/close when form has unsaved changes
  const isDirty = useMemo(() => {
    if (initialTask) {
      const descMatch = (initialTask.description || '') === description;
      const dateMatch = (initialTask.dueDate == null && dueDate == null) ||
        (initialTask.dueDate != null && dueDate != null && new Date(initialTask.dueDate).getTime() === dueDate.getTime());
      const tagsMatch = (initialTask.tags?.length ?? 0) === selectedTagIds.length &&
        (initialTask.tags ?? []).every((id) => selectedTagIds.includes(id));
      return title !== initialTask.title || !descMatch || !dateMatch ||
        (initialTask.priority || '') !== priority ||
        (initialTask.categoryId || defaultCategoryId) !== selectedCategoryId ||
        !tagsMatch;
    }
    return title.trim() !== '' || description.trim() !== '' || priority !== '' ||
      selectedCategoryId !== defaultCategoryId ||
      (selectedTagIds.length !== (defaultTagIds?.length ?? 0) ||
        defaultTagIds?.some((id) => !selectedTagIds.includes(id)));
  }, [initialTask, title, description, dueDate, priority, selectedCategoryId, defaultCategoryId, selectedTagIds, defaultTagIds]);

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

  const handleDescriptionInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    setDescription(text);
    setShowQuickActions(text.length > 0 || title.length > 0);
  }, [title]);

  const handleSubmit = useCallback(async () => {
    const plainTitle = getPlainTitleFromTitleDiv(titleRef.current);
    const trimmedTitle = plainTitle.trim();
    if (!trimmedTitle || isSubmitting) return;
    const tagIds = getTagIdsFromTitleDiv(titleRef.current);
    const pendingNames = getPendingTagNamesFromTitleDiv(titleRef.current);
    try {
      setIsSubmitting(true);
      const newTagIds: string[] = [];
      for (let i = 0; i < pendingNames.length; i++) {
        const name = pendingNames[i];
        const color = TAG_COLORS[(tags.length + i) % TAG_COLORS.length];
        const newTag = await addTag({ name, color });
        newTagIds.push(newTag.id);
      }
      const allTagIds = [...tagIds, ...newTagIds];

      const taskData: Partial<Task> = {
        title: trimmedTitle,
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        priority: priority ? (priority as 'low' | 'medium' | 'high') : undefined,
        categoryId: selectedCategoryId,
        tags: allTagIds.length > 0 ? allTagIds : undefined,
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
        setSelectedTagIds(defaultTagIds);
        setShowQuickActions(false);
        if (descriptionRef.current) descriptionRef.current.textContent = '';
        requestAnimationFrame(() => titleRef.current?.focus());
      }
    } catch (error) {
      inlineEditorLogger.error('Failed to submit task', { error });
    } finally {
      setIsSubmitting(false);
    }
  }, [description, dueDate, priority, selectedCategoryId, onSubmit, initialTask, isSubmitting, defaultCategoryId, defaultTagIds, tags.length, addTag]);

  const handleDescriptionKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
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
          <TaskNameInput
            key={initialTask?.id ?? 'new'}
            inputRef={titleRef}
            value={title}
            onChange={(plainTitle) => {
              setTitle(plainTitle);
              setShowQuickActions(plainTitle.length > 0 || description.length > 0);
            }}
            onTagIdsChange={setSelectedTagIds}
            onTimeParsed={(time) => {
              // Only set due date when we parsed a time from title. Do not clear when title has no time,
              // so the Today button (or date picker) choice is not overwritten by async time parse.
              if (time && !initialTask) setDueDate(time);
              else if (!time && !initialTask && !title.trim()) setDueDate(null);
            }}
            placeholder="Task name"
            variant="inline"
            autoFocus={autoFocus}
            initialTagIds={initialTask ? (initialTask.tags ?? []) : defaultTagIds}
            onEscape={onCancel}
          />

          {/* Description input */}
          <Box
            ref={descriptionRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleDescriptionInput}
            onKeyDown={handleDescriptionKeyDown}
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
          />

          <InlineTaskEditorFooter
            show={Boolean(initialTask)}
            isSubmitting={isSubmitting}
            isSaveDisabled={title.trim() === ''}
            onCancel={onCancel}
          />
        </Box>
      </Box>
      </Box>
    </Box>
  );
};

export default InlineTaskEditor;
