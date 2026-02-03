import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Paper,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Contrast as ContrastIcon,
  TextFields as TextFieldsIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  Hearing as HearingIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  RestartAlt as RestartIcon,
} from '@mui/icons-material';
import { useA11y } from "../../contexts/A11yContext";
import { useI18n } from "../../contexts/I18nContext";
import { createAccessibleButton, createAccessibleCheckbox } from "../../utils/a11y";

/**
 * AccessibilitySettings component
 * 
 * This component provides a user interface for configuring accessibility settings
 * such as high contrast mode, reduced motion, font size, focus visibility, and screen reader mode.
 */
const AccessibilitySettings: React.FC = () => {
  const { t } = useI18n();
  const {
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    focusVisible,
    toggleFocusVisible,
    screenReaderOnly,
    toggleScreenReaderOnly,
  } = useA11y();

  // Create accessible button props
  const increaseFontSizeButtonProps = createAccessibleButton(
    'increase-font-size',
    t('a11y.increaseFontSize'),
    increaseFontSize
  );

  const decreaseFontSizeButtonProps = createAccessibleButton(
    'decrease-font-size',
    t('a11y.decreaseFontSize'),
    decreaseFontSize
  );

  const resetFontSizeButtonProps = createAccessibleButton(
    'reset-font-size',
    t('a11y.resetFontSize'),
    resetFontSize
  );

  // Create accessible checkbox props
  const highContrastCheckboxProps = createAccessibleCheckbox(
    'high-contrast',
    t('a11y.highContrast'),
    highContrast,
    toggleHighContrast
  );

  const reducedMotionCheckboxProps = createAccessibleCheckbox(
    'reduced-motion',
    t('a11y.reducedMotion'),
    reducedMotion,
    toggleReducedMotion
  );

  const focusVisibleCheckboxProps = createAccessibleCheckbox(
    'focus-visible',
    t('a11y.focusVisible'),
    focusVisible,
    toggleFocusVisible
  );

  const screenReaderOnlyCheckboxProps = createAccessibleCheckbox(
    'screen-reader-only',
    t('a11y.screenReaderOnly'),
    screenReaderOnly,
    toggleScreenReaderOnly
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
        {t('settings.accessibility')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('settings.accessibility.description')}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        {/* High Contrast Mode */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ContrastIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">{t('settings.accessibility.highContrast')}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('settings.accessibility.highContrastDescription')}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={highContrast}
                onChange={toggleHighContrast}
                color="primary"
                {...highContrastCheckboxProps}
              />
            }
            label={t('a11y.enable')}
          />
        </Grid>

        {/* Reduced Motion */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SpeedIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">{t('settings.accessibility.reducedMotion')}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('settings.accessibility.reducedMotionDescription')}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={reducedMotion}
                onChange={toggleReducedMotion}
                color="primary"
                {...reducedMotionCheckboxProps}
              />
            }
            label={t('a11y.enable')}
          />
        </Grid>

        {/* Font Size */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextFieldsIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">{t('settings.accessibility.fontSize')}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('settings.accessibility.fontSizeDescription')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={t('settings.accessibility.fontSize.decrease')}>
              <IconButton
                onClick={decreaseFontSize}
                disabled={fontSize <= 12}
                {...decreaseFontSizeButtonProps}
              >
                <RemoveIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="body1" sx={{ mx: 2, minWidth: 40, textAlign: 'center' }}>
              {fontSize}px
            </Typography>
            <Tooltip title={t('settings.accessibility.fontSize.increase')}>
              <IconButton
                onClick={increaseFontSize}
                disabled={fontSize >= 24}
                {...increaseFontSizeButtonProps}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('settings.accessibility.fontSize.reset')}>
              <IconButton onClick={resetFontSize} sx={{ ml: 1 }} {...resetFontSizeButtonProps}>
                <RestartIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        {/* Focus Visibility */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <VisibilityIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">{t('settings.accessibility.focusVisible')}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('settings.accessibility.focusVisibleDescription')}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={focusVisible}
                onChange={toggleFocusVisible}
                color="primary"
                {...focusVisibleCheckboxProps}
              />
            }
            label={t('a11y.enable')}
          />
        </Grid>

        {/* Screen Reader Mode */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <HearingIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">{t('settings.accessibility.screenReader')}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('settings.accessibility.screenReaderDescription')}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={screenReaderOnly}
                onChange={toggleScreenReaderOnly}
                color="primary"
                {...screenReaderOnlyCheckboxProps}
              />
            }
            label={t('a11y.enable')}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Reset all settings to default
            if (highContrast) toggleHighContrast();
            if (reducedMotion) toggleReducedMotion();
            resetFontSize();
            if (focusVisible) toggleFocusVisible();
            if (screenReaderOnly) toggleScreenReaderOnly();
          }}
          {...createAccessibleButton(
            'reset-all-settings', 
            t('a11y.resetAllSettings'), 
            () => {
              // Reset all settings to default
              if (highContrast) toggleHighContrast();
              if (reducedMotion) toggleReducedMotion();
              resetFontSize();
              if (focusVisible) toggleFocusVisible();
              if (screenReaderOnly) toggleScreenReaderOnly();
            }
          )}
        >
          {t('a11y.resetAllSettings')}
        </Button>
      </Box>
    </Paper>
  );
};

export default AccessibilitySettings; 