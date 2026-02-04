import React from 'react';
import { Box, Popover, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface TaskDueDatePopoverProps {
  anchorEl: HTMLElement | null;
  tempDate: Date | null;
  tempTime: Date | null;
  hasExistingDueDate: boolean;
  onClose: () => void;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (time: Date | null) => void;
  onRemove: () => void;
}

const TaskDueDatePopover: React.FC<TaskDueDatePopoverProps> = ({
  anchorEl,
  tempDate,
  tempTime,
  hasExistingDueDate,
  onClose,
  onDateChange,
  onTimeChange,
  onRemove,
}) => {
  const theme = useTheme();

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          mt: 1,
          p: 2,
          minWidth: 280,
          backgroundColor: theme.palette.background.paper,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0, 0, 0, 0.4)'
              : '0 8px 24px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <DatePicker
            label="Date"
            value={tempDate}
            onChange={onDateChange}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                sx: {
                  '& .MuiOutlinedInput-root': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.05)
                        : alpha(theme.palette.common.black, 0.02),
                  },
                },
              },
            }}
          />
          <TimePicker
            label="Time"
            value={tempTime}
            onChange={onTimeChange}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                sx: {
                  '& .MuiOutlinedInput-root': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.05)
                        : alpha(theme.palette.common.black, 0.02),
                  },
                },
              },
            }}
          />
          {hasExistingDueDate && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
              <Typography
                onClick={onRemove}
                sx={{
                  cursor: 'pointer',
                  color: 'error.main',
                  fontSize: '0.875rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Remove date
              </Typography>
            </Box>
          )}
        </Box>
      </LocalizationProvider>
    </Popover>
  );
};

export default TaskDueDatePopover;

