import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, useTheme, Fab } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from './Sidebar';
import TaskModal from '../modals/TaskModal';
import WebSocketStatus from '../common/WebSocketStatus';
import { Task } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
  userName?: string;
  isTaskModalOpen: boolean;
  onCloseTaskModal: () => void;
  onSaveTask: (taskData: Omit<Task, 'id' | 'order'>) => void;
  editingTask?: Task;
  tags: { name: string; color: string }[];
  onCreateTask: () => void;
  onOpenShortcutsHelp: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isSidebarCollapsed,
  onToggleSidebar,
  darkMode,
  toggleDarkMode,
  onLogout,
  userName,
  isTaskModalOpen,
  onCloseTaskModal,
  onSaveTask,
  editingTask,
  tags,
  onCreateTask,
  onOpenShortcutsHelp
}) => {
  const theme = useTheme();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback to window location if the logout handler fails
      window.location.href = '/auth';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            2DU
          </Typography>
          <WebSocketStatus />
          {userName && (
            <Typography variant="body1" sx={{ mx: 2 }}>
              {userName}
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          marginLeft: isSidebarCollapsed ? '64px' : '280px',
          width: `calc(100% - ${isSidebarCollapsed ? '64px' : '280px'})`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
        
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={onToggleSidebar}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          userName={userName}
          onOpenShortcutsHelp={onOpenShortcutsHelp}
        />

        <Fab
          color="primary"
          aria-label="add task"
          onClick={onCreateTask}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>

        <TaskModal
          open={isTaskModalOpen}
          onClose={onCloseTaskModal}
          onSave={onSaveTask}
          initialTask={editingTask}
          tags={tags}
          categories={[]}
        />
      </Box>
    </Box>
  );
};

export default MainLayout; 