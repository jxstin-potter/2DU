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
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Typography, Collapse, IconButton, Button, useTheme, useMediaQuery, } from '@mui/material';
import { ChevronRight as ChevronRightIcon, ExpandMore as ExpandMoreIcon, CheckCircle as CheckCircleIcon, Add as AddIcon, } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format, isBefore, startOfDay } from 'date-fns';
import TaskItem from './TaskItem';
import InlineTaskEditor from './InlineTaskEditor';
import { useTaskModal } from '../../contexts/TaskModalContext';
var TodayView = function (_a) {
    var tasks = _a.tasks, _b = _a.justAddedTaskId, justAddedTaskId = _b === void 0 ? null : _b, onTaskAction = _a.onTaskAction, onCreateTask = _a.onCreateTask, tags = _a.tags, categories = _a.categories, defaultCategoryId = _a.defaultCategoryId;
    var theme = useTheme();
    var isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    var appBarOffset = isMobile ? 56 : 64;
    var _c = useTaskModal(), isTaskModalOpen = _c.isOpen, openModal = _c.openModal, closeTaskModal = _c.closeModal;
    var _d = useState(true), overdueExpanded = _d[0], setOverdueExpanded = _d[1];
    var _e = useState(false), completedTodayExpanded = _e[0], setCompletedTodayExpanded = _e[1];
    var _f = useState(true), summaryExpanded = _f[0], setSummaryExpanded = _f[1];
    var _g = useState(false), showInlineEditor = _g[0], setShowInlineEditor = _g[1];
    var _h = useState(function () { return startOfDay(new Date()); }), todayDate = _h[0], setTodayDate = _h[1];
    // Refresh "today" at midnight and when tab becomes visible (e.g. user returns next day)
    useEffect(function () {
        var scheduleNextMidnight = function () {
            var now = new Date();
            var nextMidnight = new Date(now);
            nextMidnight.setHours(24, 0, 0, 0);
            var delay = nextMidnight.getTime() - now.getTime();
            return window.setTimeout(function () {
                setTodayDate(startOfDay(new Date()));
                timeoutRef.current = scheduleNextMidnight();
            }, delay);
        };
        var timeoutRef = { current: scheduleNextMidnight() };
        var handleVisibilityChange = function () {
            if (document.visibilityState === 'visible') {
                var now_1 = startOfDay(new Date());
                setTodayDate(function (prev) { return (prev.getTime() === now_1.getTime() ? prev : now_1); });
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return function () {
            clearTimeout(timeoutRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
    // Inline editor is controlled by showInlineEditor state, triggered by "Add task" buttons
    var handleCreateTask = useCallback(function (taskData) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!onCreateTask) return [3 /*break*/, 2];
                    return [4 /*yield*/, onCreateTask(taskData)];
                case 1:
                    _a.sent();
                    setShowInlineEditor(false);
                    closeTaskModal();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, [onCreateTask, closeTaskModal]);
    var handleCancelEditor = useCallback(function () {
        setShowInlineEditor(false);
        closeTaskModal();
    }, [closeTaskModal]);
    var _j = useMemo(function () {
        var overdue = [];
        var today = [];
        var incompleteCount = 0;
        tasks.forEach(function (task) {
            if (task.dueDate) {
                var taskDate = startOfDay(new Date(task.dueDate));
                if (isBefore(taskDate, todayDate)) {
                    overdue.push(task);
                    if (!task.completed)
                        incompleteCount++;
                }
                else if (taskDate.getTime() === todayDate.getTime()) {
                    today.push(task);
                    if (!task.completed)
                        incompleteCount++;
                }
            }
            else {
                today.push(task);
                if (!task.completed)
                    incompleteCount++;
            }
        });
        // Overdue section: only show incomplete tasks (completed = done, not overdue)
        var overdueIncomplete = overdue.filter(function (t) { return !t.completed; });
        overdueIncomplete.sort(function (a, b) {
            if (!a.dueDate || !b.dueDate)
                return 0;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        // Sort today: incomplete first (newest first), then completed (newest first)
        today.sort(function (a, b) {
            if (a.completed !== b.completed)
                return a.completed ? 1 : -1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        var todayIncomplete = today.filter(function (t) { return !t.completed; });
        // Only count tasks completed *today* (by updatedAt) so the count resets each day
        var todayCompleted = today.filter(function (t) {
            return t.completed &&
                startOfDay(new Date(t.updatedAt)).getTime() === todayDate.getTime();
        });
        // Overview: incomplete tasks always; completed only if completed today (resets daily)
        var tasksForSummary = __spreadArray(__spreadArray(__spreadArray([], overdueIncomplete, true), todayIncomplete, true), todayCompleted, true);
        return {
            overdueTasks: overdueIncomplete,
            todayTasks: today,
            todayIncomplete: todayIncomplete,
            todayCompleted: todayCompleted,
            taskCount: incompleteCount,
            tasksForSummary: tasksForSummary,
        };
    }, [tasks, todayDate]), overdueTasks = _j.overdueTasks, todayTasks = _j.todayTasks, todayIncomplete = _j.todayIncomplete, todayCompleted = _j.todayCompleted, taskCount = _j.taskCount, tasksForSummary = _j.tasksForSummary;
    var formattedDate = format(todayDate, "MMM d 'Today' - EEEE");
    var priorityColors = {
        low: '#4caf50',
        medium: '#ff9800',
        high: '#f44336',
    };
    var getTaskSummaryColor = function (task) {
        var cat = categories.find(function (c) { return c.id === task.categoryId; });
        if (cat === null || cat === void 0 ? void 0 : cat.color)
            return cat.color;
        if (task.priority && priorityColors[task.priority])
            return priorityColors[task.priority];
        return theme.palette.error.main;
    };
    return (_jsxs(Box, { sx: { width: '100%' }, children: [_jsxs(Box, { sx: {
                    position: 'sticky',
                    top: appBarOffset,
                    zIndex: 10,
                    backgroundColor: 'background.default',
                    borderBottom: 1,
                    borderColor: 'divider',
                    pb: 2,
                    mb: 4,
                }, children: [_jsx(Typography, { component: "h1", variant: "h6", sx: {
                            fontWeight: 700,
                            mb: 0.5,
                            fontSize: '1.5rem',
                            lineHeight: 1.3,
                        }, children: "Today" }), _jsxs(Box, { sx: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mb: tasksForSummary.length > 0 ? 1 : 1.5,
                        }, children: [_jsx(CheckCircleIcon, { sx: {
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                } }), _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { fontSize: '0.75rem' }, children: [taskCount, " ", taskCount === 1 ? 'task' : 'tasks'] }), tasksForSummary.length > 0 && (_jsx(IconButton, { size: "small", onClick: function () { return setSummaryExpanded(function (e) { return !e; }); }, "aria-label": summaryExpanded ? 'Hide task list' : 'Show task list', sx: {
                                    p: 0.25,
                                    minWidth: 0,
                                    color: 'text.disabled',
                                    '&:hover': { color: 'text.secondary', backgroundColor: 'transparent' },
                                }, children: summaryExpanded ? (_jsx(ExpandMoreIcon, { sx: { fontSize: '1rem' } })) : (_jsx(ChevronRightIcon, { sx: { fontSize: '1rem' } })) }))] }), tasksForSummary.length > 0 && (_jsx(Collapse, { in: summaryExpanded, children: _jsxs(Box, { sx: {
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: 0.5,
                                fontSize: '0.8125rem',
                                color: 'text.secondary',
                                maxHeight: 48,
                                overflow: 'hidden',
                                mb: 1,
                            }, children: [tasksForSummary.slice(0, 7).map(function (task) { return (_jsxs(Box, { component: "span", sx: {
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        mr: 1.25,
                                        flexShrink: 0,
                                    }, children: [_jsx(Box, { component: "span", sx: {
                                                width: 3,
                                                height: 10,
                                                borderRadius: 0.5,
                                                flexShrink: 0,
                                                backgroundColor: getTaskSummaryColor(task),
                                            } }), _jsxs(Typography, { component: "span", variant: "body2", sx: { fontSize: '0.8125rem', color: 'text.secondary', textDecoration: task.completed ? 'line-through' : 'none' }, children: [task.completed ? '✓ ' : '', task.title] })] }, task.id)); }), tasksForSummary.length > 7 && (_jsxs(Typography, { component: "span", variant: "body2", sx: { fontSize: '0.8125rem', color: 'text.secondary' }, children: [tasksForSummary.length - 7, "+ more"] }))] }) }))] }), overdueTasks.length > 0 && (_jsxs(Box, { sx: { mb: theme.spacing(3) }, children: [_jsxs(Box, { sx: {
                            display: 'flex',
                            alignItems: 'center',
                            mb: theme.spacing(1),
                        }, children: [_jsx(IconButton, { size: "small", onClick: function () { return setOverdueExpanded(!overdueExpanded); }, sx: { p: theme.spacing(0.5) }, children: overdueExpanded ? (_jsx(ExpandMoreIcon, { fontSize: "small" })) : (_jsx(ChevronRightIcon, { fontSize: "small" })) }), _jsx(Typography, { variant: "h6", sx: {
                                    fontWeight: theme.typography.fontWeightBold,
                                    fontSize: theme.typography.body1.fontSize
                                }, children: "Overdue" })] }), _jsx(Collapse, { in: overdueExpanded, children: _jsx(Box, { children: overdueTasks.map(function (task) {
                                var isJustAdded = task.id === justAddedTaskId;
                                var item = (_jsx(TaskItem, { task: task, onToggleComplete: onTaskAction.toggle, onDelete: onTaskAction.delete, onEdit: onTaskAction.edit, onUpdate: onTaskAction.update, tags: tags, categories: categories }, task.id));
                                return isJustAdded ? (_jsx(motion.div, { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25, ease: 'easeOut' }, children: item }, task.id)) : (item);
                            }) }) })] })), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", sx: {
                            fontWeight: theme.typography.fontWeightBold,
                            fontSize: theme.typography.body1.fontSize,
                            mb: theme.spacing(2),
                        }, children: formattedDate }), todayTasks.length > 0 ? (_jsxs(_Fragment, { children: [todayIncomplete.map(function (task) {
                                var isJustAdded = task.id === justAddedTaskId;
                                var item = (_jsx(TaskItem, { task: task, onToggleComplete: onTaskAction.toggle, onDelete: onTaskAction.delete, onEdit: onTaskAction.edit, onUpdate: onTaskAction.update, tags: tags, categories: categories }, task.id));
                                return isJustAdded ? (_jsx(motion.div, { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25, ease: 'easeOut' }, children: item }, task.id)) : (item);
                            }), showInlineEditor && onCreateTask ? (_jsx(Box, { sx: { mt: theme.spacing(2), mb: theme.spacing(1) }, children: _jsx(InlineTaskEditor, { onSubmit: handleCreateTask, onCancel: handleCancelEditor, categories: categories, defaultCategoryId: defaultCategoryId }) })) : (_jsx(Box, { sx: { mt: theme.spacing(0.5), width: '100%' }, children: _jsx(Button, { fullWidth: true, disableRipple: true, startIcon: _jsx(Box, { sx: {
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            backgroundColor: 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'text.secondary',
                                            transition: 'background-color 0.2s ease, color 0.2s ease',
                                        }, children: _jsx(AddIcon, { sx: { fontSize: '1rem', color: 'inherit' } }) }), onClick: function () { return setShowInlineEditor(true); }, sx: {
                                        justifyContent: 'flex-start',
                                        textTransform: 'none',
                                        minHeight: 36,
                                        py: 0,
                                        px: 2,
                                        color: 'text.secondary',
                                        borderRadius: 1,
                                        transition: 'color 0.2s ease, background-color 0.2s ease',
                                        '& .MuiButton-startIcon > *': {
                                            transition: 'background-color 0.2s ease, color 0.2s ease',
                                        },
                                        '&:hover': {
                                            color: '#5c4e00',
                                            backgroundColor: 'transparent',
                                        },
                                        '&:hover .MuiButton-startIcon > *': {
                                            backgroundColor: '#5c4e00',
                                            color: 'common.white',
                                        },
                                    }, children: "Add task" }) })), todayCompleted.length > 0 && (_jsxs(Box, { sx: { mt: theme.spacing(2), mb: theme.spacing(1) }, children: [_jsxs(Box, { sx: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: theme.spacing(1),
                                        }, children: [_jsx(IconButton, { size: "small", onClick: function () { return setCompletedTodayExpanded(!completedTodayExpanded); }, sx: { p: theme.spacing(0.5) }, children: completedTodayExpanded ? (_jsx(ExpandMoreIcon, { fontSize: "small" })) : (_jsx(ChevronRightIcon, { fontSize: "small" })) }), _jsxs(Typography, { variant: "h6", sx: {
                                                    fontWeight: theme.typography.fontWeightBold,
                                                    fontSize: theme.typography.body1.fontSize,
                                                }, children: ["Completed (", todayCompleted.length, ")"] })] }), _jsx(Collapse, { in: completedTodayExpanded, children: _jsx(Box, { children: todayCompleted.map(function (task) {
                                                var isJustAdded = task.id === justAddedTaskId;
                                                var item = (_jsx(TaskItem, { task: task, onToggleComplete: onTaskAction.toggle, onDelete: onTaskAction.delete, onEdit: onTaskAction.edit, onUpdate: onTaskAction.update, tags: tags, categories: categories }, task.id));
                                                return isJustAdded ? (_jsx(motion.div, { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25, ease: 'easeOut' }, children: item }, task.id)) : (item);
                                            }) }) })] }))] })) : (_jsx(Box, { sx: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: theme.spacing(1.5),
                        }, children: showInlineEditor && onCreateTask ? (_jsx(InlineTaskEditor, { onSubmit: handleCreateTask, onCancel: handleCancelEditor, categories: categories, defaultCategoryId: defaultCategoryId })) : (_jsxs(_Fragment, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { fontSize: theme.typography.body2.fontSize, mb: 1 }, children: "No tasks for today" }), _jsx(Box, { sx: { width: '100%' }, children: _jsx(Button, { fullWidth: true, disableRipple: true, startIcon: _jsx(Box, { sx: {
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                backgroundColor: 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'text.secondary',
                                                transition: 'background-color 0.2s ease, color 0.2s ease',
                                            }, children: _jsx(AddIcon, { sx: { fontSize: '1rem', color: 'inherit' } }) }), onClick: function () { return setShowInlineEditor(true); }, sx: {
                                            justifyContent: 'flex-start',
                                            textTransform: 'none',
                                            minHeight: 36,
                                            py: 0,
                                            px: 2,
                                            color: 'text.secondary',
                                            borderRadius: 1,
                                            transition: 'color 0.2s ease, background-color 0.2s ease',
                                            '& .MuiButton-startIcon > *': {
                                                transition: 'background-color 0.2s ease, color 0.2s ease',
                                            },
                                            '&:hover': {
                                                color: '#5c4e00',
                                                backgroundColor: 'transparent',
                                            },
                                            '&:hover .MuiButton-startIcon > *': {
                                                backgroundColor: '#5c4e00',
                                                color: 'common.white',
                                            },
                                        }, children: "Add task" }) })] })) }))] })] }));
};
export default TodayView;
