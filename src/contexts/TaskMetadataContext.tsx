import React, { createContext, useContext, useMemo } from 'react';
import { Category, Tag } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';

interface TaskMetadataContextValue {
  categories: Category[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const TaskMetadataContext = createContext<TaskMetadataContextValue | undefined>(undefined);

export const TaskMetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refreshCategories,
  } = useCategories();
  const { tags, loading: tagsLoading, error: tagsError, refreshTags } = useTags();

  const value = useMemo<TaskMetadataContextValue>(() => {
    const loading = categoriesLoading || tagsLoading;
    const error = categoriesError || tagsError;
    return {
      categories,
      tags,
      loading,
      error,
      refresh: () => {
        refreshCategories();
        refreshTags();
      },
    };
  }, [categories, tags, categoriesLoading, tagsLoading, categoriesError, tagsError, refreshCategories, refreshTags]);

  return <TaskMetadataContext.Provider value={value}>{children}</TaskMetadataContext.Provider>;
};

export const useTaskMetadata = () => {
  const ctx = useContext(TaskMetadataContext);
  if (!ctx) throw new Error('useTaskMetadata must be used within TaskMetadataProvider');
  return ctx;
};

