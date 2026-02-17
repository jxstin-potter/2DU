import React from 'react';
import { Box, Button, Chip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Today as TodayIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { isToday, startOfDay } from 'date-fns';
import { TaskPriority, getPriorityChipStyles, getPriorityColor, priorityLabels } from './inlineTaskEditorPriority';

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

  const handleCyclePriority = () => {
    if (!priority) {
      onPriorityChange('medium');
    } else if (priority === 'medium') {
      onPriorityChange('high');
    } else if (priority === 'high') {
      onPriorityChange('low');
    } else {
      onPriorityChange('medium');
    }
  };

  const handleRemovePriority = () => onPriorityChange('');

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

      {/* Priority button */}
      <Button
        type="button"
        size="small"
        startIcon={<FlagIcon sx={{ fontSize: '0.875rem' }} />}
        onClick={handleCyclePriority}
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
          backgroundColor: 'transparent',
          '& .MuiButton-startIcon': {
            color: priority ? getPriorityColor(priority) : theme.palette.text.secondary,
          },
          '&:hover': {
            backgroundColor: alpha(theme.palette.action.hover, 0.5),
            borderColor: alpha(theme.palette.divider, 0.8),
          },
        }}
      >
        Priority
      </Button>

      {/* Selected priority chip */}
      {priority && (
        <Chip
          icon={
            <FlagIcon
              sx={{ fontSize: '0.875rem !important', color: `${getPriorityColor(priority)} !important` }}
            />
          }
          label={priorityLabels[priority]}
          size="small"
          onDelete={handleRemovePriority}
          sx={{
            height: '28px',
            fontSize: '0.8125rem',
            fontWeight: 500,
            ...getPriorityChipStyles(theme, priority),
          }}
        />
      )}
    </Box>
  );
};

export default InlineTaskEditorQuickActions;

