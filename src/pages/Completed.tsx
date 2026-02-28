import React, { useState, useEffect, useMemo } from 'react';
import { Container, Box, Typography, useTheme } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToTasks } from '../services/tasksService';
import { taskDocumentToTask } from '../types/firestore';
import { Task } from '../types';
import CompletedTaskItem from '../components/task-management/CompletedTaskItem';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';

const Completed: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to completed tasks
  useEffect(() => {
    if (!user?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Fetch all tasks and filter completed ones in memory to avoid Firestore index requirement
    const unsubscribe = subscribeToTasks(
      user.id,
      { completionStatus: 'all', sortBy: 'creationDate', sortOrder: 'desc' },
      (result) => {
        try {
          const convertedTasks = result.tasks.map((taskDoc: any) => taskDocumentToTask(taskDoc));
          
          // Filter to only completed tasks and sort by updatedAt (completion time)
          const completedTasks = convertedTasks
            .filter(task => task.completed === true)
            .sort((a, b) => {
              const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
              const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
              return timeB - timeA; // Most recent first
            });
          
          setTasks(completedTasks);
          setLoading(false);
          setError(null);
        } catch (error) {
          setError('Failed to process tasks');
          setLoading(false);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.id]);

  // Group tasks by completion date
  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: Task[] } = {};

    tasks.forEach(task => {
      if (!task.updatedAt) return;
      
      const completionDate = startOfDay(new Date(task.updatedAt));
      let dateKey: string;

      if (isToday(completionDate)) {
        dateKey = format(completionDate, "MMM d 'Today' ‧ EEEE");
      } else if (isYesterday(completionDate)) {
        dateKey = format(completionDate, "MMM d 'Yesterday' ‧ EEEE");
      } else {
        dateKey = format(completionDate, 'MMM d ‧ EEEE');
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });

    // Sort tasks within each group by completion time (most recent first)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
      });
    });

    return groups;
  }, [tasks]);

  const sortedDateKeys = useMemo(() => {
    return Object.keys(groupedTasks).sort((a, b) => {
      // Get the first task from each group to extract the date
      const taskA = groupedTasks[a][0];
      const taskB = groupedTasks[b][0];
      
      if (!taskA?.updatedAt || !taskB?.updatedAt) return 0;
      
      const dateA = new Date(taskA.updatedAt).getTime();
      const dateB = new Date(taskB.updatedAt).getTime();
      
      return dateB - dateA; // Most recent first
    });
  }, [groupedTasks]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%',
      px: { xs: 2, sm: 0 },
    }}>
      <Container 
        maxWidth="md"
        disableGutters
        sx={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ 
          width: '100%',
          maxWidth: { xs: '100%', sm: theme.breakpoints.values.sm },
        }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h5" 
              component="h1"
              sx={{ 
                fontWeight: theme.typography.fontWeightBold,
                mb: 1,
              }}
            >
              Activity: All projects
            </Typography>
          </Box>

          {/* Grouped Tasks */}
          {sortedDateKeys.length > 0 ? (
            sortedDateKeys.map((dateKey) => (
              <Box key={dateKey} sx={{ mb: 4 }}>
                {/* Date Header */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    fontSize: theme.typography.body1.fontSize,
                    mb: 2,
                    color: 'text.secondary',
                  }}
                >
                  {dateKey}
                </Typography>

                {/* Tasks for this date */}
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  {groupedTasks[dateKey].map((task) => (
                    <CompletedTaskItem key={task.id} task={task} />
                  ))}
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
            }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: theme.typography.body2.fontSize }}
              >
                No completed tasks yet
              </Typography>
            </Box>
          )}

          {/* End of history message */}
          {sortedDateKeys.length > 0 && (
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              mt: 4,
              mb: 4,
            }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: theme.typography.body2.fontSize,
                  fontStyle: 'italic',
                }}
              >
                That's it. No more history to load.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Completed;
