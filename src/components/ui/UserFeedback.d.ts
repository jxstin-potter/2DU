import React, { ReactNode } from 'react';
export declare enum FeedbackType {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info"
}
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
interface FeedbackContextType {
    showFeedback: (feedback: Omit<Feedback, 'id' | 'timestamp'>) => void;
    hideFeedback: (id: string) => void;
    clearAllFeedback: () => void;
}
interface FeedbackProviderProps {
    children: ReactNode;
}
export declare const FeedbackProvider: React.FC<FeedbackProviderProps>;
export declare const useFeedback: () => FeedbackContextType;
export declare const showSuccessFeedback: (message: string, title?: string, action?: {
    label: string;
    onClick: () => void;
}) => void;
export declare const showErrorFeedback: (message: string, title?: string, action?: {
    label: string;
    onClick: () => void;
}) => void;
export declare const showWarningFeedback: (message: string, title?: string, action?: {
    label: string;
    onClick: () => void;
}) => void;
export declare const showInfoFeedback: (message: string, title?: string, action?: {
    label: string;
    onClick: () => void;
}) => void;
export default FeedbackProvider;
