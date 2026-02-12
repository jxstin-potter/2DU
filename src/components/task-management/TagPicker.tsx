import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Box,
  Chip,
  Popper,
  Paper,
  List,
  ListItemButton,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import { Tag } from '../../types';

export interface TagPickerProps {
  tags: Tag[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  placeholder?: string;
  size?: 'small' | 'medium';
  disabled?: boolean;
}

/**
 * Renders selected tags as chips and an input. Typing "@" opens a list of tags to add.
 * Selecting a tag adds it to selectedTagIds. Matches Todoist-style label picker.
 */
const TagPicker: React.FC<TagPickerProps> = ({
  tags,
  selectedTagIds,
  onChange,
  placeholder = '',
  size = 'small',
  disabled = false,
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showSuggestions = anchorEl != null;
  const filterQuery = inputValue.startsWith('@') ? inputValue.slice(1).trim().toLowerCase() : '';

  const suggestedTags = useMemo(() => {
    const alreadySelected = new Set(selectedTagIds);
    return tags.filter((t) => {
      if (alreadySelected.has(t.id)) return false;
      if (!filterQuery) return true;
      return t.name.toLowerCase().includes(filterQuery);
    });
  }, [tags, selectedTagIds, filterQuery]);

  useEffect(() => {
    if (inputValue.includes('@')) {
      setAnchorEl(inputRef.current);
    } else {
      setAnchorEl(null);
    }
  }, [inputValue]);

  const handleSelectTag = (tag: Tag) => {
    onChange([...selectedTagIds, tag.id]);
    setInputValue('');
    setAnchorEl(null);
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTagIds.filter((id) => id !== tagId));
  };

  const selectedTags = useMemo(
    () => tags.filter((t) => selectedTagIds.includes(t.id)),
    [tags, selectedTagIds]
  );

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.75 }}>
      {selectedTags.map((t) => (
        <Chip
          key={t.id}
          size={size}
          icon={<LabelIcon sx={{ fontSize: '0.875rem !important' }} />}
          label={t.name}
          onDelete={() => handleRemoveTag(t.id)}
          sx={{
            height: size === 'small' ? 24 : 28,
            fontSize: '0.8125rem',
            bgcolor: alpha(t.color ? t.color : theme.palette.primary.main, 0.2),
            color: t.color ? t.color : theme.palette.primary.main,
            '& .MuiChip-deleteIcon': { fontSize: '0.875rem' },
          }}
        />
      ))}
      <TextField
        inputRef={inputRef}
        size={size}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => {
          if (inputValue === '' || inputValue === '@') setAnchorEl(inputRef.current);
        }}
        onBlur={() => {
          setTimeout(() => setAnchorEl(null), 180);
        }}
        disabled={disabled}
        variant="outlined"
        sx={{
          minWidth: 140,
          '& .MuiInputBase-root': {
            fontSize: '0.8125rem',
          },
        }}
        InputProps={{
          startAdornment: inputValue ? null : (
            <InputAdornment position="start">
              <LabelIcon sx={{ fontSize: '1rem', color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      <Popper
        open={showSuggestions}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: theme.zIndex.modal + 1 }}
      >
        <Paper
          elevation={8}
          sx={{
            minWidth: anchorEl?.offsetWidth ?? 200,
            maxHeight: 280,
            overflow: 'auto',
            mt: 0.5,
          }}
        >
          <List dense disablePadding>
            {suggestedTags.length === 0 ? (
              <ListItemButton disabled>
                <Box component="span" sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                  {filterQuery ? 'No matching labels' : 'No other labels'}
                </Box>
              </ListItemButton>
            ) : (
              suggestedTags.map((t) => (
                <ListItemButton
                  key={t.id}
                  onClick={() => handleSelectTag(t)}
                  sx={{ fontSize: '0.8125rem' }}
                >
                  <LabelIcon
                    sx={{
                      fontSize: '1rem',
                      mr: 1,
                      color: t.color ?? 'text.secondary',
                    }}
                  />
                  {t.name}
                </ListItemButton>
              ))
            )}
          </List>
        </Paper>
      </Popper>
    </Box>
  );
};

export default TagPicker;
