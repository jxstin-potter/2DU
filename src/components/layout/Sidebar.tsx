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
  Tooltip,
  Divider,
  ListSubheader,
  Collapse,
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
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  FilterList as FilterIcon,
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
  const [projectsOpen, setProjectsOpen] = React.useState(true);
  const [filtersOpen, setFiltersOpen] = React.useState(true);

  const mainMenuItems = [
    { text: t('sidebar.today'), icon: <InboxIcon />, path: "/today" },
    { text: t('sidebar.upcoming'), icon: <EventIcon />, path: "/upcoming" },
    { text: t('sidebar.calendar'), icon: <CalendarIcon />, path: "/calendar" },
  ];

  const projectItems = [
    { text: 'Personal', icon: <FolderIcon />, path: "/projects/personal" },
    { text: 'Work', icon: <FolderIcon />, path: "/projects/work" },
    { text: 'Shopping', icon: <FolderIcon />, path: "/projects/shopping" },
  ];

  const filterItems = [
    { text: 'Priority 1', icon: <FilterIcon />, path: "/filters/priority-1" },
    { text: 'Priority 2', icon: <FilterIcon />, path: "/filters/priority-2" },
    { text: 'Priority 3', icon: <FilterIcon />, path: "/filters/priority-3" },
  ];

  const renderMenuItem = (item: { text: string; icon: React.ReactNode; path: string }, isCollapsed: boolean) => {
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
  };

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
          overflowX: 'hidden',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
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

      <Divider />

      {!isCollapsed && (
        <ListSubheader sx={{ 
          backgroundColor: 'transparent',
          color: 'text.secondary',
          fontWeight: 'bold',
          px: 2,
          py: 1,
        }}>
          Projects
        </ListSubheader>
      )}
      <List sx={{ px: 1 }}>
        {!isCollapsed && (
          <ListItem
            button
            onClick={() => setProjectsOpen(!projectsOpen)}
            sx={{ minHeight: 48, px: 2.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Projects" />
            {projectsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
        )}
        <Collapse in={projectsOpen || isCollapsed} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {projectItems.map(item => renderMenuItem(item, isCollapsed))}
          </List>
        </Collapse>
      </List>

      <Divider />

      {!isCollapsed && (
        <ListSubheader sx={{ 
          backgroundColor: 'transparent',
          color: 'text.secondary',
          fontWeight: 'bold',
          px: 2,
          py: 1,
        }}>
          Filters & Labels
        </ListSubheader>
      )}
      <List sx={{ px: 1 }}>
        {!isCollapsed && (
          <ListItem
            button
            onClick={() => setFiltersOpen(!filtersOpen)}
            sx={{ minHeight: 48, px: 2.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
              <FilterIcon />
            </ListItemIcon>
            <ListItemText primary="Filters" />
            {filtersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
        )}
        <Collapse in={filtersOpen || isCollapsed} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {filterItems.map(item => renderMenuItem(item, isCollapsed))}
          </List>
        </Collapse>
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