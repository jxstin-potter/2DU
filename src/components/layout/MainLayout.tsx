import React, { useState, useCallback, useMemo } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import KeyboardShortcutsHelp from '../features/KeyboardShortcutsHelp';
import SettingsModal from '../features/SettingsModal';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { mode } = useCustomTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, navigate]);

  const handleOpenShortcutsHelp = useCallback(() => {
    setIsShortcutsModalOpen(true);
  }, []);

  const handleCloseShortcutsHelp = useCallback(() => {
    setIsShortcutsModalOpen(false);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setIsSettingsModalOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsModalOpen(false);
  }, []);

  const toggleDarkMode = useCustomTheme().toggleColorMode;

  // Memoize sidebar width to prevent recalculation on every render
  const sidebarWidth = useMemo(() => isSidebarCollapsed ? 64 : 240, [isSidebarCollapsed]);
  
  // Memoize main content styles to prevent layout thrashing
  const mainContentStyles = useMemo(() => ({
    flexGrow: 1,
    width: { 
      xs: '100%',
      sm: `calc(100% - ${sidebarWidth}px)` 
    },
    ml: { 
      xs: 0,
      sm: `${sidebarWidth}px` 
    },
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }), [sidebarWidth, theme]);

  const appBarStyles = useMemo(() => ({
    width: { 
      xs: '100%',
      sm: `calc(100% - ${sidebarWidth}px)` 
    },
    ml: { 
      xs: 0,
      sm: `${sidebarWidth}px` 
    },
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.background.default,
  }), [sidebarWidth, theme]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={useCallback(() => setIsSidebarCollapsed(prev => !prev), [])}
        darkMode={mode === 'dark'}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        user={user}
        userName={user?.name}
        onOpenShortcutsHelp={handleOpenShortcutsHelp}
        onOpenSettings={handleOpenSettings}
      />
      <KeyboardShortcutsHelp
        open={isShortcutsModalOpen}
        onClose={handleCloseShortcutsHelp}
      />
      <SettingsModal
        open={isSettingsModalOpen}
        onClose={handleCloseSettings}
      />
      <Box
        component="main"
        sx={mainContentStyles}
      >
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={appBarStyles}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <Box sx={{ 
          mt: { xs: 7, sm: 8 },
          py: 3,
          px: { xs: 2, sm: 3 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 