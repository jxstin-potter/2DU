import React, { useState, useEffect } from 'react';
import { Task } from '../../types';
import { logError } from '../../utils/errorLogging';
import { startOfDay } from 'date-fns';

interface TaskManagementProps {
  userId: string;
  onTasksChange: (tasks: Task[]) => void;
}

interface TaskManagementResult {
  tasks: Task[];
  isLoading: boolean;
  handleTaskAction: {
    toggle: (taskId: string) => void;
    delete: (taskId: string) => void;
    update: (taskId: string, updates: Partial<Task>) => void;
    save: (taskData: Omit<Task, 'id' | 'order'>) => void;
    edit: (task: Task) => void;
  };
}

const TaskManagement: React.FC<TaskManagementProps> = ({ userId, onTasksChange }): TaskManagementResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      try {
        const savedTasks = localStorage.getItem(`tasks-${userId}`);
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          setTasks(parsedTasks);
          onTasksChange(parsedTasks);
        } else {
          // Initialize with empty tasks if none exist
          setTasks([]);
          onTasksChange([]);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        logError(err instanceof Error ? err : new Error('Failed to load user data'), 'Failed to load user data');
        // Initialize with empty tasks on error
        setTasks([]);
        onTasksChange([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // If userId is empty, clear tasks
      setTasks([]);
      onTasksChange([]);
    }
  }, [userId, onTasksChange]);

  // Save user data
  useEffect(() => {
    if (userId) {
      try {
        localStorage.setItem(`tasks-${userId}`, JSON.stringify(tasks));
        onTasksChange(tasks);
      } catch (err) {
        console.error('Error saving user data:', err);
        logError(err instanceof Error ? err : new Error('Failed to save user data'), 'Failed to save user data');
      }
    }
  }, [tasks, userId, onTasksChange]);

  const handleTaskAction = {
    toggle: (taskId: string) => {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    },
    delete: (taskId: string) => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    },
    update: (taskId: string, updates: Partial<Task>) => {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    },
    save: (taskData: Omit<Task, 'id' | 'order'>) => {
      if (!userId) return;

      try {
        const taskWithDefaultDate = {
          ...taskData,
          dueDate: taskData.dueDate || new Date().toISOString()
        };
        
        const dueDate = new Date(taskWithDefaultDate.dueDate);
        if (isNaN(dueDate.getTime())) {
          console.error('Cannot save task: invalid dueDate format', taskWithDefaultDate.dueDate);
          return;
        }
        
        const validDueDate = startOfDay(dueDate);
        
        const newTask: Task = {
          ...taskWithDefaultDate,
          id: `task-${Date.now()}`,
          order: tasks.length,
          completed: false,
          tags: taskWithDefaultDate.tags || [],
          dueDate: validDueDate,
          userId: userId,
          status: taskWithDefaultDate.status || 'todo',
          subtasks: (taskWithDefaultDate.subtasks || []).map(subtask => ({
            ...subtask,
            order: subtask.order || 0
          })),
          attachments: (taskWithDefaultDate.attachments || []).map(attachment => ({
            ...attachment,
            uploadedAt: new Date()
          })),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        setTasks(prevTasks => [...prevTasks, newTask]);
      } catch (err) {
        console.error('Error saving task:', err);
        logError(err instanceof Error ? err : new Error('Failed to save task'), 'Failed to save task');
      }
    },
    edit: (task: Task) => {
      // This is a placeholder for the edit action
      // The actual edit functionality is handled by the parent component
      console.log('Editing task:', task);
    }
  };

  return {
    tasks,
    isLoading,
    handleTaskAction
  };
};

export default TaskManagement; 