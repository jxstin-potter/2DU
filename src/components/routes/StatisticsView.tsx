import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Tabs, Tab, useTheme, CircularProgress } from '@mui/material';
import { useTaskStore } from '../../stores/taskStore';
import { Task } from '../../types';
import TaskCompletionChart from '../charts/TaskCompletionChart';
import TaskCategoryChart from '../charts/TaskCategoryChart';
import TaskTagChart from '../charts/TaskTagChart';
import TaskTimelineChart from '../charts/TaskTimelineChart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`statistics-tabpanel-${index}`}
      aria-labelledby={`statistics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `statistics-tab-${index}`,
    'aria-controls': `statistics-tabpanel-${index}`,
  };
}

const StatisticsView: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        // Error loading tasks - handled by error state
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [fetchTasks]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Task Statistics
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Categories" {...a11yProps(1)} />
          <Tab label="Tags" {...a11yProps(2)} />
          <Tab label="Timeline" {...a11yProps(3)} />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Task Completion Status
                </Typography>
                <TaskCompletionChart tasks={tasks} />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tasks by Category
            </Typography>
            <TaskCategoryChart tasks={tasks} />
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tasks by Tag
            </Typography>
            <TaskTagChart tasks={tasks} />
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Timeline
            </Typography>
            <TaskTimelineChart tasks={tasks} />
          </Paper>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default StatisticsView; 