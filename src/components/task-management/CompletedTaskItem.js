import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Box, Typography, Avatar, } from '@mui/material';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
var CompletedTaskItem = function (_a) {
    var task = _a.task;
    var user = useAuth().user;
    var completionTime = useMemo(function () {
        if (!task.updatedAt)
            return '';
        return format(new Date(task.updatedAt), 'h:mm a');
    }, [task.updatedAt]);
    var formattedDate = useMemo(function () {
        if (!task.updatedAt)
            return '';
        var taskDate = new Date(task.updatedAt);
        var today = new Date();
        var yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (taskDate.toDateString() === today.toDateString()) {
            return format(taskDate, "MMM d 'Today' ‧ EEEE");
        }
        else if (taskDate.toDateString() === yesterday.toDateString()) {
            return format(taskDate, "MMM d 'Yesterday' ‧ EEEE");
        }
        else {
            return format(taskDate, 'MMM d ‧ EEEE');
        }
    }, [task.updatedAt]);
    var userInitials = useMemo(function () {
        if (user === null || user === void 0 ? void 0 : user.name) {
            return user.name
                .split(' ')
                .map(function (n) { return n[0]; })
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return 'U';
    }, [user === null || user === void 0 ? void 0 : user.name]);
    return (_jsx(Box, { component: "div", sx: {
            textDecoration: 'none',
            color: 'inherit',
            display: 'block',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: 'action.hover',
            },
        }, children: _jsxs(Box, { sx: {
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1.5,
                px: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
            }, children: [_jsx(Avatar, { sx: {
                        width: 24,
                        height: 24,
                        fontSize: '0.75rem',
                        bgcolor: 'primary.main',
                    }, children: userInitials }), _jsxs(Box, { sx: { flex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }, children: [_jsx(Typography, { variant: "body2", sx: {
                                color: 'text.secondary',
                                fontSize: '0.875rem',
                            }, children: "You completed" }), _jsx(Box, { sx: {
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                border: '2px solid',
                                borderColor: 'error.main',
                                flexShrink: 0,
                            } }), _jsx(Typography, { variant: "body2", sx: {
                                textDecoration: 'line-through',
                                color: 'text.secondary',
                                fontSize: '0.875rem',
                                flex: 1,
                            }, children: task.title }), _jsx(Typography, { variant: "body2", sx: {
                                color: 'text.secondary',
                                fontSize: '0.875rem',
                            }, children: "Inbox" }), _jsx(Typography, { variant: "body2", sx: {
                                color: 'text.secondary',
                                fontSize: '0.875rem',
                            }, children: completionTime })] })] }) }));
};
export default CompletedTaskItem;
