import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import LoadingState from '../ui/LoadingState';
import { useAuth } from '../../contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Route guard for authenticated-only areas.
 *
 * - While auth is initializing/loading, we render a full-screen loading state.
 * - If unauthenticated, we redirect to /login and preserve the original location
 *   so the login screen can send the user back afterwards.
 */
const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <LoadingState isLoading={true} fullScreen={true} variant="overlay">
          <Box />
        </LoadingState>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default RequireAuth;

