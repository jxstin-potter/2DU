var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { t } from '../../utils/i18n';
/**
 * Error Boundary component to catch JavaScript errors in child component tree
 * Displays a fallback UI when an error occurs
 */
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hasError: false,
            error: null,
        };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        // Log error to console - in a real app, this would send to an error tracking service
        console.error('Component Error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
        });
    };
    ErrorBoundary.prototype.render = function () {
        var _a;
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsxs(Paper, { elevation: 3, sx: {
                    p: 4,
                    m: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }, children: [_jsx(Typography, { variant: "h4", color: "error", gutterBottom: true, children: t('error.somethingWentWrong') }), _jsx(Box, { sx: { my: 2 }, children: _jsx(Typography, { variant: "body1", children: ((_a = this.state.error) === null || _a === void 0 ? void 0 : _a.message) || t('error.unexpectedError') }) }), _jsx(Button, { variant: "contained", color: "primary", onClick: function () { return window.location.reload(); }, children: t('error.reloadPage') })] }));
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(Component));
export default ErrorBoundary;
