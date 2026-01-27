import React, { useCallback, useState } from 'react';
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
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Event as EventIcon,
  LocalOffer as TagIcon,
  CheckCircle as CompletedIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Keyboard as KeyboardIcon,
  Add as AddIcon,
  Search as SearchIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { useTaskModal } from '../../contexts/TaskModalContext';
import { useSearchModal } from '../../contexts/SearchModalContext';
import { User } from '../../types';
import SidebarToggleIcon from '../ui/SidebarToggleIcon';
import ThinArrowDownIcon from '../ui/ThinArrowDownIcon';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
  userName?: string;
  user?: User | null;
  onOpenShortcutsHelp: () => void;
  onOpenSettings?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  darkMode,
  toggleDarkMode,
  onLogout,
  userName,
  user,
  onOpenShortcutsHelp,
  onOpenSettings,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const { openModal } = useTaskModal();
  const { openModal: openSearchModal } = useSearchModal();
  
  // Menu anchor states
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [helpAnchorEl, setHelpAnchorEl] = useState<null | HTMLElement>(null);
  
  const displayName = user?.name || userName || t('sidebar.user');
  const profilePicture = user?.profilePicture;
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };
  
  const handleHelpMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setHelpAnchorEl(event.currentTarget);
  };
  
  const handleHelpMenuClose = () => {
    setHelpAnchorEl(null);
  };
  
  const handleSettings = () => {
    handleProfileMenuClose();
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      navigate('/settings');
    }
  };
  
  const handleLogout = () => {
    handleProfileMenuClose();
    onLogout();
  };
  
  const handleKeyboardShortcuts = () => {
    handleHelpMenuClose();
    onOpenShortcutsHelp();
  };

  const iconSpacing = 0.75;

  const mainMenuItems = [
    { text: t('sidebar.today'), icon: <InboxIcon />, path: "/today" },
    { text: t('sidebar.upcoming'), icon: <EventIcon />, path: "/upcoming" },
    { text: t('sidebar.tags'), icon: <TagIcon />, path: "/tags" },
    { text: t('sidebar.completed'), icon: <CompletedIcon />, path: "/completed" },
  ];

  const renderMenuItem = useCallback((item: { text: string; icon: React.ReactNode; path: string }, isCollapsed: boolean) => {
    const isActive = location.pathname === item.path;
    return (
      <ListItem
        button
        key={item.path}
        onClick={() => navigate(item.path)}
        sx={{
          minHeight: 32,
          justifyContent: isCollapsed ? 'center' : 'initial',
          px: 2,
          py: 0.5,
          borderRadius: 1,
          mb: 0.25,
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

  const drawerWidth = isCollapsed ? 64 : 240;
  
  const drawerStyles = {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      transition: theme.transitions.create(['width', 'transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      willChange: 'width',
    },
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={drawerStyles}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isCollapsed ? 'center' : 'space-between',
          p: 1,
          px: 1.5,
          minHeight: 40,
          height: 40,
        }}> 
          {!isCollapsed ? (
            <Button
              onClick={handleProfileMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                textTransform: 'none',
                color: theme.palette.text.primary,
                p: 0.5,
                minWidth: 0,
                flex: 1,
                justifyContent: 'flex-start',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Avatar
                src={profilePicture}
                alt={displayName}
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.75rem',
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  maxWidth: 140,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayName}
              </Typography>
              <ThinArrowDownIcon sx={{ fontSize: '1rem', ml: 0.01 }} />
            </Button>
          ) : (
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                color: theme.palette.text.primary,
                p: 0.5,
              }}
            >
              <Avatar
                src={profilePicture}
                alt={displayName}
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.75rem',
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          )}
          <IconButton 
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
            aria-controls="sidebar"
            aria-expanded={!isCollapsed}
            sx={{ 
              ml: isCollapsed ? 0 : -0.5,
              mr: isCollapsed ? 0 : -0.5,
              color: theme.palette.text.secondary,
              p: 0.5,
              '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },
              transition: 'all 0.2s ease',
            }}
          >
            <SidebarToggleIcon isCollapsed={isCollapsed} sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Box>
      
      {!isCollapsed && (
        <>
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
                  minHeight: 32,
                  justifyContent: 'initial',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  mb: 0.25,
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
                minHeight: 32,
                justifyContent: 'initial',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                mb: 0.25,
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
              onClick={handleHelpMenuOpen}
              sx={{
                minHeight: 32,
                justifyContent: 'initial',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                mb: 0.25,
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
                  minWidth: 36,
                  justifyContent: 'center',
                  color: 'text.secondary',
                  '& svg': {
                    fontSize: '1.25rem',
                  },
                }}
              >
                <HelpIcon />
              </ListItemIcon>
              <ListItemText 
                primary={t('sidebar.helpResources')}
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
      
      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disablePortal={false}
      >
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('sidebar.settings')} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('sidebar.logout')} />
        </MenuItem>
      </Menu>
      
      {/* Help & Resources Dropdown Menu */}
      <Menu
        anchorEl={helpAnchorEl}
        open={Boolean(helpAnchorEl)}
        onClose={handleHelpMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        disablePortal={false}
      >
        <MenuItem onClick={handleKeyboardShortcuts}>
          <ListItemIcon>
            <KeyboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('sidebar.keyboardShortcuts')} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Sidebar; 