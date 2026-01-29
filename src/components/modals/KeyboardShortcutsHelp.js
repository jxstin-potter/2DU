import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, useTheme, Divider, alpha, } from '@mui/material';
import { Close as CloseIcon, KeyboardArrowUp as ArrowUpIcon, KeyboardArrowDown as ArrowDownIcon, KeyboardArrowLeft as ArrowLeftIcon, KeyboardArrowRight as ArrowRightIcon, } from '@mui/icons-material';
import { useI18n } from '../../contexts/I18nContext';
var KeyboardShortcutsHelp = function (_a) {
    var open = _a.open, onClose = _a.onClose;
    var theme = useTheme();
    var t = useI18n().t;
    var shortcuts = [
        {
            title: 'General',
            items: [
                { key: 'Enter', description: 'Open task view' },
                { key: 'X', description: 'Select task' },
                { key: 'Ctrl A', description: 'Select all tasks' },
                { key: '↑ or K', description: 'Move focus up' },
                { key: '↓ or J', description: 'Move focus down' },
                { key: '←', description: 'Move focus to the left' },
                { key: '→', description: 'Move focus to the right' },
                { key: 'Esc', description: 'Dismiss/cancel' },
                { key: 'Z or Ctrl Z', description: 'Undo' },
                { key: 'Ctrl K', description: 'Open Quick Find' },
                { key: '?', description: 'Show keyboard shortcuts' },
                { key: 'M', description: 'Open/close sidebar' },
            ],
        },
        {
            title: 'Quick Add',
            items: [
                { key: 'Q', description: 'Add task' },
                { key: '⇧ Q', description: 'Dictate tasks with Ramble' },
                { key: '#', description: 'Pick project' },
                { key: '/', description: 'Pick section' },
                { key: '+', description: 'Add assignee' },
                { key: '@', description: 'Add label' },
                { key: 'P1, P2, P3, P4', description: 'Set priority' },
                { key: '!', description: 'Add reminder' },
            ],
        },
        {
            title: 'Navigate',
            items: [
                { key: 'G then H or H', description: 'Go to home' },
                { key: 'G then i', description: 'Go to Inbox' },
                { key: 'G then T', description: 'Go to Today' },
            ],
        },
    ];
    var renderKey = function (keyString) {
        var parts = keyString.split(' ');
        return (_jsx(Box, { sx: { display: 'flex', alignItems: 'center', gap: 0.5 }, children: parts.map(function (part, index) {
                if (part === '↑') {
                    return _jsx(ArrowUpIcon, { sx: { fontSize: '1rem' } }, index);
                }
                if (part === '↓') {
                    return _jsx(ArrowDownIcon, { sx: { fontSize: '1rem' } }, index);
                }
                if (part === '←') {
                    return _jsx(ArrowLeftIcon, { sx: { fontSize: '1rem' } }, index);
                }
                if (part === '→') {
                    return _jsx(ArrowRightIcon, { sx: { fontSize: '1rem' } }, index);
                }
                if (part === '⇧') {
                    return (_jsx(Typography, { component: "span", sx: {
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            fontFamily: 'monospace',
                        }, children: "\u21E7" }, index));
                }
                if (part === 'then' || part === 'or') {
                    return (_jsx(Typography, { component: "span", variant: "body2", sx: { mx: 0.5, color: 'text.secondary' }, children: part }, index));
                }
                return (_jsx(Box, { component: "span", sx: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '24px',
                        height: '24px',
                        px: 1,
                        py: 0.5,
                        borderRadius: '4px',
                        bgcolor: alpha(theme.palette.text.primary, 0.08),
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                    }, children: part }, index));
            }) }));
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, PaperProps: {
            sx: {
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                maxHeight: '80vh',
            },
        }, children: [_jsxs(DialogTitle, { sx: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 2,
                }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Typography, { variant: "h6", component: "h2", fontWeight: "bold", children: "Keyboard Shortcuts" }), _jsx(Box, { sx: {
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    bgcolor: alpha(theme.palette.text.secondary, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }, children: _jsx(Typography, { variant: "caption", color: "text.secondary", children: "?" }) })] }), _jsx(IconButton, { onClick: onClose, size: "small", sx: {
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                color: theme.palette.text.primary,
                            },
                        }, children: _jsx(CloseIcon, {}) })] }), _jsx(DialogContent, { sx: {
                    px: 3,
                    pb: 2,
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        bgcolor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        bgcolor: alpha(theme.palette.text.secondary, 0.2),
                        borderRadius: '4px',
                        '&:hover': {
                            bgcolor: alpha(theme.palette.text.secondary, 0.3),
                        },
                    },
                }, children: shortcuts.map(function (section, sectionIndex) { return (_jsxs(Box, { sx: { mb: sectionIndex < shortcuts.length - 1 ? 3 : 0 }, children: [_jsx(Typography, { variant: "subtitle2", fontWeight: "bold", sx: {
                                mb: 2,
                                color: theme.palette.text.primary,
                                fontSize: '0.875rem',
                            }, children: section.title }), _jsx(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 0 }, children: section.items.map(function (item, itemIndex) { return (_jsxs(React.Fragment, { children: [_jsxs(Box, { sx: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            py: 1.5,
                                            px: 0,
                                        }, children: [_jsx(Typography, { variant: "body2", sx: {
                                                    fontSize: '0.875rem',
                                                    color: theme.palette.text.primary,
                                                }, children: item.description }), renderKey(item.key)] }), itemIndex < section.items.length - 1 && (_jsx(Divider, { sx: { my: 0 } }))] }, item.key)); }) }), sectionIndex < shortcuts.length - 1 && (_jsx(Divider, { sx: { mt: 2, mb: 0 } }))] }, section.title)); }) })] }));
};
export default KeyboardShortcutsHelp;
