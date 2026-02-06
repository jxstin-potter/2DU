import React, { useMemo } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Navigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/forms/AuthForm';
import { useAuth } from '../contexts/AuthContext';

type AuthRedirectState = {
  from?: { pathname?: string; search?: string; hash?: string };
};

const Login: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const from = (location.state as AuthRedirectState | null)?.from;
    if (from?.pathname) {
      const search = from.search ?? '';
      const hash = from.hash ?? '';
      return `${from.pathname}${search}${hash}`;
    }
    return '/today';
  }, [location.state]);

  // If already authenticated, don't show the login page.
  if (!loading && user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Box
      component="main"
      sx={{
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 3,
        overflow: 'hidden',
        bgcolor: 'background.default',
        backgroundImage: theme => {
          const glowStrong = alpha(theme.palette.primary.main, 0.14);
          const glowSoft = alpha(theme.palette.primary.main, 0.08);
          return `radial-gradient(1200px circle at 20% 10%, ${glowStrong}, transparent 40%), radial-gradient(900px circle at 90% 80%, ${glowSoft}, transparent 40%)`;
        },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <AuthForm />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 2 }}
        >
          By continuing you agree to our{' '}
          <Link href="#" underline="hover" color="inherit">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="#" underline="hover" color="inherit">
            Privacy Policy
          </Link>
          .
        </Typography>
      </Box>
    </Box>
  );
};

export default Login; 