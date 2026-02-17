import React, { useState } from 'react';
import { Box, Button, Chip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Today as TodayIcon,
  Flag as FlagIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { isToday, startOfDay } from 'date-fns';
import { TaskPriority, getPriorityChipStyles, getPriorityColor, priorityLabels } from './inlineTaskEditorPriority';

const PRIORITY_OPTIONS: { value: TaskPriority | ''; label: string }[] = [
  { value: '', label: 'None' },
  { value: 'low', label: priorityLabels.low },
  { value: 'medium', label: priorityLabels.medium },
  { value: 'high', label: priorityLabels.high },
];

interface InlineTaskEditorQuickActionsProps {
  initialTask: boolean;
  show: boolean;
  dueDate: Date | null;
  priority: TaskPriority | '';
  onDueDateChange: (date: Date | null) => void;
  onPriorityChange: (priority: TaskPriority | '') => void;
}

const InlineTaskEditorQuickActions: React.FC<InlineTaskEditorQuickActionsProps> = ({
  initialTask: _initialTask,
  show,
  dueDate,
  priority,
  onDueDateChange,
  onPriorityChange,
}) => {
  const theme = useTheme();

  const isTodaySelected = Boolean(dueDate && isToday(dueDate));

  const handleSetToday = () => {
    if (isTodaySelected) {
      onDueDateChange(null);
    } else {
      onDueDateChange(startOfDay(new Date()));
    }
  };

  const [priorityAnchorEl, setPriorityAnchorEl] = useState<null | HTMLElement>(null);

  const handlePriorityOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setPriorityAnchorEl(event.currentTarget);
  };

  const handlePriorityClose = () => setPriorityAnchorEl(null);

  const handlePrioritySelect = (value: TaskPriority | '') => {
    onPriorityChange(value);
    handlePriorityClose();
  };

  if (!show && !dueDate && !priority) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        flexWrap: 'wrap',
        mt: 0.5,
      }}
    >
      {/* Today button/tag */}
      {isTodaySelected ? (
        <Chip
          icon={<TodayIcon sx={{ fontSize: '0.875rem !important', color: '#4caf50 !important' }} />}
          label="Today"
          size="small"
          onDelete={() => onDueDateChange(null)}
          sx={{
            height: '28px',
            fontSize: '0.8125rem',
            backgroundColor: '#4caf50',
            color: 'white',
            fontWeight: 500,
            '& .MuiChip-icon': {
              color: 'white !important',
            },
            '& .MuiChip-deleteIcon': {
              fontSize: '1rem',
              color: 'white',
              '&:hover': {
                color: 'rgba(255,255,255,0.8)',
              },
            },
          }}
        />
      ) : (
        <Button
          type="button"
          size="small"
          startIcon={<TodayIcon sx={{ fontSize: '0.875rem' }} />}
          onClick={handleSetToday}
          sx={{
            textTransform: 'none',
            fontSize: '0.8125rem',
            color: theme.palette.text.secondary,
            minWidth: 'auto',
            px: 1.25,
            py: 0.5,
            height: '28px',
            borderRadius: '6px',
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: alpha(theme.palette.action.hover, 0.5),
              borderColor: alpha(theme.palette.divider, 0.8),
            },
          }}
        >
          Today
        </Button>
      )}

      {/* Priority dropdown */}
      <Button
        type="button"
        size="small"
        startIcon={<FlagIcon sx={{ fontSize: '0.875rem' }} />}
        onClick={handlePriorityOpen}
        sx={{
          textTransform: 'none',
          fontSize: '0.8125rem',
          color: priority ? getPriorityColor(priority) : theme.palette.text.secondary,
          minWidth: 'auto',
          px: 1.25,
          py: 0.5,
          height: '28px',
          borderRadius: '6px',
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          backgroundColor: priority ? alpha(getPriorityColor(priority), 0.12) : 'transparent',
          '& .MuiButton-startIcon': {
            color: priority ? getPriorityColor(priority) : theme.palette.text.secondary,
          },
          '&:hover': {
            backgroundColor: priority ? alpha(getPriorityColor(priority), 0.2) : alpha(theme.palette.action.hover, 0.5),
            borderColor: alpha(theme.palette.divider, 0.8),
          },
        }}
      >
        {priority ? priorityLabels[priority] : 'Priority'}
      </Button>
      <Menu
        anchorEl={priorityAnchorEl}
        open={Boolean(priorityAnchorEl)}
        onClose={handlePriorityClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            minWidth: 140,
            mt: 1,
          },
        }}
      >
        {PRIORITY_OPTIONS.map(({ value, label }) => (
          <MenuItem
            key={value || 'none'}
            onClick={() => handlePrioritySelect(value)}
            selected={priority === value}
          >
            {value ? (
              <>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FlagIcon sx={{ fontSize: '1rem', color: getPriorityColor(value) }} />
                </ListItemIcon>
                <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                {priority === value && (
                  <CheckIcon sx={{ fontSize: '1rem', color: 'primary.main', ml: 1 }} />
                )}
              </>
            ) : (
              <>
                <ListItemIcon sx={{ minWidth: 32 }} />
                <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                {!priority && <CheckIcon sx={{ fontSize: '1rem', color: 'primary.main', ml: 1 }} />}
              </>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default InlineTaskEditorQuickActions;

