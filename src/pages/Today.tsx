import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import TaskManager from '../components/task-management/TaskManager';
import { useI18n } from '../contexts/I18nContext';

const Today: React.FC = () => {
  const { t } = useI18n();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('sidebar.today')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('today.description')}
          </Typography>
        </Paper>

        <TaskManager />
      </Box>
    </Container>
  );
};

export default Today; 