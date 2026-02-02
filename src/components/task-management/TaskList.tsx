import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Sort as SortIcon,
} from '@mui/icons-material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { motion } from 'framer-motion';
import { Task, Tag, Category } from '../../types';
import TaskItem from './TaskItem';
import InlineTaskEditor from './InlineTaskEditor';
import { useTaskModal } from '../../contexts/TaskModalContext';

export type SortOption = 'manual' | 'dueDate' | 'title' | 'createdAt';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
  onTaskAction: {
    toggle: (taskId: string) => Promise<void>;
    delete: (taskId: string) => Promise<void>;
    update: (taskId: string, updates: Partial<Task>) => Promise<void>;
    edit: (task: Task) => Promise<void>;
    share?: (task: Task) => Promise<void>;
  };
  onCreateTask?: (taskData: Partial<Task>) => Promise<void>;
  sortBy?: SortOption;
  onSortChange?: (sortBy: SortOption) => void;
  draggable?: boolean;
  tags: Tag[];
  categories: Category[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  defaultCategoryId?: string;
  justAddedTaskId?: string | null;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  error = null,
  onTaskAction,
  onCreateTask,
  sortBy: sortByProp = 'dueDate',
  onSortChange,
  draggable = false,
  tags,
  categories,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  defaultCategoryId,
  justAddedTaskId = null,
}) => {
  const theme = useTheme();
  const { isOpen: isTaskModalOpen, closeModal: closeTaskModal } = useTaskModal();
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [showInlineEditor, setShowInlineEditor] = useState(false);
  const sortBy = sortByProp;

  // Don't auto-show inline editor - it should only be triggered explicitly
  // The inline editor is for quick adding within the list, not for sidebar "Add task"
  // Keep this disabled for now - inline editor can be added via a separate trigger if needed
  useEffect(() => {
    setShowInlineEditor(false);
  }, []);

  const handleCreateTask = useCallback(async (taskData: Partial<Task>) => {
    if (onCreateTask) {
      await onCreateTask(taskData);
      setShowInlineEditor(false);
      closeTaskModal();
    }
  }, [onCreateTask, closeTaskModal]);

  const handleCancelEditor = useCallback(() => {
    setShowInlineEditor(false);
    closeTaskModal();
  }, [closeTaskModal]);

  const handleTaskAction = useCallback(async (action: keyof TaskListProps['onTaskAction'], ...args: any[]) => {
    if (actionInProgress) return;
    
    try {
      setActionInProgress(action);
      const actionFn = onTaskAction[action];
      if (actionFn) {
        await actionFn(...args);
      }
    } catch (error) {
      // Error handling is done by the action function
    } finally {
      setActionInProgress(null);
    }
  }, [actionInProgress, onTaskAction]);

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (option: SortOption) => {
    onSortChange?.(option);
    handleSortClose();
  };

  // Display list: manual = use tasks as-is (already ordered from subscription); else sort locally
  const displayTasks = useMemo(() => {
    if (sortBy === 'manual') return tasks;
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        default:
          return 0;
      }
    });
  }, [tasks, sortBy]);


  // Virtualized list item renderer
  const Row = useCallback(({ index, style }: ListChildComponentProps) => {
    const task = displayTasks[index];
    if (!task) return null;
    const isJustAdded = task.id === justAddedTaskId;
    const content = draggable ? (
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            data-testid={`task-${task.id}`}
          >
            <TaskItem
              task={task}
              onToggleComplete={() => handleTaskAction('toggle', task.id)}
              onDelete={() => handleTaskAction('delete', task.id)}
              onEdit={() => handleTaskAction('edit', task)}
              onUpdate={onTaskAction.update}
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
        onUpdate={onTaskAction.update}
        tags={tags}
        categories={categories}
        isActionInProgress={actionInProgress !== null}
      />
    );
    return (
      <div style={style}>
        {isJustAdded ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {content}
          </motion.div>
        ) : (
          content
        )}
      </div>
    );
  }, [displayTasks, tags, categories, actionInProgress, draggable, handleTaskAction, justAddedTaskId]);

  // Throttle scroll handler to prevent excessive calls
  const scrollThrottleRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastScrollOffsetRef = React.useRef<number>(0);

  // Handle infinite scroll with throttling
  const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: { scrollOffset: number; scrollUpdateWasRequested: boolean }) => {
    // Throttle scroll events to max once per 100ms
    if (scrollThrottleRef.current) {
      return;
    }

    scrollThrottleRef.current = setTimeout(() => {
      scrollThrottleRef.current = null;
      
      // Only process if scroll offset changed significantly (at least 50px)
      if (Math.abs(scrollOffset - lastScrollOffsetRef.current) < 50 && !scrollUpdateWasRequested) {
        return;
      }
      
      lastScrollOffsetRef.current = scrollOffset;

      if (!scrollUpdateWasRequested && hasMore && !isLoadingMore && onLoadMore) {
        const listHeight = 600; // Base height
        const scrollThreshold = listHeight * 0.8; // Load more when 80% scrolled
        
        if (scrollOffset > scrollThreshold) {
          onLoadMore();
        }
      }
    }, 100);
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Cleanup throttle on unmount
  useEffect(() => {
    return () => {
      if (scrollThrottleRef.current) {
        clearTimeout(scrollThrottleRef.current);
      }
    };
  }, []);

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
      itemCount={displayTasks.length}
      itemSize={72}
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
        <Button
          size="small"
          startIcon={<SortIcon />}
          onClick={handleSortClick}
        >
          Sort: {sortBy === 'manual' ? 'Manual' :
                sortBy === 'dueDate' ? 'Due Date' :
                sortBy === 'title' ? 'Title' : 'Created'}
        </Button>
      </Box>

      {/* Inline task editor */}
      {showInlineEditor && onCreateTask && (
        <Box sx={{ mb: 2 }}>
          <InlineTaskEditor
            onSubmit={handleCreateTask}
            onCancel={handleCancelEditor}
            categories={categories}
            defaultCategoryId={defaultCategoryId}
          />
        </Box>
      )}

      {draggable ? (
        <Droppable droppableId="task-list" mode="virtual">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} data-testid="task-list">
              {listContent}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ) : (
        <div data-testid="task-list">{listContent}</div>
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
        <MenuItem onClick={() => handleSortSelect('manual')}>
          <ListItemText>Manual</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('dueDate')}>
          <ListItemText>Due Date</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('title')}>
          <ListItemText>Title</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('createdAt')}>
          <ListItemText>Created Date</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TaskList; 