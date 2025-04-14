import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  List as MuiList,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { Droppable, Draggable, DragDropContext, DropResult } from 'react-beautiful-dnd';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Task, Tag, Category } from '../../types';
import TaskItem from './TaskItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { isToday, isPast, isFuture } from 'date-fns';

type SortOption = 'dueDate' | 'priority' | 'title' | 'createdAt';
type FilterOption = 'all' | 'today' | 'overdue' | 'upcoming' | 'completed' | 'active';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
  onTaskAction: {
    toggle: (taskId: string) => Promise<void>;
    delete: (taskId: string) => Promise<void>;
    update: (taskId: string, updates: Partial<Task>) => Promise<void>;
    edit: (task: Task) => Promise<void>;
    share: (task: Task) => Promise<void>;
  };
  draggable?: boolean;
  onTaskSelect: (task: Task) => void;
  onTaskToggle: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
  tags: Tag[];
  categories: Category[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  error = null,
  onTaskAction,
  draggable = false,
  onTaskSelect,
  onTaskToggle,
  onTaskDelete,
  onTaskEdit,
  tags,
  categories,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}) => {
  const theme = useTheme();
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Debounced search handler
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(() => {
        setSearchQuery(value);
      }, 300)
    );
  };

  const handleTaskAction = async (action: keyof TaskListProps['onTaskAction'], ...args: any[]) => {
    if (actionInProgress) return; // Prevent concurrent actions
    
    try {
      setActionInProgress(action);
      await onTaskAction[action](...args);
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || actionInProgress) return;

    const { source, destination } = result;
    if (source.index === destination.index) return;

    try {
      setActionInProgress('update');
      await onTaskAction.update(tasks[source.index].id, {
        order: destination.index
      });
    } catch (error) {
      console.error('Error updating task order:', error);
    } finally {
      setActionInProgress(null);
    }
  };

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

  // Memoized filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
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
  }, [tasks, filterBy]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
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
  }, [filteredTasks, sortBy]);

  const searchFilteredTasks = useMemo(() => {
    return searchQuery
      ? sortedTasks.filter(task => 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : sortedTasks;
  }, [sortedTasks, searchQuery]);

  // Virtualized list item renderer
  const Row = useCallback(({ index, style }: ListChildComponentProps) => {
    const task = searchFilteredTasks[index];
    return (
      <div style={style}>
        {draggable ? (
          <Draggable draggableId={task.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <TaskItem
                  task={task}
                  onToggleComplete={() => handleTaskAction('toggle', task.id)}
                  onDelete={() => handleTaskAction('delete', task.id)}
                  onEdit={() => handleTaskAction('edit', task)}
                  tags={tags}
                  categories={categories}
                  isActionInProgress={actionInProgress !== null}
                />
              </div>
            )}
          </Draggable>
        ) : (
          <TaskItem
            task={task}
            onToggleComplete={() => handleTaskAction('toggle', task.id)}
            onDelete={() => handleTaskAction('delete', task.id)}
            onEdit={() => handleTaskAction('edit', task)}
            tags={tags}
            categories={categories}
            isActionInProgress={actionInProgress !== null}
          />
        )}
      </div>
    );
  }, [searchFilteredTasks, tags, categories, actionInProgress, draggable]);

  // Handle infinite scroll
  const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: { scrollOffset: number; scrollUpdateWasRequested: boolean }) => {
    if (!scrollUpdateWasRequested && hasMore && !isLoadingMore && onLoadMore) {
      const listHeight = 600; // Base height
      const scrollThreshold = listHeight * 0.8; // Load more when 80% scrolled
      
      if (scrollOffset > scrollThreshold) {
        onLoadMore();
      }
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const listHeight = isMobile ? 400 : 600;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          <Typography variant="body1">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  const listContent = (
    <FixedSizeList
      height={listHeight}
      width="100%"
      itemCount={searchFilteredTasks.length}
      itemSize={72} // Adjust based on your TaskItem height
      onScroll={handleScroll}
    >
      {Row}
    </FixedSizeList>
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
          onChange={handleSearchChange}
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

      {draggable ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="task-list" mode="virtual">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {listContent}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        listContent
      )}

      {isLoadingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={() => handleSortSelect('dueDate')}>
          <ListItemText>Due Date</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('priority')}>
          <ListItemText>Priority</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('title')}>
          <ListItemText>Title</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('createdAt')}>
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
        <MenuItem onClick={() => handleFilterSelect('completed')}>
          <ListItemText>Completed Tasks</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleFilterSelect('today')}>
          <ListItemText>Today</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('overdue')}>
          <ListItemText>Overdue</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('upcoming')}>
          <ListItemText>Upcoming</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TaskList; 