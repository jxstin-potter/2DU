import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Container,
  Button,
} from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useAuth } from '../../contexts/AuthContext';
import { useTaskModal } from '../../contexts/TaskModalContext';
import { useSearchModal } from '../../contexts/SearchModalContext';
import { subscribeToTasks, createTaskFromData, updateTask, deleteTask } from '../../services/tasksService';
import { taskDocumentToTask, taskToTaskDocument } from '../../utils/taskHelpers';
import TaskModal from '../modals/TaskModal';
import SearchModal, { SearchCriteria } from '../modals/SearchModal';
import { Task, Category, Tag, Comment } from '../../types';
import AddIcon from '@mui/icons-material/Add';
import TaskList from './TaskList';
import { DEFAULT_TAGS } from '../../constants/defaultTags';

const TaskManager: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isOpen: isTaskModalOpen, openModal: openTaskModal, closeModal: closeTaskModal } = useTaskModal();
  const { isOpen: isSearchModalOpen, closeModal: closeSearchModal } = useSearchModal();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>(DEFAULT_TAGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);

  // Subscribe to tasks using real-time listener (simplified approach)
  useEffect(() => {
    if (!user?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Use real-time subscription - automatically updates when tasks change
    const unsubscribe = subscribeToTasks(
      user.id,
      { completionStatus: 'all', sortBy: 'creationDate', sortOrder: 'desc' },
      (result) => {
        try {
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
  }, [user?.id]);

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
    if (!result.destination || !user?.id) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order of all tasks
    const updatedTasks = items.map((task, index) => ({
      ...task,
      order: index
    }));

    setTasks(updatedTasks);

    // Update the order in the database
    try {
      const { doc, updateDoc, collection } = await import('firebase/firestore');
      const { db } = await import('../../firebase');
      
      for (const task of updatedTasks) {
        const taskRef = doc(collection(db, 'tasks'), task.id);
        await updateDoc(taskRef, { order: task.order });
      }
    } catch (error) {
      setError('Failed to update task order');
    }
  };

  const handleSearch = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(task => task.categoryId === selectedCategory);
    }

    // Apply search criteria
    if (searchCriteria) {
      filtered = filtered.filter(task => {
        // Title filter (case-insensitive partial match)
        if (searchCriteria.title && searchCriteria.title.trim()) {
          const titleMatch = task.title.toLowerCase().includes(searchCriteria.title.toLowerCase());
          if (!titleMatch) return false;
        }

        // Description filter (case-insensitive pa9rtial match)
        if (searchCriteria.description && searchCriteria.description.trim()) {
          const descMatch = task.description?.toLowerCase().includes(searchCriteria.description.toLowerCase());
          if (!descMatch) return false;
        }

        // Due date filter (exact date match)
        if (searchCriteria.dueDate) {
          const taskDate = task.dueDate ? new Date(task.dueDate) : null;
          if (!taskDate) return false;
          const searchDate = new Date(searchCriteria.dueDate);
          const taskDateStr = taskDate.toDateString();
          const searchDateStr = searchDate.toDateString();
          if (taskDateStr !== searchDateStr) return false;
        }

        // Priority filter (exact match)
        if (searchCriteria.priority) {
          if (task.priority !== searchCriteria.priority) return false;
        }

        return true;
      });
    }

    return filtered;
  }, [tasks, selectedCategory, searchCriteria]);

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
      
      // Convert Task to TaskDocument format using helper
      const taskDoc = taskToTaskDocument({
        ...taskData,
        userId: user.id,
        completed: false,
        order: tasks.length,
      });
      
      // Use simplified service function
      await createTaskFromData(user.id, taskDoc);
      
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
            onTaskAction={{
              toggle: handleTaskToggle,
              delete: handleTaskDelete,
              update: async (taskId: string, updates: Partial<Task>) => {
                await handleTaskUpdate(taskId, updates);
              },
              edit: async (task: Task) => {
                setSelectedTask(task);
              },
            }}
            tags={tags}
            categories={categories}
          />
        </DragDropContext>

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

      <SearchModal
        open={isSearchModalOpen}
        onClose={closeSearchModal}
        onSearch={handleSearch}
      />
    </Container>
  );
};

export default TaskManager; 