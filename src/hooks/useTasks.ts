import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  createTask, 
  updateTask, 
  deleteTask, 
  subscribeToTasks,
  loadMoreTasks,
  TaskFilterParams
} from '../services/tasksService';
import { TaskDocument, TaskQueryResult } from '../types/firestore';
import { taskDocumentToTask, taskPatchToTaskDocument } from '../types/firestore';
import { logger } from '../utils/logger';
import { logHookError } from '../utils/errorLogging';

// Create a hook-specific logger
const tasksHookLogger = logger.hook('useTasks');

// Define specific error types for better error handling
type TaskError = {
  message: string;
  code: 'AUTH_REQUIRED' | 'INVALID_DATA' | 'NETWORK_ERROR' | 'PROCESSING_ERROR' | 'UNKNOWN_ERROR';
  details?: any;
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TaskError | null>(null);
  const [filterParamsState, setFilterParamsState] = useState<TaskFilterParams>({
    completionStatus: 'all',
    sortBy: 'creationDate',
    sortOrder: 'desc',
    view: undefined,
    limit: 20
  });
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { user } = useAuth();

  // Memoize filterParams to prevent unnecessary re-subscriptions
  const filterParams = useMemo(() => filterParamsState, [filterParamsState]);

  // Helper function to set error state with proper typing
  const setTaskError = (message: string, code: TaskError['code'], details?: any) => {
    logHookError(new Error(message), 'useTasks', message, { code, details });
    setError({ message, code, details });
  };

  // Helper function to clear error state
  const clearError = () => {
    setError(null);
  };

  // Load more tasks
  const loadMore = useCallback(async () => {
    if (!user || !lastVisible || !hasMore || isLoadingMore) {
      tasksHookLogger.debug('Skipping loadMore', { 
        hasUser: !!user, 
        hasLastVisible: !!lastVisible, 
        hasMore, 
        isLoadingMore 
      });
      return;
    }

    try {
      setIsLoadingMore(true);
      clearError();
      tasksHookLogger.info('Loading more tasks', { 
        userId: user.id, 
        filterParams 
      });

      const result = await loadMoreTasks(user.id, filterParams, lastVisible);
      
      const newTasks = result.tasks.map((t) => taskDocumentToTask(t));

      setTasks((prev) => {
        const next = [...prev, ...newTasks];
        tasksHookLogger.info('Successfully loaded more tasks', {
          userId: user.id,
          newTaskCount: newTasks.length,
          totalTaskCount: next.length,
          hasMore: result.hasMore,
        });
        return next;
      });
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      logHookError(error, 'useTasks', 'Failed to load more tasks', { 
        userId: user?.id,
        filterParams,
        error: error.message
      });
      setTaskError(
        'Failed to load more tasks',
        'NETWORK_ERROR',
        { error: err }
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [user, lastVisible, hasMore, isLoadingMore, filterParams]);

  useEffect(() => {
    if (!user) {
      tasksHookLogger.info('No user found, clearing tasks state');
      setTasks([]);
      setLoading(false);
      clearError();
      return;
    }

    setLoading(true);
    clearError();
    tasksHookLogger.info('Setting up task subscription', { 
      userId: user.id, 
      filterParams 
    });

    let unsubscribe: () => void;

    try {
      unsubscribe = subscribeToTasks(
        user.id, 
        filterParams,
        (result: TaskQueryResult) => {
          try {
            const processedTasks = result.tasks.map((t) => taskDocumentToTask(t));

            setTasks(processedTasks);
            setLastVisible(result.lastVisible);
            setHasMore(result.hasMore);
            if (result.fromServer !== false) setLoading(false);
            clearError();

            tasksHookLogger.info('Received task updates', { 
              userId: user.id, 
              taskCount: processedTasks.length,
              hasMore: result.hasMore 
            });
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error occurred');
            logHookError(error, 'useTasks', 'Failed to process tasks data', { 
              userId: user.id,
              filterParams,
              error: error.message
            });
            setTaskError(
              'Failed to process tasks data',
              'PROCESSING_ERROR',
              { error: err }
            );
            setLoading(false);
            setTasks([]);
          }
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      logHookError(error, 'useTasks', 'Failed to establish connection with tasks service', { 
        userId: user.id,
        filterParams,
        error: error.message
      });
      setTaskError(
        'Failed to establish connection with tasks service',
        'NETWORK_ERROR',
        { error: err }
      );
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        tasksHookLogger.info('Cleaning up task subscription', { userId: user.id });
        unsubscribe();
      }
    };
  }, [user, filterParams]);

  // Set the view filter (today, upcoming, calendar, etc.)
  const setView = useCallback((view: 'today' | 'upcoming' | 'calendar' | 'completed' | null) => {
    tasksHookLogger.info('Updating task view', { 
      userId: user?.id, 
      newView: view 
    });
    setFilterParamsState(prevFilters => ({
      ...prevFilters,
      view: view || undefined
    }));
  }, [user?.id]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TaskFilterParams>) => {
    tasksHookLogger.info('Updating task filters', { 
      userId: user?.id, 
      newFilters 
    });
    setFilterParamsState(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    setLastVisible(null);
    setHasMore(true);
  }, [user?.id]);

  const addTask = useCallback(async (title: string) => {
    if (!user) {
      setTaskError('Please log in to add tasks', 'AUTH_REQUIRED');
      return;
    }
    
    tasksHookLogger.info('Adding new task', { 
      userId: user.id, 
      title 
    });
    
    try {
      clearError();
      await createTask(user.id, title);
      tasksHookLogger.info('Task created successfully', { 
        userId: user.id
      });
    } catch (err) {
      setTaskError(
        'Failed to create new task',
        'NETWORK_ERROR',
        { error: err, taskTitle: title }
      );
    }
  }, [user]);

  const removeTask = useCallback(async (taskId: string) => {
    if (!user) {
      setTaskError('Please log in to remove tasks', 'AUTH_REQUIRED');
      return;
    }
    
    tasksHookLogger.info('Removing task', { 
      userId: user.id, 
      taskId 
    });
    
    try {
      clearError();
      await deleteTask(taskId, user.id);
      tasksHookLogger.info('Task removed successfully', { 
        userId: user.id, 
        taskId 
      });
    } catch (err) {
      setTaskError(
        'Failed to remove task',
        'NETWORK_ERROR',
        { error: err, taskId }
      );
    }
  }, [user]);

  const toggleComplete = useCallback(async (taskId: string, completed: boolean) => {
    if (!user) {
      setTaskError('Please log in to update tasks', 'AUTH_REQUIRED');
      return;
    }

    tasksHookLogger.info('Toggling task completion', { 
      userId: user.id, 
      taskId, 
      completed 
    });
    
    try {
      clearError();
      await updateTask(taskId, { completed }, user.id);
      tasksHookLogger.info('Task completion updated successfully', { 
        userId: user.id, 
        taskId, 
        completed 
      });
    } catch (err) {
      setTaskError(
        'Failed to update task status',
        'NETWORK_ERROR',
        { error: err, taskId, completed }
      );
    }
  }, [user]);

  const editTask = useCallback(async (task: Partial<Task> & { id: string }) => {
    if (!user) {
      setTaskError('Please log in to edit tasks', 'AUTH_REQUIRED');
      return;
    }

    tasksHookLogger.info('Editing task', {
      userId: user.id,
      taskId: task.id,
      updates: task
    });

    try {
      clearError();
      const { id: _id, ...patch } = task;
      const firestoreTask = taskPatchToTaskDocument(patch);
      await updateTask(task.id, firestoreTask, user.id);
      tasksHookLogger.info('Task updated successfully', {
        userId: user.id,
        taskId: task.id
      });
    } catch (err) {
      setTaskError(
        'Failed to update task',
        'NETWORK_ERROR',
        { error: err, taskId: task.id, updates: task }
      );
    }
  }, [user]);

  return useMemo(() => ({
    tasks,
    loading,
    error,
    addTask,
    removeTask,
    toggleComplete,
    editTask,
    loadMore,
    isLoadingMore,
    hasMore,
    setView,
    updateFilters
  }), [tasks, loading, error, addTask, removeTask, toggleComplete, editTask, loadMore, isLoadingMore, hasMore, setView, updateFilters]);
}; 