import React, { useState, useCallback, useMemo } from 'react';
import { 
  Box, 
  TextField, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import { useI18n } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { mode } = useCustomTheme();
  const { t } = useI18n();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout } = useAuth();
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
    // TODO: Implement shortcuts help dialog
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
    borderBottom: `1px solid ${theme.palette.divider}`,
  }), [sidebarWidth, theme]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={useCallback(() => setIsSidebarCollapsed(prev => !prev), [])}
        darkMode={mode === 'dark'}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        onOpenShortcutsHelp={handleOpenShortcutsHelp}
      />
      <Box
        component="main"
        sx={mainContentStyles}
      >
        <AppBar 
          position="fixed" 
          color="default" 
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {t('app.name')}
            </Typography>
            <TextField
              size="small"
              placeholder="Search tasks..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 2, width: 200 }}
            />
          </Toolbar>
        </AppBar>

        <Box sx={{ 
          mt: 8, // Height of AppBar
          p: 3,
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 