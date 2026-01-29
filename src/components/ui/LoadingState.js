var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Skeleton, Typography, Button, Alert, CircularProgress, } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { t } from '../../utils/i18n';
var LoadingState = function (_a) {
    var isLoading = _a.isLoading, error = _a.error, children = _a.children, _b = _a.loadingText, loadingText = _b === void 0 ? t('common.loading') : _b, _c = _a.errorText, errorText = _c === void 0 ? t('error.defaultError') : _c, retryAction = _a.retryAction, _d = _a.variant, variant = _d === void 0 ? 'overlay' : _d, _e = _a.fullScreen, fullScreen = _e === void 0 ? false : _e;
    // Handle error state
    if (error) {
        var errorMessage = typeof error === 'string' ? error : (error === null || error === void 0 ? void 0 : error.message) || errorText;
        return (_jsx(Box, { sx: {
                display: 'flex',
                alignItems: 'center',
                p: 2,
                animation: 'fadeIn 0.3s ease-out forwards',
            }, children: _jsx(Alert, { severity: "error", action: retryAction && (_jsx(Button, { color: "inherit", size: "small", onClick: retryAction, startIcon: _jsx(RefreshIcon, {}), sx: {
                        animation: 'fadeIn 0.3s ease-out forwards',
                    }, children: t('error.tryAgain') })), children: _jsx(Typography, { variant: "body1", children: errorMessage }) }) }));
    }
    // Handle loading state
    if (isLoading) {
        if (variant === 'skeleton') {
            return (_jsx(Box, { sx: {
                    animation: 'slideIn 0.3s ease-out forwards',
                    width: '100%',
                }, children: __spreadArray([], Array(4), true).map(function (_, index) { return (_jsx(Skeleton, { variant: "rectangular", height: 60, sx: {
                        mb: index < 3 ? 1 : 0,
                        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: 1,
                    } }, index)); }) }));
        }
        if (variant === 'inline') {
            return (_jsxs(Box, { sx: {
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    animation: 'fadeIn 0.3s ease-out forwards',
                }, children: [_jsx(CircularProgress, { size: 20, sx: { mr: 2 } }), _jsx(Typography, { variant: "body2", children: loadingText })] }));
        }
        // Default overlay variant
        return (_jsxs(Box, { sx: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 1000,
                height: fullScreen ? '100vh' : '100%',
                animation: 'fadeIn 0.3s ease-out forwards',
            }, children: [_jsx(CircularProgress, { size: 40, sx: { mb: 2 } }), _jsx(Typography, { variant: "body1", children: loadingText })] }));
    }
    // Render children when not loading and no error
    return _jsx(_Fragment, { children: children });
};
export default LoadingState;
