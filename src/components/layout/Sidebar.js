import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, useTheme, Typography, Tooltip, Menu, MenuItem, Avatar, Divider, alpha, } from '@mui/material';
import { Inbox as InboxIcon, Event as EventIcon, LocalOffer as TagIcon, CheckCircle as CompletedIcon, Logout as LogoutIcon, Settings as SettingsIcon, Keyboard as KeyboardIcon, Add as AddIcon, Search as SearchIcon, HelpOutline as HelpIcon, } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { useTaskModal } from '../../contexts/TaskModalContext';
import { useSearchModal } from '../../contexts/SearchModalContext';
import SidebarToggleIcon from '../ui/SidebarToggleIcon';
import ThinArrowDownIcon from '../ui/ThinArrowDownIcon';
var Sidebar = function (_a) {
    var isCollapsed = _a.isCollapsed, onToggleCollapse = _a.onToggleCollapse, darkMode = _a.darkMode, toggleDarkMode = _a.toggleDarkMode, onLogout = _a.onLogout, userName = _a.userName, user = _a.user, onOpenShortcutsHelp = _a.onOpenShortcutsHelp, onOpenSettings = _a.onOpenSettings;
    var theme = useTheme();
    var navigate = useNavigate();
    var location = useLocation();
    var t = useI18n().t;
    var openModal = useTaskModal().openModal;
    var openSearchModal = useSearchModal().openModal;
    // Menu anchor states
    var _b = useState(null), profileAnchorEl = _b[0], setProfileAnchorEl = _b[1];
    var _c = useState(null), helpAnchorEl = _c[0], setHelpAnchorEl = _c[1];
    var displayName = (user === null || user === void 0 ? void 0 : user.name) || userName || t('sidebar.user');
    var profilePicture = user === null || user === void 0 ? void 0 : user.profilePicture;
    var handleProfileMenuOpen = function (event) {
        setProfileAnchorEl(event.currentTarget);
    };
    var handleProfileMenuClose = function () {
        setProfileAnchorEl(null);
    };
    var handleHelpMenuOpen = function (event) {
        setHelpAnchorEl(event.currentTarget);
    };
    var handleHelpMenuClose = function () {
        setHelpAnchorEl(null);
    };
    var handleSettings = function () {
        handleProfileMenuClose();
        if (onOpenSettings) {
            onOpenSettings();
        }
        else {
            navigate('/settings');
        }
    };
    var handleLogout = function () {
        handleProfileMenuClose();
        onLogout();
    };
    var handleKeyboardShortcuts = function () {
        handleHelpMenuClose();
        onOpenShortcutsHelp();
    };
    var iconSpacing = 0.75;
    var mainMenuItems = [
        { text: t('sidebar.today'), icon: _jsx(InboxIcon, {}), path: "/today" },
        { text: t('sidebar.upcoming'), icon: _jsx(EventIcon, {}), path: "/upcoming" },
        { text: t('sidebar.tags'), icon: _jsx(TagIcon, {}), path: "/tags" },
        { text: t('sidebar.completed'), icon: _jsx(CompletedIcon, {}), path: "/completed" },
    ];
    var renderMenuItem = useCallback(function (item, isCollapsed) {
        var isActive = location.pathname === item.path;
        var offWhiteColor = theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.1)
            : alpha(theme.palette.common.white, 0.7);
        return (_jsx(ListItem, { button: true, onClick: function () { return navigate(item.path); }, sx: {
                minHeight: 32,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                mb: 0.25,
                backgroundColor: isActive ? offWhiteColor : 'transparent',
                color: 'text.primary',
                '&:hover': {
                    backgroundColor: isActive ? offWhiteColor : 'action.hover',
                },
                '& .MuiListItemIcon-root': {
                    color: isActive ? '#5c4e00' : 'text.secondary',
                    minWidth: 36,
                },
            }, children: isCollapsed ? (_jsx(Tooltip, { title: item.text, placement: "right", children: _jsx(ListItemIcon, { sx: {
                        minWidth: 0,
                        justifyContent: 'center',
                        color: isActive ? '#5c4e00' : 'text.secondary',
                        '& svg': {
                            fontSize: '1.25rem',
                        },
                    }, children: item.icon }) })) : (_jsxs(_Fragment, { children: [_jsx(ListItemIcon, { sx: {
                            minWidth: 36,
                            mr: iconSpacing,
                            justifyContent: 'center',
                            color: isActive ? '#5c4e00' : 'text.secondary',
                            '& svg': {
                                fontSize: '1.25rem',
                            },
                        }, children: item.icon }), _jsx(ListItemText, { primary: item.text, primaryTypographyProps: {
                            variant: 'body2',
                            sx: { fontSize: '0.8125rem' }
                        } })] })) }, item.path));
    }, [location.pathname, navigate, isCollapsed, theme.palette.mode]);
    var drawerWidth = isCollapsed ? 64 : 240;
    var drawerStyles = {
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            transition: theme.transitions.create(['width', 'transform'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            willChange: 'width',
        },
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Drawer, { variant: "permanent", sx: drawerStyles, children: [_jsxs(Box, { sx: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed ? 'center' : 'space-between',
                            p: 1,
                            px: 1.5,
                            minHeight: 40,
                            height: 40,
                        }, children: [!isCollapsed ? (_jsxs(Box, { sx: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.75,
                                    flex: 1,
                                    minWidth: 0,
                                }, children: [_jsx(Avatar, { src: profilePicture, alt: displayName, sx: {
                                            width: 28,
                                            height: 28,
                                            fontSize: '0.75rem',
                                            bgcolor: theme.palette.primary.main,
                                        }, children: displayName.charAt(0).toUpperCase() }), _jsx(Typography, { variant: "body2", sx: {
                                            fontSize: '0.8125rem',
                                            fontWeight: 500,
                                            maxWidth: 140,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }, children: displayName }), _jsx(IconButton, { onClick: handleProfileMenuOpen, "aria-label": t('sidebar.openProfileMenu'), size: "small", sx: {
                                            color: theme.palette.text.primary,
                                            p: 0.25,
                                            ml: -0.25,
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                        }, children: _jsx(ThinArrowDownIcon, { sx: { fontSize: '1rem' } }) })] })) : null, _jsx(IconButton, { onClick: onToggleCollapse, "aria-label": isCollapsed ? 'Open sidebar' : 'Close sidebar', "aria-controls": "sidebar", "aria-expanded": !isCollapsed, sx: {
                                    ml: isCollapsed ? 0 : -0.5,
                                    mr: isCollapsed ? 0 : -0.5,
                                    color: theme.palette.text.secondary,
                                    p: 0.5,
                                    '&:hover': {
                                        color: theme.palette.primary.main,
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                    transition: 'all 0.2s ease',
                                }, children: _jsx(SidebarToggleIcon, { isCollapsed: isCollapsed, sx: { fontSize: '1rem' } }) })] }), !isCollapsed && (_jsxs(_Fragment, { children: [_jsxs(List, { sx: {
                                    px: 1,
                                    '& .MuiListItemIcon-root': {
                                        mr: iconSpacing,
                                    },
                                }, children: [_jsxs(ListItem, { button: true, onClick: openModal, sx: {
                                            minHeight: 32,
                                            justifyContent: 'initial',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 1,
                                            mb: 0.25,
                                            backgroundColor: 'transparent',
                                            color: 'text.primary',
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                            '& .MuiListItemIcon-root': {
                                                minWidth: 36,
                                                color: 'text.secondary',
                                            },
                                        }, children: [_jsx(ListItemIcon, { sx: {
                                                    minWidth: 36,
                                                    justifyContent: 'center',
                                                    color: 'text.secondary',
                                                    '& svg': {
                                                        fontSize: '1.25rem',
                                                    },
                                                }, children: _jsx(Box, { sx: {
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#5c4e00', // Gold color
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }, children: _jsx(AddIcon, { sx: { fontSize: '1rem', color: 'inherit' } }) }) }), _jsx(ListItemText, { primary: "Add task", primaryTypographyProps: {
                                                    variant: 'body2',
                                                    sx: {
                                                        fontSize: '0.8125rem',
                                                        color: '#5c4e00', // Match the gold circle color
                                                    }
                                                } })] }), _jsxs(ListItem, { button: true, onClick: openSearchModal, sx: {
                                            minHeight: 32,
                                            justifyContent: 'initial',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 1,
                                            mb: 0.25,
                                            backgroundColor: 'transparent',
                                            color: 'text.primary',
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                            '& .MuiListItemIcon-root': {
                                                minWidth: 36,
                                            },
                                        }, children: [_jsx(ListItemIcon, { sx: {
                                                    minWidth: 36,
                                                    justifyContent: 'center',
                                                    color: 'text.secondary',
                                                    '& svg': {
                                                        fontSize: '1.25rem',
                                                    },
                                                }, children: _jsx(SearchIcon, {}) }), _jsx(ListItemText, { primary: "Search", primaryTypographyProps: {
                                                    variant: 'body2',
                                                    sx: { fontSize: '0.8125rem' }
                                                } })] }), mainMenuItems.map(function (item) { return renderMenuItem(item, false); })] }), _jsx(Box, { sx: { flexGrow: 1 } }), _jsx(List, { sx: {
                                    px: 1,
                                    '& .MuiListItemIcon-root': {
                                        mr: iconSpacing,
                                    },
                                }, children: _jsxs(ListItem, { button: true, onClick: handleHelpMenuOpen, sx: {
                                        minHeight: 32,
                                        justifyContent: 'initial',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 1,
                                        mb: 0.25,
                                        color: 'text.primary',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'text.secondary',
                                            minWidth: 36,
                                        },
                                    }, children: [_jsx(ListItemIcon, { sx: {
                                                minWidth: 36,
                                                justifyContent: 'center',
                                                color: 'text.secondary',
                                                '& svg': {
                                                    fontSize: '1.25rem',
                                                },
                                            }, children: _jsx(HelpIcon, {}) }), _jsx(ListItemText, { primary: t('sidebar.helpResources'), primaryTypographyProps: {
                                                variant: 'body2',
                                                sx: { fontSize: '0.8125rem' }
                                            } })] }) })] }))] }), _jsxs(Menu, { anchorEl: profileAnchorEl, open: Boolean(profileAnchorEl), onClose: handleProfileMenuClose, anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                }, transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                }, disablePortal: false, children: [_jsxs(MenuItem, { onClick: handleSettings, children: [_jsx(ListItemIcon, { children: _jsx(SettingsIcon, { fontSize: "small" }) }), _jsx(ListItemText, { primary: t('sidebar.settings') })] }), _jsx(Divider, {}), _jsxs(MenuItem, { onClick: handleLogout, children: [_jsx(ListItemIcon, { children: _jsx(LogoutIcon, { fontSize: "small" }) }), _jsx(ListItemText, { primary: t('sidebar.logout') })] })] }), _jsx(Menu, { anchorEl: helpAnchorEl, open: Boolean(helpAnchorEl), onClose: handleHelpMenuClose, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, transformOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                }, disablePortal: false, children: _jsxs(MenuItem, { onClick: handleKeyboardShortcuts, children: [_jsx(ListItemIcon, { children: _jsx(KeyboardIcon, { fontSize: "small" }) }), _jsx(ListItemText, { primary: t('sidebar.keyboardShortcuts') })] }) })] }));
};
export default Sidebar;
