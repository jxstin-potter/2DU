import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import TaskManager from '../components/task-management/TaskManager';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your tasks and stay organized
          </Typography>
        </Paper>

        <TaskManager />
      </Box>
    </Container>
  );
};

export default Dashboard; 