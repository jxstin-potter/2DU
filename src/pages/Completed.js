import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { Container, Box, Typography, useTheme } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToTasks } from '../services/tasksService';
import { taskDocumentToTask } from '../utils/taskHelpers';
import CompletedTaskItem from '../components/task-management/CompletedTaskItem';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';
var Completed = function () {
    var theme = useTheme();
    var user = useAuth().user;
    var _a = useState([]), tasks = _a[0], setTasks = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    // Subscribe to completed tasks
    useEffect(function () {
        if (!(user === null || user === void 0 ? void 0 : user.id)) {
            setTasks([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        // Fetch all tasks and filter completed ones in memory to avoid Firestore index requirement
        var unsubscribe = subscribeToTasks(user.id, { completionStatus: 'all', sortBy: 'creationDate', sortOrder: 'desc' }, function (result) {
            try {
                var convertedTasks = result.tasks.map(function (taskDoc) {
                    var _a;
                    try {
                        return taskDocumentToTask(taskDoc);
                    }
                    catch (taskError) {
                        return {
                            id: taskDoc.id || '',
                            title: taskDoc.title || 'Untitled Task',
                            completed: (_a = taskDoc.completed) !== null && _a !== void 0 ? _a : false,
                            userId: taskDoc.userId || '',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                    }
                });
                // Filter to only completed tasks and sort by updatedAt (completion time)
                var completedTasks = convertedTasks
                    .filter(function (task) { return task.completed === true; })
                    .sort(function (a, b) {
                    var timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                    var timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                    return timeB - timeA; // Most recent first
                });
                setTasks(completedTasks);
                setLoading(false);
                setError(null);
            }
            catch (error) {
                setError('Failed to process tasks');
                setLoading(false);
            }
        });
        return function () {
            unsubscribe();
        };
    }, [user === null || user === void 0 ? void 0 : user.id]);
    // Group tasks by completion date
    var groupedTasks = useMemo(function () {
        var groups = {};
        tasks.forEach(function (task) {
            if (!task.updatedAt)
                return;
            var completionDate = startOfDay(new Date(task.updatedAt));
            var dateKey;
            if (isToday(completionDate)) {
                dateKey = format(completionDate, "MMM d 'Today' ‧ EEEE");
            }
            else if (isYesterday(completionDate)) {
                dateKey = format(completionDate, "MMM d 'Yesterday' ‧ EEEE");
            }
            else {
                dateKey = format(completionDate, 'MMM d ‧ EEEE');
            }
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(task);
        });
        // Sort tasks within each group by completion time (most recent first)
        Object.keys(groups).forEach(function (key) {
            groups[key].sort(function (a, b) {
                var timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                var timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                return timeB - timeA;
            });
        });
        return groups;
    }, [tasks]);
    var sortedDateKeys = useMemo(function () {
        return Object.keys(groupedTasks).sort(function (a, b) {
            // Get the first task from each group to extract the date
            var taskA = groupedTasks[a][0];
            var taskB = groupedTasks[b][0];
            if (!(taskA === null || taskA === void 0 ? void 0 : taskA.updatedAt) || !(taskB === null || taskB === void 0 ? void 0 : taskB.updatedAt))
                return 0;
            var dateA = new Date(taskA.updatedAt).getTime();
            var dateB = new Date(taskB.updatedAt).getTime();
            return dateB - dateA; // Most recent first
        });
    }, [groupedTasks]);
    if (loading) {
        return (_jsx(Container, { maxWidth: "lg", children: _jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", children: _jsx(Typography, { children: "Loading..." }) }) }));
    }
    if (error) {
        return (_jsx(Container, { maxWidth: "lg", children: _jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", children: _jsx(Typography, { color: "error", children: error }) }) }));
    }
    return (_jsx(Box, { sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
        }, children: _jsx(Container, { maxWidth: "md", sx: {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }, children: _jsxs(Box, { sx: {
                    width: '100%',
                    maxWidth: theme.breakpoints.values.sm,
                }, children: [_jsx(Box, { sx: { mb: 3 }, children: _jsx(Typography, { variant: "h5", component: "h1", sx: {
                                fontWeight: theme.typography.fontWeightBold,
                                mb: 1,
                            }, children: "Activity: All projects" }) }), sortedDateKeys.length > 0 ? (sortedDateKeys.map(function (dateKey) { return (_jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "h6", sx: {
                                    fontWeight: theme.typography.fontWeightBold,
                                    fontSize: theme.typography.body1.fontSize,
                                    mb: 2,
                                    color: 'text.secondary',
                                }, children: dateKey }), _jsx(Box, { sx: {
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                }, children: groupedTasks[dateKey].map(function (task) { return (_jsx(CompletedTaskItem, { task: task }, task.id)); }) })] }, dateKey)); })) : (_jsx(Box, { sx: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '200px',
                        }, children: _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { fontSize: theme.typography.body2.fontSize }, children: "No completed tasks yet" }) })), sortedDateKeys.length > 0 && (_jsx(Box, { sx: {
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4,
                            mb: 4,
                        }, children: _jsx(Typography, { variant: "body2", color: "text.secondary", sx: {
                                fontSize: theme.typography.body2.fontSize,
                                fontStyle: 'italic',
                            }, children: "That's it. No more history to load." }) }))] }) }) }));
};
export default Completed;
