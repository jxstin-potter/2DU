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
import { WebSocketProvider } from './contexts/WebSocketContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';
import { ThemeProvider } from './components/common/ThemeProvider';
import { Task } from './types';
import LoadingState from './components/common/LoadingState';

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

// Main app content
const AppContent: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleDragEnd = (result: DropResult) => {
    // Handle drag and drop logic
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setTasks(updatedItems);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <MainLayout onCreateTask={handleCreateTask}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <TodayView tasks={tasks} onTaskEdit={setEditingTask} />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/upcoming"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <UpcomingView tasks={tasks} onTaskEdit={setEditingTask} />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tags"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <TagsView tasks={tasks} onTaskEdit={setEditingTask} />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/completed"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CompletedView tasks={tasks} onTaskEdit={setEditingTask} />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CalendarView tasks={tasks} onTaskEdit={setEditingTask} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </MainLayout>
    </DragDropContext>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <I18nProvider>
            <A11yProvider>
              <FeedbackProvider>
                <WebSocketProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Suspense fallback={<LoadingFallback />}>
                      <AppContent />
                    </Suspense>
                  </LocalizationProvider>
                </WebSocketProvider>
              </FeedbackProvider>
            </A11yProvider>
          </I18nProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
