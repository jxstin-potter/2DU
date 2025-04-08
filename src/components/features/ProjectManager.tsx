import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Project, ProjectMember, TimeEntry, ProjectStats } from '../types/project';
import { Task } from '../types';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';

interface ProjectManagerProps {
  userId: string;
  onTaskSelect: (taskId: string) => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ userId, onTaskSelect }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'stats'>('list');
  const [projectStats, setProjectStats] = useState<Record<string, ProjectStats>>({});

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadProjects();
  }, [userId]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const projectsCollection = collection(db, 'projects');
      const projectsQuery = query(
        projectsCollection,
        where('members', 'array-contains', { userId, role: 'member' })
      );
      const projectsSnapshot = await getDocs(projectsQuery);
      const loadedProjects = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      setProjects(loadedProjects);

      // Load project stats
      const stats: Record<string, ProjectStats> = {};
      for (const project of loadedProjects) {
        stats[project.id] = await calculateProjectStats(project.id);
      }
      setProjectStats(stats);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const calculateProjectStats = async (projectId: string): Promise<ProjectStats> => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const tasksCollection = collection(db, 'tasks');
    const tasksQuery = query(tasksCollection, where('projectId', '==', projectId));
    const tasksSnapshot = await getDocs(tasksQuery);
    const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));

    const timeEntriesCollection = collection(db, 'timeEntries');
    const timeEntriesQuery = query(timeEntriesCollection, where('projectId', '==', projectId));
    const timeEntriesSnapshot = await getDocs(timeEntriesQuery);
    const timeEntries = timeEntriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimeEntry));

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTimeSpent = timeEntries.reduce((acc, entry) => acc + (entry.duration || 0), 0);
    const activeMembers = new Set(timeEntries.map(entry => entry.userId)).size;

    return {
      totalTasks,
      completedTasks,
      totalTimeSpent,
      activeMembers,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      averageTimePerTask: totalTasks > 0 ? totalTimeSpent / totalTasks : 0,
    };
  };

  const handleCreateProject = async () => {
    try {
      setError(null);

      if (!title.trim()) {
        setError('Title is required');
        return;
      }

      const projectData: Omit<Project, 'id'> = {
        title: title.trim(),
        description: description.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: userId,
        members: [{
          userId,
          email: '', // This should be fetched from the user's profile
          role: 'owner',
          joinedAt: new Date(),
        }],
        tasks: [],
        status: 'active',
        dueDate: dueDate || undefined,
        tags,
        category: category || undefined,
      };

      const projectsCollection = collection(db, 'projects');
      const docRef = await addDoc(projectsCollection, projectData);
      
      const newProject: Project = { ...projectData, id: docRef.id };
      setProjects(prev => [...prev, newProject]);
      
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project');
    }
  };

  const handleUpdateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };
      await updateDoc(projectRef, updateData);
      setProjects(prev => 
        prev.map(p => p.id === projectId ? { ...p, ...updates } : p)
      );
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setTags([]);
    setCategory('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          New Project
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={view} onChange={(_, newValue) => setView(newValue)}>
          <Tab label="List View" value="list" />
          <Tab label="Statistics" value="stats" />
        </Tabs>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {view === 'list' ? (
        <Grid container spacing={2}>
          {projects.map(project => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Paper
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
                onClick={() => setSelectedProject(project)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" noWrap>
                    {project.title}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      setIsMemberModalOpen(true);
                    }}>
                      <PeopleIcon />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {project.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {project.description}
                  </Typography>
                )}

                <Box sx={{ mt: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {project.dueDate && (
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={format(new Date(project.dueDate), 'MMM d')}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {project.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {projects.map(project => {
            const stats = projectStats[project.id];
            return (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {project.title}
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Tasks
                      </Typography>
                      <Typography variant="h6">
                        {stats.completedTasks}/{stats.totalTasks}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Completion Rate
                      </Typography>
                      <Typography variant="h6">
                        {stats.completionRate.toFixed(1)}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Time Spent
                      </Typography>
                      <Typography variant="h6">
                        {Math.round(stats.totalTimeSpent / 60)}h
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Active Members
                      </Typography>
                      <Typography variant="h6">
                        {stats.activeMembers}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Project Creation Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Project Members Modal */}
      <Dialog open={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Project Members</DialogTitle>
        <DialogContent>
          {/* Member management UI will go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMemberModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectManager; 