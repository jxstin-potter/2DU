import React, { Suspense, lazy } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface LazyLoadProps {
  children: React.ReactNode;
}

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
  >
    <CircularProgress />
  </Box>
);

const ErrorFallback = ({ error }: { error: Error }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
    flexDirection="column"
    gap={2}
  >
    <Typography color="error" variant="h6">
      Something went wrong
    </Typography>
    <Typography color="textSecondary" variant="body2">
      {error.message}
    </Typography>
  </Box>
);

export const LazyLoadWrapper = ({ children }: LazyLoadProps) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

export const lazyLoad = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  componentName: string
) => {
  const LazyComponent = lazy(importFn);
  return (props: any) => (
    <LazyLoadWrapper>
      <LazyComponent {...props} />
    </LazyLoadWrapper>
  );
}; 