import React, { useState, useCallback, useMemo } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Checkbox, 
  IconButton, 
  Chip, 
  Tooltip, 
  Card, 
  CardContent,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import FlagIcon from '@mui/icons-material/Flag';
import FolderIcon from '@mui/icons-material/Folder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LabelIcon from '@mui/icons-material/Label';
import { Task } from '../../types';
import { format, isToday, isPast, isFuture } from 'date-fns';
import "../../styles/animations.css";

interface TaskListProps {
  tasks: Task[];
  onTaskAction: {
    toggle: (taskId: string) => void;
    delete: (taskId: string) => void;
    update: (taskId: string, updates: Partial<Task>) => void;
    edit: (task: Task) => void;
    share: (task: Task) => void;
  };
  draggable?: boolean;
}

type SortOption = 'dueDate' | 'priority' | 'title' | 'createdAt';
type FilterOption = 'all' | 'today' | 'overdue' | 'upcoming' | 'completed' | 'active';

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskAction, draggable = false }) => {
  const theme = useTheme();
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortSelect = (option: SortOption) => {
    setSortBy(option);
    handleSortClose();
  };

  const handleFilterSelect = (option: FilterOption) => {
    setFilterBy(option);
    handleFilterClose();
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return theme.palette.success.main;
      case 'medium': return theme.palette.warning.main;
      case 'high': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const handleTaskComplete = (taskId: string) => {
    // Add micro-interaction feedback
    const taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
      taskElement.classList.add('animate-status-change');
      setTimeout(() => {
        taskElement.classList.remove('animate-status-change');
      }, 500);
    }
    
    onTaskAction.toggle(taskId);
  };

  const handleTaskDelete = (taskId: string) => {
    // Add micro-interaction feedback
    const taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
      taskElement.classList.add('animate-shake');
      setTimeout(() => {
        taskElement.classList.remove('animate-shake');
        onTaskAction.delete(taskId);
      }, 500);
    } else {
      onTaskAction.delete(taskId);
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    // Add ripple effect to button
    const button = event.currentTarget;
    button.classList.add('button-click');
    setTimeout(() => {
      button.classList.remove('button-click');
    }, 600);
  };

  // Sort tasks based on selected sort option
  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority': {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return (priorityOrder[a.priority || 'medium'] || 1) - (priorityOrder[b.priority || 'medium'] || 1);
      }
      case 'title':
        return a.title.localeCompare(b.title);
      case 'createdAt':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      default:
        return 0;
    }
  });

  // Filter tasks based on selected filter option
  const filteredTasks = sortedTasks.filter(task => {
    // First apply the filter option
    if (filterBy === 'completed') return task.completed;
    if (filterBy === 'active') return !task.completed;
    
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      if (filterBy === 'today') return isToday(dueDate);
      if (filterBy === 'overdue') return isPast(dueDate) && !task.completed;
      if (filterBy === 'upcoming') return isFuture(dueDate) && !task.completed;
    }
    
    return true; // 'all' filter
  });

  // Apply search filter
  const searchFilteredTasks = searchQuery
    ? filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredTasks;

  const renderTask = (task: Task) => (
    <Card 
      id={`task-${task.id}`}
      className="hover-lift animate-fade-in"
      sx={{ 
        mb: 2, 
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
        },
        ...(task.completed && { opacity: 0.7 })
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Checkbox
          checked={task.completed}
          onChange={() => handleTaskComplete(task.id)}
          sx={{ 
            mr: 1,
            '&.Mui-checked': {
              color: theme.palette.success.main,
            }
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {task.title}
          </Typography>
          {task.description && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mt: 0.5,
                transition: 'opacity 0.2s ease-in-out',
                opacity: task.completed ? 0.5 : 1
              }}
            >
              {task.description}
            </Typography>
          )}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {task.category && (
              <Chip
                icon={<FolderIcon />}
                label={task.category}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  transition: 'all 0.2s ease-in-out'
                }}
              />
            )}
            {task.dueDate && (
              <Chip
                icon={<AccessTimeIcon />}
                label={format(new Date(task.dueDate), 'MMM d, yyyy')}
                size="small"
                sx={{ 
                  bgcolor: isPast(new Date(task.dueDate)) && !task.completed
                    ? alpha(theme.palette.error.main, 0.1)
                    : isToday(new Date(task.dueDate))
                    ? alpha(theme.palette.warning.main, 0.1)
                    : alpha(theme.palette.info.main, 0.1),
                  color: isPast(new Date(task.dueDate)) && !task.completed
                    ? theme.palette.error.main
                    : isToday(new Date(task.dueDate))
                    ? theme.palette.warning.main
                    : theme.palette.info.main,
                  transition: 'all 0.2s ease-in-out'
                }}
              />
            )}
            {task.tags && task.tags.length > 0 && (
              <Chip
                icon={<LabelIcon />}
                label={`${task.tags.length} tag${task.tags.length > 1 ? 's' : ''}`}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                  transition: 'all 0.2s ease-in-out'
                }}
              />
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton 
              size="small" 
              onClick={(e) => {
                handleButtonClick(e);
                onTaskAction.edit(task);
              }}
              sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton 
              size="small" 
              onClick={(e) => {
                handleButtonClick(e);
                onTaskAction.share(task);
              }}
              sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                }
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              onClick={() => handleTaskDelete(task.id)}
              sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  if (tasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No tasks yet. Click the + button to add one!</Typography>
      </Box>
    );
  }

  const renderTaskList = () => (
    <Box className="animate-fade-in">
      {searchFilteredTasks.map((task) => renderTask(task))}
    </Box>
  );

  const renderDraggableTaskList = () => (
    <Droppable droppableId="taskList">
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {searchFilteredTasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {renderTask(task)}
                </Box>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        flexWrap: 'wrap',
        gap: 1,
      }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            startIcon={<SortIcon />}
            onClick={handleSortClick}
            variant="outlined"
          >
            Sort: {sortBy === 'dueDate' ? 'Due Date' : 
                  sortBy === 'priority' ? 'Priority' : 
                  sortBy === 'title' ? 'Title' : 'Created'}
          </Button>
          <Button
            size="small"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            variant="outlined"
          >
            Filter: {filterBy === 'all' ? 'All Tasks' : 
                    filterBy === 'today' ? 'Today' : 
                    filterBy === 'overdue' ? 'Overdue' : 
                    filterBy === 'upcoming' ? 'Upcoming' : 
                    filterBy === 'completed' ? 'Completed' : 'Active'}
          </Button>
        </Box>
        
        <TextField
          size="small"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={() => handleSortSelect('dueDate')}>
          <ListItemIcon>
            <AccessTimeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Due Date</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('priority')}>
          <ListItemIcon>
            <FlagIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Priority</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('title')}>
          <ListItemIcon>
            <LabelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Title</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('createdAt')}>
          <ListItemIcon>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Created Date</ListItemText>
        </MenuItem>
      </Menu>
      
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={() => handleFilterSelect('all')}>
          <ListItemText>All Tasks</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('active')}>
          <ListItemText>Active Tasks</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleFilterSelect('today')}>
          <ListItemText>Due Today</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('overdue')}>
          <ListItemText>Overdue</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('upcoming')}>
          <ListItemText>Upcoming</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleFilterSelect('completed')}>
          <ListItemText>Completed</ListItemText>
        </MenuItem>
      </Menu>
      
      {draggable ? renderDraggableTaskList() : renderTaskList()}
      
      {searchFilteredTasks.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {searchQuery 
              ? `No tasks match "${searchQuery}"` 
              : filterBy !== 'all' 
                ? `No ${filterBy} tasks found` 
                : 'No tasks found'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TaskList; 