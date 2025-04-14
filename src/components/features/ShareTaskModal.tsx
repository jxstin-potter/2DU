import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert
} from '@mui/material';
import { Task, SharedUser } from '../../types';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShareIcon from '@mui/icons-material/Share';

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
  onShare
}) => {
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'viewer' | 'editor'>('viewer');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (task) {
      setSharedUsers(task.sharedWith || []);
    }
  }, [task]);

  const handleAddUser = () => {
    if (!newUserEmail.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserEmail.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if user is already in the list
    if (sharedUsers.some(user => user.email === newUserEmail.trim())) {
      setError('This user is already in the list');
      return;
    }

    const newUser: SharedUser = {
      email: newUserEmail.trim(),
      role: newUserRole
    };

    setSharedUsers([...sharedUsers, newUser]);
    setNewUserEmail('');
    setError(null);
  };

  const handleRemoveUser = (email: string) => {
    setSharedUsers(sharedUsers.filter(user => user.email !== email));
  };

  const handleShare = () => {
    onShare(task.id, sharedUsers);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Share Task
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {task.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share this task with others to collaborate
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Task shared successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add People
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              type="email"
              placeholder="Enter email address"
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as 'viewer' | 'editor')}
                label="Role"
              >
                <MenuItem value="viewer">Viewer</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddUser}
              disabled={!newUserEmail.trim()}
              startIcon={<PersonAddIcon />}
            >
              Add
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Shared with ({sharedUsers.length})
        </Typography>

        {sharedUsers.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No one has been shared with this task yet
          </Typography>
        ) : (
          <List>
            {sharedUsers.map((user) => (
              <ListItem key={user.email} divider>
                <ListItemText
                  primary={user.email}
                  secondary={`Role: ${user.role}`}
                />
                <ListItemSecondaryAction>
                  <Chip
                    label={user.role}
                    size="small"
                    color={user.role === 'editor' ? 'primary' : 'default'}
                    sx={{ mr: 1 }}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveUser(user.email)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleShare}
          variant="contained"
          color="primary"
          startIcon={<ShareIcon />}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareTaskModal; 