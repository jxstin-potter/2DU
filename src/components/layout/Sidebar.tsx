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
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Inbox as InboxIcon,
  Event as EventIcon,
  LocalOffer as TagIcon,
  CheckCircle as CompletedIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Keyboard as KeyboardIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { useTaskModal } from '../../contexts/TaskModalContext';
import { useSearchModal } from '../../contexts/SearchModalContext';

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
  const { openModal } = useTaskModal();
  const { openModal: openSearchModal } = useSearchModal();

  // Shared icon spacing configuration - edit this value to change spacing for all sidebar items
  const iconSpacing = useMemo(() => 0.75, []);

  const mainMenuItems = useMemo(() => [
    { text: t('sidebar.today'), icon: <InboxIcon />, path: "/today" },
    { text: t('sidebar.upcoming'), icon: <EventIcon />, path: "/upcoming" },
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
          minHeight: 40,
          justifyContent: isCollapsed ? 'center' : 'initial',
          px: 2,
          borderRadius: 1,
          mb: 0.5,
          backgroundColor: isActive ? 'primary.main' : 'transparent',
          color: isActive ? 'primary.contrastText' : 'text.primary',
          '&:hover': {
            backgroundColor: isActive ? 'primary.dark' : 'action.hover',
          },
          '& .MuiListItemIcon-root': {
            color: isActive ? '#5c4e00' : 'text.secondary',
            minWidth: 36,
          },
        }}
      >
        {isCollapsed ? (
          <Tooltip title={item.text} placement="right">
            <ListItemIcon
              sx={{
                minWidth: 0,
                justifyContent: 'center',
                color: isActive ? '#5c4e00' : 'text.secondary',
                '& svg': {
                  fontSize: '1.25rem',
                },
              }}
            >
              {item.icon}
            </ListItemIcon>
          </Tooltip>
        ) : (
          <>
            <ListItemIcon
              sx={{
                minWidth: 36,
                mr: iconSpacing,
                justifyContent: 'center',
                color: isActive ? '#5c4e00' : 'text.secondary',
                '& svg': {
                  fontSize: '1.25rem',
                },
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{ 
                variant: 'body2',
                sx: { fontSize: '0.8125rem' }
              }}
            />
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
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      // Use transform instead of width transition to prevent layout thrashing
      // Width changes trigger layout recalculation, transform only triggers repaint
      transition: theme.transitions.create(['width', 'transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
      border: 'none !important',
      borderRight: 'none !important',
      borderLeft: 'none !important',
      borderTop: 'none !important',
      borderBottom: 'none !important',
      outline: 'none',
      boxShadow: 'none',
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
        justifyContent: isCollapsed ? 'center' : 'space-between',
        p: 1.5,
        minHeight: 48,
      }}> 
        {!isCollapsed && (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              fontSize: '0.875rem',
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
            ml: isCollapsed ? 0 : 0,
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
        <>
          <Box sx={{ p: 1.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {t('sidebar.welcome', { userName: userName || t('sidebar.user') })}
            </Typography>
          </Box>
          
          <List sx={{ 
            px: 1,
            '& .MuiListItemIcon-root': {
              mr: iconSpacing,
            },
          }}>
            <ListItem
              button
              onClick={openModal}
                sx={{
                  minHeight: 40,
                  justifyContent: 'initial',
                  px: 2,
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: 'transparent',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '& .MuiListItemIcon-root': {
                    minWidth: 36,
                    color: 'text.secondary',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    justifyContent: 'center',
                    color: 'text.secondary',
                    '& svg': {
                      fontSize: '1.25rem',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: '#5c4e00', // Gold color
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AddIcon sx={{ fontSize: '1rem', color: 'inherit' }} />
                  </Box>
                </ListItemIcon>
                <ListItemText 
              primary="Add task" 
              primaryTypographyProps={{ 
                variant: 'body2',
                sx: { 
                  fontSize: '0.8125rem',
                  color: '#5c4e00', // Match the gold circle color
                }
              }} 
            />
              </ListItem>
            
            <ListItem
              button
              onClick={openSearchModal}
              sx={{
                minHeight: 40,
                justifyContent: 'initial',
                px: 2,
                borderRadius: 1,
                mb: 0.5,
                backgroundColor: 'transparent',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiListItemIcon-root': {
                  minWidth: 36,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  justifyContent: 'center',
                  color: 'text.secondary',
                  '& svg': {
                    fontSize: '1.25rem',
                  },
                }}
              >
                <SearchIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Search" 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  sx: { fontSize: '0.8125rem' }
                }} 
              />
            </ListItem>
            
            {mainMenuItems.map(item => renderMenuItem(item, false))}
          </List>

          <Box sx={{ flexGrow: 1 }} />
          
          <List sx={{ 
            px: 1,
            '& .MuiListItemIcon-root': {
              mr: iconSpacing,
            },
          }}>
            <ListItem
              button
              onClick={onOpenShortcutsHelp}
              sx={{
                minHeight: 40,
                justifyContent: 'initial',
                px: 2,
                borderRadius: 1,
                mb: 0.5,
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiListItemIcon-root': {
                  color: 'text.secondary',
                  minWidth: 36,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                }}
              >
                <KeyboardIcon />
              </ListItemIcon>
              <ListItemText 
                primary={t('shortcuts.title')}
                primaryTypographyProps={{ 
                  variant: 'body2',
                  sx: { fontSize: '0.8125rem' }
                }}
              />
            </ListItem>
            
            <ListItem
              button
              onClick={toggleDarkMode}
              sx={{
                minHeight: 40,
                justifyContent: 'initial',
                px: 2,
                borderRadius: 1,
                mb: 0.5,
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiListItemIcon-root': {
                  color: 'text.secondary',
                  minWidth: 36,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </ListItemIcon>
              <ListItemText 
                primary={darkMode ? 'Light Mode' : 'Dark Mode'}
                primaryTypographyProps={{ 
                  variant: 'body2',
                  sx: { fontSize: '0.8125rem' }
                }}
              />
            </ListItem>

            <ListItem
              button
              onClick={onLogout}
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
                borderRadius: 1,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{ 
                  variant: 'body2',
                  sx: { fontSize: '0.8125rem' }
                }}
              />
            </ListItem>
          </List>
        </>
      )}
    </Drawer>
  );
};

export default Sidebar; 