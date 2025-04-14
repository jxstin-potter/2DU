import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { testAuth } from '../firebase';

const AuthTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!email || !password) {
      setResult({ success: false, message: 'Please enter both email and password' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      await testAuth(email, password);
      setResult({ success: true, message: 'Authentication test successful!' });
    } catch (error) {
      console.error('Test error:', error);
      setResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Firebase Auth Test
      </Typography>
      
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleTest}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Testing...' : 'Test Authentication'}
      </Button>
      
      {result && (
        <Alert 
          severity={result.success ? 'success' : 'error'} 
          sx={{ mt: 2 }}
        >
          {result.message}
        </Alert>
      )}
    </Box>
  );
};

export default AuthTest; 