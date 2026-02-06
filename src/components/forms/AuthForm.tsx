import React, { useMemo, useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Divider,
  Stack,
  Checkbox,
  FormControlLabel,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';

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

type AuthRedirectState = {
  from?: { pathname?: string; search?: string; hash?: string };
};

const AuthForm: React.FC = () => {
  const { login, signup, loginWithGoogle, loginWithApple, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const redirectTo = useMemo(() => {
    const from = (location.state as AuthRedirectState | null)?.from;
    if (from?.pathname) {
      const search = from.search ?? '';
      const hash = from.hash ?? '';
      return `${from.pathname}${search}${hash}`;
    }
    return '/today';
  }, [location.state]);

  const validateForm = () => {
    const email = formData.email.trim();
    if (!email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!isLogin && !formData.name) {
      setError('Please enter your name');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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
    setInfo(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password, rememberMe);
      } else {
        await signup(formData.email, formData.password, formData.name, rememberMe);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setInfo(null);
    setIsLoading(true);
    try {
      const result = await loginWithGoogle(rememberMe);
      if (result === 'success') {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApple = async () => {
    setError(null);
    setInfo(null);
    setIsLoading(true);
    try {
      const result = await loginWithApple(rememberMe);
      if (result === 'success') {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Apple sign-in failed');
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
    setInfo(null);
  };

  const openReset = () => {
    setError(null);
    setInfo(null);
    setResetEmail(formData.email.trim());
    setResetOpen(true);
  };

  const submitReset = async () => {
    setError(null);
    setInfo(null);
    const email = resetEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setResetOpen(false);
      setInfo("If an account exists for that email, you'll receive a password reset link shortly. If you usually sign in with Google, sign in with Google and add a password in Settings.");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        width: '100%',
        maxWidth: 380,
        borderRadius: 3,
        border: theme => `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={2.25}>
        {/* Brand */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            aria-label="2DU"
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: '#000',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              userSelect: 'none',
            }}
          >
            2DU
          </Box>
        </Box>

        <Box>
          <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 800 }}>
            {isLogin ? 'Welcome!' : 'Create your account'}
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 0.5 }}>
            {isLogin ? 'Log in to start completing tasks.' : 'Sign up to start completing tasks.'}
          </Typography>
        </Box>

        {/* Social auth (UI only for now) */}
        <Stack spacing={1}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogle}
            disabled={isLoading}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<AppleIcon />}
            onClick={handleApple}
            disabled={isLoading}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Continue with Apple
          </Button>
        </Stack>

        <Divider sx={{ color: 'text.secondary' }}>OR</Divider>

        {error && <Alert severity="error">{error}</Alert>}
        {info && <Alert severity="success">{info}</Alert>}

        <Box component="form" onSubmit={handleSubmit} autoComplete="on">
          <Stack spacing={1.5}>
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
                autoComplete="name"
                inputProps={{ autoCapitalize: 'words' }}
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
              autoComplete="email"
              inputProps={{ autoCapitalize: 'none', spellCheck: 'false' }}
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
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.25 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Link
                component="button"
                type="button"
                onClick={openReset}
                underline="hover"
                sx={{ fontSize: '0.875rem' }}
                disabled={!isLogin || isLoading}
              >
                Forgot password?
              </Link>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 0.5, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={22} color="inherit" /> : isLogin ? 'Log in' : 'Sign up'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center">
          {isLogin ? (
            <>
              Don&apos;t have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => setIsLogin(false)}
                underline="hover"
                sx={{ fontWeight: 700 }}
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => setIsLogin(true)}
                underline="hover"
                sx={{ fontWeight: 700 }}
              >
                Log in
              </Link>
            </>
          )}
        </Typography>
      </Stack>

      <Dialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        aria-labelledby="reset-password-title"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="reset-password-title">Reset password</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Enter your email and we&apos;ll send you a reset link.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Email"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="email"
            inputProps={{ autoCapitalize: 'none', spellCheck: 'false' }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setResetOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={submitReset} disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Send reset link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AuthForm; 