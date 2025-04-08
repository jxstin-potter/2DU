import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Category } from '../types';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

interface CategoryManagerProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  open,
  onClose,
  categories,
  onCategoriesChange,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#1976d2');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const categoryData = {
        name: newCategoryName.trim(),
        color: newCategoryColor,
        order: categories.length,
        userId: 'current-user-id', // Replace with actual user ID
      };

      const docRef = await addDoc(collection(db, 'categories'), categoryData);
      const newCategory: Category = {
        id: docRef.id,
        ...categoryData,
      };

      onCategoriesChange([...categories, newCategory]);
      setNewCategoryName('');
      setNewCategoryColor('#1976d2');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      const categoryRef = doc(db, 'categories', category.id);
      await updateDoc(categoryRef, {
        name: category.name,
        color: category.color,
      });

      onCategoriesChange(
        categories.map((c) => (c.id === category.id ? category : c))
      );
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      onCategoriesChange(categories.filter((c) => c.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const colorOptions = [
    { value: '#1976d2', label: 'Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#d32f2f', label: 'Red' },
    { value: '#ed6c02', label: 'Orange' },
    { value: '#9c27b0', label: 'Purple' },
    { value: '#0288d1', label: 'Light Blue' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Categories</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add New Category
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              fullWidth
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Color</InputLabel>
              <Select
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                label="Color"
              >
                {colorOptions.map((color) => (
                  <MenuItem key={color.value} value={color.value}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: color.value,
                          borderRadius: '50%',
                        }}
                      />
                      {color.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Existing Categories
        </Typography>
        <List>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
              }}
            >
              {editingCategory?.id === category.id ? (
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <TextField
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                    fullWidth
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={editingCategory.color}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          color: e.target.value,
                        })
                      }
                    >
                      {colorOptions.map((color) => (
                        <MenuItem key={color.value} value={color.value}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: color.value,
                                borderRadius: '50%',
                              }}
                            />
                            {color.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={() => handleUpdateCategory(editingCategory)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditingCategory(null)}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: category.color,
                      borderRadius: '50%',
                      mr: 2,
                    }}
                  />
                  <ListItemText primary={category.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => setEditingCategory(category)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryManager; 