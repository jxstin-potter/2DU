import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Button,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Project, ProjectStats } from '../../types/project';
import { Task } from '../../types';
import TaskList from '../TaskList';
import TimeTracker from '../TimeTracker';
import ProjectManager from '../ProjectManager';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';

interface ProjectViewProps {
  userId: string;
  projectId: string;
}

const ProjectView: React.FC<ProjectViewProps> = ({ userId, projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'tasks' | 'time' | 'members'>('tasks');
  const [stats, setStats] = useState<ProjectStats | null>(null);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load project
      const projectDoc = await getDocs(query(collection(db, 'projects'), where('id', '==', projectId)));
      if (projectDoc.empty) {
        throw new Error('Project not found');
      }
      const projectData = { id: projectDoc.docs[0].id, ...projectDoc.docs[0].data() } as Project;
      setProject(projectData);

      // Load tasks
      const tasksCollection = collection(db, 'tasks');
      const tasksQuery = query(
        tasksCollection,
        where('projectId', '==', projectId),
        orderBy('order')
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const loadedTasks = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
      setTasks(loadedTasks);

      // Calculate stats
      const timeEntriesCollection = collection(db, 'timeEntries');
      const timeEntriesQuery = query(timeEntriesCollection, where('projectId', '==', projectId));
      const timeEntriesSnapshot = await getDocs(timeEntriesQuery);
      const timeEntries = timeEntriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalTasks = loadedTasks.length;
      const completedTasks = loadedTasks.filter(task => task.completed).length;
      const totalTimeSpent = timeEntries.reduce((acc, entry) => acc + (entry.duration || 0), 0);
      const activeMembers = new Set(timeEntries.map(entry => entry.userId)).size;

      setStats({
        totalTasks,
        completedTasks,
        totalTimeSpent,
        activeMembers,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        averageTimePerTask: totalTasks > 0 ? totalTimeSpent / totalTasks : 0,
      });
    } catch (error) {
      console.error('Error loading project data:', error);
      setError('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAction = {
    toggle: async (taskId: string) => {
      // Implement task toggle
    },
    delete: async (taskId: string) => {
      // Implement task delete
    },
    update: async (taskId: string, updates: Partial<Task>) => {
      // Implement task update
    },
    edit: async (task: Task) => {
      // Implement task edit
    },
    share: async (task: Task) => {
      // Implement task share
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box>
        <Typography color="error">Project not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {project.title}
        </Typography>
        {project.description && (
          <Typography color="text.secondary" paragraph>
            {project.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {project.dueDate && (
            <Chip
              icon={<AccessTimeIcon />}
              label={`Due: ${format(new Date(project.dueDate), 'MMM d, yyyy')}`}
              color="primary"
              variant="outlined"
            />
          )}
          <Chip
            icon={<PeopleIcon />}
            label={`${project.members.length} Members`}
            color="secondary"
            variant="outlined"
          />
          {stats && (
            <Chip
              icon={<AccessTimeIcon />}
              label={`${Math.round(stats.totalTimeSpent / 60)}h spent`}
              color="info"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{stats.totalTasks}</Typography>
              <Typography color="text.secondary">Total Tasks</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{stats.completedTasks}</Typography>
              <Typography color="text.secondary">Completed Tasks</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{stats.completionRate.toFixed(1)}%</Typography>
              <Typography color="text.secondary">Completion Rate</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{stats.activeMembers}</Typography>
              <Typography color="text.secondary">Active Members</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={view} onChange={(_, newValue) => setView(newValue)}>
          <Tab label="Tasks" value="tasks" />
          <Tab label="Time Tracking" value="time" />
          <Tab label="Members" value="members" />
        </Tabs>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {view === 'tasks' && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* Implement new task */}}
            >
              Add Task
            </Button>
          </Box>
          <TaskList
            tasks={tasks}
            onTaskAction={handleTaskAction}
            draggable
          />
        </Box>
      )}

      {view === 'time' && (
        <TimeTracker
          userId={userId}
          taskId={tasks[0]?.id || ''}
          projectId={projectId}
        />
      )}

      {view === 'members' && (
        <Box>
          {/* Implement member management UI */}
        </Box>
      )}
    </Box>
  );
};

export default ProjectView; 