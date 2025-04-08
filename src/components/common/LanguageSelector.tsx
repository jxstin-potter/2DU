import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Paper,
  useTheme,
} from '@mui/material';
import { useI18n } from '../../contexts/I18nContext';
import { createAccessibleSelect } from '../../utils/a11y';
import { supportedLanguages } from '../../utils/i18n';

/**
 * LanguageSelector component
 * 
 * This component provides a user interface for selecting the application language.
 * It displays a dropdown menu with all supported languages and updates the application
 * language when a new selection is made.
 */
const LanguageSelector: React.FC = () => {
  const theme = useTheme();
  const { language, setLanguage, t } = useI18n();

  // Create accessible select props
  const languageSelectProps = createAccessibleSelect(
    'language-select',
    t('settings.language'),
    language,
    (event: SelectChangeEvent) => setLanguage(event.target.value as string)
  );

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 600,
        mx: 'auto',
        my: 4,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        {t('settings.language')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('settings.language.select')}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="language-select-label">{t('settings.language.select')}</InputLabel>
          <Select
            labelId="language-select-label"
            value={language}
            label={t('settings.language.select')}
            onChange={(event) => setLanguage(event.target.value as string)}
            {...languageSelectProps}
          >
            {supportedLanguages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {t('settings.language.note')}
      </Typography>
    </Paper>
  );
};

export default LanguageSelector; 