import { useState, useEffect } from 'react';
import { Tag } from '../types';
import { createTag, getTags, patchTag, removeTag } from '../services/tagsService';
import { logHookError } from '../utils/errorLogging';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      setTags(await getTags());
    } catch (err) {
      setError('Failed to load tags');
      logHookError(err instanceof Error ? err : new Error('Failed to load tags'), 'useTags', 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (tag: Omit<Tag, 'id'>) => {
    try {
      const newTag = await createTag(tag);
      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (err) {
      setError('Failed to add tag');
      logHookError(err instanceof Error ? err : new Error('Failed to add tag'), 'useTags', 'Failed to add tag');
      throw err;
    }
  };

  const updateTag = async (id: string, updates: Partial<Tag>) => {
    try {
      await patchTag(id, updates);
      setTags(prev => 
        prev.map(tag => tag.id === id ? { ...tag, ...updates } : tag)
      );
    } catch (err) {
      setError('Failed to update tag');
      logHookError(err instanceof Error ? err : new Error('Failed to update tag'), 'useTags', 'Failed to update tag', { tagId: id, updates });
      throw err;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      await removeTag(id);
      setTags(prev => prev.filter(tag => tag.id !== id));
    } catch (err) {
      setError('Failed to delete tag');
      logHookError(err instanceof Error ? err : new Error('Failed to delete tag'), 'useTags', 'Failed to delete tag', { tagId: id });
      throw err;
    }
  };

  return {
    tags,
    loading,
    error,
    addTag,
    updateTag,
    deleteTag,
    refreshTags: loadTags
  };
};