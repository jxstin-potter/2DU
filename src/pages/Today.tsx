import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Box, useTheme, Snackbar, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToTasks } from '../services/tasksService';
import { taskDocumentToTask, taskPatchToTaskDocument } from '../types/firestore';
import { Task } from '../types';
import TodayView from '../components/task-management/TodayView';
import TaskModal from '../components/modals/TaskModal';
import { useTaskModal } from '../contexts/TaskModalContext';
import { createTaskFromData, updateTask, deleteTask } from '../services/tasksService';

const Today: React.FC = () => {
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

  // Subscribe to tasks
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
          if (count === 0 && lastAppliedTaskCountRef.current > 0) {
            return;
          }
          lastAppliedTaskCountRef.current = count;
          const convertedTasks = result.tasks.map((taskDoc: any) => {
            try {
              return taskDocumentToTask(taskDoc);
            } catch (taskError) {
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
  }, [user?.id]);

  const handleTaskToggle = useCallback(async (taskId: string) => {
    if (!user?.id) {
      setError('Please log in to toggle tasks');
      return;
    }

    try {
      const task = tasks.find(t => t.id === taskId);
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
  }, [tasks, user?.id]);

  const handleUndoComplete = useCallback(() => {
    if (completedTaskIdForUndo) {
      handleTaskToggle(completedTaskIdForUndo);
      setCompletedSnackbarOpen(false);
      setCompletedTaskIdForUndo(null);
    }
  }, [completedTaskIdForUndo, handleTaskToggle]);

  const handleCloseCompletedSnackbar = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setCompletedSnackbarOpen(false);
    setCompletedTaskIdForUndo(null);
  }, []);

  const handleTaskDelete = async (taskId: string) => {
    if (!user?.id) {
      setError('Please log in to delete tasks');
      return;
    }

    try {
      await deleteTask(taskId, user.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    if (!user?.id) {
      setError('Please log in to update tasks');
      return;
    }

    try {
      const taskDoc = taskPatchToTaskDocument(updates);
      
      await updateTask(taskId, taskDoc, user.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update task');
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      if (authLoading) {
        throw new Error('Please wait for authentication to complete');
      }
      if (!user?.id) {
        throw new Error('Please log in to create tasks');
      }
      
      const taskDoc = taskPatchToTaskDocument({
        ...taskData,
        userId: user.id,
        completed: false,
        order: tasks.length,
      });
      
      const newTaskId = await createTaskFromData(user.id, taskDoc);
      setJustAddedTaskId(newTaskId);
      setTimeout(() => setJustAddedTaskId(null), 600);
      
      setSelectedTask(null);
      closeTaskModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      setError(errorMessage);
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          {/* Loading will be handled by TodayView */}
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '100%',
      pl: 0,
      ml: -1,
      mt: -0.5,
    }}>
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
        <Box sx={{ 
          width: '100%',
          maxWidth: theme.breakpoints.values.sm,
        }}>
          <TodayView
            tasks={tasks}
            justAddedTaskId={justAddedTaskId}
            onTaskAction={{
              toggle: handleTaskToggle,
              delete: handleTaskDelete,
              update: handleTaskUpdate,
              edit: (task: Task) => {
                setSelectedTask(task);
                openTaskModal();
              },
            }}
            onCreateTask={handleCreateTask}
          />
        </Box>

        {/* Show TaskModal for both creating and editing tasks */}
        <TaskModal
          open={isTaskModalOpen}
          onClose={() => {
            closeTaskModal();
            setSelectedTask(null);
          }}
          onSubmit={selectedTask ? 
            async (taskData) => {
              if (selectedTask.id) {
                await handleTaskUpdate(selectedTask.id, taskData);
                closeTaskModal();
                setSelectedTask(null);
              }
            } : 
            handleCreateTask
          }
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

export default Today;
