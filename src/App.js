import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense, useMemo } from 'react';
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
import MainLayout from './components/layout/MainLayout';
import { useTheme } from './contexts/ThemeContext';
// Lazy load pages with error handling
var Login = lazy(function () { return import('./pages/Login'); });
var Settings = lazy(function () { return import('./pages/Settings'); });
var Today = lazy(function () { return import('./pages/Today'); });
var Completed = lazy(function () { return import('./pages/Completed'); });
// Main app content
var AppContent = function () {
    var mode = useTheme().mode;
    var theme = useMemo(function () { return getTheme(mode); }, [mode]);
    return (_jsxs(MuiThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(Box, { sx: {
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }, children: _jsx(MainLayout, { children: _jsx(Suspense, { fallback: _jsx(LoadingState, { isLoading: true, children: null }), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/today", replace: true }) }), _jsx(Route, { path: "/today", element: _jsx(Today, {}) }), _jsx(Route, { path: "/completed", element: _jsx(Completed, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) })] }) }) }) })] }));
};
// Root app component with providers
var App = function () {
    return (_jsx(ErrorBoundary, { children: _jsx(ThemeProvider, { children: _jsx(AuthProvider, { children: _jsx(I18nProvider, { children: _jsx(A11yProvider, { children: _jsx(FeedbackProvider, { children: _jsx(TaskModalProvider, { children: _jsx(SearchModalProvider, { children: _jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsx(AppContent, {}) }) }) }) }) }) }) }) }) }));
};
export default App;
