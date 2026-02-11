import React, { useMemo, useState, KeyboardEvent, ChangeEvent } from 'react';
import {
  Box,
  Chip,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

export interface TagListProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagCreate: (tag: string) => void;
  onTagDelete: (tag: string) => void;
}

/**
 * Tag list with selectable tags, inline creation with validation, and delete.
 * Parent owns state; this component only emits events.
 */
const TagList: React.FC<TagListProps> = ({
  tags,
  selectedTags,
  onTagSelect,
  onTagCreate,
  onTagDelete,
}) => {
  const theme = useTheme();
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);

  const normalizedTags = useMemo(
    () => tags.map((t) => t.trim()).filter((t) => t.length > 0),
    [tags]
  );

  const handleNewTagChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
    if (error) {
      setError(null);
    }
  };

  const handleCreateTag = () => {
    const value = newTag.trim();

    if (!value) {
      setError('Tag name cannot be empty');
      return;
    }

    const exists = normalizedTags.some(
      (t) => t.toLowerCase() === value.toLowerCase()
    );
    if (exists) {
      setError('Tag already exists');
      return;
    }

    onTagCreate(value);
    setNewTag('');
    setError(null);
  };

  const handleCreateTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCreateTag();
    }
  };

  const handleTagClick = (tag: string) => {
    onTagSelect(tag);
  };

  const handleDeleteClick = (event: React.MouseEvent, tag: string) => {
    event.stopPropagation();
    onTagDelete(tag);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* Header row: title + quick count */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            fontSize: '0.75rem',
            color: 'text.secondary',
          }}
        >
          Tags
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'text.disabled', fontSize: '0.7rem' }}
        >
          {normalizedTags.length} total
        </Typography>
      </Box>

      {/* Create row */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          placeholder="Create new tag"
          value={newTag}
          onChange={handleNewTagChange}
          onKeyDown={handleCreateTagKeyDown}
          inputProps={{ 'data-testid': 'tag-input' }}
          error={Boolean(error)}
          helperText={error || ' '}
        />
        <IconButton
          aria-label="Add tag"
          onClick={handleCreateTag}
          sx={{
            alignSelf: 'flex-start',
            mt: 0.25,
            borderRadius: 1,
            border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Tag chips */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.75,
          mt: 0.5,
        }}
      >
        {normalizedTags.map((tag) => {
          const selected = selectedTags.includes(tag);

          return (
            <Box
              key={tag}
              data-testid={`tag-${tag}`}
              className={selected ? 'selected' : undefined}
              sx={{ display: 'inline-flex' }}
            >
              <Chip
                label={tag}
                size="small"
                onClick={() => handleTagClick(tag)}
                onDelete={(event) => handleDeleteClick(event as any, tag)}
                deleteIcon={
                  <DeleteOutlineIcon
                    data-testid="delete-tag"
                    sx={{ fontSize: '1rem' }}
                  />
                }
                sx={{
                  fontSize: '0.8125rem',
                  borderRadius: '999px',
                  border: `1px solid ${
                    selected
                      ? theme.palette.primary.main
                      : alpha(theme.palette.divider, 0.8)
                  }`,
                  backgroundColor: selected
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.action.hover, 0.2),
                  color: selected
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  '& .MuiChip-label': {
                    px: 1.5,
                  },
                  '& .MuiChip-deleteIcon': {
                    color: alpha(theme.palette.text.secondary, 0.7),
                    '&:hover': {
                      color: theme.palette.error.main,
                    },
                  },
                  cursor: 'pointer',
                }}
              />
            </Box>
          );
        })}

        {normalizedTags.length === 0 && (
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}
          >
            No tags yet. Create your first tag above.
          </Typography>
        )}
      </Box>

      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: -1, fontSize: '0.75rem' }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default TagList;

