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
import { Task } from '../../types';
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
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  defaultCategoryId?: string;
  justAddedTaskId?: string | null;
}

type TaskActionDispatcher = (action: keyof TaskListProps['onTaskAction'], ...args: unknown[]) => Promise<void>;

/** Memoized row component so TaskItem receives stable callbacks per task */
const TaskRow = React.memo<{
  task: Task;
  index: number;
  dispatchAction: TaskActionDispatcher;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  isActionInProgress: boolean;
  isJustAdded: boolean;
  draggable: boolean;
}>(({ task, index, dispatchAction, onUpdate, isActionInProgress, isJustAdded, draggable }) => {
  const onToggleComplete = useCallback(
    () => dispatchAction('toggle', task.id),
    [dispatchAction, task.id]
  );
  const onDelete = useCallback(
    () => dispatchAction('delete', task.id),
    [dispatchAction, task.id]
  );
  const onEdit = useCallback(
    () => dispatchAction('edit', task),
    [dispatchAction, task]
  );
  const content = (
    <TaskItem
      task={task}
      onToggleComplete={onToggleComplete}
      onDelete={onDelete}
      onEdit={onEdit}
      onUpdate={onUpdate}
      isActionInProgress={isActionInProgress}
    />
  );
  const wrapped = isJustAdded ? (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  ) : (
    content
  );
  if (draggable) {
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            data-testid={`task-${task.id}`}
          >
            {content}
          </div>
        )}
      </Draggable>
    );
  }
  return <div data-testid={`task-${task.id}`}>{wrapped}</div>;
});
TaskRow.displayName = 'TaskRow';

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  error = null,
  onTaskAction,
  onCreateTask,
  sortBy: sortByProp = 'dueDate',
  onSortChange,
  draggable = false,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  defaultCategoryId,
  justAddedTaskId = null,
}) => {
  const theme = useTheme();
  const { closeModal: closeTaskModal } = useTaskModal();
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

  const actionInProgressRef = React.useRef<string | null>(null);
  actionInProgressRef.current = actionInProgress;
  const handleTaskAction = useCallback(async (action: keyof TaskListProps['onTaskAction'], ...args: unknown[]) => {
    if (actionInProgressRef.current) return;
    
    try {
      setActionInProgress(action);
      const actionFn = onTaskAction[action] as ((...a: unknown[]) => Promise<void>) | undefined;
      if (actionFn) {
        await actionFn(...args);
      }
    } catch (error) {
      // Error handling is done by the action function
    } finally {
      setActionInProgress(null);
    }
  }, [onTaskAction]);

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
    return (
      <div style={style}>
        <TaskRow
          task={task}
          index={index}
          dispatchAction={handleTaskAction}
          onUpdate={onTaskAction.update}
          isActionInProgress={actionInProgress !== null}
          isJustAdded={task.id === justAddedTaskId}
          draggable={draggable}
        />
      </div>
    );
  }, [
    displayTasks,
    actionInProgress,
    draggable,
    justAddedTaskId,
    handleTaskAction,
    onTaskAction.update,
  ]);

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
      itemSize={isMobile ? 80 : 72}
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