var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, IconButton, Typography, Box, List, ListItem, ListItemIcon, ListItemText, TextField, Button, Avatar, Switch, FormControlLabel, Divider, InputAdornment, useTheme, alpha, } from '@mui/material';
import { Close as CloseIcon, Person as PersonIcon, Settings as SettingsIcon, Search as SearchIcon, } from '@mui/icons-material';
import { useI18n } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
/** Resize image to fit within maxSize and return as JPEG data URL (no Firebase Storage). */
function resizeImageToDataUrl(file, maxSize, quality) {
    return new Promise(function (resolve, reject) {
        var url = URL.createObjectURL(file);
        var img = new Image();
        img.onload = function () {
            URL.revokeObjectURL(url);
            var w = img.naturalWidth;
            var h = img.naturalHeight;
            var dw = w;
            var dh = h;
            if (w > maxSize || h > maxSize) {
                if (w > h) {
                    dw = maxSize;
                    dh = (h * maxSize) / w;
                }
                else {
                    dh = maxSize;
                    dw = (w * maxSize) / h;
                }
            }
            var canvas = document.createElement('canvas');
            canvas.width = Math.round(dw);
            canvas.height = Math.round(dh);
            var ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas not supported'));
                return;
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = function () {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };
        img.src = url;
    });
}
var SettingsModal = function (_a) {
    var _b;
    var open = _a.open, onClose = _a.onClose;
    var theme = useTheme();
    var t = useI18n().t;
    var _c = useAuth(), user = _c.user, updateUserProfile = _c.updateUserProfile;
    var _d = useCustomTheme(), mode = _d.mode, toggleColorMode = _d.toggleColorMode;
    var _e = useState('account'), activeTab = _e[0], setActiveTab = _e[1];
    var _f = useState((user === null || user === void 0 ? void 0 : user.name) || ''), name = _f[0], setName = _f[1];
    var _g = useState(null), photoError = _g[0], setPhotoError = _g[1];
    var _h = useState(false), photoLoading = _h[0], setPhotoLoading = _h[1];
    var fileInputRef = useRef(null);
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
        var trimmed = name.trim();
        if (trimmed && trimmed !== (user === null || user === void 0 ? void 0 : user.name)) {
            updateUserProfile({ name: trimmed });
        }
    };
    var handleChangePhoto = function () {
        var _a;
        setPhotoError(null);
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    var handleFileChange = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var file, MAX_INPUT_SIZE, dataUrl, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file || !(user === null || user === void 0 ? void 0 : user.id))
                        return [2 /*return*/];
                    MAX_INPUT_SIZE = 4 * 1024 * 1024;
                    if (file.size > MAX_INPUT_SIZE) {
                        setPhotoError('Photo must be 4MB or smaller.');
                        event.target.value = '';
                        return [2 /*return*/];
                    }
                    if (!file.type.startsWith('image/')) {
                        setPhotoError('Please select an image file.');
                        event.target.value = '';
                        return [2 /*return*/];
                    }
                    setPhotoLoading(true);
                    setPhotoError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, resizeImageToDataUrl(file, 256, 0.75)];
                case 2:
                    dataUrl = _b.sent();
                    return [4 /*yield*/, updateUserProfile({ profilePicture: dataUrl })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _b.sent();
                    setPhotoError(err_1 instanceof Error ? err_1.message : 'Failed to process photo.');
                    return [3 /*break*/, 6];
                case 5:
                    setPhotoLoading(false);
                    event.target.value = '';
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleRemovePhoto = function () {
        updateUserProfile({ profilePicture: '' });
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
                                                            }, children: "Manage plan" })] })] }), _jsx(Divider, { sx: { mb: 4 } }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileChange, style: { display: 'none' }, "aria-hidden": "true" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1.5 }, children: "Photo" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 1 }, children: [_jsx(Avatar, { src: (user === null || user === void 0 ? void 0 : user.profilePicture) || undefined, alt: (user === null || user === void 0 ? void 0 : user.name) || 'User', sx: {
                                                                width: 64,
                                                                height: 64,
                                                                fontSize: '1.5rem',
                                                                bgcolor: theme.palette.primary.main,
                                                            }, children: ((_b = user === null || user === void 0 ? void 0 : user.name) === null || _b === void 0 ? void 0 : _b.charAt(0).toUpperCase()) || 'U' }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Button, { variant: "outlined", size: "small", onClick: handleChangePhoto, disabled: photoLoading, sx: {
                                                                        textTransform: 'none',
                                                                        borderColor: theme.palette.divider,
                                                                        color: theme.palette.text.primary,
                                                                        '&:hover': {
                                                                            borderColor: theme.palette.text.secondary,
                                                                            backgroundColor: theme.palette.action.hover,
                                                                        },
                                                                    }, children: photoLoading ? 'Uploading…' : 'Change photo' }), _jsx(Button, { variant: "outlined", size: "small", onClick: handleRemovePhoto, sx: {
                                                                        textTransform: 'none',
                                                                        borderColor: theme.palette.error.main,
                                                                        color: theme.palette.error.main,
                                                                        '&:hover': {
                                                                            borderColor: theme.palette.error.dark,
                                                                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                                        },
                                                                    }, children: "Remove photo" })] })] }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Pick a photo up to 4MB." }), photoError && (_jsx(Typography, { variant: "caption", color: "error", display: "block", sx: { mt: 0.5 }, children: photoError })), _jsx(Typography, { variant: "caption", color: "text.secondary", display: "block", sx: { mt: 0.5 }, children: "Your avatar photo will be public." })] }), _jsx(Divider, { sx: { mb: 4 } }), _jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: "Name" }), _jsx(TextField, { fullWidth: true, value: name, onChange: handleNameChange, onBlur: handleSaveName, variant: "outlined", size: "small", sx: {
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
