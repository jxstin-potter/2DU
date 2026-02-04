import React from 'react';
import { Outlet } from 'react-router-dom';
import RequireAuth from '../auth/RequireAuth';
import MainLayout from './MainLayout';
import { TaskMetadataProvider } from '../../contexts/TaskMetadataContext';

/**
 * Layout wrapper for authenticated sections of the app.
 * All routes nested under this layout will have the full app chrome (sidebar, app bar, modals)
 * and will redirect to /login if the user is not authenticated.
 */
const ProtectedLayout: React.FC = () => {
  return (
    <RequireAuth>
      <TaskMetadataProvider>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </TaskMetadataProvider>
    </RequireAuth>
  );
};

export default ProtectedLayout;

