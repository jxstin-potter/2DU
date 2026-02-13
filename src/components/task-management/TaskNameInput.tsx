import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  InputLabel,
  FormHelperText,
  Popper,
  Paper,
  List,
  ListItemButton,
  useTheme,
  alpha,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import AddIcon from '@mui/icons-material/Add';
import type { Tag } from '../../types';
import {
  getWordBeforeCaret,
  getPlainTitleFromTitleDiv,
  getTagIdsFromTitleDiv,
  getPendingTagNamesFromTitleDiv,
  createTagMentionSpan,
  createPendingTagSpan,
} from '../../utils/taskTitleMentions';
import { useTaskMetadata } from '../../contexts/TaskMetadataContext';

export interface TaskNameInputProps {
  value: string;
  onChange: (plainTitle: string) => void;
  onTagIdsChange?: (tagIds: string[]) => void;
  onPendingNamesChange?: (names: string[]) => void;
  onTimeParsed?: (time: Date | null) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLDivElement>;
  /** Initial tag IDs to render as tag spans (e.g. when editing) */
  initialTagIds?: string[];
  /** Called when Escape is pressed (e.g. to cancel inline editor) */
  onEscape?: () => void;
  /** Use compact styling (no border, no floating label) for inline editors */
  variant?: 'default' | 'inline';
  sx?: Record<string, unknown>;
}

