import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  useTheme,
  alpha,
  Popper,
  Paper,
  List,
  ListItemButton,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import { motion } from 'framer-motion';
import { Task, Category } from '../../types';
import type { Tag } from '../../types';
import InlineTaskEditorQuickActions from './inline-task-editor/InlineTaskEditorQuickActions';
import InlineTaskEditorFooter from './inline-task-editor/InlineTaskEditorFooter';
import InlineTaskEditorCategoryMenu from './inline-task-editor/InlineTaskEditorCategoryMenu';
import { TaskPriority } from './inline-task-editor/inlineTaskEditorPriority';
import { useTaskMetadata } from '../../contexts/TaskMetadataContext';
import { logger } from '../../utils/logger';

const inlineEditorLogger = logger.component('InlineTaskEditor');

const TAG_MENTION_DATA_ATTR = 'data-tag-id';

/** Light yellow background for inline tag mentions */
const tagMentionStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 235, 59, 0.35)',
  borderRadius: '4px',
  padding: '0 2px',
};

/** Get the word before the caret (e.g. "@Hi" or "Buy") and a range spanning that word for replacement */
function getWordBeforeCaret(container: HTMLElement): { word: string; range: Range } | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0).cloneRange();
  if (!container.contains(range.commonAncestorContainer)) return null;
  try {
    range.setStart(container, 0);
    range.setEnd(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset);
    const textBefore = range.toString();
    const words = textBefore.split(/\s/);
    const word = words[words.length - 1] ?? '';
    (range as unknown as { moveStart(unit: string, count: number): void }).moveStart('character', Math.max(0, textBefore.length - word.length));
    return { word, range };
  } catch {
    return null;
  }
}

/** Extract plain text from title div (skip tag spans) */
function getPlainTitleFromTitleDiv(container: HTMLElement | null): string {
  if (!container) return '';
  let text = '';
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.getAttribute(TAG_MENTION_DATA_ATTR)) return;
      node.childNodes.forEach(walk);
    }
  };
  container.childNodes.forEach(walk);
  return text.trim();
}

/** Collect tag ids from tag spans in title div (dedupe) */
function getTagIdsFromTitleDiv(container: HTMLElement | null): string[] {
  if (!container) return [];
  const ids: string[] = [];
  const spans = container.querySelectorAll(`[${TAG_MENTION_DATA_ATTR}]`);
  spans.forEach((el) => {
    const id = el.getAttribute(TAG_MENTION_DATA_ATTR);
    if (id && !ids.includes(id)) ids.push(id);
  });
  return ids;
}

