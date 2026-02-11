import React, { createContext, useContext, useMemo } from 'react';
import { Category, Tag } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';

interface TaskMetadataContextValue {
  categories: Category[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  /** Use when you only care about tags (e.g. Tags page) so categories failure doesn't show. */
  tagsError: string | null;
  /** Use when you only care about categories. */
  categoriesError: string | null;
  refresh: () => void;
  addTag: (tag: Omit<Tag, 'id'>) => Promise<Tag>;
  deleteTag: (id: string) => Promise<void>;
  refreshTags: () => void;
}

const TaskMetadataContext = createContext<TaskMetadataContextValue | undefined>(undefined);

export const TaskMetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refreshCategories,
  } = useCategories();
  const {
    tags,
    loading: tagsLoading,
    error: tagsError,
    refreshTags,
    addTag,
    deleteTag,
  } = useTags();

  const value = useMemo<TaskMetadataContextValue>(() => {
    const loading = categoriesLoading || tagsLoading;
    const error = categoriesError || tagsError;
    return {
      categories,
      tags,
      loading,
      error,
      tagsError,
      categoriesError,
      refresh: () => {
        refreshCategories();
        refreshTags();
      },
      addTag,
      deleteTag,
      refreshTags,
    };
  }, [categories, tags, categoriesLoading, tagsLoading, categoriesError, tagsError, refreshCategories, refreshTags, addTag, deleteTag]);

  return <TaskMetadataContext.Provider value={value}>{children}</TaskMetadataContext.Provider>;
};

export const useTaskMetadata = () => {
  const ctx = useContext(TaskMetadataContext);
  if (!ctx) throw new Error('useTaskMetadata must be used within TaskMetadataProvider');
  return ctx;
};

