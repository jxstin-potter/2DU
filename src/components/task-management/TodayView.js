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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useCallback } from 'react';
import { Box, Typography, Collapse, IconButton, Link, Button, useTheme, } from '@mui/material';
import { ChevronRight as ChevronRightIcon, ExpandMore as ExpandMoreIcon, CheckCircle as CheckCircleIcon, Add as AddIcon, } from '@mui/icons-material';
import { format, isBefore, isToday, startOfDay } from 'date-fns';
import TaskItem from './TaskItem';
import InlineTaskEditor from './InlineTaskEditor';
import { useTaskModal } from '../../contexts/TaskModalContext';
var TodayView = function (_a) {
    var tasks = _a.tasks, onTaskAction = _a.onTaskAction, onCreateTask = _a.onCreateTask, tags = _a.tags, categories = _a.categories, defaultCategoryId = _a.defaultCategoryId;
    var theme = useTheme();
    var _b = useTaskModal(), isTaskModalOpen = _b.isOpen, openModal = _b.openModal, closeTaskModal = _b.closeModal;
    var _c = useState(true), overdueExpanded = _c[0], setOverdueExpanded = _c[1];
    var _d = useState(false), showInlineEditor = _d[0], setShowInlineEditor = _d[1];
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
    var todayDate = startOfDay(new Date());
    var _e = useMemo(function () {
        var overdue = [];
        var today = [];
        var count = 0;
        tasks.forEach(function (task) {
            if (task.completed) {
                return;
            }
            if (task.dueDate) {
                var taskDate = startOfDay(new Date(task.dueDate));
                if (isBefore(taskDate, todayDate)) {
                    overdue.push(task);
                    count++;
                }
                else if (isToday(taskDate)) {
                    today.push(task);
                    count++;
                }
            }
            else {
                // Tasks without a due date should appear in the "today" section
                today.push(task);
                count++;
            }
        });
        // Sort overdue by dueDate (oldest first)
        overdue.sort(function (a, b) {
            if (!a.dueDate || !b.dueDate)
                return 0;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        // Sort today tasks by creation date (newest first) so newly added tasks appear at the top
        today.sort(function (a, b) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return { overdueTasks: overdue, todayTasks: today, taskCount: count };
    }, [tasks, todayDate]), overdueTasks = _e.overdueTasks, todayTasks = _e.todayTasks, taskCount = _e.taskCount;
    var formattedDate = format(new Date(), "MMM d 'Today' - EEEE");
    return (_jsxs(Box, { sx: { width: '100%' }, children: [_jsx(Typography, { variant: "h6", component: "div", sx: {
                    fontWeight: theme.typography.fontWeightBold,
                    mb: theme.spacing(2),
                    fontSize: theme.typography.h6.fontSize,
                }, children: "Today" }), _jsxs(Box, { sx: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(1),
                    mb: theme.spacing(3)
                }, children: [_jsx(CheckCircleIcon, { sx: {
                            fontSize: theme.typography.body2.fontSize,
                            color: 'text.secondary'
                        } }), _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { fontSize: theme.typography.body2.fontSize }, children: [taskCount, " ", taskCount === 1 ? 'task' : 'tasks'] })] }), overdueTasks.length > 0 && (_jsxs(Box, { sx: { mb: theme.spacing(3) }, children: [_jsxs(Box, { sx: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: theme.spacing(1),
                        }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: theme.spacing(1) }, children: [_jsx(IconButton, { size: "small", onClick: function () { return setOverdueExpanded(!overdueExpanded); }, sx: { p: theme.spacing(0.5) }, children: overdueExpanded ? (_jsx(ExpandMoreIcon, { fontSize: "small" })) : (_jsx(ChevronRightIcon, { fontSize: "small" })) }), _jsx(Typography, { variant: "h6", sx: {
                                            fontWeight: theme.typography.fontWeightBold,
                                            fontSize: theme.typography.body1.fontSize
                                        }, children: "Overdue" })] }), _jsx(Link, { component: "button", variant: "body2", onClick: function () {
                                    // TODO: Implement reschedule functionality
                                }, sx: {
                                    color: 'warning.main',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }, children: "Reschedule" })] }), _jsx(Collapse, { in: overdueExpanded, children: _jsx(Box, { children: overdueTasks.map(function (task) { return (_jsx(TaskItem, { task: task, onToggleComplete: onTaskAction.toggle, onDelete: onTaskAction.delete, onEdit: onTaskAction.edit, onUpdate: onTaskAction.update, tags: tags, categories: categories }, task.id)); }) }) })] })), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", sx: {
                            fontWeight: theme.typography.fontWeightBold,
                            fontSize: theme.typography.body1.fontSize,
                            mb: theme.spacing(2),
                        }, children: formattedDate }), showInlineEditor && onCreateTask && (_jsx(Box, { sx: { mb: theme.spacing(2) }, children: _jsx(InlineTaskEditor, { onSubmit: handleCreateTask, onCancel: handleCancelEditor, categories: categories, defaultCategoryId: defaultCategoryId }) })), todayTasks.length > 0 ? (_jsxs(_Fragment, { children: [todayTasks.map(function (task) { return (_jsx(TaskItem, { task: task, onToggleComplete: onTaskAction.toggle, onDelete: onTaskAction.delete, onEdit: onTaskAction.edit, onUpdate: onTaskAction.update, tags: tags, categories: categories }, task.id)); }), !showInlineEditor && (_jsx(Box, { sx: {
                                    mt: theme.spacing(3),
                                    display: 'flex',
                                    justifyContent: 'center'
                                }, children: _jsx(Button, { startIcon: _jsx(AddIcon, { sx: { color: '#a7020290' } }), onClick: function () { return setShowInlineEditor(true); }, sx: {
                                        textTransform: 'none',
                                        color: 'text.secondary',
                                    }, children: "Add task" }) }))] })) : (_jsx(Box, { sx: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: theme.spacing(1.5),
                        }, children: !showInlineEditor && (_jsxs(_Fragment, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { fontSize: theme.typography.body2.fontSize }, children: "No tasks for today" }), _jsx(Button, { startIcon: _jsx(AddIcon, { sx: { color: '#a7020290' } }), onClick: function () { return setShowInlineEditor(true); }, sx: {
                                        textTransform: 'none',
                                        color: 'text.secondary',
                                    }, children: "Add task" })] })) }))] })] }));
};
export default TodayView;