/** Create a tag mention span for insertion into contenteditable */
function createTagMentionSpan(tag: Tag): HTMLSpanElement {
  const span = document.createElement('span');
  span.contentEditable = 'false';
  span.setAttribute(TAG_MENTION_DATA_ATTR, tag.id);
  span.textContent = `@${tag.name}`;
  Object.assign(span.style, tagMentionStyle);
  span.setAttribute('data-tag-mention', '1');
  return span;
}

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
  const { categories: metadataCategories, tags } = useTaskMetadata();
  const categories = categoriesProp ?? metadataCategories;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<TaskPriority | ''>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(defaultCategoryId);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(defaultTagIds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState<null | HTMLElement>(null);
  const [atSuggestionOpen, setAtSuggestionOpen] = useState(false);
  const [atMentionQuery, setAtMentionQuery] = useState('');
  const [atSuggestionsHighlightIndex, setAtSuggestionsHighlightIndex] = useState(0);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const atFilterQuery = atMentionQuery.trim().toLowerCase();
  const atFilteredTags = useMemo(() => {
    return tags.filter((t) => {
      if (!atFilterQuery) return true;
      return t.name.toLowerCase().includes(atFilterQuery);
    });
  }, [tags, atFilterQuery]);

  // Initialize form from initialTask if editing
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
      setPriority(initialTask.priority || '');
      setSelectedCategoryId(initialTask.categoryId || defaultCategoryId);
      setSelectedTagIds(initialTask.tags ?? []);
      setShowQuickActions(true);
      if (titleRef.current) {
        const el = titleRef.current;
        el.textContent = '';
        if (initialTask.title) {
          el.appendChild(document.createTextNode(initialTask.title));
        }
        const tagIds = initialTask.tags ?? [];
        tagIds.forEach((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          if (tag) {
            if (el.childNodes.length > 0) el.appendChild(document.createTextNode('\u00A0'));
            el.appendChild(createTagMentionSpan(tag));
          }
        });
      }
      if (descriptionRef.current) {
        descriptionRef.current.textContent = initialTask.description || '';
      }
    } else {
      setDueDate(defaultDueDate);
      setSelectedTagIds(defaultTagIds);
      setShowQuickActions(true);
      if (titleRef.current) {
        const el = titleRef.current;
        el.textContent = '';
        if (defaultTagIds.length > 0) {
          defaultTagIds.forEach((tagId, i) => {
            const t = tags.find((x) => x.id === tagId);
            if (t) {
              if (i > 0) el.appendChild(document.createTextNode('\u00A0'));
              el.appendChild(createTagMentionSpan(t));
            }
          });
          el.appendChild(document.createTextNode('\u00A0'));
        }
      }
      if (descriptionRef.current) {
        descriptionRef.current.textContent = '';
      }
    }
  }, [initialTask, defaultCategoryId, defaultDueDate, defaultTagIds, tags]);

  // Sync selectedTagIds from DOM when tag spans are added/removed in the title div
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const observer = new MutationObserver(() => {
      setSelectedTagIds(getTagIdsFromTitleDiv(el));
    });
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

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

  const insertTagMention = useCallback(
    (tag: Tag) => {
      const el = titleRef.current;
      if (!el) return;
      const result = getWordBeforeCaret(el);
      if (!result || !result.word.startsWith('@')) return;
      const { range } = result;
      const sel = window.getSelection();
      if (!sel) return;
      range.deleteContents();
      const span = createTagMentionSpan(tag);
      range.insertNode(span);
      range.setStartAfter(span);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      setSelectedTagIds((prev) => (prev.includes(tag.id) ? prev : [...prev, tag.id]));
      setAtSuggestionOpen(false);
      setAtMentionQuery('');
      setAtSuggestionsHighlightIndex(0);
      const plain = getPlainTitleFromTitleDiv(el);
      setTitle(plain);
      setShowQuickActions(plain.length > 0 || description.length > 0);
    },
    [description]
  );

  const handleTitleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const text = getPlainTitleFromTitleDiv(el);
      setTitle(text);
      setShowQuickActions(text.length > 0 || description.length > 0);

      const result = getWordBeforeCaret(el);
      if (result?.word.startsWith('@')) {
        setAtMentionQuery(result.word.slice(1));
        setAtSuggestionOpen(true);
        setAtSuggestionsHighlightIndex(0);
      } else {
        setAtSuggestionOpen(false);
      }
    },
    [description]
  );

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

    try {
      setIsSubmitting(true);
      const taskData: Partial<Task> = {
        title: trimmedTitle,
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        priority: priority ? (priority as 'low' | 'medium' | 'high') : undefined,
        categoryId: selectedCategoryId,
        tags: tagIds.length > 0 ? tagIds : undefined,
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
  }, [description, dueDate, priority, selectedCategoryId, onSubmit, initialTask, isSubmitting, defaultCategoryId, defaultTagIds]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (atSuggestionOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setAtSuggestionOpen(false);
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setAtSuggestionsHighlightIndex((i) =>
            i < atFilteredTags.length - 1 ? i + 1 : 0
          );
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setAtSuggestionsHighlightIndex((i) =>
            i > 0 ? i - 1 : atFilteredTags.length - 1
          );
          return;
        }
        if (e.key === 'Enter' && atFilteredTags.length > 0) {
          e.preventDefault();
          insertTagMention(atFilteredTags[atSuggestionsHighlightIndex]);
          return;
        }
      }
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
    [handleSubmit, onCancel, atSuggestionOpen, atFilteredTags, atSuggestionsHighlightIndex, insertTagMention]
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
          <Popper
            open={atSuggestionOpen && (atFilteredTags.length > 0 || atMentionQuery.length > 0)}
            anchorEl={titleRef.current}
            placement="bottom-start"
            style={{ zIndex: theme.zIndex.tooltip }}
          >
            <Paper elevation={2} sx={{ maxHeight: 240, overflow: 'auto', minWidth: 160 }}>
              <List dense disablePadding>
                {atFilteredTags.length === 0 ? (
                  <ListItemButton disabled>
                    {atMentionQuery ? 'No matching labels' : 'No labels'}
                  </ListItemButton>
                ) : (
                  atFilteredTags.map((tag, idx) => (
                    <ListItemButton
                      key={tag.id}
                      selected={idx === atSuggestionsHighlightIndex}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertTagMention(tag);
                      }}
                      sx={{ py: 0.5 }}
                    >
                      <LabelIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      {tag.name}
                    </ListItemButton>
                  ))
                )}
              </List>
            </Paper>
          </Popper>

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
      </Box>
    </Box>
  );
};

export default InlineTaskEditor;
