import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Category } from '../../types';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

interface CategoryManagerProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onUpdate: (categories: Category[]) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  open,
  onClose,
  categories,
  onUpdate,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const categoriesCollection = collection(db, 'categories');
      const newCategory = {
        name: newCategoryName.trim(),
        order: categories.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(categoriesCollection, newCategory);
      const categoryWithId: Category = { ...newCategory, id: docRef.id };

      onUpdate([...categories, categoryWithId]);
      setNewCategoryName('');
      setError(null);
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    if (!editingCategory?.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const categoryRef = doc(db, 'categories', category.id);
      await updateDoc(categoryRef, {
        name: editingCategory.name.trim(),
        updatedAt: new Date(),
      });

      onUpdate(
        categories.map((c) =>
          c.id === category.id ? { ...c, name: editingCategory.name.trim() } : c
        )
      );
      setEditingCategory(null);
      setError(null);
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await deleteDoc(categoryRef);
      onUpdate(categories.filter((c) => c.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  const handleClose = () => {
    setNewCategoryName('');
    setEditingCategory(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Manage Categories</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Box display="flex" gap={1} sx={{ mb: 2 }}>
            <TextField
              label="New Category"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              fullWidth
              error={!!error}
              helperText={error}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCategory}
              sx={{ minWidth: '100px' }}
            >
              Add
            </Button>
          </Box>

          <Paper elevation={0} sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List>
              {categories.map((category) => (
                <ListItem key={category.id}>
                  {editingCategory?.id === category.id ? (
                    <TextField
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, name: e.target.value })
                      }
                      fullWidth
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateCategory(category);
                        }
                      }}
                    />
                  ) : (
                    <ListItemText primary={category.name} />
                  )}
                  <ListItemSecondaryAction>
                    {editingCategory?.id === category.id ? (
                      <Button
                        size="small"
                        onClick={() => handleUpdateCategory(category)}
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => setEditingCategory(category)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryManager; 