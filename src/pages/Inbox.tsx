import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Container, Box, useTheme, Snackbar, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToTasks } from '../services/tasksService';
import { taskDocumentToTask, taskPatchToTaskDocument } from '../types/firestore';
import { Task } from '../types';
import InboxView from '../components/task-management/InboxView';
import TaskModal from '../components/modals/TaskModal';
import { useTaskModal } from '../contexts/TaskModalContext';
import { createTaskFromData, updateTask, deleteTask } from '../services/tasksService';
import { logger } from '../utils/logger';

const Inbox: React.FC = () => {
  const theme = useTheme();
  const { user, loading: authLoading } = useAuth();
  const { isOpen: isTaskModalOpen, openModal: openTaskModal, closeModal: closeTaskModal } = useTaskModal();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [justAddedTaskId, setJustAddedTaskId] = useState<string | null>(null);
  const [completedSnackbarOpen, setCompletedSnackbarOpen] = useState(false);
  const [completedTaskIdForUndo, setCompletedTaskIdForUndo] = useState<string | null>(null);
  const lastAppliedTaskCountRef = useRef<number>(0);
  const tasksRef = useRef<Task[]>([]);
  tasksRef.current = tasks;

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
      { completionStatus: 'all', sortBy: 'creationDate', sortOrder: 'desc' },
      (result) => {
        try {
          const count = result.tasks.length;
          if (count === 0 && lastAppliedTaskCountRef.current > 0) return;
          lastAppliedTaskCountRef.current = count;
          const convertedTasks = result.tasks.map((taskDoc: any) => {
            try {
              return taskDocumentToTask(taskDoc);
            } catch {
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
        } catch {
          setError('Failed to process tasks');
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  const handleTaskToggle = useCallback(async (taskId: string) => {
    if (!user?.id) {
      setError('Please log in to toggle tasks');
      return;
    }
    try {
      const task = tasksRef.current.find((t) => t.id === taskId);
      if (!task) return;
      const completed = !task.completed;
      const taskDoc = taskPatchToTaskDocument({ completed });
      await updateTask(taskId, taskDoc, user.id);
      if (completed) {
        setCompletedTaskIdForUndo(taskId);
        setCompletedSnackbarOpen(true);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to toggle task status');
    }
  }, [user?.id]);

  const handleUndoComplete = useCallback(() => {
    if (!completedTaskIdForUndo) return;
    handleTaskToggle(completedTaskIdForUndo);
    setCompletedSnackbarOpen(false);
    setCompletedTaskIdForUndo(null);
  }, [completedTaskIdForUndo, handleTaskToggle]);

  const handleCloseCompletedSnackbar = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setCompletedSnackbarOpen(false);
    setCompletedTaskIdForUndo(null);
  }, []);

  const handleTaskDelete = useCallback(async (taskId: string) => {
    if (!user?.id) return;
    try {
      await deleteTask(taskId, user.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }, [user?.id]);

  const handleTaskUpdate = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!user?.id) return;
    try {
      const taskDoc = taskPatchToTaskDocument(updates);
      await updateTask(taskId, taskDoc, user.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update task');
    }
  }, [user?.id]);

  const handleTaskEdit = useCallback((task: Task) => {
    setSelectedTask(task);
    openTaskModal();
  }, [openTaskModal]);

  const handleCreateTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      if (authLoading) throw new Error('Please wait for authentication to complete');
      if (!user?.id) throw new Error('Please log in to create tasks');

      const taskDoc = taskPatchToTaskDocument({
        ...taskData,
        userId: user.id,
        completed: false,
        order: tasksRef.current.length,
      });

      const newTaskId = await createTaskFromData(user.id, taskDoc);
      setJustAddedTaskId(newTaskId);
      setTimeout(() => setJustAddedTaskId(null), 600);
      setSelectedTask(null);
      closeTaskModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      setError(errorMessage);
      logger.error('Failed to create task', { action: 'createTask' }, error);
      throw error;
    }
  }, [authLoading, user?.id, closeTaskModal]);

  const onTaskAction = useMemo(
    () => ({
      toggle: handleTaskToggle,
      delete: handleTaskDelete,
      update: handleTaskUpdate,
      edit: handleTaskEdit,
    }),
    [handleTaskToggle, handleTaskDelete, handleTaskUpdate, handleTaskEdit]
  );

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
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" />
      </Container>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        pl: 0,
        ml: -1,
        mt: -0.5,
      }}
    >
      <Container
        maxWidth="md"
        disableGutters
        sx={{
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: theme.breakpoints.values.sm }}>
          <InboxView
            tasks={tasks}
            loading={loading}
            justAddedTaskId={justAddedTaskId}
            onTaskAction={onTaskAction}
            onCreateTask={handleCreateTask}
          />
        </Box>

        <TaskModal
          open={isTaskModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          initialTask={selectedTask}
          loading={loading}
        />

        <Snackbar
          open={completedSnackbarOpen}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          autoHideDuration={15000}
          onClose={handleCloseCompletedSnackbar}
          message="1 task completed"
          action={
            <>
              <Button color="inherit" size="small" onClick={handleUndoComplete}>
                Undo
              </Button>
              <IconButton size="small" aria-label="Close" color="inherit" onClick={() => handleCloseCompletedSnackbar()}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
          sx={{ left: 16, bottom: 16 }}
        />
      </Container>
    </Box>
  );
};

export default Inbox;
