import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  CircularProgress,
  Container,
} from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useAuth } from '../../contexts/AuthContext';
import { useTaskModal } from '../../contexts/TaskModalContext';
import { subscribeToTasks, createTaskFromData, updateTask, deleteTask, updateTaskOrder } from '../../services/tasksService';
import { taskDocumentToTask, taskPatchToTaskDocument } from '../../types/firestore';
import { computeNewOrder } from '../../utils/taskHelpers';
import TaskModal from '../modals/TaskModal';
import { Task } from '../../types';
import TaskList from './TaskList';
import { logger } from '../../utils/logger';

const taskManagerLogger = logger.component('TaskManager');

export type SortMode = 'manual' | 'dueDate' | 'title' | 'createdAt';

const TaskManager: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isOpen: isTaskModalOpen, openModal: openTaskModal, closeModal: closeTaskModal } = useTaskModal();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [justAddedTaskId, setJustAddedTaskId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('createdAt');
  const lastAppliedTaskCountRef = useRef<number>(0);
  const tasksRef = useRef<Task[]>([]);
  tasksRef.current = tasks;

  const subscriptionSortBy = sortMode === 'manual' ? 'manual' : sortMode === 'dueDate' ? 'dueDate' : 'creationDate';

  // Subscribe to tasks using real-time listener; sort mode drives query sort
  useEffect(() => {
    if (!user?.id) {
      setTasks([]);
      setLoading(false);
      lastAppliedTaskCountRef.current = 0;
      return;
    }

    setLoading(true);
    setError(null);
    lastAppliedTaskCountRef.current = 0;

    const unsubscribe = subscribeToTasks(
      user.id,
      { completionStatus: 'all', sortBy: subscriptionSortBy, sortOrder: 'desc' },
      (result) => {
        try {
          const count = result.tasks.length;
          if (count === 0 && lastAppliedTaskCountRef.current > 0) {
            return;
          }
          lastAppliedTaskCountRef.current = count;
          // Convert TaskDocument to Task using helper (with error handling per task)
          const convertedTasks = result.tasks.map((taskDoc: any) => {
            try {
              return taskDocumentToTask(taskDoc);
            } catch (taskError) {
              // Return a minimal valid task if conversion fails
              return {
                id: taskDoc.id || '',
                title: taskDoc.title || 'Untitled Task',
                completed: taskDoc.completed ?? false,
                userId: taskDoc.userId || '',
                createdAt: new Date(),
                updatedAt: new Date(),
              } as Task;
            }
          });
          setTasks(convertedTasks);
          setLoading(false);
          setError(null);
        } catch (error) {
          setError('Failed to process tasks');
          setLoading(false);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.id, subscriptionSortBy]);

  const handleTaskSelect = useCallback((task: Task) => {
    setSelectedTask(task);
    openTaskModal();
  }, [openTaskModal]);

  const handleTaskUpdate = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!user?.id) {
      setError('Please log in to update tasks');
      return;
    }

    try {
      // Convert Task updates to TaskDocument format
      const taskDoc = taskPatchToTaskDocument(updates);
      
      await updateTask(taskId, taskDoc, user.id);
      // Tasks will automatically update via the real-time subscription
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update task');
    }
  }, [user?.id]);

  const handleTaskDelete = useCallback(async (taskId: string) => {
    if (!user?.id) {
      setError('Please log in to delete tasks');
      return;
    }

    try {
      await deleteTask(taskId, user.id);
      // Tasks will automatically update via the real-time subscription
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }, [user?.id]);

  const handleTaskToggle = useCallback(async (taskId: string) => {
    if (!user?.id) {
      setError('Please log in to toggle tasks');
      return;
    }

    try {
      const task = tasksRef.current.find(t => t.id === taskId);
      if (!task) return;

      const completed = !task.completed;
      const taskDoc = taskPatchToTaskDocument({ completed });
      
      await updateTask(taskId, taskDoc, user.id);
      // Tasks will automatically update via the real-time subscription
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to toggle task status');
    }
  }, [user?.id]);

  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination || !user?.id || sortMode !== 'manual') return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const displayTasks = tasksRef.current;
    const movedTask = displayTasks[source.index];
    if (!movedTask) return;

    const before = displayTasks[destination.index - 1];
    const after = displayTasks[destination.index + 1];
    const newOrder = computeNewOrder(before, after);

    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === movedTask.id ? { ...t, order: newOrder } : t));
      return [...updated].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
    });

    try {
      await updateTaskOrder(movedTask.id, newOrder, user.id);
    } catch (error) {
      setError('Failed to update task order');
    }
  }, [user?.id, sortMode]);

  const filteredTasks = tasks;

  const handleCreateTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      if (authLoading) {
        throw new Error('Please wait for authentication to complete');
      }
      if (!user?.id) {
        throw new Error('Please log in to create tasks');
      }
      
      const currentTasks = tasksRef.current;
      const maxOrder = currentTasks.length === 0 ? 0 : Math.max(...currentTasks.map((t) => t.order ?? 0), 0);
      const taskDoc = taskPatchToTaskDocument({
        ...taskData,
        userId: user.id,
        completed: false,
        order: maxOrder + 1,
      });
      
      // Use simplified service function
      const newTaskId = await createTaskFromData(user.id, taskDoc);
      setJustAddedTaskId(newTaskId);
      setTimeout(() => setJustAddedTaskId(null), 600);
      
      // Tasks will automatically update via the real-time subscription
      // Close the modal after successful creation
      setSelectedTask(null);
      closeTaskModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      setError(errorMessage);
      taskManagerLogger.error('Failed to create task', { error });
      // Re-throw the error so the caller can handle it
      throw error;
    }
  }, [authLoading, user?.id, closeTaskModal]);

  const onTaskAction = useMemo(() => ({
    toggle: handleTaskToggle,
    delete: handleTaskDelete,
    update: handleTaskUpdate,
    edit: async (task: Task) => { handleTaskSelect(task); },
  }), [handleTaskToggle, handleTaskDelete, handleTaskUpdate, handleTaskSelect]);

  const handleModalClose = useCallback(() => {
    closeTaskModal();
    setSelectedTask(null);
  }, [closeTaskModal]);

  const handleModalSubmit = useMemo(() => {
    if (selectedTask) {
      return async (taskData: Partial<Task>) => {
        if (selectedTask.id) {
          await handleTaskUpdate(selectedTask.id, taskData);
          closeTaskModal();
          setSelectedTask(null);
        }
      };
    }
    return handleCreateTask;
  }, [selectedTask, handleTaskUpdate, closeTaskModal, handleCreateTask]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          justAddedTaskId={justAddedTaskId}
          sortBy={sortMode}
          onSortChange={setSortMode}
          draggable={sortMode === 'manual'}
          onTaskAction={onTaskAction}
          onCreateTask={handleCreateTask}
        />
      </DragDropContext>

      {/* Show TaskModal for both creating and editing tasks */}
      <TaskModal
        open={isTaskModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialTask={selectedTask}
        loading={loading}
      />
    </Container>
  );
};

export default TaskManager; 