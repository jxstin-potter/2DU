import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useMemo } from 'react';
import { Dialog, DialogContent, TextField, Box, Typography, useTheme, alpha, InputAdornment, } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useNavigate } from 'react-router-dom';
import { useSearchModal } from '../../contexts/SearchModalContext';
import { useI18n } from '../../contexts/I18nContext';
var iconMap = {
    today: CalendarTodayRoundedIcon,
    completed: CheckCircleRoundedIcon,
    settings: SettingsRoundedIcon,
};
var SearchModal = function (_a) {
    var open = _a.open, onClose = _a.onClose;
    var theme = useTheme();
    var navigate = useNavigate();
    var _b = useSearchModal(), recentViews = _b.recentViews, closeModal = _b.closeModal;
    var t = useI18n().t;
    var _c = useState(''), query = _c[0], setQuery = _c[1];
    var inputRef = useRef(null);
    var _d = useState(0), highlightedIndex = _d[0], setHighlightedIndex = _d[1];
    var filteredRecent = useMemo(function () {
        if (!query.trim())
            return recentViews;
        var q = query.toLowerCase().trim();
        return recentViews.filter(function (v) { return t(v.labelKey).toLowerCase().includes(q); });
    }, [recentViews, query, t]);
    useEffect(function () {
        if (open) {
            setQuery('');
            setHighlightedIndex(0);
            setTimeout(function () { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 0);
        }
    }, [open]);
    useEffect(function () {
        setHighlightedIndex(0);
    }, [query]);
    var handleClose = function () {
        setQuery('');
        onClose();
        closeModal();
    };
    var handleSelect = function (path) {
        navigate(path);
        handleClose();
    };
    var handleKeyDown = function (e) {
        if (e.key === 'Escape') {
            handleClose();
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(function (i) { return Math.min(i + 1, filteredRecent.length - 1); });
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(function (i) { return Math.max(i - 1, 0); });
            return;
        }
        if (e.key === 'Enter' && filteredRecent.length > 0) {
            e.preventDefault();
            handleSelect(filteredRecent[highlightedIndex].path);
        }
    };
    return (_jsx(Dialog, { open: open, onClose: handleClose, PaperProps: {
            sx: {
                width: '560px',
                maxWidth: 'calc(100vw - 32px)',
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                m: 0,
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 20px 60px -12px rgba(0, 0, 0, 0.5), 0 8px 24px -4px rgba(0, 0, 0, 0.4)'
                    : '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 8px 24px -4px rgba(0, 0, 0, 0.1)',
            },
        }, sx: {
            '& .MuiBackdrop-root': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.25)',
            },
        }, children: _jsxs(DialogContent, { sx: {
                p: 0,
                '&.MuiDialogContent-root': { padding: 0 },
            }, children: [_jsx(Box, { sx: { px: 2, pt: 2, pb: 1 }, children: _jsx(TextField, { inputRef: inputRef, fullWidth: true, size: "small", placeholder: "Search or type a command...", value: query, onChange: function (e) { return setQuery(e.target.value); }, onKeyDown: handleKeyDown, variant: "outlined", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", sx: { mr: 1 }, children: _jsx(SearchRoundedIcon, { sx: { color: theme.palette.text.secondary, fontSize: '1.25rem' } }) })),
                            endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(Typography, { component: "span", variant: "caption", sx: {
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 0.75,
                                        bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.06),
                                        color: theme.palette.text.secondary,
                                        fontFamily: 'monospace',
                                        fontSize: '0.7rem',
                                    }, children: "Ctrl K" }) })),
                            sx: {
                                backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.03),
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.12) : alpha(theme.palette.common.black, 0.12),
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.2) : alpha(theme.palette.common.black, 0.2),
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                    borderWidth: '1px',
                                },
                                '& .MuiInputBase-input': {
                                    color: theme.palette.text.primary,
                                    py: 1.25,
                                },
                            },
                        } }) }), filteredRecent.length > 0 && (_jsxs(Box, { sx: { pb: 2 }, children: [_jsx(Typography, { variant: "caption", sx: {
                                display: 'block',
                                px: 2,
                                py: 0.75,
                                color: theme.palette.text.secondary,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }, children: "Recently viewed" }), _jsx(Box, { component: "ul", sx: { m: 0, p: 0, listStyle: 'none' }, children: filteredRecent.map(function (item, index) { return (_jsx(RecentViewItem, { item: item, label: t(item.labelKey), isHighlighted: index === highlightedIndex, theme: theme, onSelect: function () { return handleSelect(item.path); }, onHover: function () { return setHighlightedIndex(index); } }, item.path)); }) })] }))] }) }));
};
function RecentViewItem(_a) {
    var item = _a.item, label = _a.label, isHighlighted = _a.isHighlighted, theme = _a.theme, onSelect = _a.onSelect, onHover = _a.onHover;
    var Icon = iconMap[item.icon];
    return (_jsxs(Box, { component: "li", onMouseEnter: onHover, onClick: onSelect, sx: {
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.25,
            cursor: 'pointer',
            borderRadius: '8px',
            mx: 1,
            backgroundColor: isHighlighted ? (theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.common.black, 0.06)) : 'transparent',
            color: theme.palette.text.primary,
            '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.common.black, 0.06),
            },
        }, children: [_jsx(Box, { sx: {
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.06),
                    color: theme.palette.text.secondary,
                }, children: _jsx(Icon, { sx: { fontSize: '1.25rem' } }) }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 500, fontSize: '0.875rem' }, children: label })] }));
}
export default SearchModal;
