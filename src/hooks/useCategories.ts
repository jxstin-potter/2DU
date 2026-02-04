import { useState, useEffect } from 'react';
import { Category } from '../types';
import { createCategory, getCategories, patchCategory, removeCategory } from '../services/categoriesService';
import { logHookError } from '../utils/errorLogging';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setCategories(await getCategories());
    } catch (err) {
      setError('Failed to load categories');
      logHookError(err instanceof Error ? err : new Error('Failed to load categories'), 'useCategories', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const newCategory = await createCategory({
        ...category,
        order: categories.length,
      });
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError('Failed to add category');
      logHookError(err instanceof Error ? err : new Error('Failed to add category'), 'useCategories', 'Failed to add category');
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await patchCategory(id, updates);
      setCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat)
      );
    } catch (err) {
      setError('Failed to update category');
      logHookError(err instanceof Error ? err : new Error('Failed to update category'), 'useCategories', 'Failed to update category', { categoryId: id, updates });
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await removeCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      setError('Failed to delete category');
      logHookError(err instanceof Error ? err : new Error('Failed to delete category'), 'useCategories', 'Failed to delete category', { categoryId: id });
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: loadCategories
  };
}; 