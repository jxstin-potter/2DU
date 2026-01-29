import React, { ReactNode } from 'react';
interface TaskModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}
export declare const TaskModalProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useTaskModal: () => TaskModalContextType;
export {};
