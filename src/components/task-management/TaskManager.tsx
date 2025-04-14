import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Paper,
  Container,
} from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import TaskView from './TaskView';
import CategoryManager from './CategoryManager';
import { Task, Category, Tag, Comment } from '../../types';
import SettingsIcon from '@mui/icons-material/Settings';
import TaskList from './TaskList';
import CalendarView from './CalendarView';

// Default tags if none are found in the database
const DEFAULT_TAGS: Tag[] = [
  { id: '1', name: 'Work', color: '#4CAF50' },
  { id: '2', name: 'Personal', color: '#2196F3' },
  { id: '3', name: 'Shopping', color: '#FF9800' },
  { id: '4', name: 'Urgent', color: '#f44336' },
  { id: '5', name: 'Important', color: '#9c27b0' },
];

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>(DEFAULT_TAGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);

  // Load tasks, categories, and tags from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load tasks
        const tasksQuery = query(collection(db, 'tasks'), orderBy('order'));
        const tasksSnapshot = await getDocs(tasksQuery);
        const loadedTasks = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];
        setTasks(loadedTasks);

        // Load categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const loadedCategories = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(loadedCategories);

        // Load tags
        const tagsSnapshot = await getDocs(collection(db, 'tags'));
        if (!tagsSnapshot.empty) {
          const loadedTags = tagsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Tag[];
          setTags(loadedTags);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setIsTaskViewOpen(true);
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
      
      // Update selected task if it's the one being edited
      if (selectedTask?.id === taskId) {
        setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleTaskToggle = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const taskRef = doc(db, 'tasks', taskId);
      const completed = !task.completed;
      await updateDoc(taskRef, { completed, updatedAt: new Date() });
      
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, completed } : t
        )
      );
    } catch (error) {
      console.error('Error toggling task:', error);
      setError('Failed to toggle task status');
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

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
    updatedTasks.forEach(async (task) => {
      try {
        const taskRef = doc(db, 'tasks', task.id);
        await updateDoc(taskRef, { order: task.order });
      } catch (error) {
        console.error('Error updating task order:', error);
        setError('Failed to update task order');
      }
    });
  };

  const filteredTasks = selectedCategory
    ? tasks.filter(task => task.categoryId === selectedCategory)
    : tasks;

  const handleAddComment = async (taskId: string, comment: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const newComment: Comment = {
        id: Date.now().toString(),
        text: comment,
        author: 'Current User', // TODO: Replace with actual user
        timestamp: new Date()
      };

      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedComments = [...(task.comments || []), newComment];
      await updateDoc(taskRef, { 
        comments: updatedComments,
        updatedAt: new Date()
      });

      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, comments: updatedComments } : t
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    }
  };

  const handleAddSubtask = async (taskId: string, subtaskTitle: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const newSubtask = {
        id: Date.now().toString(),
        title: subtaskTitle,
        completed: false
      };

      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedSubtasks = [...(task.subtasks || []), newSubtask];
      await updateDoc(taskRef, { 
        subtasks: updatedSubtasks,
        updatedAt: new Date()
      });

      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, subtasks: updatedSubtasks } : t
        )
      );
    } catch (error) {
      console.error('Error adding subtask:', error);
      setError('Failed to add subtask');
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedSubtasks = task.subtasks?.map(subtask =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      );

      await updateDoc(taskRef, { 
        subtasks: updatedSubtasks,
        updatedAt: new Date()
      });

      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, subtasks: updatedSubtasks } : t
        )
      );
    } catch (error) {
      console.error('Error toggling subtask:', error);
      setError('Failed to toggle subtask');
    }
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
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Task Manager
          </Typography>
          <Box>
            <IconButton
              onClick={() => setIsCategoryManagerOpen(true)}
              color="primary"
              sx={{ mr: 1 }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        <Paper sx={{ mb: 2 }}>
          <Tabs
            value={view}
            onChange={(_, newValue) => setView(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="List View" value="list" />
            <Tab label="Calendar View" value="calendar" />
          </Tabs>
        </Paper>

        <DragDropContext onDragEnd={handleDragEnd}>
          {view === 'list' ? (
            <TaskList
              tasks={filteredTasks}
              loading={loading}
              error={error}
              onTaskToggle={handleTaskToggle}
              onTaskDelete={handleTaskDelete}
              onTaskEdit={(task) => {
                setSelectedTask(task);
                setIsTaskViewOpen(true);
              }}
              tags={tags}
              categories={categories}
            />
          ) : (
            <CalendarView
              tasks={filteredTasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onTaskToggle={handleTaskToggle}
              onTaskSelect={handleTaskSelect}
            />
          )}
        </DragDropContext>
      </Box>

      <TaskView
        open={isTaskViewOpen}
        onClose={() => {
          setIsTaskViewOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onTaskUpdate={handleTaskUpdate}
        onAddComment={handleAddComment}
        onAddSubtask={handleAddSubtask}
        onToggleSubtask={handleToggleSubtask}
        tags={tags}
        categories={categories}
      />

      <CategoryManager
        open={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onUpdate={setCategories}
      />
    </Container>
  );
};

export default TaskManager; 