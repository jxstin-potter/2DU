import React, { useEffect, useMemo, useCallback } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
  Typography,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Inbox as InboxIcon,
  Event as EventIcon,
  CalendarMonth as CalendarIcon,
  LocalOffer as TagIcon,
  CheckCircle as CompletedIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Keyboard as KeyboardIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
  userName?: string;
  onOpenShortcutsHelp: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  darkMode,
  toggleDarkMode,
  onLogout,
  userName,
  onOpenShortcutsHelp,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  const mainMenuItems = useMemo(() => [
    { text: t('sidebar.today'), icon: <InboxIcon />, path: "/today" },
    { text: t('sidebar.upcoming'), icon: <EventIcon />, path: "/upcoming" },
    { text: t('sidebar.calendar'), icon: <CalendarIcon />, path: "/calendar" },
    { text: t('sidebar.tags'), icon: <TagIcon />, path: "/tags" },
    { text: t('sidebar.completed'), icon: <CompletedIcon />, path: "/completed" },
  ], [t]);

  const renderMenuItem = useCallback((item: { text: string; icon: React.ReactNode; path: string }, isCollapsed: boolean) => {
    const isActive = location.pathname === item.path;
    return (
      <ListItem
        button
        key={item.path}
        onClick={() => navigate(item.path)}
        sx={{
          minHeight: 48,
          justifyContent: isCollapsed ? 'center' : 'initial',
          px: 2.5,
          borderRadius: 1,
          mb: 0.5,
          backgroundColor: isActive ? 'primary.main' : 'transparent',
          color: isActive ? 'primary.contrastText' : 'inherit',
          '&:hover': {
            backgroundColor: isActive ? 'primary.dark' : 'action.hover',
          },
          '& .MuiListItemIcon-root': {
            color: isActive ? 'primary.contrastText' : 'inherit',
          },
        }}
      >
        {isCollapsed ? (
          <Tooltip title={item.text} placement="right">
            <ListItemIcon
              sx={{
                minWidth: 0,
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
          </Tooltip>
        ) : (
          <>
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2,
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </>
        )}
      </ListItem>
    );
  }, [location.pathname, navigate, isCollapsed]);

  // Memoize drawer styles to prevent recalculation
  const drawerWidth = useMemo(() => isCollapsed ? 64 : 240, [isCollapsed]);
  
  const drawerStyles = useMemo(() => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      // Use transform instead of width transition to prevent layout thrashing
      // Width changes trigger layout recalculation, transform only triggers repaint
      transition: theme.transitions.create(['width', 'transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
      borderRight: `1px solid ${theme.palette.divider}`,
      // Force GPU acceleration for smoother transitions
      willChange: 'width',
    },
  }), [drawerWidth, theme]);

  return (
    <Drawer
      variant="permanent"
      sx={drawerStyles}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        minHeight: 64,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}> 
        {!isCollapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            2DU
          </Typography>
        )}
        <IconButton 
          onClick={onToggleCollapse}
          sx={{ 
            ml: isCollapsed ? 'auto' : 0,
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
            }
          }}
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      
      {!isCollapsed && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            {t('sidebar.welcome', { userName: userName || t('sidebar.user') })}
          </Typography>
        </Box>
      )}
      
      <List sx={{ px: 1 }}>
        {mainMenuItems.map(item => renderMenuItem(item, isCollapsed))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      
      <Divider />
      
      <List sx={{ px: 1 }}>
        <ListItem
          button
          onClick={onOpenShortcutsHelp}
          sx={{
            minHeight: 48,
            justifyContent: isCollapsed ? 'center' : 'initial',
            px: 2.5,
            borderRadius: 1,
            mb: 0.5,
          }}
        >
          {isCollapsed ? (
            <Tooltip title={t('shortcuts.title')} placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                }}
              >
                <KeyboardIcon />
              </ListItemIcon>
            </Tooltip>
          ) : (
            <>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                }}
              >
                <KeyboardIcon />
              </ListItemIcon>
              <ListItemText primary={t('shortcuts.title')} />
            </>
          )}
        </ListItem>
        
        <ListItem
          button
          onClick={toggleDarkMode}
          sx={{
            minHeight: 48,
            justifyContent: isCollapsed ? 'center' : 'initial',
            px: 2.5,
            borderRadius: 1,
            mb: 0.5,
          }}
        >
          {isCollapsed ? (
            <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'} placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </ListItemIcon>
            </Tooltip>
          ) : (
            <>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </ListItemIcon>
              <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
            </>
          )}
        </ListItem>

        <ListItem
          button
          onClick={onLogout}
          sx={{
            minHeight: 48,
            justifyContent: isCollapsed ? 'center' : 'initial',
            px: 2.5,
            borderRadius: 1,
          }}
        >
          {isCollapsed ? (
            <Tooltip title="Logout" placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
            </Tooltip>
          ) : (
            <>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </>
          )}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar; 