import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { subDays } from 'date-fns';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (range: DateRange) => void;
}

const PRESET_RANGES = [
  { label: 'Last 7 days', days: 7, testId: 'preset-last-7-days' },
  { label: 'Last 30 days', days: 30, testId: 'preset-last-30-days' },
] as const;

const validateDateRange = (start: Date, end: Date): { isValid: boolean; error: string } => {
  const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  if (startDateOnly > endDateOnly) {
    return { isValid: false, error: 'End date must be after start date' };
  }
  return { isValid: true, error: '' };
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
}) => {
  const [localStartDate, setLocalStartDate] = useState<Date>(startDate);
  const [localEndDate, setLocalEndDate] = useState<Date>(endDate);
  const [error, setError] = useState<string>('');
  const onDateRangeChangeRef = useRef(onDateRangeChange);

  // Update ref when callback changes
  useEffect(() => {
    onDateRangeChangeRef.current = onDateRangeChange;
  }, [onDateRangeChange]);

  useEffect(() => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
  }, [startDate, endDate]);

  const handleStartDateChange = useCallback((date: Date | null) => {
    if (!date) return;
    
    setLocalStartDate((prevStartDate) => {
      setLocalEndDate((currentEndDate) => {
        const validation = validateDateRange(date, currentEndDate);
        if (!validation.isValid) {
          setError(validation.error);
          return currentEndDate;
        }
        
        setError('');
        onDateRangeChangeRef.current({ startDate: date, endDate: currentEndDate });
        return currentEndDate;
      });
      return date;
    });
  }, []);

  const handleEndDateChange = useCallback((date: Date | null) => {
    if (!date) return;
    
    setLocalEndDate((prevEndDate) => {
      setLocalStartDate((currentStartDate) => {
        const validation = validateDateRange(currentStartDate, date);
        if (!validation.isValid) {
          setError(validation.error);
          return currentStartDate;
        }
        
        setError('');
        onDateRangeChangeRef.current({ startDate: currentStartDate, endDate: date });
        return currentStartDate;
      });
      return date;
    });
  }, []);

  const handlePresetClick = useCallback((days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    
    setLocalStartDate(start);
    setLocalEndDate(end);
    setError('');
    onDateRangeChangeRef.current({ startDate: start, endDate: end });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Preset Ranges
            </Typography>
            <Stack direction="row" spacing={1}>
              {PRESET_RANGES.map((preset) => (
                <Button
                  key={preset.testId}
                  data-testid={preset.testId}
                  variant="outlined"
                  size="small"
                  onClick={() => handlePresetClick(preset.days)}
                >
                  {preset.label}
                </Button>
              ))}
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <DatePicker
              label="Start Date"
              value={localStartDate}
              onChange={handleStartDateChange}
              slotProps={{
                textField: {
                  inputProps: {
                    'data-testid': 'start-date-input',
                  },
                  fullWidth: true,
                },
              }}
            />
            <DatePicker
              label="End Date"
              value={localEndDate}
              onChange={handleEndDateChange}
              slotProps={{
                textField: {
                  inputProps: {
                    'data-testid': 'end-date-input',
                  },
                  fullWidth: true,
                },
              }}
            />
          </Box>

          {error && (
            <Typography 
              color="error" 
              variant="caption"
              role="alert"
              aria-live="polite"
            >
              {error}
            </Typography>
          )}
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
