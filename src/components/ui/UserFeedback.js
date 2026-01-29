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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, createContext, useContext, useMemo, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle, Button, Box, Typography } from '@mui/material';
// Feedback types
export var FeedbackType;
(function (FeedbackType) {
    FeedbackType["SUCCESS"] = "success";
    FeedbackType["ERROR"] = "error";
    FeedbackType["WARNING"] = "warning";
    FeedbackType["INFO"] = "info";
})(FeedbackType || (FeedbackType = {}));
var FeedbackContext = createContext(undefined);
// Feedback provider component
export var FeedbackProvider = function (_a) {
    var children = _a.children;
    var _b = useState([]), feedbacks = _b[0], setFeedbacks = _b[1];
    // Hide feedback
    var hideFeedback = useCallback(function (id) {
        setFeedbacks(function (prev) { return prev.filter(function (feedback) { return feedback.id !== id; }); });
    }, []);
    // Show feedback
    var showFeedback = useCallback(function (feedback) {
        var id = Math.random().toString(36).substring(2, 9);
        var newFeedback = __assign(__assign({}, feedback), { id: id, timestamp: Date.now() });
        setFeedbacks(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newFeedback], false); });
        // Auto-hide after duration
        if (feedback.autoHideDuration !== 0) {
            setTimeout(function () {
                hideFeedback(id);
            }, feedback.autoHideDuration || 6000);
        }
    }, [hideFeedback]);
    // Clear all feedback
    var clearAllFeedback = useCallback(function () {
        setFeedbacks([]);
    }, []);
    // Context value - memoize to prevent unnecessary re-renders
    var contextValue = useMemo(function () { return ({
        showFeedback: showFeedback,
        hideFeedback: hideFeedback,
        clearAllFeedback: clearAllFeedback,
    }); }, [showFeedback, hideFeedback, clearAllFeedback]);
    return (_jsxs(FeedbackContext.Provider, { value: contextValue, children: [children, _jsx(FeedbackContainer, { feedbacks: feedbacks, onClose: hideFeedback })] }));
};
// Feedback container component
var FeedbackContainer = function (_a) {
    var feedbacks = _a.feedbacks, onClose = _a.onClose;
    // Group feedbacks by type
    var groupedFeedbacks = feedbacks.reduce(function (acc, feedback) {
        if (!acc[feedback.type]) {
            acc[feedback.type] = [];
        }
        acc[feedback.type].push(feedback);
        return acc;
    }, {});
    // Get the most recent feedback of each type
    var latestFeedbacks = Object.values(groupedFeedbacks).map(function (group) {
        return group.sort(function (a, b) { return b.timestamp - a.timestamp; })[0];
    });
    return (_jsx(Box, { sx: {
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
        }, children: latestFeedbacks.map(function (feedback) { return (_jsx(Snackbar, { open: true, anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, sx: { position: 'relative', bottom: 0, right: 0 }, children: _jsxs(Alert, { severity: feedback.type, onClose: function () { return onClose(feedback.id); }, sx: { width: '100%', minWidth: 300 }, action: feedback.action && (_jsx(Button, { color: "inherit", size: "small", onClick: feedback.action.onClick, children: feedback.action.label })), children: [feedback.title && _jsx(AlertTitle, { children: feedback.title }), _jsx(Typography, { variant: "body2", children: feedback.message })] }) }, feedback.id)); }) }));
};
// Custom hook to use feedback
export var useFeedback = function () {
    var context = useContext(FeedbackContext);
    if (!context) {
        throw new Error('useFeedback must be used within a FeedbackProvider');
    }
    return context;
};
// Helper functions to show specific types of feedback
export var showSuccessFeedback = function (message, title, action) {
    var showFeedback = useFeedback().showFeedback;
    showFeedback({
        type: FeedbackType.SUCCESS,
        title: title,
        message: message,
        action: action,
    });
};
export var showErrorFeedback = function (message, title, action) {
    var showFeedback = useFeedback().showFeedback;
    showFeedback({
        type: FeedbackType.ERROR,
        title: title,
        message: message,
        action: action,
        autoHideDuration: 0, // Don't auto-hide errors
    });
};
export var showWarningFeedback = function (message, title, action) {
    var showFeedback = useFeedback().showFeedback;
    showFeedback({
        type: FeedbackType.WARNING,
        title: title,
        message: message,
        action: action,
    });
};
export var showInfoFeedback = function (message, title, action) {
    var showFeedback = useFeedback().showFeedback;
    showFeedback({
        type: FeedbackType.INFO,
        title: title,
        message: message,
        action: action,
    });
};
export default FeedbackProvider;
