import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AuthForm from '../components/forms/AuthForm';

const Login: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography 
          component="h1" 
          variant="h4" 
          sx={{ 
            mb: 4,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #4a90e2 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          2DU Task Manager
        </Typography>
        <AuthForm />
      </Box>
    </Container>
  );
};

export default Login; 