import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, Typography, Box, List, ListItem, ListItemIcon, ListItemText, TextField, Button, Avatar, Switch, FormControlLabel, Divider, InputAdornment, useTheme, alpha, } from '@mui/material';
import { Close as CloseIcon, Person as PersonIcon, Settings as SettingsIcon, Search as SearchIcon, } from '@mui/icons-material';
import { useI18n } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
var SettingsModal = function (_a) {
    var _b;
    var open = _a.open, onClose = _a.onClose;
    var theme = useTheme();
    var t = useI18n().t;
    var user = useAuth().user;
    var _c = useCustomTheme(), mode = _c.mode, toggleColorMode = _c.toggleColorMode;
    var _d = useState('account'), activeTab = _d[0], setActiveTab = _d[1];
    var _e = useState((user === null || user === void 0 ? void 0 : user.name) || ''), name = _e[0], setName = _e[1];
    React.useEffect(function () {
        setName((user === null || user === void 0 ? void 0 : user.name) || '');
    }, [user === null || user === void 0 ? void 0 : user.name]);
    var handleTabChange = function (tab) {
        setActiveTab(tab);
    };
    var handleNameChange = function (event) {
        setName(event.target.value);
    };
    var handleSaveName = function () {
        // TODO: Implement name update to Firestore
    };
    var handleChangePhoto = function () {
        // TODO: Implement photo change
    };
    var handleRemovePhoto = function () {
        // TODO: Implement photo removal
    };
    var handleChangeEmail = function () {
        // TODO: Implement email change
    };
    var handleAddPassword = function () {
        // TODO: Implement password addition
    };
    var handleManagePlan = function () {
        // TODO: Implement plan management
    };
    var settingsTabs = [
        { id: 'account', label: 'Account', icon: _jsx(PersonIcon, {}) },
        { id: 'general', label: 'General', icon: _jsx(SettingsIcon, {}) },
    ];
    return (_jsx(Dialog, { open: open, onClose: onClose, maxWidth: "lg", fullWidth: true, PaperProps: {
            sx: {
                maxWidth: '900px',
                height: '80vh',
                maxHeight: '700px',
                borderRadius: 2,
                overflow: 'hidden',
            },
        }, children: _jsxs(DialogContent, { sx: { p: 0, height: '100%', display: 'flex', flexDirection: 'column' }, children: [_jsxs(Box, { sx: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderBottom: "1px solid ".concat(theme.palette.divider),
                    }, children: [_jsx(Typography, { variant: "h6", fontWeight: "bold", children: "Settings" }), _jsx(IconButton, { onClick: onClose, size: "small", children: _jsx(CloseIcon, {}) })] }), _jsxs(Box, { sx: { display: 'flex', flex: 1, overflow: 'hidden' }, children: [_jsxs(Box, { sx: {
                                width: 240,
                                borderRight: "1px solid ".concat(theme.palette.divider),
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }, children: [_jsx(Box, { sx: { p: 2, borderBottom: "1px solid ".concat(theme.palette.divider) }, children: _jsx(TextField, { placeholder: "Search", size: "small", fullWidth: true, InputProps: {
                                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, { fontSize: "small" }) })),
                                        }, sx: {
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: alpha(theme.palette.action.hover, 0.3),
                                            },
                                        } }) }), _jsx(List, { sx: { flex: 1, overflow: 'auto', py: 1 }, children: settingsTabs.map(function (tab) { return (_jsxs(ListItem, { button: true, onClick: function () { return handleTabChange(tab.id); }, selected: activeTab === tab.id, sx: {
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
                                        }, children: [_jsx(ListItemIcon, { sx: { minWidth: 40 }, children: tab.icon }), _jsx(ListItemText, { primary: tab.label, primaryTypographyProps: {
                                                    fontSize: '0.875rem',
                                                    fontWeight: activeTab === tab.id ? 500 : 400,
                                                } })] }, tab.id)); }) })] }), _jsxs(Box, { sx: {
                                flex: 1,
                                overflow: 'auto',
                                p: 3,
                            }, children: [activeTab === 'account' && (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", fontWeight: "bold", sx: { mb: 3 }, children: "Account" }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }, children: _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 0.5 }, children: "Plan" }) }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsx(Typography, { variant: "body1", children: "Beginner" }), _jsx(Button, { variant: "outlined", size: "small", onClick: handleManagePlan, sx: {
                                                                textTransform: 'none',
                                                                borderColor: theme.palette.divider,
                                                                color: theme.palette.text.primary,
                                                                '&:hover': {
                                                                    borderColor: theme.palette.text.secondary,
                                                                    backgroundColor: theme.palette.action.hover,
                                                                },
                                                            }, children: "Manage plan" })] })] }), _jsx(Divider, { sx: { mb: 4 } }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1.5 }, children: "Photo" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 1 }, children: [_jsx(Avatar, { src: user === null || user === void 0 ? void 0 : user.profilePicture, alt: (user === null || user === void 0 ? void 0 : user.name) || 'User', sx: {
                                                                width: 64,
                                                                height: 64,
                                                                fontSize: '1.5rem',
                                                                bgcolor: theme.palette.primary.main,
                                                            }, children: ((_b = user === null || user === void 0 ? void 0 : user.name) === null || _b === void 0 ? void 0 : _b.charAt(0).toUpperCase()) || 'U' }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Button, { variant: "outlined", size: "small", onClick: handleChangePhoto, sx: {
                                                                        textTransform: 'none',
                                                                        borderColor: theme.palette.divider,
                                                                        color: theme.palette.text.primary,
                                                                        '&:hover': {
                                                                            borderColor: theme.palette.text.secondary,
                                                                            backgroundColor: theme.palette.action.hover,
                                                                        },
                                                                    }, children: "Change photo" }), _jsx(Button, { variant: "outlined", size: "small", onClick: handleRemovePhoto, sx: {
                                                                        textTransform: 'none',
                                                                        borderColor: theme.palette.error.main,
                                                                        color: theme.palette.error.main,
                                                                        '&:hover': {
                                                                            borderColor: theme.palette.error.dark,
                                                                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                                        },
                                                                    }, children: "Remove photo" })] })] }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Pick a photo up to 4MB." }), _jsx(Typography, { variant: "caption", color: "text.secondary", display: "block", sx: { mt: 0.5 }, children: "Your avatar photo will be public." })] }), _jsx(Divider, { sx: { mb: 4 } }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: "Name" }), _jsx(TextField, { fullWidth: true, value: name, onChange: handleNameChange, onBlur: handleSaveName, variant: "outlined", size: "small", sx: {
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: theme.palette.background.paper,
                                                        },
                                                    } }), _jsxs(Typography, { variant: "caption", color: "text.secondary", sx: { mt: 0.5, display: 'block' }, children: [name.length, "/255"] })] }), _jsx(Divider, { sx: { mb: 4 } }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: "Email" }), _jsx(Typography, { variant: "body1", sx: { mb: 1.5 }, children: (user === null || user === void 0 ? void 0 : user.email) || 'No email' }), _jsx(Button, { variant: "outlined", size: "small", onClick: handleChangeEmail, sx: {
                                                        textTransform: 'none',
                                                        borderColor: theme.palette.divider,
                                                        color: theme.palette.text.primary,
                                                        '&:hover': {
                                                            borderColor: theme.palette.text.secondary,
                                                            backgroundColor: theme.palette.action.hover,
                                                        },
                                                    }, children: "Change email" })] }), _jsx(Divider, { sx: { mb: 4 } }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: "Password" }), _jsx(Button, { variant: "outlined", size: "small", onClick: handleAddPassword, sx: {
                                                        textTransform: 'none',
                                                        borderColor: theme.palette.divider,
                                                        color: theme.palette.text.primary,
                                                        '&:hover': {
                                                            borderColor: theme.palette.text.secondary,
                                                            backgroundColor: theme.palette.action.hover,
                                                        },
                                                    }, children: "Add password" })] }), _jsx(Divider, { sx: { mb: 4 } }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Two-factor authentication" }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: false, onChange: function () { }, size: "small" }), label: "" })] }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "2FA is disabled on your account." })] }), _jsx(Divider, { sx: { mb: 4 } }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: "Connected accounts" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "No connected accounts" })] })] })), activeTab === 'general' && (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", fontWeight: "bold", sx: { mb: 3 }, children: "General" }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 0.5 }, children: "Theme" }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Choose between light and dark mode" })] }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: mode === 'dark', onChange: toggleColorMode, size: "small" }), label: "" })] }), _jsx(Typography, { variant: "body2", color: "text.primary", children: mode === 'dark' ? 'Dark mode' : 'Light mode' })] }), _jsx(Divider, { sx: { mb: 4 } }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: "Language" }), _jsx(Typography, { variant: "body1", children: "English" }), _jsx(Typography, { variant: "caption", color: "text.secondary", sx: { mt: 0.5, display: 'block' }, children: "Changes will take effect immediately" })] })] }))] })] })] }) }));
};
export default SettingsModal;
