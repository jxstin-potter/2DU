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
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Paper, useTheme, } from '@mui/material';
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
var LanguageSelector = function () {
    var theme = useTheme();
    var _a = useI18n(), language = _a.language, setLanguage = _a.setLanguage, t = _a.t;
    // Create accessible select props
    var languageSelectProps = createAccessibleSelect('language-select', t('settings.language'), language, function (event) { return setLanguage(event.target.value); });
    return (_jsxs(Paper, { elevation: 3, sx: {
            p: 3,
            maxWidth: 600,
            mx: 'auto',
            my: 4,
            borderRadius: 2,
        }, children: [_jsx(Typography, { variant: "h5", component: "h2", gutterBottom: true, children: t('settings.language') }), _jsx(Typography, { variant: "body2", color: "text.secondary", paragraph: true, children: t('settings.language.select') }), _jsx(Box, { sx: { mt: 3 }, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "language-select-label", children: t('settings.language.select') }), _jsx(Select, __assign({ labelId: "language-select-label", value: language, label: t('settings.language.select'), onChange: function (event) { return setLanguage(event.target.value); } }, languageSelectProps, { children: supportedLanguages.map(function (lang) { return (_jsx(MenuItem, { value: lang.code, children: lang.name }, lang.code)); }) }))] }) }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 2 }, children: t('settings.language.note') })] }));
};
export default LanguageSelector;
