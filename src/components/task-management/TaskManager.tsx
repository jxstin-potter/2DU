import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  CircularProgress,
  Container,
} from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useAuth } from '../../contexts/AuthContext';
import { useTaskModal } from '../../contexts/TaskModalContext';
import { subscribeToTasks, createTaskFromData, updateTask, deleteTask, updateTaskOrder } from '../../services/tasksService';
import { taskDocumentToTask, taskToTaskDocument, computeNewOrder } from '../../utils/taskHelpers';
import TaskModal from '../modals/TaskModal';
import { Task, Category, Tag } from '../../types';
import TaskList from './TaskList';
import { DEFAULT_TAGS } from '../../constants/defaultTags';

export type SortMode = 'manual' | 'dueDate' | 'title' | 'createdAt';

const TaskManager: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isOpen: isTaskModalOpen, openModal: openTaskModal, closeModal: closeTaskModal } = useTaskModal();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>(DEFAULT_TAGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [justAddedTaskId, setJustAddedTaskId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('createdAt');
  const lastAppliedTaskCountRef = useRef<number>(0);

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

    // Load categories and tags (one-time load)
    const loadCategoriesAndTags = async () => {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('../../firebase');
        
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const loadedCategories = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(loadedCategories);

        const tagsSnapshot = await getDocs(collection(db, 'tags'));
        if (!tagsSnapshot.empty) {
          const loadedTags = tagsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Tag[];
          setTags(loadedTags);
        }
      } catch (error) {
        console.error('Failed to load categories/tags:', error);
      }
    };

    loadCategoriesAndTags();

    return () => {
      unsubscribe();
    };
  }, [user?.id, subscriptionSortBy]);

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    // For now, we'll just open the modal for editing too
    openTaskModal();
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    if (!user?.id) {
      setError('Please log in to update tasks');
      return;
    }

    try {
      // Convert Task updates to TaskDocument format
      const taskDoc = taskToTaskDocument(updates);
      taskDoc.updatedAt = (await import('firebase/firestore')).Timestamp.now();
      
      await updateTask(taskId, taskDoc, user.id);
      // Tasks will automatically update via the real-time subscription
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId: string) => {
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
  };

  const handleTaskToggle = async (taskId: string) => {
    if (!user?.id) {
      setError('Please log in to toggle tasks');
      return;
    }

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const completed = !task.completed;
      const taskDoc = taskToTaskDocument({ completed });
      const { Timestamp } = await import('firebase/firestore');
      taskDoc.updatedAt = Timestamp.now();
      
      await updateTask(taskId, taskDoc, user.id);
      // Tasks will automatically update via the real-time subscription
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to toggle task status');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !user?.id || sortMode !== 'manual') return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const displayTasks = filteredTasks;
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
  };

  const filteredTasks = useMemo(() => {
    if (!selectedCategory) return tasks;
    return tasks.filter((task) => task.categoryId === selectedCategory);
  }, [tasks, selectedCategory]);

  const handleAddComment = async (taskId: string, comment: string) => {
    if (!user?.id) {
      setError('Please log in to add comments');
      return;
    }

    try {
      const { doc, updateDoc, Timestamp } = await import('firebase/firestore');
      const { db } = await import('../../firebase');
      const { collection } = await import('firebase/firestore');
      
      const taskRef = doc(collection(db, 'tasks'), taskId);
      const newComment = {
        id: Date.now().toString(),
        userId: user.id,
        text: comment,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedComments = [...(task.comments || []), {
        ...newComment,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      
      await updateTask(taskId, { 
        comments: updatedComments.map(c => ({
          ...c,
          createdAt: Timestamp.fromDate(c.createdAt),
          updatedAt: Timestamp.fromDate(c.updatedAt)
        }))
      }, user.id);
      // Tasks will automatically update via the real-time subscription
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add comment');
    }
  };

  const handleAddSubtask = async (taskId: string, subtaskTitle: string) => {
    if (!user?.id) {
      setError('Please log in to add subtasks');
      return;
    }

    try {
      const { Timestamp } = await import('firebase/firestore');
      
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newSubtask = {
        id: Date.now().toString(),
        title: subtaskTitle,
        completed: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const updatedSubtasks = [...(task.subtasks || []), {
        ...newSubtask,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      
      await updateTask(taskId, { 
        subtasks: updatedSubtasks.map(s => ({
          ...s,
          createdAt: Timestamp.fromDate(s.createdAt),
          updatedAt: Timestamp.fromDate(s.updatedAt)
        }))
      }, user.id);
      // Tasks will automatically update via the real-time subscription
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add subtask');
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    if (!user?.id) {
      setError('Please log in to toggle subtasks');
      return;
    }

    try {
      const { Timestamp } = await import('firebase/firestore');
      
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedSubtasks = task.subtasks?.map(subtask =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      );

      await updateTask(taskId, { 
        subtasks: updatedSubtasks?.map(s => ({
          ...s,
          createdAt: s.createdAt instanceof Date ? Timestamp.fromDate(s.createdAt) : s.createdAt,
          updatedAt: Timestamp.now()
        }))
      }, user.id);
      // Tasks will automatically update via the real-time subscription
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to toggle subtask');
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
      
      const maxOrder = tasks.length === 0 ? 0 : Math.max(...tasks.map((t) => t.order ?? 0), 0);
      const taskDoc = taskToTaskDocument({
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
      console.error('Failed to create task:', error);
      // Re-throw the error so the caller can handle it
      throw error;
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
  };

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
          onTaskAction={{
            toggle: handleTaskToggle,
            delete: handleTaskDelete,
            update: async (taskId: string, updates: Partial<Task>) => {
              await handleTaskUpdate(taskId, updates);
            },
            edit: async (task: Task) => { handleTaskSelect(task); },
          }}
          onCreateTask={handleCreateTask}
          tags={tags}
          categories={categories}
        />
      </DragDropContext>

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
    </Container>
  );
};

export default TaskManager; 