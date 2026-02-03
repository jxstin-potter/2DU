import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, InputLabel, FormHelperText } from '@mui/material';
import { useTheme, alpha } from '@mui/material';

interface HighlightedTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  onTimeParsed?: (time: Date | null, matchInfo: { start: number; end: number; text: string } | null) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  inputRef?: React.RefObject<HTMLDivElement>;
  sx?: any;
}

const HighlightedTimeInput: React.FC<HighlightedTimeInputProps> = ({
  value,
  onChange,
  onTimeParsed,
  label,
  error,
  helperText,
  required,
  disabled,
  inputRef: externalRef,
  sx,
}) => {
  const theme = useTheme();
  const internalRef = useRef<HTMLDivElement>(null);
  const inputRef = externalRef || internalRef;
  const [isFocused, setIsFocused] = useState(false);
  const isUpdatingRef = useRef(false);
  const didInitContentRef = useRef(false);

  // Import parseTimeFromText dynamically to avoid circular dependencies
  const parseTime = useCallback(async (text: string) => {
    const { parseTimeFromText } = await import('../../utils/taskHelpers');
    return parseTimeFromText(text);
  }, []);

  // Initialize content on mount
  useEffect(() => {
    if (didInitContentRef.current) return;
    didInitContentRef.current = true;
    if (inputRef.current && !inputRef.current.textContent && value) {
      inputRef.current.textContent = value;
    }
  }, [inputRef, value]); // intentionally mount-only semantics via ref

  // Parse time and update content when value changes
  useEffect(() => {
    // Always parse time, even if we skip DOM updates
    const parseAndNotify = async () => {
      const { time, matchInfo: parsedMatchInfo } = await parseTime(value);

      onTimeParsed?.(time, parsedMatchInfo || null);
    };
    
    parseAndNotify();

    // Update DOM only if needed and not currently updating
    if (!inputRef.current || isUpdatingRef.current) {
      return;
    }

    const updateContent = async () => {
      const { matchInfo: parsedMatchInfo } = await parseTime(value);
      
      if (!inputRef.current) return;
      
      // Skip DOM update if contentEditable already has the correct content and no match
      const currentText = inputRef.current.textContent || '';
      if (currentText === value && !parsedMatchInfo) {
        return;
      }
      
      // Save cursor position before updating
      const selection = window.getSelection();
      let savedRange: Range | null = null;
      if (selection?.rangeCount) {
        savedRange = selection.getRangeAt(0).cloneRange();
        // Calculate offset relative to the contentEditable element
        const preCaretRange = savedRange.cloneRange();
        preCaretRange.selectNodeContents(inputRef.current);
        preCaretRange.setEnd(savedRange.startContainer, savedRange.startOffset);
        const caretOffset = preCaretRange.toString().length;
        savedRange = { ...savedRange, caretOffset } as any;
      }

      // Create highlighted content
      if (parsedMatchInfo && parsedMatchInfo.start >= 0 && parsedMatchInfo.end <= value.length) {
        const before = value.substring(0, parsedMatchInfo.start);
        const match = value.substring(parsedMatchInfo.start, parsedMatchInfo.end);
        const after = value.substring(parsedMatchInfo.end);

        // Build HTML with highlighted span
        isUpdatingRef.current = true;
        inputRef.current.innerHTML = [
          escapeHtml(before),
          `<span data-testid="natural-language-match" style="background-color: ${alpha(theme.palette.primary.main, 0.2)}; border-radius: 2px; padding: 0 2px;">${escapeHtml(match)}</span>`,
          escapeHtml(after),
        ].join('');

        // Restore cursor position
        if (savedRange && (savedRange as any).caretOffset !== undefined) {
          try {
            const walker = document.createTreeWalker(
              inputRef.current,
              NodeFilter.SHOW_TEXT,
              null
            );
            let currentOffset = 0;
            let targetNode: Node | null = null;
            let targetOffset = 0;
            const targetCaretOffset = (savedRange as any).caretOffset;

            while (walker.nextNode()) {
              const node = walker.currentNode;
              const nodeLength = node.textContent?.length || 0;
              if (currentOffset + nodeLength >= targetCaretOffset) {
                targetNode = node;
                targetOffset = targetCaretOffset - currentOffset;
                break;
              }
              currentOffset += nodeLength;
            }

            if (targetNode) {
              const newRange = document.createRange();
              newRange.setStart(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0));
              newRange.setEnd(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0));
              selection?.removeAllRanges();
              selection?.addRange(newRange);
            }
          } catch (e) {
            // Cursor restoration failed, continue
          }
        }
        isUpdatingRef.current = false;
      } else {
        // No match, just set plain text
        isUpdatingRef.current = true;
        inputRef.current.textContent = value;
        isUpdatingRef.current = false;
      }
    };

    updateContent();
  }, [value, parseTime, onTimeParsed, theme.palette.primary.main, inputRef]);

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    if (isUpdatingRef.current) {
      return;
    }
    const text = e.currentTarget.textContent || '';

    onChange(text);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Prevent Enter from creating a new line - let the form handle submission
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Find the closest form and submit it
      const form = inputRef.current?.closest('form');
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    }
  }, [inputRef]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    const newValue = inputRef.current?.textContent || '';
    onChange(newValue);
  }, [onChange, inputRef]);

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ...sx }}>
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {label && (
          <InputLabel
            shrink={isFocused || !!value}
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: isFocused || value ? 'translate(14px, -9px) scale(0.75)' : 'translate(14px, 14px) scale(1)',
              transformOrigin: 'top left',
              color: error ? theme.palette.error.main : (isFocused ? theme.palette.primary.main : theme.palette.text.secondary),
              pointerEvents: 'none',
              transition: 'all 0.2s cubic-bezier(0.0, 0, 0.2, 1) 0ms',
              zIndex: 1,
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.background.paper
                : theme.palette.background.paper,
              padding: isFocused || value ? '0 4px' : '0',
            }}
          >
            {label}
            {required && ' *'}
          </InputLabel>
        )}
        <Box
          ref={inputRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          suppressContentEditableWarning
          sx={{
            minHeight: '40px',
            padding: label ? (isFocused || value ? '14px 14px 2px 14px' : '20px 14px 2px 14px') : '8.5px 14px',
            border: `1px solid ${error ? theme.palette.error.main : (isFocused ? theme.palette.primary.main : (theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.2) : alpha(theme.palette.common.black, 0.2)))}`,
            borderRadius: '4px',
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.common.white, 0.05)
              : alpha(theme.palette.common.black, 0.02),
            color: theme.palette.text.primary,
            fontSize: '0.875rem',
            fontFamily: theme.typography.fontFamily,
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.6 : 1,
            transition: 'border-color 0.2s ease',
            '&:hover': {
              borderColor: error ? theme.palette.error.main : (theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.3) : alpha(theme.palette.common.black, 0.3)),
            },
            '&:focus': {
              borderColor: theme.palette.primary.main,
              borderWidth: '2px',
              padding: label ? (isFocused || value ? '13px 13px 1px 13px' : '19px 13px 1px 13px') : '7.5px 13px',
            },
            '& span[data-testid="natural-language-match"]': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: '2px',
              padding: '0 2px',
            },
          }}
        />
      </Box>
      {helperText && (
        <FormHelperText error={error} sx={{ mt: 0.5, mx: 1.75 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default HighlightedTimeInput;
