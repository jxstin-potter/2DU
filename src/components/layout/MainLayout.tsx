import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearchModal } from '../../contexts/SearchModalContext';
import KeyboardShortcutsHelp from '../modals/KeyboardShortcutsHelp';
import SettingsModal from '../modals/SettingsModal';
import SearchModal from '../modals/SearchModal';
import { logger } from '../../utils/logger';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { mode } = useCustomTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen: isSearchModalOpen, openModal: openSearchModal, closeModal: closeSearchModal, recordRecentView } = useSearchModal();

  useEffect(() => {
    recordRecentView(location.pathname);
  }, [location.pathname, recordRecentView]);

  // Close mobile drawer on route change
  useEffect(() => {
    if (isMobile) setIsMobileDrawerOpen(false);
  }, [location.pathname, isMobile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearchModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearchModal]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      logger.error('Logout failed', { action: 'logout' }, error);
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

  const handleToggleCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleMobileDrawerToggle = useCallback(() => {
    setIsMobileDrawerOpen((prev) => !prev);
  }, []);

  const handleMobileDrawerClose = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, []);

  const toggleDarkMode = useCustomTheme().toggleColorMode;

  const sidebarWidth = useMemo(() => isSidebarCollapsed ? 64 : 240, [isSidebarCollapsed]);
  
  const mainContentStyles = useMemo(() => ({
    flexGrow: 1,
    width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
    ml: isMobile ? 0 : `${sidebarWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }), [sidebarWidth, isMobile, theme]);

  const appBarStyles = useMemo(() => ({
    width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
    ml: isMobile ? 0 : `${sidebarWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.background.default,
  }), [sidebarWidth, isMobile, theme]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        darkMode={mode === 'dark'}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        user={user}
        userName={user?.name}
        onOpenShortcutsHelp={handleOpenShortcutsHelp}
        onOpenSettings={handleOpenSettings}
        isMobile={isMobile}
        mobileOpen={isMobileDrawerOpen}
        onMobileClose={handleMobileDrawerClose}
      />
      <KeyboardShortcutsHelp
        open={isShortcutsModalOpen}
        onClose={handleCloseShortcutsHelp}
      />
      <SettingsModal
        open={isSettingsModalOpen}
        onClose={handleCloseSettings}
      />
      <SearchModal
        open={isSearchModalOpen}
        onClose={closeSearchModal}
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
                aria-label="Open navigation"
                sx={{ mr: 2 }}
                onClick={handleMobileDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <Box sx={{
          mt: { xs: 7, sm: 8 },
          pt: 0,
          pb: 3,
          pl: 0,
          pr: { xs: 2, sm: 3 },
          display: 'flex',
          justifyContent: 'flex-start',
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