import React from 'react';
import { Container, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import { useI18n } from '../contexts/I18nContext';
import AccessibilitySettings from '../components/features/AccessibilitySettings';
import LanguageSelector from '../components/common/LanguageSelector';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Settings page component
 * 
 * This component provides a user interface for configuring application settings,
 * including accessibility options and language preferences.
 */
const Settings: React.FC = () => {
  const { t } = useI18n();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%', mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('settings.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('settings.description')}
        </Typography>

        <Paper sx={{ width: '100%', mt: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label={t('settings.tabsLabel')}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab 
              label={t('settings.accessibility')} 
              id="settings-tab-0"
              aria-controls="settings-tabpanel-0"
            />
            <Tab 
              label={t('settings.language')} 
              id="settings-tab-1"
              aria-controls="settings-tabpanel-1"
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <AccessibilitySettings />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <LanguageSelector />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Settings; 