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
    setCompletingTaskId(taskId);
    setTimeout(() => {
      onTaskAction.toggle(taskId);
      setCompletingTaskId(null);
    }, 500); // Match the animation duration
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
      key={task.id} 
      sx={{ 
        mb: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: theme.shadows[3],
          transform: 'translateY(-2px)',
        },
        opacity: task.completed ? 0.7 : 1,
        borderLeft: `4px solid ${task.completed 
          ? theme.palette.success.main 
          : task.priority === 'high' 
            ? theme.palette.error.main 
            : task.priority === 'medium' 
              ? theme.palette.warning.main 
              : theme.palette.success.main}`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Checkbox
            checked={task.completed}
            onChange={(e) => handleTaskComplete(task.id)}
            sx={{
              color: theme.palette.primary.main,
              '&.Mui-checked': {
                color: theme.palette.success.main,
              },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              flexGrow: 1,
              color: task.completed ? 'text.secondary' : 'text.primary',
            }}
          >
            {task.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              onClick={() => onTaskAction.edit(task)}
              size="small"
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={() => onTaskAction.delete(task.id)}
              size="small"
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {task.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1.5,
              pl: 4,
              borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {task.description}
          </Typography>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1.5, 
          alignItems: 'center',
          pl: 4,
        }}>
          {task.dueDate && (
            <Tooltip title={format(new Date(task.dueDate), 'PPP')}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                color: isPast(new Date(task.dueDate)) && !task.completed
                  ? theme.palette.error.main
                  : 'text.secondary',
              }}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2">
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </Typography>
              </Box>
            </Tooltip>
          )}
          
          {(task.category || task.categoryId) && (
            <Tooltip title={task.category || task.categoryId}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FolderIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {task.category || task.categoryId}
                </Typography>
              </Box>
            </Tooltip>
          )}
          
          {task.priority && task.priority !== 'medium' && (
            <Tooltip title={`Priority: ${task.priority}`}>
              <Chip
                icon={<FlagIcon />}
                label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                size="small"
                sx={{ 
                  height: 24,
                  bgcolor: alpha(getPriorityColor(task.priority), 0.1),
                  color: getPriorityColor(task.priority),
                  fontWeight: 500,
                  '& .MuiChip-icon': {
                    color: getPriorityColor(task.priority),
                  }
                }}
              />
            </Tooltip>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {task.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{ 
                    height: 20,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                />
              ))}
            </Box>
          )}
          
          {task.isShared && (
            <Tooltip title="Shared Task">
              <Chip
                icon={<ShareIcon />}
                label="Shared"
                size="small"
                sx={{ 
                  height: 24,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                }}
              />
            </Tooltip>
          )}
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