const TaskNameInput: React.FC<TaskNameInputProps> = ({
  value,
  onChange,
  onTagIdsChange,
  onPendingNamesChange,
  onTimeParsed,
  label,
  error,
  helperText,
  required,
  disabled,
  autoFocus,
  placeholder = 'Task name',
  inputRef: externalRef,
  initialTagIds = [],
  onEscape,
  variant = 'default',
  sx,
}) => {
  const theme = useTheme();
  const { tags } = useTaskMetadata();
  const internalRef = useRef<HTMLDivElement>(null);
  const inputRef = externalRef || internalRef;
  const tagsRef = useRef(tags);
  tagsRef.current = tags;
  const [isFocused, setIsFocused] = useState(false);
  const [atSuggestionOpen, setAtSuggestionOpen] = useState(false);
  const [atMentionQuery, setAtMentionQuery] = useState('');
  const [atSuggestionsHighlightIndex, setAtSuggestionsHighlightIndex] = useState(0);

  const atFilterQuery = atMentionQuery.trim().toLowerCase();
  const atFilteredTags = useMemo(() => {
    return tags.filter((t) => {
      if (!atFilterQuery) return true;
      return t.name.toLowerCase().includes(atFilterQuery);
    });
  }, [tags, atFilterQuery]);

  const createTagDisabled = !atMentionQuery.trim();
  const createOptionLabel = atFilteredTags.length === 0 && atMentionQuery
    ? `Tag not found. Create ${atMentionQuery}`
    : atMentionQuery
      ? `Create tag "${atMentionQuery}"`
      : 'Create tag (type to name)';

  const atOptionCount = atFilteredTags.length + 1;
  const isCreateTagSelected = atSuggestionsHighlightIndex === atFilteredTags.length;

  const syncTagState = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    onTagIdsChange?.(getTagIdsFromTitleDiv(el));
    onPendingNamesChange?.(getPendingTagNamesFromTitleDiv(el));
  }, [inputRef, onTagIdsChange, onPendingNamesChange]);

  const insertTagMention = useCallback(
    (tag: Tag) => {
      const el = inputRef.current;
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
      const plain = getPlainTitleFromTitleDiv(el);
      onChange(plain);
      setAtSuggestionOpen(false);
      setAtMentionQuery('');
      setAtSuggestionsHighlightIndex(0);
      syncTagState();
    },
    [onChange, syncTagState]
  );

  const insertPendingTagMention = useCallback(
    (pendingName: string) => {
      if (!pendingName.trim()) return;
      const el = inputRef.current;
      if (!el) return;
      const result = getWordBeforeCaret(el);
      if (!result || !result.word.startsWith('@')) return;
      const { range } = result;
      const sel = window.getSelection();
      if (!sel) return;
      range.deleteContents();
      const span = createPendingTagSpan(pendingName);
      range.insertNode(span);
      range.setStartAfter(span);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      const plain = getPlainTitleFromTitleDiv(el);
      onChange(plain);
      setAtSuggestionOpen(false);
      setAtMentionQuery('');
      setAtSuggestionsHighlightIndex(0);
      syncTagState();
    },
    [onChange, syncTagState]
  );

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const text = getPlainTitleFromTitleDiv(el);
      onChange(text);
      syncTagState();

      const result = getWordBeforeCaret(el);
      if (result?.word.startsWith('@')) {
        setAtMentionQuery(result.word.slice(1));
        setAtSuggestionOpen(true);
        setAtSuggestionsHighlightIndex(0);
      } else {
        setAtSuggestionOpen(false);
      }
    },
    [onChange, syncTagState]
  );

  const lastTimeParsedRef = useRef<Date | null | undefined>(undefined);
  const onTimeParsedRef = useRef(onTimeParsed);
  onTimeParsedRef.current = onTimeParsed;
  useEffect(() => {
    if (!value.trim()) {
      if (lastTimeParsedRef.current !== null) {
        lastTimeParsedRef.current = null;
        onTimeParsedRef.current?.(null);
      }
      return;
    }
    let cancelled = false;
    import('../../utils/taskHelpers').then(({ parseTimeFromText }) => {
      if (cancelled) return;
      const { time } = parseTimeFromText(value);
      const next = time ?? null;
      const last = lastTimeParsedRef.current;
      const same = last === next || (last != null && next != null && last.getTime() === next.getTime());
      if (!same) {
        lastTimeParsedRef.current = next;
        onTimeParsedRef.current?.(next);
      }
    });
    return () => { cancelled = true; };
  }, [value]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const currentPlain = getPlainTitleFromTitleDiv(el);
    const currentIds = getTagIdsFromTitleDiv(el);
    const idsMatch = currentIds.length === initialTagIds.length
      && initialTagIds.every((id) => currentIds.includes(id));
    if (currentPlain === value && idsMatch) return;
    el.textContent = '';
    if (value) el.appendChild(document.createTextNode(value));
    const tags = tagsRef.current;
    initialTagIds.forEach((tagId) => {
      const tag = tags.find((t) => t.id === tagId);
      if (tag) {
        if (el.childNodes.length > 0) el.appendChild(document.createTextNode('\u00A0'));
        el.appendChild(createTagMentionSpan(tag));
      }
    });
    syncTagState();
  }, [value, initialTagIds]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        if (atSuggestionOpen) {
          e.preventDefault();
          setAtSuggestionOpen(false);
          return;
        }
        onEscape?.();
        return;
      }
      if (atSuggestionOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setAtSuggestionsHighlightIndex((i) =>
            i < atOptionCount - 1 ? i + 1 : 0
          );
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setAtSuggestionsHighlightIndex((i) =>
            i > 0 ? i - 1 : atOptionCount - 1
          );
          return;
        }
        if ((e.key === 'Enter' || e.key === 'Tab') && atOptionCount > 0) {
          e.preventDefault();
          if (isCreateTagSelected) {
            if (!createTagDisabled) insertPendingTagMention(atMentionQuery.trim());
          } else {
            insertTagMention(atFilteredTags[atSuggestionsHighlightIndex]);
          }
          return;
        }
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const form = inputRef.current?.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
    },
    [
      atSuggestionOpen,
      atOptionCount,
      isCreateTagSelected,
      createTagDisabled,
      atMentionQuery,
      atFilteredTags,
      atSuggestionsHighlightIndex,
      insertTagMention,
      insertPendingTagMention,
      inputRef,
      onEscape,
    ]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      const selection = window.getSelection();
      if (selection?.rangeCount && inputRef.current) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      const newPlain = inputRef.current ? getPlainTitleFromTitleDiv(inputRef.current) : '';
      onChange(newPlain);
      syncTagState();
    },
    [onChange, syncTagState]
  );

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [autoFocus]);

  const displayValue = value || (inputRef.current ? getPlainTitleFromTitleDiv(inputRef.current) : '') || '';
  const isInline = variant === 'inline';

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', ...sx }}>
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {label && !isInline && (
          <InputLabel
            shrink={isFocused || !!displayValue}
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: isFocused || displayValue ? 'translate(14px, -9px) scale(0.75)' : 'translate(14px, 14px) scale(1)',
              transformOrigin: 'top left',
              color: error ? theme.palette.error.main : (isFocused ? theme.palette.primary.main : theme.palette.text.secondary),
              pointerEvents: 'none',
              transition: 'all 0.2s cubic-bezier(0.0, 0, 0.2, 1) 0ms',
              zIndex: 1,
              backgroundColor: theme.palette.background.paper,
              padding: isFocused || displayValue ? '0 4px' : '0',
            }}
          >
            {label}
            {required && ' *'}
          </InputLabel>
        )}
        <Box
          ref={inputRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          data-placeholder={placeholder}
          sx={{
            minHeight: isInline ? '28px' : '40px',
            maxHeight: isInline ? '200px' : undefined,
            overflowY: isInline ? 'auto' : undefined,
            padding: isInline ? 0 : (label ? (isFocused || displayValue ? '14px 14px 2px 14px' : '20px 14px 2px 14px') : '8.5px 14px'),
            border: isInline ? 'none' : `1px solid ${error ? theme.palette.error.main : (isFocused ? theme.palette.primary.main : (theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.2) : alpha(theme.palette.common.black, 0.2)))}`,
            borderRadius: isInline ? 0 : '4px',
            backgroundColor: isInline ? 'transparent' : (theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.05)
              : alpha(theme.palette.common.black, 0.02)),
            color: theme.palette.text.primary,
            fontSize: isInline ? '0.9375rem' : '0.875rem',
            fontWeight: isInline ? 500 : 400,
            fontFamily: theme.typography.fontFamily,
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.6 : 1,
            transition: isInline ? undefined : 'border-color 0.2s ease',
            wordBreak: 'break-word',
            ...(!isInline && {
              '&:hover': {
                borderColor: error ? theme.palette.error.main : (theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.3) : alpha(theme.palette.common.black, 0.3)),
              },
              '&:focus': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
                padding: label ? (isFocused || displayValue ? '13px 13px 1px 13px' : '19px 13px 1px 13px') : '7.5px 13px',
              },
            }),
            '&:empty:before': {
              content: 'attr(data-placeholder)',
              color: theme.palette.text.secondary,
              opacity: 0.6,
              ...(isInline && { fontWeight: 400 }),
            },
          }}
        />
        <Popper
          open={atSuggestionOpen}
          anchorEl={inputRef.current}
          placement="bottom-start"
          style={{ zIndex: theme.zIndex.tooltip }}
        >
          <Paper elevation={2} sx={{ maxHeight: 240, overflow: 'auto', minWidth: 180 }}>
            <List dense disablePadding>
              {atFilteredTags.map((tag, idx) => (
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
              ))}
              <ListItemButton
                selected={isCreateTagSelected}
                disabled={createTagDisabled}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (!createTagDisabled) insertPendingTagMention(atMentionQuery.trim());
                }}
                sx={{ py: 0.5 }}
              >
                <AddIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                {createOptionLabel}
              </ListItemButton>
            </List>
          </Paper>
        </Popper>
      </Box>
      {helperText && (
        <FormHelperText error={error} sx={{ mt: 0.5, mx: 1.75 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default TaskNameInput;
