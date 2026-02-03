import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  styled,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Styled TextField component with enhanced autofill fixes
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '16px',
  '& .MuiInputBase-root': {
    position: 'relative',
    minHeight: '56px', // Ensure consistent height
  },
  '& .MuiInputBase-input': {
    padding: '16px 14px', // Consistent padding
    '&:-webkit-autofill': {
      // Better autofill styling
      WebkitBoxShadow: theme.palette.mode === 'dark' 
        ? '0 0 0 100px #333 inset' 
        : '0 0 0 100px #f5f5f5 inset',
      WebkitTextFillColor: theme.palette.text.primary,
      caretColor: theme.palette.primary.main,
      borderRadius: 'inherit',
      // Longer transition to ensure it stays applied
      transition: 'background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s',
    },
  },
  '& .MuiInputLabel-root': {
    // Ensure label transitions properly with autofilled inputs
    '&.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
    // Fix animation for smoother transition
    transition: theme.transitions.create(['transform', 'color'], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeOut,
    }),
  },
  // Special handling for autofilled state
  '& .MuiInputBase-input:-webkit-autofill + .MuiInputLabel-root': {
    transform: 'translate(14px, -9px) scale(0.75)',
    color: theme.palette.primary.main,
  },
}));

const AuthForm: React.FC = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  
  // Force update on mounted to handle autofill
  useEffect(() => {
    // Force a re-render after a short delay to handle autofill
    const timer = setTimeout(() => {
      // This forces the component to recognize autofilled fields
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        const value = input.value;
        // Trigger change event if the input has a value
        if (value) {
          const event = new Event('input', { bubbles: true });
          input.dispatchEvent(event);
          // Update our state if the input has a name that matches our form fields
          if (input.name) {
            setFormData((prev) => {
              if (!(input.name in prev)) return prev;
              return { ...prev, [input.name]: value };
            });
          }
        }
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!isLogin && !formData.name) {
      setError('Please enter your name');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation (at least 6 characters)
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, formData.name);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null); // Clear error when user types
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #4a90e2 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
          }}
        >
          2DU
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </Typography>

        <Tabs
          value={isLogin ? 0 : 1}
          onChange={(_, newValue) => setIsLogin(newValue === 0)}
          sx={{ mb: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <StyledTextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              variant="outlined"
            />
          )}
          <StyledTextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            variant="outlined"
          />
          <StyledTextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AuthForm; 