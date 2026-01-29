import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InboxIcon from '@mui/icons-material/Inbox';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LabelIcon from '@mui/icons-material/Label';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import styles from './EmptyState.module.css';
var EmptyState = function (_a) {
    var type = _a.type, onCreateTask = _a.onCreateTask;
    var theme = useTheme();
    var getIconContainerClass = function () {
        switch (type) {
            case 'today':
                return styles.iconToday;
            case 'upcoming':
                return styles.iconUpcoming;
            case 'completed':
                return styles.iconCompleted;
            case 'tags':
                return styles.iconTags;
            case 'calendar':
                return styles.iconCalendar;
            default:
                return styles.iconToday;
        }
    };
    var getIcon = function () {
        var iconSx = {
            fontSize: 60,
            color: type === 'completed'
                ? theme.palette.success.main
                : theme.palette.primary.main
        };
        switch (type) {
            case 'today':
                return _jsx(InboxIcon, { sx: iconSx });
            case 'upcoming':
                return _jsx(EventIcon, { sx: iconSx });
            case 'completed':
                return _jsx(CheckCircleIcon, { sx: iconSx });
            case 'tags':
                return _jsx(LabelIcon, { sx: iconSx });
            case 'calendar':
                return _jsx(CalendarMonthIcon, { sx: iconSx });
            default:
                return _jsx(InboxIcon, { sx: iconSx });
        }
    };
    var getTitle = function () {
        switch (type) {
            case 'today':
                return 'No tasks for today';
            case 'upcoming':
                return 'No upcoming tasks';
            case 'completed':
                return 'No completed tasks';
            case 'tags':
                return 'No tagged tasks';
            case 'calendar':
                return 'No tasks scheduled';
            default:
                return 'No tasks';
        }
    };
    var getDescription = function () {
        switch (type) {
            case 'today':
                return 'You have no tasks scheduled for today. Add a new task to get started.';
            case 'upcoming':
                return 'You have no upcoming tasks. Plan ahead by adding tasks with future due dates.';
            case 'completed':
                return 'You haven\'t completed any tasks yet. Complete tasks to see them here.';
            case 'tags':
                return 'You haven\'t tagged any tasks yet. Add tags to your tasks to organize them.';
            case 'calendar':
                return 'You have no tasks scheduled. Add tasks with due dates to see them in your calendar.';
            default:
                return 'You have no tasks. Add a new task to get started.';
        }
    };
    return (_jsxs(Box, { className: styles.container, sx: {
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.02)'
        }, children: [_jsx("div", { className: getIconContainerClass(), children: getIcon() }), _jsx(Typography, { variant: "h5", className: styles.title, sx: {
                    color: theme.palette.text.primary,
                    mb: 0.5
                }, children: getTitle() }), _jsx(Typography, { variant: "body2", className: styles.description, sx: {
                    color: theme.palette.text.secondary,
                    mb: 3,
                    maxWidth: '400px'
                }, children: getDescription() }), onCreateTask && (_jsx(Button, { variant: "contained", color: "primary", startIcon: _jsx(AddIcon, {}), onClick: onCreateTask, sx: {
                    borderRadius: '6px',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4]
                    }
                }, children: "Add New Task" }))] }));
};
export default EmptyState;
