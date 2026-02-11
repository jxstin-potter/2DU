import React, { lazy, Suspense, useMemo } from 'react';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import { A11yProvider } from './contexts/A11yContext';
import { FeedbackProvider } from './components/ui/UserFeedback';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskModalProvider } from './contexts/TaskModalContext';
import { SearchModalProvider } from './contexts/SearchModalContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import LoadingState from './components/ui/LoadingState';
import ProtectedLayout from './components/layout/ProtectedLayout';
import { useTheme } from './contexts/ThemeContext';

// Lazy load pages with error handling
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/Settings'));
const Inbox = lazy(() => import('./pages/Inbox'));
const Today = lazy(() => import('./pages/Today'));
const Completed = lazy(() => import('./pages/Completed'));
const Upcoming = lazy(() => import('./pages/Upcoming'));
const Tags = lazy(() => import('./pages/Tags'));

// Main app content
const AppContent: React.FC = () => {
  const { mode } = useTheme();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Suspense fallback={<LoadingState isLoading={true} children={null} />}>
          <Routes>
            {/* Public routes (no app chrome) */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes (render app chrome and require auth) */}
            <Route element={<ProtectedLayout />}>
              <Route index element={<Navigate to="inbox" replace />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="today" element={<Today />} />
              <Route path="upcoming" element={<Upcoming />} />
              <Route path="tags" element={<Tags />} />
              <Route path="tags/:tagSlug" element={<Tags />} />
              <Route path="completed" element={<Completed />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/inbox" replace />} />
          </Routes>
        </Suspense>
      </Box>
    </MuiThemeProvider>
  );
};

// Root app component with providers
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <I18nProvider>
            <A11yProvider>
              <FeedbackProvider>
                <TaskModalProvider>
                  <SearchModalProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <AppContent />
                    </LocalizationProvider>
                  </SearchModalProvider>
                </TaskModalProvider>
              </FeedbackProvider>
            </A11yProvider>
          </I18nProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
