import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task, SharedUser } from '../types';

interface ShareTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  onShare: (taskId: string, sharedUsers: SharedUser[]) => void;
}

const ShareTaskModal: React.FC<ShareTaskModalProps> = ({
  open,
  onClose,
  task,
  onShare,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>(task.sharedWith || []);

  const handleAddUser = () => {
    if (!email.trim()) return;

    const newUser: SharedUser = {
      userId: `user-${Date.now()}`, // In a real app, this would come from Firebase Auth
      email: email.trim(),
      role,
      sharedAt: new Date(),
    };

    setSharedUsers(prev => [...prev, newUser]);
    setEmail('');
    setRole('viewer');
  };

  const handleRemoveUser = (userId: string) => {
    setSharedUsers(prev => prev.filter(user => user.userId !== userId));
  };

  const handleSubmit = () => {
    onShare(task.id, sharedUsers);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Share Task: {task.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Share with others
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              size="small"
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as 'viewer' | 'editor')}
                label="Role"
              >
                <MenuItem value="viewer">Viewer</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddUser}
              disabled={!email.trim()}
            >
              Add
            </Button>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Shared with ({sharedUsers.length})
          </Typography>
          <List>
            {sharedUsers.map((user) => (
              <ListItem key={user.userId}>
                <ListItemText
                  primary={user.email}
                  secondary={
                    <Chip
                      label={user.role}
                      size="small"
                      color={user.role === 'editor' ? 'primary' : 'default'}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveUser(user.userId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareTaskModal; 