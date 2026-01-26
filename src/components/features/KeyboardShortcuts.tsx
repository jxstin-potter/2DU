import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  useTheme,
  Divider,
} from '@mui/material';

interface KeyboardShortcutsProps {
  onCreateTask: () => void;
  onToggleSidebar: () => void;
  onToggleDarkMode: () => void;
  onSearch: () => void;
  onFilter: () => void;
  onSort: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onCreateTask,
  onToggleSidebar,
  onToggleDarkMode,
  onSearch,
  onFilter,
  onSort,
}) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const theme = useTheme();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const shortcuts = [
    { key: 'Ctrl + N', description: t('shortcuts.createTask') },
    { key: 'Ctrl + B', description: t('shortcuts.toggleSidebar') },
    { key: 'Ctrl + D', description: t('shortcuts.toggleDarkMode') },
    { key: 'Ctrl + F', description: t('shortcuts.search') },
    { key: 'Ctrl + [', description: t('shortcuts.filter') },
    { key: 'Ctrl + ]', description: t('shortcuts.sort') },
    { key: 'Ctrl + 1', description: t('shortcuts.today') },
    { key: 'Ctrl + 2', description: t('shortcuts.upcoming') },
    { key: 'Ctrl + 3', description: t('shortcuts.calendar') },
    { key: 'Ctrl + 4', description: t('shortcuts.tags') },
    { key: 'Ctrl + 5', description: t('shortcuts.completed') },
    { key: 'Ctrl + 6', description: t('shortcuts.settings') },
  ];

  // Use refs to store latest callbacks to avoid re-attaching event listeners
  const callbacksRef = useRef({
    navigate,
    onCreateTask,
    onToggleSidebar,
    onToggleDarkMode,
    onSearch,
    onFilter,
    onSort,
  });

  // Update refs when callbacks change
  useEffect(() => {
    callbacksRef.current = {
      navigate,
      onCreateTask,
      onToggleSidebar,
      onToggleDarkMode,
      onSearch,
      onFilter,
      onSort,
    };
  }, [navigate, onCreateTask, onToggleSidebar, onToggleDarkMode, onSearch, onFilter, onSort]);

  // Memoize event handler to prevent unnecessary re-attachments
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore shortcuts when typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const { navigate, onCreateTask, onToggleSidebar, onToggleDarkMode, onSearch, onFilter, onSort } = callbacksRef.current;

    // Check for modifier keys
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;
    const isAlt = event.altKey;

    // Navigation shortcuts
    if (isCtrlOrCmd) {
      switch (event.key.toLowerCase()) {
        case '1':
          navigate('/today');
          break;
        case '2':
          navigate('/upcoming');
          break;
        case '3':
          navigate('/calendar');
          break;
        case '4':
          navigate('/tags');
          break;
        case '5':
          navigate('/completed');
          break;
        case '6':
          navigate('/settings');
          break;
        case 'f':
          onSearch();
          break;
        case 'n':
          onCreateTask();
          break;
        case 'b':
          onToggleSidebar();
          break;
        case 'd':
          onToggleDarkMode();
          break;
        case '[':
          onFilter();
          break;
        case ']':
          onSort();
          break;
        case '?':
          setIsHelpOpen(true);
          break;
      }
    }

    // Task management shortcuts
    if (isAlt) {
      switch (event.key.toLowerCase()) {
        case 't':
          onCreateTask();
          break;
        case 'f':
          onFilter();
          break;
        case 's':
          onSort();
          break;
      }
    }

    // Quick navigation without modifiers
    if (!isCtrlOrCmd && !isShift && !isAlt) {
      switch (event.key) {
        case 'Escape':
          // Close any open modals or menus
          // TODO: Implement modal/menu closing
          break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <Dialog
        open={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('shortcuts.title')}</DialogTitle>
        <DialogContent>
          <List>
            {shortcuts.map((shortcut, index) => (
              <React.Fragment key={shortcut.key}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">{shortcut.description}</Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            bgcolor: theme.palette.action.hover,
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontFamily: 'monospace',
                          }}
                        >
                          {shortcut.key}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < shortcuts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsHelpOpen(false)}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KeyboardShortcuts; 