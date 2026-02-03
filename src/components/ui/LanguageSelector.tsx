import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import { useI18n } from '../../contexts/I18nContext';
import type { Language } from '../../utils/i18n';
import { supportedLanguages } from '../../utils/i18n';

/**
 * LanguageSelector component
 * 
 * This component provides a user interface for selecting the application language.
 * It displays a dropdown menu with all supported languages and updates the application
 * language when a new selection is made.
 */
const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

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
            inputProps={{ 'aria-label': t('settings.language') }}
            onChange={(event) => setLanguage(event.target.value as Language)}
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