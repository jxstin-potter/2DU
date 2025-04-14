import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Stack, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography,
  Paper,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useTasks } from '../../hooks/useTasks';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import { useI18n } from '../../contexts/I18nContext';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { addTask } = useTasks();
  const { mode } = useCustomTheme();
  const { t } = useI18n();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  const handleOpenShortcutsHelp = () => {
    // TODO: Implement shortcuts help dialog
    console.log('Shortcuts help clicked');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        darkMode={mode === 'dark'}
        toggleDarkMode={useCustomTheme().toggleColorMode}
        onLogout={handleLogout}
        onOpenShortcutsHelp={handleOpenShortcutsHelp}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { 
            xs: '100%',
            sm: `calc(100% - ${isSidebarCollapsed ? 64 : 240}px)` 
          },
          ml: { 
            xs: 0,
            sm: `${isSidebarCollapsed ? 64 : 240}px` 
          },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <AppBar 
          position="fixed" 
          color="default" 
          elevation={0}
          sx={{
            width: { 
              xs: '100%',
              sm: `calc(100% - ${isSidebarCollapsed ? 64 : 240}px)` 
            },
            ml: { 
              xs: 0,
              sm: `${isSidebarCollapsed ? 64 : 240}px` 
            },
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
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
          <Paper 
            elevation={0}
            sx={{ 
              p: 2,
              mb: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AddIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                sx={{
                  minWidth: 100,
                  borderRadius: 2,
                }}
              >
                Add Task
              </Button>
            </Stack>
          </Paper>
          
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 