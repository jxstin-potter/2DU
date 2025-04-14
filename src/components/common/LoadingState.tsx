import React from 'react';
import {
  Box,
  Skeleton,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { t } from '../../utils/i18n';

interface LoadingStateProps {
  isLoading: boolean;
  error?: Error | string | null;
  children: React.ReactNode;
  loadingText?: string;
  errorText?: string;
  retryAction?: () => void;
  variant?: 'overlay' | 'skeleton' | 'inline';
  fullScreen?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  error,
  children,
  loadingText = t('common.loading'),
  errorText = t('error.defaultError'),
  retryAction,
  variant = 'overlay',
  fullScreen = false,
}) => {
  // Handle error state
  if (error) {
    const errorMessage = typeof error === 'string' ? error : error?.message || errorText;
    
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          animation: 'fadeIn 0.3s ease-out forwards',
        }}
      >
        <Alert
          severity="error"
          action={
            retryAction && (
              <Button
                color="inherit"
                size="small"
                onClick={retryAction}
                startIcon={<RefreshIcon />}
                sx={{
                  animation: 'fadeIn 0.3s ease-out forwards',
                }}
              >
                {t('error.tryAgain')}
              </Button>
            )
          }
        >
          <Typography variant="body1">{errorMessage}</Typography>
        </Alert>
      </Box>
    );
  }

  // Handle loading state
  if (isLoading) {
    if (variant === 'skeleton') {
      return (
        <Box
          sx={{
            animation: 'slideIn 0.3s ease-out forwards',
            width: '100%',
          }}
        >
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={60}
              sx={{
                mb: index < 3 ? 1 : 0,
                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: 1,
              }}
            />
          ))}
        </Box>
      );
    }

    if (variant === 'inline') {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            animation: 'fadeIn 0.3s ease-out forwards',
          }}
        >
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <Typography variant="body2">{loadingText}</Typography>
        </Box>
      );
    }

    // Default overlay variant
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000,
          height: fullScreen ? '100vh' : '100%',
          animation: 'fadeIn 0.3s ease-out forwards',
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body1">{loadingText}</Typography>
      </Box>
    );
  }

  // Render children when not loading and no error
  return <>{children}</>;
};

export default LoadingState; 