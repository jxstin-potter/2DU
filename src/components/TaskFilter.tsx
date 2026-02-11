import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import TagList from './TagList';

export type TaskStatusFilter = 'all' | 'active' | 'completed';

export interface TaskFilterProps {
  onFilterChange: (filters: { status: TaskStatusFilter; tags: string[] }) => void;
  availableTags: string[];
  initialStatus?: TaskStatusFilter;
  initialTags?: string[];
}

/**
 * Lightweight filter bar for tasks:
 * - status dropdown (all / active / completed)
 * - tag multi-select (delegated to TagList)
 *
 * Purely presentational: emits filter changes upwards and keeps local UI state.
 */
const TaskFilter: React.FC<TaskFilterProps> = ({
  onFilterChange,
  availableTags,
  initialStatus = 'all',
  initialTags = [],
}) => {
  const [status, setStatus] = useState<TaskStatusFilter>(initialStatus);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  // Keep local state in sync if initial values change on remount
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    setSelectedTags(initialTags);
  }, [initialTags]);

  const handleStatusChange = (event: SelectChangeEvent<TaskStatusFilter>) => {
    const nextStatus = event.target.value as TaskStatusFilter;
    setStatus(nextStatus);
    onFilterChange({ status: nextStatus, tags: selectedTags });
  };

  const handleStatusKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    // Basic keyboard support for Cypress test: ArrowDown cycles, Enter commits change.
    const options: TaskStatusFilter[] = ['all', 'active', 'completed'];
    const currentIndex = options.indexOf(status);

    if (event.key === 'ArrowDown') {
      const nextStatus = options[(currentIndex + 1) % options.length];
      setStatus(nextStatus);
      event.preventDefault();
    } else if (event.key === 'Enter') {
      onFilterChange({ status, tags: selectedTags });
      event.preventDefault();
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) => {
      const exists = prev.includes(tag);
      const next = exists ? prev.filter((t) => t !== tag) : [...prev, tag];
      onFilterChange({ status, tags: next });
      return next;
    });
  };

  const handleTagCreate = (tag: string) => {
    // For now, surface new tag upstream only via selection; actual persistence
    // is handled in higher-level views (e.g. Tags page).
    if (!availableTags.includes(tag)) {
      setSelectedTags((prev) => {
        const next = [...prev, tag];
        onFilterChange({ status, tags: next });
        return next;
      });
    }
  };

  const handleTagDelete = (tag: string) => {
    setSelectedTags((prev) => {
      const next = prev.filter((t) => t !== tag);
      onFilterChange({ status, tags: next });
      return next;
    });
  };

  const handleClearFilters = () => {
    setStatus('all');
    setSelectedTags([]);
    onFilterChange({ status: 'all', tags: [] });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (status !== 'all') count += 1;
    count += selectedTags.length;
    return count;
  }, [status, selectedTags]);

  return (
    <Box
      data-testid="filter-section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        mb: 2,
      }}
    >
      {/* Top row: status dropdown + clear button + active count */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="task-status-filter-label">Status</InputLabel>
          <Select<TaskStatusFilter>
            labelId="task-status-filter-label"
            id="task-status-filter"
            data-testid="status-filter"
            value={status}
            label="Status"
            onChange={handleStatusChange}
            onKeyDown={handleStatusKeyDown}
          >
            <MenuItem
              value="all"
              data-testid="status-option-all"
            >
              All
            </MenuItem>
            <MenuItem
              value="active"
              data-testid="status-option-active"
            >
              Active
            </MenuItem>
            <MenuItem
              value="completed"
              data-testid="status-option-completed"
            >
              Completed
            </MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="text"
          size="small"
          onClick={handleClearFilters}
          data-testid="clear-filters"
        >
          Clear filters
        </Button>

        <Typography
          variant="body2"
          data-testid="filter-count"
          sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}
        >
          {activeFilterCount} active filter{activeFilterCount === 1 ? '' : 's'}
        </Typography>
      </Box>

      {/* Tag filter section */}
      <Box
        data-testid="tag-filter"
        sx={{
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          p: 1.5,
        }}
      >
        <TagList
          tags={availableTags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onTagCreate={handleTagCreate}
          onTagDelete={handleTagDelete}
        />
      </Box>
    </Box>
  );
};

export default TaskFilter;

