import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Tag } from '../types';

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
      const tagsCollection = collection(db, 'tags');
      const snapshot = await getDocs(tagsCollection);
      const loadedTags = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Tag));
      setTags(loadedTags);
    } catch (err) {
      setError('Failed to load tags');
      console.error('Error loading tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (tag: Omit<Tag, 'id'>) => {
    try {
      const tagsCollection = collection(db, 'tags');
      const docRef = await addDoc(tagsCollection, tag);
      const newTag = { ...tag, id: docRef.id };
      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (err) {
      setError('Failed to add tag');
      console.error('Error adding tag:', err);
      throw err;
    }
  };

  const updateTag = async (id: string, updates: Partial<Tag>) => {
    try {
      const tagRef = doc(db, 'tags', id);
      await updateDoc(tagRef, updates);
      setTags(prev => 
        prev.map(tag => tag.id === id ? { ...tag, ...updates } : tag)
      );
    } catch (err) {
      setError('Failed to update tag');
      console.error('Error updating tag:', err);
      throw err;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const tagRef = doc(db, 'tags', id);
      await deleteDoc(tagRef);
      setTags(prev => prev.filter(tag => tag.id !== id));
    } catch (err) {
      setError('Failed to delete tag');
      console.error('Error deleting tag:', err);
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