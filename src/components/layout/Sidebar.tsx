import React, { useEffect } from 'react';
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
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
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
  Help as HelpIcon,
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

  console.log('Sidebar rendering with props:', {
    isCollapsed,
    darkMode,
    userName,
    currentPath: location.pathname,
  });

  const menuItems = [
    { text: t('sidebar.today'), icon: <InboxIcon />, path: "/today" },
    { text: t('sidebar.upcoming'), icon: <EventIcon />, path: "/upcoming" },
    { text: t('sidebar.calendar'), icon: <CalendarIcon />, path: "/calendar" },
    { text: t('sidebar.tags'), icon: <TagIcon />, path: "/tags" },
    { text: t('sidebar.completed'), icon: <CompletedIcon />, path: "/completed" },
    { text: t('sidebar.settings'), icon: <SettingsIcon />, path: "/settings" },
  ];

  useEffect(() => {
    console.log('Sidebar translations:', {
      today: t('sidebar.today'),
      upcoming: t('sidebar.upcoming'),
      calendar: t('sidebar.calendar'),
      tags: t('sidebar.tags'),
      completed: t('sidebar.completed'),
      settings: t('sidebar.settings'),
      welcome: t('sidebar.welcome', { userName: userName || t('sidebar.user') }),
    });
  }, [t, userName]);

  return (
    <Drawer
      variant="permanent"
      className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}
      sx={{
        width: isCollapsed ? 64 : 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? 64 : 240,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box className="logo-container">
        <Box className="logo-link">
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
        </Box>
        <IconButton onClick={onToggleCollapse}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      
      <Divider />
      
      {!isCollapsed && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            {t('sidebar.welcome', { userName: userName || t('sidebar.user') })}
          </Typography>
        </Box>
      )}
      
      <List className="nav-list">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2.5,
                borderRadius: 1,
                mb: 0.5,
                '&.active': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
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
        })}
      </List>
      
      <Box sx={{ mt: 'auto', p: 1 }}>
        <ListItem
          button
          onClick={onOpenShortcutsHelp}
          sx={{
            minHeight: 48,
            justifyContent: isCollapsed ? 'center' : 'initial',
            px: 2.5,
            borderRadius: 1,
            mb: 0.5,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          {isCollapsed ? (
            <Tooltip title={t('sidebar.keyboardShortcuts')} placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                }}
              >
                <HelpIcon />
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
                <HelpIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('Keyboard Shortcuts')}
                sx={{ opacity: 1 }}
              />
            </>
          )}
        </ListItem>
      </Box>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Divider />
      
      <List>
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
            <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} placement="right">
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
              <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
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