var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Switch, FormControlLabel, Button, Divider, Paper, Grid, IconButton, Tooltip, useTheme, } from '@mui/material';
import { Contrast as ContrastIcon, TextFields as TextFieldsIcon, Visibility as VisibilityIcon, Speed as SpeedIcon, Hearing as HearingIcon, Add as AddIcon, Remove as RemoveIcon, RestartAlt as RestartIcon, } from '@mui/icons-material';
import { useA11y } from "../../contexts/A11yContext";
import { useI18n } from "../../contexts/I18nContext";
import { createAccessibleButton, createAccessibleCheckbox } from "../../utils/a11y";
/**
 * AccessibilitySettings component
 *
 * This component provides a user interface for configuring accessibility settings
 * such as high contrast mode, reduced motion, font size, focus visibility, and screen reader mode.
 */
var AccessibilitySettings = function () {
    var theme = useTheme();
    var t = useI18n().t;
    var _a = useA11y(), highContrast = _a.highContrast, toggleHighContrast = _a.toggleHighContrast, reducedMotion = _a.reducedMotion, toggleReducedMotion = _a.toggleReducedMotion, fontSize = _a.fontSize, increaseFontSize = _a.increaseFontSize, decreaseFontSize = _a.decreaseFontSize, resetFontSize = _a.resetFontSize, focusVisible = _a.focusVisible, toggleFocusVisible = _a.toggleFocusVisible, screenReaderOnly = _a.screenReaderOnly, toggleScreenReaderOnly = _a.toggleScreenReaderOnly;
    // Create accessible button props
    var increaseFontSizeButtonProps = createAccessibleButton('increase-font-size', t('a11y.increaseFontSize'), increaseFontSize);
    var decreaseFontSizeButtonProps = createAccessibleButton('decrease-font-size', t('a11y.decreaseFontSize'), decreaseFontSize);
    var resetFontSizeButtonProps = createAccessibleButton('reset-font-size', t('a11y.resetFontSize'), resetFontSize);
    // Create accessible checkbox props
    var highContrastCheckboxProps = createAccessibleCheckbox('high-contrast', t('a11y.highContrast'), highContrast, toggleHighContrast);
    var reducedMotionCheckboxProps = createAccessibleCheckbox('reduced-motion', t('a11y.reducedMotion'), reducedMotion, toggleReducedMotion);
    var focusVisibleCheckboxProps = createAccessibleCheckbox('focus-visible', t('a11y.focusVisible'), focusVisible, toggleFocusVisible);
    var screenReaderOnlyCheckboxProps = createAccessibleCheckbox('screen-reader-only', t('a11y.screenReaderOnly'), screenReaderOnly, toggleScreenReaderOnly);
    return (_jsxs(Paper, { elevation: 3, sx: {
            p: 3,
            maxWidth: 600,
            mx: 'auto',
            my: 4,
            borderRadius: 2,
        }, children: [_jsx(Typography, { variant: "h5", component: "h2", gutterBottom: true, children: t('settings.accessibility') }), _jsx(Typography, { variant: "body2", color: "text.secondary", paragraph: true, children: t('settings.accessibility.description') }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(ContrastIcon, { sx: { mr: 1 } }), _jsx(Typography, { variant: "subtitle1", children: t('settings.accessibility.highContrast') })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", paragraph: true, children: t('settings.accessibility.highContrastDescription') }), _jsx(FormControlLabel, { control: _jsx(Switch, __assign({ checked: highContrast, onChange: toggleHighContrast, color: "primary" }, highContrastCheckboxProps)), label: t('a11y.enable') })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(SpeedIcon, { sx: { mr: 1 } }), _jsx(Typography, { variant: "subtitle1", children: t('settings.accessibility.reducedMotion') })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", paragraph: true, children: t('settings.accessibility.reducedMotionDescription') }), _jsx(FormControlLabel, { control: _jsx(Switch, __assign({ checked: reducedMotion, onChange: toggleReducedMotion, color: "primary" }, reducedMotionCheckboxProps)), label: t('a11y.enable') })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(TextFieldsIcon, { sx: { mr: 1 } }), _jsx(Typography, { variant: "subtitle1", children: t('settings.accessibility.fontSize') })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", paragraph: true, children: t('settings.accessibility.fontSizeDescription') }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Tooltip, { title: t('settings.accessibility.fontSize.decrease'), children: _jsx(IconButton, __assign({ onClick: decreaseFontSize, disabled: fontSize <= 12 }, decreaseFontSizeButtonProps, { children: _jsx(RemoveIcon, {}) })) }), _jsxs(Typography, { variant: "body1", sx: { mx: 2, minWidth: 40, textAlign: 'center' }, children: [fontSize, "px"] }), _jsx(Tooltip, { title: t('settings.accessibility.fontSize.increase'), children: _jsx(IconButton, __assign({ onClick: increaseFontSize, disabled: fontSize >= 24 }, increaseFontSizeButtonProps, { children: _jsx(AddIcon, {}) })) }), _jsx(Tooltip, { title: t('settings.accessibility.fontSize.reset'), children: _jsx(IconButton, __assign({ onClick: resetFontSize, sx: { ml: 1 } }, resetFontSizeButtonProps, { children: _jsx(RestartIcon, {}) })) })] })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(VisibilityIcon, { sx: { mr: 1 } }), _jsx(Typography, { variant: "subtitle1", children: t('settings.accessibility.focusVisible') })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", paragraph: true, children: t('settings.accessibility.focusVisibleDescription') }), _jsx(FormControlLabel, { control: _jsx(Switch, __assign({ checked: focusVisible, onChange: toggleFocusVisible, color: "primary" }, focusVisibleCheckboxProps)), label: t('a11y.enable') })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(HearingIcon, { sx: { mr: 1 } }), _jsx(Typography, { variant: "subtitle1", children: t('settings.accessibility.screenReader') })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", paragraph: true, children: t('settings.accessibility.screenReaderDescription') }), _jsx(FormControlLabel, { control: _jsx(Switch, __assign({ checked: screenReaderOnly, onChange: toggleScreenReaderOnly, color: "primary" }, screenReaderOnlyCheckboxProps)), label: t('a11y.enable') })] })] }), _jsx(Box, { sx: { mt: 4, display: 'flex', justifyContent: 'flex-end' }, children: _jsx(Button, __assign({ variant: "contained", color: "primary", onClick: function () {
                        // Reset all settings to default
                        if (highContrast)
                            toggleHighContrast();
                        if (reducedMotion)
                            toggleReducedMotion();
                        resetFontSize();
                        if (focusVisible)
                            toggleFocusVisible();
                        if (screenReaderOnly)
                            toggleScreenReaderOnly();
                    } }, createAccessibleButton('reset-all-settings', t('a11y.resetAllSettings'), function () {
                    // Reset all settings to default
                    if (highContrast)
                        toggleHighContrast();
                    if (reducedMotion)
                        toggleReducedMotion();
                    resetFontSize();
                    if (focusVisible)
                        toggleFocusVisible();
                    if (screenReaderOnly)
                        toggleScreenReaderOnly();
                }), { children: t('a11y.resetAllSettings') })) })] }));
};
export default AccessibilitySettings;
