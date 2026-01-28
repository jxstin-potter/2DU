import React, { useState, useEffect, useMemo } from 'react';
import { Container, Box, useTheme } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToTasks } from '../services/tasksService';
import { taskDocumentToTask } from '../utils/taskHelpers';
import { Task, Category, Tag } from '../types';
import TodayView from '../components/task-management/TodayView';
import TaskModal from '../components/modals/TaskModal';
import SearchModal, { SearchCriteria } from '../components/modals/SearchModal';
import { useTaskModal } from '../contexts/TaskModalContext';
import { useSearchModal } from '../contexts/SearchModalContext';
import { createTaskFromData, updateTask, deleteTask } from '../services/tasksService';
import { taskToTaskDocument } from '../utils/taskHelpers';
import { DEFAULT_TAGS } from '../constants/defaultTags';

const Today: React.FC = () => {
  const theme = useTheme();
  const { user, loading: authLoading } = useAuth();
  const { isOpen: isTaskModalOpen, closeModal: closeTaskModal } = useTaskModal();
  const { isOpen: isSearchModalOpen, closeModal: closeSearchModal } = useSearchModal();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>(DEFAULT_TAGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);

  // Subscribe to tasks
  useEffect(() => {
    if (!user?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTasks(
      user.id,
      { completionStatus: 'all', sortBy: 'creationDate', sortOrder: 'desc' },
      (result) => {
        try {
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

    // Load categories and tags
    const loadCategoriesAndTags = async () => {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        
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
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to toggle task status');
    }
  };

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
      const taskDoc = taskToTaskDocument(updates);
      taskDoc.updatedAt = (await import('firebase/firestore')).Timestamp.now();
      
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
      
      const taskDoc = taskToTaskDocument({
        ...taskData,
        userId: user.id,
        completed: false,
        order: tasks.length,
      });
      
      await createTaskFromData(user.id, taskDoc);
      
      setSelectedTask(null);
      closeTaskModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      setError(errorMessage);
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const handleSearch = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search criteria
    if (searchCriteria) {
      filtered = filtered.filter(task => {
        if (searchCriteria.title && searchCriteria.title.trim()) {
          const titleMatch = task.title.toLowerCase().includes(searchCriteria.title.toLowerCase());
          if (!titleMatch) return false;
        }

        if (searchCriteria.description && searchCriteria.description.trim()) {
          const descMatch = task.description?.toLowerCase().includes(searchCriteria.description.toLowerCase());
          if (!descMatch) return false;
        }

        if (searchCriteria.dueDate) {
          const taskDate = task.dueDate ? new Date(task.dueDate) : null;
          if (!taskDate) return false;
          const searchDate = new Date(searchCriteria.dueDate);
          const taskDateStr = taskDate.toDateString();
          const searchDateStr = searchDate.toDateString();
          if (taskDateStr !== searchDateStr) return false;
        }

        if (searchCriteria.priority) {
          if (task.priority !== searchCriteria.priority) return false;
        }

        return true;
      });
    }

    return filtered;
  }, [tasks, searchCriteria]);

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
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%',
    }}>
      <Container 
        maxWidth="md" 
        sx={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ 
          width: '100%',
          maxWidth: theme.breakpoints.values.sm,
        }}>
          <TodayView
            tasks={filteredTasks}
            onTaskAction={{
              toggle: handleTaskToggle,
              delete: handleTaskDelete,
              update: handleTaskUpdate,
              edit: (task: Task) => {
                setSelectedTask(task);
              },
            }}
            onCreateTask={handleCreateTask}
            tags={tags}
            categories={categories}
          />
        </Box>

        {/* Only show TaskModal for editing existing tasks */}
        <TaskModal
          open={isTaskModalOpen && !!selectedTask}
          onClose={() => {
            closeTaskModal();
            setSelectedTask(null);
          }}
          onSubmit={async (taskData) => {
            if (selectedTask?.id) {
              await handleTaskUpdate(selectedTask.id, taskData);
              closeTaskModal();
              setSelectedTask(null);
            }
          }}
          initialTask={selectedTask}
          loading={loading}
        />

        <SearchModal
          open={isSearchModalOpen}
          onClose={closeSearchModal}
          onSearch={handleSearch}
        />
      </Container>
    </Box>
  );
};

export default Today;
