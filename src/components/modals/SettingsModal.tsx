import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
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
import { useI18n } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsTab = 'account' | 'general';

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const { mode, toggleColorMode } = useCustomTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [name, setName] = useState(user?.name || '');

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
    // TODO: Implement name update to Firestore
  };

  const handleChangePhoto = () => {
    // TODO: Implement photo change
  };

  const handleRemovePhoto = () => {
    // TODO: Implement photo removal
  };

  const handleChangeEmail = () => {
    // TODO: Implement email change
  };

  const handleAddPassword = () => {
    // TODO: Implement password addition
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Photo
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar
                      src={user?.profilePicture}
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
                        Change photo
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
                    Add password
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
                  <Typography variant="body2" color="text.secondary">
                    No connected accounts
                  </Typography>
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
    </Dialog>
  );
};

export default SettingsModal;
