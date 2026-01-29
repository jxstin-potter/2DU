import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  Typography,
  useTheme,
  alpha,
  InputAdornment,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useNavigate } from 'react-router-dom';
import { useSearchModal } from '../../contexts/SearchModalContext';
import type { RecentView } from '../../contexts/SearchModalContext';
import { useI18n } from '../../contexts/I18nContext';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const iconMap = {
  today: CalendarTodayRoundedIcon,
  completed: CheckCircleRoundedIcon,
  settings: SettingsRoundedIcon,
};

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { recentViews, closeModal } = useSearchModal();
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filteredRecent = useMemo(() => {
    if (!query.trim()) return recentViews;
    const q = query.toLowerCase().trim();
    return recentViews.filter((v) => t(v.labelKey).toLowerCase().includes(q));
  }, [recentViews, query, t]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlightedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  const handleClose = () => {
    setQuery('');
    onClose();
    closeModal();
  };

  const handleSelect = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filteredRecent.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter' && filteredRecent.length > 0) {
      e.preventDefault();
      handleSelect(filteredRecent[highlightedIndex].path);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: '560px',
          maxWidth: 'calc(100vw - 32px)',
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          m: 0,
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 20px 60px -12px rgba(0, 0, 0, 0.5), 0 8px 24px -4px rgba(0, 0, 0, 0.4)'
              : '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 8px 24px -4px rgba(0, 0, 0, 0.1)',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.25)',
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          '&.MuiDialogContent-root': { padding: 0 },
        }}
      >
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            size="small"
            placeholder="Search or type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 1 }}>
                  <SearchRoundedIcon sx={{ color: theme.palette.text.secondary, fontSize: '1.25rem' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 0.75,
                      bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.06),
                      color: theme.palette.text.secondary,
                      fontFamily: 'monospace',
                      fontSize: '0.7rem',
                    }}
                  >
                    Ctrl K
                  </Typography>
                </InputAdornment>
              ),
              sx: {
                backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.03),
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.12) : alpha(theme.palette.common.black, 0.12),
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.2) : alpha(theme.palette.common.black, 0.2),
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: '1px',
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.text.primary,
                  py: 1.25,
                },
              },
            }}
          />
        </Box>

        {filteredRecent.length > 0 && (
          <Box sx={{ pb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                px: 2,
                py: 0.75,
                color: theme.palette.text.secondary,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Recently viewed
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {filteredRecent.map((item, index) => (
                <RecentViewItem
                  key={item.path}
                  item={item}
                  label={t(item.labelKey)}
                  isHighlighted={index === highlightedIndex}
                  theme={theme}
                  onSelect={() => handleSelect(item.path)}
                  onHover={() => setHighlightedIndex(index)}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

function RecentViewItem({
  item,
  label,
  isHighlighted,
  theme,
  onSelect,
  onHover,
}: {
  item: RecentView;
  label: string;
  isHighlighted: boolean;
  theme: ReturnType<typeof useTheme>;
  onSelect: () => void;
  onHover: () => void;
}) {
  const Icon = iconMap[item.icon];
  return (
    <Box
      component="li"
      onMouseEnter={onHover}
      onClick={onSelect}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.25,
        cursor: 'pointer',
        borderRadius: '8px',
        mx: 1,
        backgroundColor: isHighlighted ? (theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.common.black, 0.06)) : 'transparent',
        color: theme.palette.text.primary,
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.common.black, 0.06),
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.06),
          color: theme.palette.text.secondary,
        }}
      >
        <Icon sx={{ fontSize: '1.25rem' }} />
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
        {label}
      </Typography>
    </Box>
  );
}

export default SearchModal;
