import React, { useState, lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import { A11yProvider } from './contexts/A11yContext';
import { FeedbackProvider } from './components/common/UserFeedback';
import ErrorBoundary from './components/common/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';
import TaskManagement from './components/features/TaskManagement';
import { ThemeProvider, useTheme } from './components/common/ThemeProvider';
import { Task } from './types';
import LoadingState from './components/common/LoadingState';
import AuthForm from './components/forms/AuthForm';

// Lazy load route components
const TodayView = lazy(() => import('./components/routes/TodayView'));
const UpcomingView = lazy(() => import('./components/routes/UpcomingView'));
const TagsView = lazy(() => import('./components/routes/TagsView'));
const CompletedView = lazy(() => import('./components/routes/CompletedView'));
const CalendarView = lazy(() => import('./components/routes/CalendarView'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Protected Route wrapper - modified to make authentication optional
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState isLoading={true} fullScreen><div /></LoadingState>;
  }

  // Allow access even without a user
  return <>{children}</>;
};

// Page transition component
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [tags] = useState([
    { name: 'Work', color: '#4CAF50' },
    { name: 'Personal', color: '#2196F3' },
    { name: 'Shopping', color: '#FF9800' },
  ]);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const taskManagement = TaskManagement({
    userId: user?.id || 'anonymous',
    onTasksChange: (updatedTasks) => {
      // Update the tasks state when changes occur
      taskManagement.tasks = updatedTasks;
    },
  });

  const { tasks, handleTaskAction } = taskManagement;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
      const { source, destination } = result;
      
      if (source.droppableId === destination.droppableId) {
      const updatedTasks = Array.from(tasks);
          const [movedTask] = updatedTasks.splice(source.index, 1);
          updatedTasks.splice(destination.index, 0, movedTask);
          
      if (movedTask && typeof movedTask === 'object' && 'id' in movedTask) {
        handleTaskAction.update(movedTask.id, { order: destination.index });
      }
    }
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  };

  // Check if we're on the auth page
  const isAuthPage = location.pathname === '/auth';

  return (
      <DragDropContext onDragEnd={handleDragEnd}>
      {isAuthPage ? (
        <AuthForm />
      ) : (
        <MainLayout
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={logout}
          userName={user?.name || user?.email || ''}
          isTaskModalOpen={isTaskModalOpen}
          onCloseTaskModal={handleCloseTaskModal}
          onSaveTask={handleTaskAction.save}
          editingTask={editingTask}
          tags={tags}
          onCreateTask={handleCreateTask}
          onOpenShortcutsHelp={() => setIsShortcutsHelpOpen(true)}
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="/today" replace />} />
              <Route
                path="/today"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <TodayView
                        tasks={tasks}
                        onTaskAction={handleTaskAction}
                        onCreateTask={handleCreateTask}
                      />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upcoming"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <UpcomingView
                        tasks={tasks}
                        onTaskAction={handleTaskAction}
                        onCreateTask={handleCreateTask}
                      />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <CalendarView
                        tasks={tasks}
                        onTaskAction={handleTaskAction}
                      />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tags"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <TagsView
                        tasks={tasks}
                        onTaskAction={handleTaskAction}
                        onCreateTask={handleCreateTask}
                      />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/completed"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <CompletedView
                        tasks={tasks.filter((task: Task) => task.completed)}
                        onTaskAction={handleTaskAction}
                        onCreateTask={handleCreateTask}
                      />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Settings />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/today" replace />} />
            </Routes>
          </AnimatePresence>
        </MainLayout>
      )}
      </DragDropContext>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <I18nProvider>
          <A11yProvider>
            <FeedbackProvider>
              <ThemeProvider userId={undefined}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Suspense fallback={<LoadingFallback />}>
                  <AppContent />
                </Suspense>
              </LocalizationProvider>
              </ThemeProvider>
            </FeedbackProvider>
          </A11yProvider>
        </I18nProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
