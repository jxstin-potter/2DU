import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';

/** Resize image to fit within maxSize and return as JPEG data URL (no Firebase Storage). */
function resizeImageToDataUrl(file: File, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      let dw = w;
      let dh = h;
      if (w > maxSize || h > maxSize) {
        if (w > h) {
          dw = maxSize;
          dh = (h * maxSize) / w;
        } else {
          dh = maxSize;
          dw = (w * maxSize) / h;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(dw);
      canvas.height = Math.round(dh);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsTab = 'account' | 'general';

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const { user, updateUserProfile, addPassword, authProviders, hasPasswordProvider } = useAuth();
  const { mode, toggleColorMode } = useCustomTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [name, setName] = useState(user?.name || '');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordInfo, setPasswordInfo] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  React.useEffect(() => {
    setName(user?.name || '');
  }, [user?.name]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSaveName = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== user?.name) {
      updateUserProfile({ name: trimmed });
    }
  };

  const handleChangePhoto = () => {
    setPhotoError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;
    const MAX_INPUT_SIZE = 4 * 1024 * 1024; // 4MB
    if (file.size > MAX_INPUT_SIZE) {
      setPhotoError('Photo must be 4MB or smaller.');
      event.target.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file.');
      event.target.value = '';
      return;
    }
    setPhotoLoading(true);
    setPhotoError(null);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 256, 0.75);
      await updateUserProfile({ profilePicture: dataUrl });
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Failed to process photo.');
    } finally {
      setPhotoLoading(false);
      event.target.value = '';
    }
  };

  const handleRemovePhoto = () => {
    updateUserProfile({ profilePicture: '' });
  };

  const handleChangeEmail = () => {
    // TODO: Implement email change
  };

  const handleAddPassword = () => {
    setPasswordError(null);
    setPasswordInfo(null);
    setPassword('');
    setPasswordConfirm('');
    setPasswordOpen(true);
  };

  const handleSavePassword = async () => {
    setPasswordError(null);
    setPasswordInfo(null);

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== passwordConfirm) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      await addPassword(password);
      setPasswordOpen(false);
      setPasswordInfo(hasPasswordProvider ? 'Password updated.' : 'Password added. You can now sign in with email & password.');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to add password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const providerLabel = (providerId: string) => {
    switch (providerId) {
      case 'google.com':
        return 'Google';
      case 'apple.com':
        return 'Apple';
      case 'password':
        return 'Email / Password';
      default:
        return providerId;
    }
  };

  const handleManagePlan = () => {
    // TODO: Implement plan management
  };

  const settingsTabs = [
    { id: 'account' as SettingsTab, label: 'Account', icon: <PersonIcon /> },
    { id: 'general' as SettingsTab, label: 'General', icon: <SettingsIcon /> },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: '900px',
          height: '80vh',
          maxHeight: '700px',
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Settings
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Navigation Panel */}
          <Box
            sx={{
              width: 240,
              borderRight: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Search Bar */}
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <TextField
                placeholder="Search"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.3),
                  },
                }}
              />
            </Box>

            {/* Settings Tabs */}
            <List sx={{ flex: 1, overflow: 'auto', py: 1 }}>
              {settingsTabs.map((tab) => (
                <ListItem
                  key={tab.id}
                  button
                  onClick={() => handleTabChange(tab.id)}
                  selected={activeTab === tab.id}
                  sx={{
                    minHeight: 48,
                    px: 2,
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      },
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {tab.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={tab.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: activeTab === tab.id ? 500 : 400,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Right Content Panel */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 3,
            }}
          >
            {activeTab === 'account' && (
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Account
                </Typography>

                {/* Plan Section */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Plan
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Beginner</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleManagePlan}
                      sx={{
                        textTransform: 'none',
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
                        '&:hover': {
                          borderColor: theme.palette.text.secondary,
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      Manage plan
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Photo Section */}
                <Box sx={{ mb: 4 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    aria-hidden="true"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Photo
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar
                      src={user?.profilePicture || undefined}
                      alt={user?.name || 'User'}
                      sx={{
                        width: 64,
                        height: 64,
                        fontSize: '1.5rem',
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleChangePhoto}
                        disabled={photoLoading}
                        sx={{
                          textTransform: 'none',
                          borderColor: theme.palette.divider,
                          color: theme.palette.text.primary,
                          '&:hover': {
                            borderColor: theme.palette.text.secondary,
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        {photoLoading ? 'Uploading…' : 'Change photo'}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleRemovePhoto}
                        sx={{
                          textTransform: 'none',
                          borderColor: theme.palette.error.main,
                          color: theme.palette.error.main,
                          '&:hover': {
                            borderColor: theme.palette.error.dark,
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                          },
                        }}
                      >
                        Remove photo
                      </Button>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Pick a photo up to 4MB.
                  </Typography>
                  {photoError && (
                    <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
                      {photoError}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    Your avatar photo will be public.
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Name Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={name}
                    onChange={handleNameChange}
                    onBlur={handleSaveName}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.background.paper,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {name.length}/255
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Email Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    {user?.email || 'No email'}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleChangeEmail}
                    sx={{
                      textTransform: 'none',
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.primary,
                      '&:hover': {
                        borderColor: theme.palette.text.secondary,
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    Change email
                  </Button>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Password Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Password
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.25 }}>
                    {hasPasswordProvider
                      ? 'Password is set for your account.'
                      : 'No password yet. Add one to sign in without Google.'}
                  </Typography>
                  {passwordInfo && (
                    <Typography variant="caption" color="success.main" sx={{ display: 'block', mb: 1 }}>
                      {passwordInfo}
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleAddPassword}
                    sx={{
                      textTransform: 'none',
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.primary,
                      '&:hover': {
                        borderColor: theme.palette.text.secondary,
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    {hasPasswordProvider ? 'Change password' : 'Add password'}
                  </Button>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Two-factor authentication Section */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Two-factor authentication
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={false}
                          onChange={() => {}}
                          size="small"
                        />
                      }
                      label=""
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    2FA is disabled on your account.
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Connected accounts Section */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Connected accounts
                  </Typography>
                  {authProviders.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No connected accounts
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {authProviders.map((p) => (
                        <Box
                          key={p}
                          sx={{
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 999,
                            border: `1px solid ${theme.palette.divider}`,
                            fontSize: '0.8125rem',
                            color: 'text.secondary',
                          }}
                        >
                          {providerLabel(p)}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {activeTab === 'general' && (
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  General
                </Typography>

                {/* Theme Section */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Theme
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Choose between light and dark mode
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={mode === 'dark'}
                          onChange={toggleColorMode}
                          size="small"
                        />
                      }
                      label=""
                    />
                  </Box>
                  <Typography variant="body2" color="text.primary">
                    {mode === 'dark' ? 'Dark mode' : 'Light mode'}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Language Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Language
                  </Typography>
                  <Typography variant="body1">
                    English
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Changes will take effect immediately
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <Dialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        aria-labelledby="add-password-title"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="add-password-title">{hasPasswordProvider ? 'Change password' : 'Add password'}</DialogTitle>
        <DialogContent sx={{ pt: 1.25 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {hasPasswordProvider
              ? 'Enter a new password for your account.'
              : 'Add a password so you can sign in with email & password next time.'}
          </Typography>
          <TextField
            fullWidth
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={passwordSaving}
            autoComplete="new-password"
            sx={{ mb: 1.25 }}
          />
          <TextField
            fullWidth
            label="Confirm password"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            disabled={passwordSaving}
            autoComplete="new-password"
          />
          {passwordError && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
              {passwordError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPasswordOpen(false)} disabled={passwordSaving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSavePassword} disabled={passwordSaving}>
            {passwordSaving ? 'Saving…' : hasPasswordProvider ? 'Update password' : 'Add password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default SettingsModal;
