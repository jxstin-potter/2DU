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
import React, { useMemo, useCallback, useState, useRef } from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Box, Chip, Tooltip, Popover, } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Label as LabelIcon, CalendarToday as CalendarIcon, RadioButtonUnchecked as RadioButtonUncheckedIcon, CheckCircleOutline as CheckCircleOutlineIcon, } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTheme, alpha } from '@mui/material/styles';
import { format, isBefore, startOfDay } from 'date-fns';
var TaskItem = function (_a) {
    var task = _a.task, onToggleComplete = _a.onToggleComplete, onDelete = _a.onDelete, onEdit = _a.onEdit, onUpdate = _a.onUpdate, tags = _a.tags, categories = _a.categories, _b = _a.isActionInProgress, isActionInProgress = _b === void 0 ? false : _b;
    var theme = useTheme();
    var _c = useState(null), datePickerAnchor = _c[0], setDatePickerAnchor = _c[1];
    var _d = useState(null), tempDate = _d[0], setTempDate = _d[1];
    var _e = useState(null), tempTime = _e[0], setTempTime = _e[1];
    var dateDisplayRef = useRef(null);
    var category = useMemo(function () {
        return task.category ? categories.find(function (c) { return c.id === task.category; }) : undefined;
    }, [task.category, categories]);
    var taskTags = useMemo(function () {
        var _a;
        return ((_a = task.tags) === null || _a === void 0 ? void 0 : _a.map(function (tagId) { return tags.find(function (t) { return t.id === tagId; }); }).filter(Boolean)) || [];
    }, [task.tags, tags]);
    var isOverdue = useMemo(function () {
        if (!task.dueDate || task.completed)
            return false;
        var taskDate = startOfDay(new Date(task.dueDate));
        var today = startOfDay(new Date());
        return isBefore(taskDate, today);
    }, [task.dueDate, task.completed]);
    var formattedDate = useMemo(function () {
        if (!task.dueDate)
            return '';
        var date = new Date(task.dueDate);
        // Check if the date has a specific time (not midnight/start of day)
        var hasTime = date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0;
        if (hasTime) {
            // Include time: "MMM d yyyy h:mm a" (e.g., "Jan 28 2026 3:00 PM")
            return format(date, 'MMM d yyyy h:mm a');
        }
        // Date only: "MMM d yyyy" (e.g., "Jan 28 2026")
        return format(date, 'MMM d yyyy');
    }, [task.dueDate]);
    var handleToggleComplete = useCallback(function () {
        onToggleComplete(task.id);
    }, [onToggleComplete, task.id]);
    var handleDelete = useCallback(function () {
        onDelete(task.id);
    }, [onDelete, task.id]);
    var handleEdit = useCallback(function () {
        onEdit(task);
    }, [onEdit, task]);
    var handleDateClick = useCallback(function (event) {
        if (!onUpdate)
            return;
        event.stopPropagation();
        setDatePickerAnchor(event.currentTarget);
        if (task.dueDate) {
            var date = new Date(task.dueDate);
            setTempDate(date);
            setTempTime(date);
        }
        else {
            setTempDate(new Date());
            setTempTime(new Date());
        }
    }, [onUpdate, task.dueDate]);
    var handleDatePickerClose = useCallback(function () {
        setDatePickerAnchor(null);
    }, []);
    var handleDateChange = useCallback(function (newDate) {
        if (!newDate)
            return;
        setTempDate(newDate);
        // If time is already set, combine them immediately
        if (tempTime && onUpdate) {
            var finalDate = new Date(newDate);
            finalDate.setHours(tempTime.getHours());
            finalDate.setMinutes(tempTime.getMinutes());
            finalDate.setSeconds(0);
            finalDate.setMilliseconds(0);
            onUpdate(task.id, { dueDate: finalDate });
            setDatePickerAnchor(null);
        }
    }, [onUpdate, task.id, tempTime]);
    var handleTimeChange = useCallback(function (newTime) {
        if (!newTime)
            return;
        setTempTime(newTime);
        // Combine with current date
        var finalDate;
        if (tempDate) {
            finalDate = new Date(tempDate);
        }
        else if (task.dueDate) {
            finalDate = new Date(task.dueDate);
        }
        else {
            finalDate = new Date();
        }
        finalDate.setHours(newTime.getHours());
        finalDate.setMinutes(newTime.getMinutes());
        finalDate.setSeconds(0);
        finalDate.setMilliseconds(0);
        if (onUpdate) {
            onUpdate(task.id, { dueDate: finalDate });
            setDatePickerAnchor(null);
        }
    }, [onUpdate, task.id, task.dueDate, tempDate]);
    var handleRemoveDate = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!onUpdate)
                        return [2 /*return*/];
                    return [4 /*yield*/, onUpdate(task.id, { dueDate: undefined })];
                case 1:
                    _a.sent();
                    setDatePickerAnchor(null);
                    return [2 /*return*/];
            }
        });
    }); }, [onUpdate, task.id]);
    return (_jsxs(ListItem, { sx: {
            mb: 2,
            bgcolor: 'transparent',
            transition: 'opacity 0.2s ease',
            '& .MuiListItemSecondaryAction-root': {
                opacity: 0,
                transition: 'opacity 0.2s ease',
            },
            '&:hover .MuiListItemSecondaryAction-root': {
                opacity: 1,
            },
        }, children: [_jsx(IconButton, { edge: "start", onClick: handleToggleComplete, disabled: isActionInProgress, size: "small", sx: {
                    p: 0.25,
                    mr: 0.5,
                    backgroundColor: 'transparent',
                    '&:hover': { backgroundColor: 'transparent' },
                    '&:hover .check-hover': { opacity: 1 },
                }, "aria-label": task.completed ? 'Mark incomplete' : 'Mark complete', children: task.completed ? (_jsx(CheckCircleOutlineIcon, { sx: { fontSize: 17, color: 'success.main' } })) : (_jsxs(Box, { component: "span", sx: {
                        position: 'relative',
                        display: 'inline-flex',
                        width: 17,
                        height: 17,
                    }, children: [_jsx(RadioButtonUncheckedIcon, { sx: { fontSize: 17, color: 'action.active' } }), _jsx(CheckCircleOutlineIcon, { className: "check-hover", sx: {
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                fontSize: 16,
                                color: 'white',
                                opacity: 0,
                                transition: 'opacity 0.15s ease',
                                pointerEvents: 'none',
                                backgroundColor: 'transparent',
                            } })] })) }), _jsx(ListItemText, { primary: _jsx(Typography, { variant: "body1", sx: {
                        fontSize: '0.875rem',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'text.secondary' : 'text.primary',
                    }, children: task.title }), secondary: _jsxs(Box, { children: [task.description && (_jsx(Typography, { variant: "body2", sx: {
                                color: 'text.secondary',
                                fontSize: '0.8125rem',
                                mb: task.dueDate || category || (taskTags.length > 0) ? 0.5 : 0,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }, children: task.description })), _jsxs(Box, { sx: { display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }, children: [task.dueDate && (_jsxs(Box, { ref: dateDisplayRef, onClick: handleDateClick, sx: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        cursor: onUpdate ? 'pointer' : 'default',
                                        borderRadius: 1,
                                        px: 0.5,
                                        py: 0.25,
                                        '&:hover': onUpdate ? {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        } : {},
                                        transition: 'background-color 0.2s ease',
                                    }, children: [_jsx(CalendarIcon, { fontSize: "small", sx: { fontSize: '0.8125rem' } }), _jsx(Typography, { variant: "body2", sx: {
                                                color: isOverdue ? 'error.main' : 'text.secondary',
                                                fontSize: '0.8125rem',
                                            }, children: formattedDate })] })), category && (_jsx(Tooltip, { title: "Category", children: _jsx(Chip, { size: "small", icon: _jsx(LabelIcon, { fontSize: "small" }), label: category.name, sx: {
                                            bgcolor: 'background.default',
                                            '& .MuiChip-label': {
                                                px: 1,
                                            },
                                        } }) })), taskTags.map(function (tag) { return (_jsx(Tooltip, { title: tag.name, children: _jsx(Chip, { size: "small", label: tag.name, sx: {
                                            bgcolor: tag.color || 'background.default',
                                            color: 'white',
                                            '& .MuiChip-label': {
                                                px: 1,
                                            },
                                        } }) }, tag.id)); })] })] }) }), _jsxs(ListItemSecondaryAction, { children: [_jsx(Tooltip, { title: "Edit", children: _jsx("span", { children: _jsx(IconButton, { edge: "end", onClick: handleEdit, disabled: isActionInProgress, sx: { mr: 0.5 }, size: "small", "aria-label": "Edit task", children: _jsx(EditIcon, { sx: { fontSize: '1rem' } }) }) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx("span", { children: _jsx(IconButton, { edge: "end", onClick: handleDelete, disabled: isActionInProgress, size: "small", "aria-label": "Delete task", children: _jsx(DeleteIcon, { sx: { fontSize: '1rem' } }) }) }) })] }), onUpdate && (_jsx(Popover, { open: Boolean(datePickerAnchor), anchorEl: datePickerAnchor, onClose: handleDatePickerClose, anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                }, transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                }, PaperProps: {
                    sx: {
                        mt: 1,
                        p: 2,
                        minWidth: 280,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                            : '0 8px 24px rgba(0, 0, 0, 0.15)',
                    },
                }, children: _jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsx(DatePicker, { label: "Date", value: tempDate, onChange: handleDateChange, slotProps: {
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                        sx: {
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: theme.palette.mode === 'dark'
                                                    ? alpha(theme.palette.common.white, 0.05)
                                                    : alpha(theme.palette.common.black, 0.02),
                                            },
                                        },
                                    },
                                } }), _jsx(TimePicker, { label: "Time", value: tempTime, onChange: handleTimeChange, slotProps: {
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                        sx: {
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: theme.palette.mode === 'dark'
                                                    ? alpha(theme.palette.common.white, 0.05)
                                                    : alpha(theme.palette.common.black, 0.02),
                                            },
                                        },
                                    },
                                } }), task.dueDate && (_jsx(Box, { sx: { display: 'flex', justifyContent: 'flex-end', pt: 1 }, children: _jsx(Typography, { onClick: handleRemoveDate, sx: {
                                        cursor: 'pointer',
                                        color: 'error.main',
                                        fontSize: '0.875rem',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }, children: "Remove date" }) }))] }) }) }))] }));
};
export default React.memo(TaskItem);
