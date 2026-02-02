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
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, AppBar, Toolbar, IconButton, useTheme, useMediaQuery, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearchModal } from '../../contexts/SearchModalContext';
import KeyboardShortcutsHelp from '../modals/KeyboardShortcutsHelp';
import SettingsModal from '../modals/SettingsModal';
import SearchModal from '../modals/SearchModal';
var MainLayout = function (_a) {
    var children = _a.children;
    var _b = useState(false), isSidebarCollapsed = _b[0], setIsSidebarCollapsed = _b[1];
    var _c = useState(false), isShortcutsModalOpen = _c[0], setIsShortcutsModalOpen = _c[1];
    var _d = useState(false), isSettingsModalOpen = _d[0], setIsSettingsModalOpen = _d[1];
    var mode = useCustomTheme().mode;
    var theme = useTheme();
    var isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    var _e = useAuth(), logout = _e.logout, user = _e.user;
    var navigate = useNavigate();
    var location = useLocation();
    var _f = useSearchModal(), isSearchModalOpen = _f.isOpen, openSearchModal = _f.openModal, closeSearchModal = _f.closeModal, recordRecentView = _f.recordRecentView;
    useEffect(function () {
        recordRecentView(location.pathname);
    }, [location.pathname, recordRecentView]);
    useEffect(function () {
        var handleKeyDown = function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openSearchModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return function () { return window.removeEventListener('keydown', handleKeyDown); };
    }, [openSearchModal]);
    var handleLogout = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, logout()];
                case 1:
                    _a.sent();
                    navigate('/login');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Logout failed:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [logout, navigate]);
    var handleOpenShortcutsHelp = useCallback(function () {
        setIsShortcutsModalOpen(true);
    }, []);
    var handleCloseShortcutsHelp = useCallback(function () {
        setIsShortcutsModalOpen(false);
    }, []);
    var handleOpenSettings = useCallback(function () {
        setIsSettingsModalOpen(true);
    }, []);
    var handleCloseSettings = useCallback(function () {
        setIsSettingsModalOpen(false);
    }, []);
    var toggleDarkMode = useCustomTheme().toggleColorMode;
    // Memoize sidebar width to prevent recalculation on every render
    var sidebarWidth = useMemo(function () { return isSidebarCollapsed ? 64 : 240; }, [isSidebarCollapsed]);
    // Memoize main content styles to prevent layout thrashing
    var mainContentStyles = useMemo(function () { return ({
        flexGrow: 1,
        width: {
            xs: '100%',
            sm: "calc(100% - ".concat(sidebarWidth, "px)")
        },
        ml: {
            xs: 0,
            sm: "".concat(sidebarWidth, "px")
        },
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    }); }, [sidebarWidth, theme]);
    var appBarStyles = useMemo(function () { return ({
        width: {
            xs: '100%',
            sm: "calc(100% - ".concat(sidebarWidth, "px)")
        },
        ml: {
            xs: 0,
            sm: "".concat(sidebarWidth, "px")
        },
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: theme.palette.background.default,
    }); }, [sidebarWidth, theme]);
    return (_jsxs(Box, { sx: { display: 'flex', minHeight: '100vh' }, children: [_jsx(Sidebar, { isCollapsed: isSidebarCollapsed, onToggleCollapse: function () { return setIsSidebarCollapsed(function (prev) { return !prev; }); }, darkMode: mode === 'dark', toggleDarkMode: toggleDarkMode, onLogout: handleLogout, user: user, userName: user === null || user === void 0 ? void 0 : user.name, onOpenShortcutsHelp: handleOpenShortcutsHelp, onOpenSettings: handleOpenSettings }), _jsx(KeyboardShortcutsHelp, { open: isShortcutsModalOpen, onClose: handleCloseShortcutsHelp }), _jsx(SettingsModal, { open: isSettingsModalOpen, onClose: handleCloseSettings }), _jsx(SearchModal, { open: isSearchModalOpen, onClose: closeSearchModal }), _jsxs(Box, { component: "main", sx: mainContentStyles, children: [_jsx(AppBar, { position: "fixed", elevation: 0, sx: appBarStyles, children: _jsx(Toolbar, { children: isMobile && (_jsx(IconButton, { edge: "start", color: "inherit", "aria-label": "menu", sx: { mr: 2 }, onClick: function () { return setIsSidebarCollapsed(!isSidebarCollapsed); }, children: _jsx(MenuIcon, {}) })) }) }), _jsx(Box, { sx: {
                            mt: { xs: 7, sm: 8 },
                            pt: 0,
                            pb: 3,
                            pl: 0,
                            pr: { xs: 2, sm: 3 },
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            width: '100%',
                            minHeight: 'calc(100vh - 64px)',
                        }, children: children })] })] }));
};
export default MainLayout;
