import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

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
          case '?':
            // Show keyboard shortcuts help
            // TODO: Implement help modal
            break;
          case 'Escape':
            // Close any open modals or menus
            // TODO: Implement modal/menu closing
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onCreateTask, onToggleSidebar, onToggleDarkMode, onSearch, onFilter, onSort]);

  return null; // This is a utility component that doesn't render anything
};

export default KeyboardShortcuts; 