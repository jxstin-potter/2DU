import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Microsoft as MicrosoftIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Task } from '../types';
import externalIntegrations from '../services/externalIntegrations';

interface ExternalIntegrationsProps {
  task?: Task;
  onClose: () => void;
  open: boolean;
}

const ExternalIntegrations: React.FC<ExternalIntegrationsProps> = ({
  task,
  onClose,
  open,
}) => {
  const [googleCalendarEnabled, setGoogleCalendarEnabled] = useState(false);
  const [outlookCalendarEnabled, setOutlookCalendarEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);

  const handleGoogleCalendarToggle = async () => {
    if (!googleCalendarEnabled) {
      // Request Google Calendar authorization
      window.location.href = '/api/v1/auth/google/calendar';
    } else {
      // Revoke Google Calendar access
      localStorage.removeItem('google_token');
      setGoogleCalendarEnabled(false);
    }
  };

  const handleOutlookCalendarToggle = async () => {
    if (!outlookCalendarEnabled) {
      // Request Outlook Calendar authorization
      window.location.href = '/api/v1/auth/outlook/calendar';
    } else {
      // Revoke Outlook Calendar access
      localStorage.removeItem('outlook_token');
      setOutlookCalendarEnabled(false);
    }
  };

  const handleEmailNotificationsToggle = () => {
    setEmailNotificationsEnabled(!emailNotificationsEnabled);
  };

  const handlePushNotificationsToggle = async () => {
    if (!pushNotificationsEnabled) {
      try {
        const permission = await externalIntegrations.notifications.requestPermission();
        setPushNotificationsEnabled(permission);
      } catch (error) {
        console.error('Push notification permission error:', error);
      }
    } else {
      setPushNotificationsEnabled(false);
    }
  };

  const handleBrowserNotificationsToggle = async () => {
    if (!browserNotificationsEnabled) {
      try {
        const permission = await externalIntegrations.notifications.requestPermission();
        setBrowserNotificationsEnabled(permission);
      } catch (error) {
        console.error('Browser notification permission error:', error);
      }
    } else {
      setBrowserNotificationsEnabled(false);
    }
  };

  const handleShareOnTwitter = () => {
    if (task) {
      externalIntegrations.social.shareOnTwitter(task);
    }
  };

  const handleShareOnLinkedIn = () => {
    if (task) {
      externalIntegrations.social.shareOnLinkedIn(task);
    }
  };

  const handleShareViaEmail = () => {
    if (task) {
      const recipientEmail = prompt('Enter recipient email:');
      if (recipientEmail) {
        externalIntegrations.social.shareViaEmail(task, recipientEmail);
      }
    }
  };

  const handleGenerateLink = async () => {
    if (task) {
      try {
        const shareableLink = await externalIntegrations.social.generateShareableLink(task);
        navigator.clipboard.writeText(shareableLink);
        alert('Shareable link copied to clipboard!');
      } catch (error) {
        console.error('Error generating shareable link:', error);
        alert('Failed to generate shareable link');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <SettingsIcon />
          <Typography variant="h6">External Integrations</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemIcon>
              <GoogleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Google Calendar"
              secondary="Sync tasks with Google Calendar"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={googleCalendarEnabled}
                onChange={handleGoogleCalendarToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <MicrosoftIcon />
            </ListItemIcon>
            <ListItemText
              primary="Outlook Calendar"
              secondary="Sync tasks with Outlook Calendar"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={outlookCalendarEnabled}
                onChange={handleOutlookCalendarToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive task reminders via email"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={emailNotificationsEnabled}
                onChange={handleEmailNotificationsToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive push notifications for tasks"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={pushNotificationsEnabled}
                onChange={handlePushNotificationsToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Browser Notifications"
              secondary="Receive browser notifications for tasks"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={browserNotificationsEnabled}
                onChange={handleBrowserNotificationsToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          {task && (
            <>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Share Task"
                  secondary="Share this task with others"
                />
              </ListItem>
              <Box display="flex" justifyContent="center" gap={1} p={2}>
                <Tooltip title="Share on Twitter">
                  <IconButton onClick={handleShareOnTwitter} color="primary">
                    <TwitterIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share on LinkedIn">
                  <IconButton onClick={handleShareOnLinkedIn} color="primary">
                    <LinkedInIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share via Email">
                  <IconButton onClick={handleShareViaEmail} color="primary">
                    <EmailIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy Shareable Link">
                  <IconButton onClick={handleGenerateLink} color="primary">
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExternalIntegrations; 