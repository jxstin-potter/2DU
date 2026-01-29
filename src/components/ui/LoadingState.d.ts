import React from 'react';
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
declare const LoadingState: React.FC<LoadingStateProps>;
export default LoadingState;
