import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Chip,
} from '@mui/material';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { TimeEntry } from '../types/task';
import { Task } from '../types';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format, differenceInMinutes } from 'date-fns';

interface TimeTrackerProps {
  userId: string;
  taskId: string;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ userId, taskId }) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadTimeEntries();
  }, [taskId]);

  const loadTimeEntries = async () => {
    try {
      setLoading(true);
      setError(null);

      const timeEntriesCollection = collection(db, 'timeEntries');
      const timeEntriesQuery = query(
        timeEntriesCollection,
        where('taskId', '==', taskId),
        orderBy('startTime', 'desc')
      );
      const timeEntriesSnapshot = await getDocs(timeEntriesQuery);
      const loadedEntries = timeEntriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TimeEntry));
      setTimeEntries(loadedEntries);

      // Find active entry
      const active = loadedEntries.find(entry => !entry.endTime);
      setActiveEntry(active || null);
    } catch (error) {
      setError('Failed to load time entries');
    } finally {
      setLoading(false);
    }
  };

  const startTracking = async () => {
    try {
      setError(null);

      const newEntry: Omit<TimeEntry, 'id'> = {
        taskId,
        userId,
        startTime: new Date(),
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const timeEntriesCollection = collection(db, 'timeEntries');
      const docRef = await addDoc(timeEntriesCollection, newEntry);
      
      const entryWithId: TimeEntry = { ...newEntry, id: docRef.id };
      setTimeEntries(prev => [entryWithId, ...prev]);
      setActiveEntry(entryWithId);
    } catch (error) {
      setError('Failed to start time tracking');
    }
  };

  const stopTracking = async () => {
    if (!activeEntry) return;

    try {
      setError(null);

      const endTime = new Date();
      const duration = differenceInMinutes(endTime, new Date(activeEntry.startTime));

      const timeEntryRef = doc(db, 'timeEntries', activeEntry.id);
      const updateData = {
        endTime,
        duration,
        updatedAt: new Date(),
      };
      await updateDoc(timeEntryRef, updateData);

      setTimeEntries(prev =>
        prev.map(entry =>
          entry.id === activeEntry.id
            ? { ...entry, ...updateData }
            : entry
        )
      );
      setActiveEntry(null);
    } catch (error) {
      console.error('Error stopping time tracking:', error);
      setError('Failed to stop time tracking');
    }
  };

  const updateEntryDescription = async (entryId: string, newDescription: string) => {
    try {
      const timeEntryRef = doc(db, 'timeEntries', entryId);
      await updateDoc(timeEntryRef, {
        description: newDescription,
        updatedAt: new Date(),
      });

      setTimeEntries(prev =>
        prev.map(entry =>
          entry.id === entryId
            ? { ...entry, description: newDescription }
            : entry
        )
      );
    } catch (error) {
      setError('Failed to update time entry');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Time Tracking</Typography>
        {!activeEntry ? (
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={startTracking}
          >
            Start Tracking
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            startIcon={<StopIcon />}
            onClick={stopTracking}
          >
            Stop Tracking
          </Button>
        )}
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {activeEntry && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="subtitle1">
            Currently tracking time
          </Typography>
          <Typography variant="body2">
            Started at: {format(new Date(activeEntry.startTime), 'HH:mm:ss')}
          </Typography>
        </Paper>
      )}

      <List>
        {timeEntries.map(entry => (
          <ListItem
            key={entry.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography>
                    {format(new Date(entry.startTime), 'MMM d, HH:mm')}
                    {entry.endTime && ` - ${format(new Date(entry.endTime), 'HH:mm')}`}
                  </Typography>
                  {entry.duration && (
                    <Chip
                      label={formatDuration(entry.duration)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              }
              secondary={entry.description || 'No description'}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => {
                  setDescription(entry.description || '');
                  setIsModalOpen(true);
                }}
              >
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Time Entry</DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              updateEntryDescription(activeEntry?.id || '', description);
              setIsModalOpen(false);
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeTracker; 