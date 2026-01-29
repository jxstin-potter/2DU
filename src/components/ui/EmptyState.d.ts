import React from 'react';
interface EmptyStateProps {
    type: 'today' | 'upcoming' | 'completed' | 'tags' | 'calendar';
    onCreateTask?: () => void;
}
declare const EmptyState: React.FC<EmptyStateProps>;
export default EmptyState;
