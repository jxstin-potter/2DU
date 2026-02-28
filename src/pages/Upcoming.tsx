import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Container, IconButton, List, Snackbar, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { startOfDay } from 'date-fns';

import { useAuth } from '../contexts/AuthContext';
import { useTaskModal } from '../contexts/TaskModalContext';

import EmptyState from '../components/ui/EmptyState';
import TaskItem from '../components/task-management/TaskItem';
import TaskModal from '../components/modals/TaskModal';
import TaskDetailModal from '../components/modals/TaskDetailModal';

import { buildUpcomingSelections } from '../utils/upcomingSelectors';
import { createTaskFromData, deleteTask, subscribeToTasks, updateTask } from '../services/tasksService';
import { taskDocumentToTask, taskPatchToTaskDocument } from '../types/firestore';
import type { Task } from '../types';
import { logger } from '../utils/logger';

const Upcoming: React.FC = () => {
  const theme = useTheme();
  const { user, loading: authLoading } = useAuth();
  const { isOpen: isTaskModalOpen, openModal: openTaskModal, closeModal: closeTaskModal } = useTaskModal();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [_justAddedTaskId, setJustAddedTaskId] = useState<string | null>(null);
  const [completedSnackbarOpen, setCompletedSnackbarOpen] = useState(false);
  const [completedTaskIdForUndo, setCompletedTaskIdForUndo] = useState<string | null>(null);
  const lastAppliedTaskCountRef = useRef<number>(0);

  // Subscribe to tasks (keep query index-safe; do view filtering in-memory).
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
          // Prevent a brief "empty flash" on some snapshots.
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
          // Only clear loading when we have a server snapshot; avoids "No upcoming tasks" flash from cache/initial empty snapshot
          if (result.fromServer !== false) {
            setLoading(false);
          }
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
      const task = tasks.find((t) => t.id === taskId);
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
    if (!user?.id) {
      setError('Please log in to delete tasks');
      return;
    }

    try {
      await deleteTask(taskId, user.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }, [user?.id]);

  const handleTaskUpdate = useCallback(async (taskId: string, updates: Partial<Task>) => {
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
  }, [user?.id]);

  const handleCreateTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      if (authLoading) throw new Error('Please wait for authentication to complete');
      if (!user?.id) throw new Error('Please log in to create tasks');

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
      logger.error('Failed to create task', { action: 'createTask' }, error);
      throw error;
    }
  }, [authLoading, closeTaskModal, tasks.length, user?.id]);

  const selections = useMemo(() => {
    // Only show upcoming-related tasks: active + due date set.
    const activeDue = tasks.filter((t) => !t.completed && t.dueDate != null);
    return buildUpcomingSelections(activeDue, {
      focusedMonth: new Date(),
      // Upcoming view should start today (date-only).
      startDate: startOfDay(new Date()),
      includeEmptyDays: false,
    });
  }, [tasks]);

  const hasAnyUpcomingContent = selections.some((s) => s.tasks.length > 0);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        px: { xs: 2, sm: 0 },
        ml: { xs: 0, sm: -1 },
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
        <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: theme.breakpoints.values.sm } }}>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: theme.typography.fontWeightBold,
                mb: 0.5,
              }}
            >
              Upcoming
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tasks with due dates, grouped by day.
            </Typography>
          </Box>

          {!loading && !hasAnyUpcomingContent ? (
            <EmptyState type="upcoming" onCreateTask={() => openTaskModal()} />
          ) : (
            selections.map((selection) => (
              <Box key={selection.key} id={selection.anchorId} sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    fontSize: theme.typography.body1.fontSize,
                    mb: 1.5,
                    color: 'text.secondary',
                  }}
                >
                  {selection.title}
                </Typography>

                {selection.tasks.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    No tasks
                  </Typography>
                ) : (
                  <List
                    sx={{
                      py: 0,
                    }}
                  >
                    {selection.tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={() => handleTaskToggle(task.id)}
                        onDelete={() => handleTaskDelete(task.id)}
                        onEdit={() => {
                          setSelectedTask(task);
                          openTaskModal();
                        }}
                        onUpdate={handleTaskUpdate}
                        isActionInProgress={false}
                      />
                    ))}
                  </List>
                )}
              </Box>
            ))
          )}
        </Box>

        {selectedTask ? (
          <TaskDetailModal
            open={isTaskModalOpen}
            onClose={() => {
              closeTaskModal();
              setSelectedTask(null);
            }}
            task={selectedTask}
            onUpdate={handleTaskUpdate}
            onToggleComplete={handleTaskToggle}
          />
        ) : (
          <TaskModal
            open={isTaskModalOpen}
            onClose={() => {
              closeTaskModal();
              setSelectedTask(null);
            }}
            onSubmit={handleCreateTask}
            initialTask={null}
            loading={loading}
          />
        )}

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
              <IconButton
                size="small"
                aria-label="Close"
                color="inherit"
                onClick={() => handleCloseCompletedSnackbar()}
              >
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

export default Upcoming;

