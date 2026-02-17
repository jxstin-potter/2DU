import React, { useMemo } from 'react';
import {
  Box,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from '@mui/material';
import {
  WbSunny as TomorrowIcon,
  CalendarMonth as LaterIcon,
  Weekend as WeekendIcon,
  ArrowForward as NextWeekIcon,
  NotInterested as NoDateIcon,
  Schedule as TimeIcon,
  Loop as RepeatIcon,
} from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, nextSaturday, nextMonday, format, startOfDay } from 'date-fns';

interface InlineTaskEditorDatePopoverProps {
  anchorEl: HTMLElement | null;
  value: Date | null;
  onClose: () => void;
  onChange: (date: Date | null) => void;
}

interface QuickDateOption {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  getDate: () => Date | null;
}

const InlineTaskEditorDatePopover: React.FC<InlineTaskEditorDatePopoverProps> = ({
  anchorEl,
  value,
  onClose,
  onChange,
}) => {
  const theme = useTheme();
  const today = startOfDay(new Date());

  const quickOptions = useMemo<QuickDateOption[]>(() => {
    return [
      {
        id: 'tomorrow',
        label: 'Tomorrow',
        sublabel: format(addDays(today, 1), 'EEE'),
        icon: <TomorrowIcon sx={{ fontSize: '1rem' }} />,
        getDate: () => addDays(today, 1),
      },
      {
        id: 'later',
        label: 'Later this week',
        sublabel: format(addDays(today, 2), 'EEE'),
        icon: <LaterIcon sx={{ fontSize: '1rem' }} />,
        getDate: () => addDays(today, 2),
      },
      {
        id: 'weekend',
        label: 'This weekend',
        sublabel: format(nextSaturday(today), 'EEE'),
        icon: <WeekendIcon sx={{ fontSize: '1rem' }} />,
        getDate: () => nextSaturday(today),
      },
      {
        id: 'nextweek',
        label: 'Next week',
        sublabel: format(nextMonday(today), 'EEE MMM d'),
        icon: <NextWeekIcon sx={{ fontSize: '1rem' }} />,
        getDate: () => nextMonday(today),
      },
      {
        id: 'none',
        label: 'No Date',
        sublabel: '',
        icon: <NoDateIcon sx={{ fontSize: '1rem' }} />,
        getDate: () => null,
      },
    ];
  }, [today]);

  const displayDate = value || today;
  const headerLabel = format(displayDate, 'MMM d');

  const handleQuickSelect = (option: QuickDateOption) => {
    onChange(option.getDate());
    if (option.id === 'none') onClose();
  };

  const handleCalendarChange = (newDate: Date | null) => {
    onChange(newDate ? startOfDay(newDate) : null);
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: {
          mt: 1,
          p: 0,
          minWidth: 320,
          maxWidth: 360,
          borderRadius: 2,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
          bgcolor: alpha(theme.palette.text.primary, 0.06),
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
          {headerLabel}
        </Typography>
      </Box>

      {/* Quick date options */}
      <List dense disablePadding sx={{ py: 0.5 }}>
        {quickOptions.map((opt) => {
          const date = opt.getDate();
          const isSelected =
            opt.id === 'none'
              ? !value
              : Boolean(value && date && startOfDay(date).getTime() === startOfDay(value).getTime());
          return (
            <ListItem
              key={opt.id}
              button
              onClick={() => handleQuickSelect(opt)}
              sx={{
                py: 1,
                px: 2,
                borderRadius: 0,
                bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                '&:hover': {
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.action.hover, 0.04),
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>{opt.icon}</ListItemIcon>
              <ListItemText
                primary={opt.label}
                secondary={opt.sublabel}
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.75rem', color: 'text.secondary' }}
              />
            </ListItem>
          );
        })}
      </List>

      {/* Calendar */}
      <Box sx={{ px: 2, pb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateCalendar
            value={value || today}
            onChange={handleCalendarChange}
            showDaysOutsideCurrentMonth
            sx={{
              '& .MuiDateCalendar-root': { width: '100%' },
              '& .MuiPickersCalendarHeader-root': {
                justifyContent: 'space-between',
                paddingLeft: 0,
                paddingRight: 0,
                '& .MuiIconButton-root': {
                  color: 'text.secondary',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                },
              },
              '& .MuiPickersDay-root': {
                fontSize: '0.875rem',
                '&.Mui-selected': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                },
                '&.MuiPickersDay-today': {
                  border: `2px solid ${theme.palette.primary.main}`,
                  bgcolor: 'transparent',
                  color: 'text.primary',
                },
              },
            }}
          />
        </LocalizationProvider>

        {/* Time and Repeat placeholders */}
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              py: 0.75,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary',
              fontSize: '0.8125rem',
              cursor: 'default',
            }}
          >
            <TimeIcon sx={{ fontSize: '1rem' }} />
            Time
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              py: 0.75,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary',
              fontSize: '0.8125rem',
              cursor: 'default',
            }}
          >
            <RepeatIcon sx={{ fontSize: '1rem' }} />
            Repeat
          </Box>
        </Box>
      </Box>
    </Popover>
  );
};

export default InlineTaskEditorDatePopover;
