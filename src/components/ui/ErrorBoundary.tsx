import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { t } from '../../utils/i18n';
import { logComponentError } from '../../utils/errorLogging';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch JavaScript errors in child component tree
 * Displays a fallback UI when an error occurs
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logComponentError(error, 'ErrorBoundary', 'Component error', { componentStack: errorInfo.componentStack });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            m: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}
        >
          <Typography variant="h4" color="error" gutterBottom>
            {t('error.somethingWentWrong')}
          </Typography>
          
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              {this.state.error?.message || t('error.unexpectedError')}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()}
          >
            {t('error.reloadPage')}
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 