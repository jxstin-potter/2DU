import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup, Typography, CircularProgress, Tabs, Tab, IconButton } from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import ShareTaskModal from './ShareTaskModal';
import Calendar from './Calendar';
import CategoryManager from './CategoryManager';
import { Task, Category, Tag, SharedUser } from '../types';
import SettingsIcon from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import EnhancedTaskList from './EnhancedTaskList';
import CalendarView from './CalendarView';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load tasks, categories, and tags from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load categories
        const categoriesCollection = collection(db, 'categories');
        const categoriesQuery = query(categoriesCollection, orderBy('order'));
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const loadedCategories = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Category));
        setCategories(loadedCategories);

        // Load tags
        const tagsCollection = collection(db, 'tags');
        const tagsSnapshot = await getDocs(tagsCollection);
        const loadedTags = tagsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Tag));
        
        // Only use default tags if no tags are found in the database
        if (loadedTags.length > 0) {
          setTags(loadedTags);
        }

        // Load tasks
        const tasksCollection = collection(db, 'tasks');
        const tasksQuery = query(tasksCollection, orderBy('order'));
        const tasksSnapshot = await getDocs(tasksQuery);
        const loadedTasks = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Task));
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addTask = async (newTask: Omit<Task, 'id' | 'order'>) => {
    try {
      setError(null);
      
      if (!newTask.title.trim()) {
        setError('Title is required');
        return;
      }
      
      const order = tasks.length;
      
      const taskData: Omit<Task, 'id'> = {
        ...newTask,
        order,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: newTask.status || 'todo',
        tags: newTask.tags || [],
        category: newTask.category || '',
        categoryId: newTask.categoryId || newTask.category || '',
        subtasks: (newTask.subtasks || []).map(subtask => ({
          ...subtask,
          order: subtask.order || 0
        })),
        attachments: (newTask.attachments || []).map(attachment => ({
          ...attachment,
          uploadedAt: new Date()
        })),
        completed: false,
      };
      
      const tasksCollection = collection(db, 'tasks');
      const docRef = await addDoc(tasksCollection, taskData);
      
      const newTaskWithId: Task = { ...taskData, id: docRef.id };
      setTasks(prevTasks => [...prevTasks, newTaskWithId]);
      
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task');
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      await updateDoc(taskRef, updateData);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
      );
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    await handleTaskUpdate(taskId, updates);
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      // Add micro-interaction feedback
      const taskElement = document.getElementById(`task-${taskId}`);
      if (taskElement) {
        taskElement.classList.add('animate-status-change');
        setTimeout(() => {
          taskElement.classList.remove('animate-status-change');
        }, 500);
      }
      
      await handleTaskUpdate(taskId, { completed: !task.completed });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Add micro-interaction feedback
      const taskElement = document.getElementById(`task-${taskId}`);
      if (taskElement) {
        taskElement.classList.add('animate-shake');
        setTimeout(async () => {
          taskElement.classList.remove('animate-shake');
          await deleteDoc(doc(db, 'tasks', taskId));
          setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        }, 500);
      } else {
        await deleteDoc(doc(db, 'tasks', taskId));
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(tasks);
      const [reorderedItem] = items.splice(sourceIndex, 1);
      items.splice(destinationIndex, 0, reorderedItem);

      setTasks(items);

      try {
        const batch = items.map((task, index) => {
          const taskRef = doc(db, 'tasks', task.id);
          return updateDoc(taskRef, { order: index });
        });
        await Promise.all(batch);
      } catch (error) {
        console.error('Error updating task order:', error);
        setError('Failed to update task order');
        // Reload tasks to ensure correct order
        const tasksCollection = collection(db, 'tasks');
        const tasksQuery = query(tasksCollection, orderBy('order'));
        const querySnapshot = await getDocs(tasksQuery);
        const loadedTasks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Task));
        setTasks(loadedTasks);
      }
    }
  };

  const handleShareTask = async (taskId: string, sharedUsers: SharedUser[]) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const updateData = {
        sharedWith: sharedUsers,
        isShared: sharedUsers.length > 0,
        lastSharedAt: new Date(),
        updatedAt: new Date()
      };
      await updateDoc(taskRef, updateData);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? { ...t, ...updateData } : t)
      );
    } catch (error) {
      console.error('Error sharing task:', error);
      setError('Failed to share task');
    }
  };

  const handleShareClick = (task: Task) => {
    setSelectedTask(task);
    setIsShareModalOpen(true);
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    // Add ripple effect to button
    const button = event.currentTarget;
    button.classList.add('button-click');
    setTimeout(() => {
      button.classList.remove('button-click');
    }, 600);
  };

  const filteredTasks = selectedCategory
    ? tasks.filter(task => task.categoryId === selectedCategory)
    : tasks;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={view} onChange={(_, newValue) => setView(newValue)}>
            <Tab label="List View" value="list" />
            <Tab label="Calendar View" value="calendar" />
          </Tabs>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <ButtonGroup variant="outlined">
              <Button onClick={() => setSelectedCategory(null)}>
                All Tasks
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  sx={{
                    backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                    color: selectedCategory === category.id ? 'white' : 'inherit',
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </ButtonGroup>
            <IconButton
              onClick={(e) => {
                handleButtonClick(e);
                setIsCategoryManagerOpen(true);
              }}
              title="Manage Categories"
            >
              <SettingsIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={(e) => {
              handleButtonClick(e);
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
            className="animate-scale-in"
          >
            Add Task
          </Button>
        </Box>

        {error && (
          <Box 
            sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: 'error.light', 
              color: 'error.contrastText',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'shake 0.5s ease-in-out'
            }}
          >
            <Typography>{error}</Typography>
            <IconButton 
              size="small" 
              onClick={() => setError(null)}
              sx={{ color: 'error.contrastText' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {view === 'list' ? (
          <EnhancedTaskList
            tasks={filteredTasks}
            onTaskAction={{
              toggle: toggleTask,
              delete: deleteTask,
              update: handleTaskUpdate,
              edit: (task) => {
                setSelectedTask(task);
                setIsModalOpen(true);
              },
              share: handleShareClick,
            }}
            draggable={true}
          />
        ) : (
          <CalendarView
            tasks={filteredTasks}
            onTaskAction={{
              toggle: toggleTask,
              delete: deleteTask,
              update: handleTaskUpdate,
              edit: (task) => {
                setSelectedTask(task);
                setIsModalOpen(true);
              },
              share: handleShareClick,
            }}
          />
        )}

        <TaskModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          onSubmit={selectedTask ? handleTaskUpdate : addTask}
          initialTask={selectedTask}
          tags={tags}
          categories={categories}
        />

        <ShareTaskModal
          open={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask!}
          onShare={handleShareTask}
        />

        <CategoryManager
          open={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
          categories={categories}
          onCategoriesChange={setCategories}
        />
      </Box>
    </DragDropContext>
  );
};

export default TaskManager; 