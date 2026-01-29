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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Container, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import { useI18n } from '../contexts/I18nContext';
import AccessibilitySettings from '../components/settings/AccessibilitySettings';
import LanguageSelector from '../components/ui/LanguageSelector';
function TabPanel(props) {
    var children = props.children, value = props.value, index = props.index, other = __rest(props, ["children", "value", "index"]);
    return (_jsx("div", __assign({ role: "tabpanel", hidden: value !== index, id: "settings-tabpanel-".concat(index), "aria-labelledby": "settings-tab-".concat(index) }, other, { children: value === index && _jsx(Box, { sx: { py: 3 }, children: children }) })));
}
/**
 * Settings page component
 *
 * This component provides a user interface for configuring application settings,
 * including accessibility options and language preferences.
 */
var Settings = function () {
    var t = useI18n().t;
    var _a = React.useState(0), tabValue = _a[0], setTabValue = _a[1];
    var handleTabChange = function (event, newValue) {
        setTabValue(newValue);
    };
    return (_jsx(Container, { maxWidth: "lg", children: _jsxs(Box, { sx: { width: '100%', mt: 4, mb: 6 }, children: [_jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, children: t('settings.title') }), _jsx(Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: t('settings.description') }), _jsxs(Paper, { sx: { width: '100%', mt: 4 }, children: [_jsxs(Tabs, { value: tabValue, onChange: handleTabChange, "aria-label": t('settings.tabsLabel'), indicatorColor: "primary", textColor: "primary", variant: "fullWidth", children: [_jsx(Tab, { label: t('settings.accessibility'), id: "settings-tab-0", "aria-controls": "settings-tabpanel-0" }), _jsx(Tab, { label: t('settings.language'), id: "settings-tab-1", "aria-controls": "settings-tabpanel-1" })] }), _jsx(TabPanel, { value: tabValue, index: 0, children: _jsx(AccessibilitySettings, {}) }), _jsx(TabPanel, { value: tabValue, index: 1, children: _jsx(LanguageSelector, {}) })] })] }) }));
};
export default Settings;
