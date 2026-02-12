import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

interface TaskModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  /** Task id currently in inline-edit mode; cleared when modal opens. */
  activeInlineTaskId: string | null;
  setActiveInlineTaskId: (id: string | null) => void;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export const TaskModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState({ isOpen: false, activeInlineTaskId: null as string | null });

  const openModal = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true, activeInlineTaskId: null }));
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const setActiveInlineTaskId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, activeInlineTaskId: id }));
  }, []);

  const value = useMemo(
    () => ({
      isOpen: state.isOpen,
      openModal,
      closeModal,
      activeInlineTaskId: state.activeInlineTaskId,
      setActiveInlineTaskId,
    }),
    [state.isOpen, state.activeInlineTaskId, openModal, closeModal, setActiveInlineTaskId]
  );

  return (
    <TaskModalContext.Provider value={value}>
      {children}
    </TaskModalContext.Provider>
  );
};

export const useTaskModal = () => {
  const context = useContext(TaskModalContext);
  if (context === undefined) {
    throw new Error('useTaskModal must be used within a TaskModalProvider');
  }
  return context;
};
