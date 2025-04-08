import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
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
      title: 'Navigation',
      items: [
        { key: '⌘1', description: 'Go to Today' },
        { key: '⌘2', description: 'Go to Upcoming' },
        { key: '⌘3', description: 'Go to Calendar' },
        { key: '⌘4', description: 'Go to Tags' },
        { key: '⌘5', description: 'Go to Completed' },
        { key: '⌘6', description: 'Go to Settings' },
      ],
    },
    {
      title: 'Task Management',
      items: [
        { key: '⌘N', description: 'Create New Task' },
        { key: '⌥T', description: 'Create New Task (Alt)' },
        { key: '⌘F', description: 'Search Tasks' },
        { key: '⌘[', description: 'Filter Tasks' },
        { key: '⌘]', description: 'Sort Tasks' },
        { key: '⌥F', description: 'Filter Tasks (Alt)' },
        { key: '⌥S', description: 'Sort Tasks (Alt)' },
      ],
    },
    {
      title: 'Interface',
      items: [
        { key: '⌘B', description: 'Toggle Sidebar' },
        { key: '⌘D', description: 'Toggle Dark Mode' },
        { key: '?', description: 'Show Keyboard Shortcuts' },
        { key: 'Esc', description: 'Close Modal/Menu' },
      ],
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="h2" fontWeight="medium">
          Keyboard Shortcuts
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Use these keyboard shortcuts to quickly navigate and manage your tasks
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={4}>
          {shortcuts.map((section) => (
            <Grid item xs={12} md={4} key={section.title}>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={{ mb: 2, color: theme.palette.primary.main }}
                >
                  {section.title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {section.items.map((item) => (
                    <Box
                      key={item.key}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          px: 1,
                          py: 0.5,
                          borderRadius: 0.5,
                        }}
                      >
                        {item.key}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp; 