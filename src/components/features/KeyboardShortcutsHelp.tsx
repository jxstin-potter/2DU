import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  useTheme,
  Divider,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import { useI18n } from '../../contexts/I18nContext';

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useI18n();

  const shortcuts = [
    {
      title: 'General',
      items: [
        { key: 'Enter', description: 'Open task view' },
        { key: 'X', description: 'Select task' },
        { key: 'Ctrl A', description: 'Select all tasks' },
        { key: '↑ or K', description: 'Move focus up' },
        { key: '↓ or J', description: 'Move focus down' },
        { key: '←', description: 'Move focus to the left' },
        { key: '→', description: 'Move focus to the right' },
        { key: 'Esc', description: 'Dismiss/cancel' },
        { key: 'Z or Ctrl Z', description: 'Undo' },
        { key: 'Ctrl K', description: 'Open Quick Find' },
        { key: '?', description: 'Show keyboard shortcuts' },
        { key: 'M', description: 'Open/close sidebar' },
      ],
    },
    {
      title: 'Quick Add',
      items: [
        { key: 'Q', description: 'Add task' },
        { key: '⇧ Q', description: 'Dictate tasks with Ramble' },
        { key: '#', description: 'Pick project' },
        { key: '/', description: 'Pick section' },
        { key: '+', description: 'Add assignee' },
        { key: '@', description: 'Add label' },
        { key: 'P1, P2, P3, P4', description: 'Set priority' },
        { key: '!', description: 'Add reminder' },
      ],
    },
    {
      title: 'Navigate',
      items: [
        { key: 'G then H or H', description: 'Go to home' },
        { key: 'G then i', description: 'Go to Inbox' },
        { key: 'G then T', description: 'Go to Today' },
      ],
    },
  ];

  const renderKey = (keyString: string) => {
    const parts = keyString.split(' ');
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {parts.map((part, index) => {
          if (part === '↑') {
            return <ArrowUpIcon key={index} sx={{ fontSize: '1rem' }} />;
          }
          if (part === '↓') {
            return <ArrowDownIcon key={index} sx={{ fontSize: '1rem' }} />;
          }
          if (part === '←') {
            return <ArrowLeftIcon key={index} sx={{ fontSize: '1rem' }} />;
          }
          if (part === '→') {
            return <ArrowRightIcon key={index} sx={{ fontSize: '1rem' }} />;
          }
          if (part === '⇧') {
            return (
              <Typography
                key={index}
                component="span"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  fontFamily: 'monospace',
                }}
              >
                ⇧
              </Typography>
            );
          }
          if (part === 'then' || part === 'or') {
            return (
              <Typography
                key={index}
                component="span"
                variant="body2"
                sx={{ mx: 0.5, color: 'text.secondary' }}
              >
                {part}
              </Typography>
            );
          }
          return (
            <Box
              key={index}
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '24px',
                height: '24px',
                px: 1,
                py: 0.5,
                borderRadius: '4px',
                bgcolor: alpha(theme.palette.text.primary, 0.08),
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              {part}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component="h2" fontWeight="bold">
            Keyboard Shortcuts
          </Typography>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.text.secondary, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              ?
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
          pb: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: alpha(theme.palette.text.secondary, 0.2),
            borderRadius: '4px',
            '&:hover': {
              bgcolor: alpha(theme.palette.text.secondary, 0.3),
            },
          },
        }}
      >
        {shortcuts.map((section, sectionIndex) => (
          <Box key={section.title} sx={{ mb: sectionIndex < shortcuts.length - 1 ? 3 : 0 }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{
                mb: 2,
                color: theme.palette.text.primary,
                fontSize: '0.875rem',
              }}
            >
              {section.title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={item.key}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1.5,
                      px: 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.875rem',
                        color: theme.palette.text.primary,
                      }}
                    >
                      {item.description}
                    </Typography>
                    {renderKey(item.key)}
                  </Box>
                  {itemIndex < section.items.length - 1 && (
                    <Divider sx={{ my: 0 }} />
                  )}
                </React.Fragment>
              ))}
            </Box>
            {sectionIndex < shortcuts.length - 1 && (
              <Divider sx={{ mt: 2, mb: 0 }} />
            )}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp; 