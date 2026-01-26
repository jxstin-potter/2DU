import React, { useState, useEffect, createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle, Button, Box, Typography } from '@mui/material';

// Feedback types
export enum FeedbackType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

// Feedback interface
export interface Feedback {
  id: string;
  type: FeedbackType;
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoHideDuration?: number;
  timestamp: number;
}

// Feedback context
interface FeedbackContextType {
  showFeedback: (feedback: Omit<Feedback, 'id' | 'timestamp'>) => void;
  hideFeedback: (id: string) => void;
  clearAllFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

// Feedback provider props
interface FeedbackProviderProps {
  children: ReactNode;
}

// Feedback provider component
export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Hide feedback
  const hideFeedback = useCallback((id: string) => {
    setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== id));
  }, []);

  // Show feedback
  const showFeedback = useCallback((feedback: Omit<Feedback, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newFeedback: Feedback = {
      ...feedback,
      id,
      timestamp: Date.now(),
    };

    setFeedbacks((prev) => [...prev, newFeedback]);

    // Auto-hide after duration
    if (feedback.autoHideDuration !== 0) {
      setTimeout(() => {
        hideFeedback(id);
      }, feedback.autoHideDuration || 6000);
    }
  }, [hideFeedback]);

  // Clear all feedback
  const clearAllFeedback = useCallback(() => {
    setFeedbacks([]);
  }, []);

  // Context value - memoize to prevent unnecessary re-renders
  const contextValue: FeedbackContextType = useMemo(() => ({
    showFeedback,
    hideFeedback,
    clearAllFeedback,
  }), [showFeedback, hideFeedback, clearAllFeedback]);

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
      <FeedbackContainer feedbacks={feedbacks} onClose={hideFeedback} />
    </FeedbackContext.Provider>
  );
};

// Feedback container props
interface FeedbackContainerProps {
  feedbacks: Feedback[];
  onClose: (id: string) => void;
}

// Feedback container component
const FeedbackContainer: React.FC<FeedbackContainerProps> = ({ feedbacks, onClose }) => {
  // Group feedbacks by type
  const groupedFeedbacks = feedbacks.reduce<Record<FeedbackType, Feedback[]>>(
    (acc, feedback) => {
      if (!acc[feedback.type]) {
        acc[feedback.type] = [];
      }
      acc[feedback.type].push(feedback);
      return acc;
    },
    {} as Record<FeedbackType, Feedback[]>
  );

  // Get the most recent feedback of each type
  const latestFeedbacks = Object.values(groupedFeedbacks).map((group) =>
    group.sort((a, b) => b.timestamp - a.timestamp)[0]
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {latestFeedbacks.map((feedback) => (
        <Snackbar
          key={feedback.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ position: 'relative', bottom: 0, right: 0 }}
        >
          <Alert
            severity={feedback.type}
            onClose={() => onClose(feedback.id)}
            sx={{ width: '100%', minWidth: 300 }}
            action={
              feedback.action && (
                <Button color="inherit" size="small" onClick={feedback.action.onClick}>
                  {feedback.action.label}
                </Button>
              )
            }
          >
            {feedback.title && <AlertTitle>{feedback.title}</AlertTitle>}
            <Typography variant="body2">{feedback.message}</Typography>
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

// Custom hook to use feedback
export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

// Helper functions to show specific types of feedback
export const showSuccessFeedback = (
  message: string,
  title?: string,
  action?: { label: string; onClick: () => void }
) => {
  const { showFeedback } = useFeedback();
  showFeedback({
    type: FeedbackType.SUCCESS,
    title,
    message,
    action,
  });
};

export const showErrorFeedback = (
  message: string,
  title?: string,
  action?: { label: string; onClick: () => void }
) => {
  const { showFeedback } = useFeedback();
  showFeedback({
    type: FeedbackType.ERROR,
    title,
    message,
    action,
    autoHideDuration: 0, // Don't auto-hide errors
  });
};

export const showWarningFeedback = (
  message: string,
  title?: string,
  action?: { label: string; onClick: () => void }
) => {
  const { showFeedback } = useFeedback();
  showFeedback({
    type: FeedbackType.WARNING,
    title,
    message,
    action,
  });
};

export const showInfoFeedback = (
  message: string,
  title?: string,
  action?: { label: string; onClick: () => void }
) => {
  const { showFeedback } = useFeedback();
  showFeedback({
    type: FeedbackType.INFO,
    title,
    message,
    action,
  });
};

export default FeedbackProvider; 