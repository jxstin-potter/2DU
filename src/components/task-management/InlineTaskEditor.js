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
import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, useTheme, alpha, IconButton, Chip, Menu, MenuItem, ListItemIcon, ListItemText, } from '@mui/material';
import { Today as TodayIcon, Flag as FlagIcon, NotificationsNone as RemindersIcon, MoreVert as MoreVertIcon, Inbox as InboxIcon, KeyboardArrowDown as KeyboardArrowDownIcon, } from '@mui/icons-material';
import { isToday, startOfDay } from 'date-fns';
var InlineTaskEditor = function (_a) {
    var onSubmit = _a.onSubmit, onCancel = _a.onCancel, initialTask = _a.initialTask, _b = _a.autoFocus, autoFocus = _b === void 0 ? true : _b, _c = _a.categories, categories = _c === void 0 ? [] : _c, defaultCategoryId = _a.defaultCategoryId;
    var theme = useTheme();
    var _d = useState(''), title = _d[0], setTitle = _d[1];
    var _e = useState(''), description = _e[0], setDescription = _e[1];
    var _f = useState(null), dueDate = _f[0], setDueDate = _f[1];
    var _g = useState(''), priority = _g[0], setPriority = _g[1];
    var _h = useState(defaultCategoryId), selectedCategoryId = _h[0], setSelectedCategoryId = _h[1];
    var _j = useState(false), isSubmitting = _j[0], setIsSubmitting = _j[1];
    var _k = useState(false), showQuickActions = _k[0], setShowQuickActions = _k[1];
    var _l = useState(null), categoryMenuAnchor = _l[0], setCategoryMenuAnchor = _l[1];
    var _m = useState(null), moreMenuAnchor = _m[0], setMoreMenuAnchor = _m[1];
    var titleRef = useRef(null);
    var descriptionRef = useRef(null);
    var containerRef = useRef(null);
    // Initialize form from initialTask if editing
    useEffect(function () {
        if (initialTask) {
            setTitle(initialTask.title);
            setDescription(initialTask.description || '');
            setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
            setPriority(initialTask.priority || '');
            setSelectedCategoryId(initialTask.categoryId || defaultCategoryId);
            setShowQuickActions(true);
            if (titleRef.current) {
                titleRef.current.textContent = initialTask.title;
            }
            if (descriptionRef.current) {
                descriptionRef.current.textContent = initialTask.description || '';
            }
        }
        else {
            if (titleRef.current) {
                titleRef.current.textContent = '';
            }
            if (descriptionRef.current) {
                descriptionRef.current.textContent = '';
            }
        }
    }, [initialTask, defaultCategoryId]);
    // Auto-focus the title input when it opens
    useEffect(function () {
        if (autoFocus && titleRef.current && !initialTask) {
            requestAnimationFrame(function () {
                var _a;
                (_a = titleRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                var range = document.createRange();
                var selection = window.getSelection();
                if (titleRef.current && selection) {
                    range.selectNodeContents(titleRef.current);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            });
        }
    }, [autoFocus, initialTask]);
    // Handle click outside to close
    useEffect(function () {
        var handleClickOutside = function (event) {
            if (containerRef.current &&
                !containerRef.current.contains(event.target) &&
                !isSubmitting &&
                title.trim() === '' &&
                description.trim() === '') {
                onCancel();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onCancel, isSubmitting, title, description]);
    // Parse time from title text
    useEffect(function () {
        var parseTime = function () { return __awaiter(void 0, void 0, void 0, function () {
            var parseTimeFromText, time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!title.trim() || initialTask)
                            return [2 /*return*/];
                        return [4 /*yield*/, import('../../utils/taskHelpers')];
                    case 1:
                        parseTimeFromText = (_a.sent()).parseTimeFromText;
                        return [4 /*yield*/, parseTimeFromText(title)];
                    case 2:
                        time = (_a.sent()).time;
                        if (time && !dueDate) {
                            setDueDate(time);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        parseTime();
    }, [title, dueDate, initialTask]);
    var handleTitleInput = useCallback(function (e) {
        var text = e.currentTarget.textContent || '';
        setTitle(text);
        setShowQuickActions(text.length > 0 || description.length > 0);
    }, [description]);
    var handleDescriptionInput = useCallback(function (e) {
        var text = e.currentTarget.textContent || '';
        setDescription(text);
        setShowQuickActions(text.length > 0 || title.length > 0);
    }, [title]);
    var handleSubmit = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var trimmedTitle, taskData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    trimmedTitle = title.trim();
                    if (!trimmedTitle || isSubmitting)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setIsSubmitting(true);
                    taskData = {
                        title: trimmedTitle,
                        description: description.trim() || undefined,
                        dueDate: dueDate || undefined,
                        priority: priority ? priority : undefined,
                        categoryId: selectedCategoryId,
                        status: 'todo',
                        createdAt: (initialTask === null || initialTask === void 0 ? void 0 : initialTask.createdAt) || new Date(),
                        updatedAt: new Date(),
                    };
                    return [4 /*yield*/, onSubmit(taskData)];
                case 2:
                    _a.sent();
                    // Reset form
                    setTitle('');
                    setDescription('');
                    setDueDate(null);
                    setPriority('');
                    setSelectedCategoryId(defaultCategoryId);
                    setShowQuickActions(false);
                    // Clear and focus title for next task
                    if (titleRef.current) {
                        titleRef.current.textContent = '';
                        requestAnimationFrame(function () {
                            var _a;
                            (_a = titleRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                        });
                    }
                    if (descriptionRef.current) {
                        descriptionRef.current.textContent = '';
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to submit task:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [title, description, dueDate, priority, selectedCategoryId, onSubmit, initialTask, isSubmitting, defaultCategoryId]);
    var handleKeyDown = useCallback(function (e, field) {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Submit the form from either field
            e.preventDefault();
            handleSubmit();
        }
        else if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
        }
    }, [handleSubmit, onCancel]);
    var handleSetToday = function () {
        if (dueDate && isToday(dueDate)) {
            setDueDate(null);
        }
        else {
            setDueDate(startOfDay(new Date()));
        }
    };
    var handleSetPriority = function (newPriority) {
        if (priority === newPriority) {
            setPriority('');
        }
        else {
            setPriority(newPriority);
        }
    };
    var handleRemoveDate = function () {
        setDueDate(null);
    };
    var handleRemovePriority = function () {
        setPriority('');
    };
    var priorityColors = {
        low: '#4caf50',
        medium: '#ff9800',
        high: '#f44336',
    };
    var priorityLabels = {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
    };
    var selectedCategory = categories.find(function (c) { return c.id === selectedCategoryId; });
    var isTodaySelected = dueDate && isToday(dueDate);
    return (_jsxs(Box, { ref: containerRef, component: "form", onSubmit: function (e) {
            e.preventDefault();
            handleSubmit();
        }, sx: {
            mb: 2,
            bgcolor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.95)
                : theme.palette.background.paper,
            borderRadius: '8px',
            border: "1px solid ".concat(alpha(theme.palette.divider, 0.5)),
            boxShadow: theme.palette.mode === 'dark'
                ? '0 2px 8px rgba(0,0,0,0.3)'
                : '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.2s ease',
            overflow: 'hidden',
            '&:focus-within': {
                borderColor: theme.palette.primary.main,
                boxShadow: "0 0 0 2px ".concat(alpha(theme.palette.primary.main, 0.15), ", 0 4px 12px rgba(0,0,0,0.1)"),
            },
        }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'flex-start', p: 1.5, gap: 1.5 }, children: [_jsx(Box, { sx: {
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mt: 0.5,
                        }, children: _jsx(Box, { sx: {
                                width: 18,
                                height: 18,
                                border: "2px solid ".concat(alpha(theme.palette.text.secondary, 0.4)),
                                borderRadius: '50%',
                                transition: 'all 0.2s ease',
                            } }) }), _jsxs(Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [_jsx(Box, { ref: titleRef, contentEditable: true, suppressContentEditableWarning: true, onInput: handleTitleInput, onKeyDown: function (e) { return handleKeyDown(e, 'title'); }, "data-placeholder": "Task name", sx: {
                                    minHeight: '28px',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    outline: 'none',
                                    fontSize: '0.9375rem',
                                    lineHeight: 1.5,
                                    fontWeight: 500,
                                    color: theme.palette.text.primary,
                                    wordBreak: 'break-word',
                                    '&:empty:before': {
                                        content: 'attr(data-placeholder)',
                                        color: theme.palette.text.secondary,
                                        opacity: 0.6,
                                        fontWeight: 400,
                                    },
                                    '&:focus': {
                                        outline: 'none',
                                    },
                                } }), _jsx(Box, { ref: descriptionRef, contentEditable: true, suppressContentEditableWarning: true, onInput: handleDescriptionInput, onKeyDown: function (e) { return handleKeyDown(e, 'description'); }, "data-placeholder": "Description", sx: {
                                    minHeight: '24px',
                                    maxHeight: '150px',
                                    overflowY: 'auto',
                                    outline: 'none',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    color: theme.palette.text.secondary,
                                    wordBreak: 'break-word',
                                    '&:empty:before': {
                                        content: 'attr(data-placeholder)',
                                        color: theme.palette.text.secondary,
                                        opacity: 0.5,
                                        fontStyle: 'italic',
                                    },
                                    '&:focus': {
                                        outline: 'none',
                                        color: theme.palette.text.primary,
                                    },
                                } }), (showQuickActions || dueDate || priority) && (_jsxs(Box, { sx: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.75,
                                    flexWrap: 'wrap',
                                    mt: 0.5,
                                }, children: [isTodaySelected ? (_jsx(Chip, { icon: _jsx(TodayIcon, { sx: { fontSize: '0.875rem !important', color: '#4caf50 !important' } }), label: "Today", size: "small", onDelete: handleRemoveDate, sx: {
                                            height: '28px',
                                            fontSize: '0.8125rem',
                                            backgroundColor: '#4caf50',
                                            color: 'white',
                                            fontWeight: 500,
                                            '& .MuiChip-icon': {
                                                color: 'white !important',
                                            },
                                            '& .MuiChip-deleteIcon': {
                                                fontSize: '1rem',
                                                color: 'white',
                                                '&:hover': {
                                                    color: 'rgba(255,255,255,0.8)',
                                                },
                                            },
                                        } })) : (_jsx(Button, { size: "small", startIcon: _jsx(TodayIcon, { sx: { fontSize: '0.875rem' } }), onClick: handleSetToday, sx: {
                                            textTransform: 'none',
                                            fontSize: '0.8125rem',
                                            color: theme.palette.text.secondary,
                                            minWidth: 'auto',
                                            px: 1.25,
                                            py: 0.5,
                                            height: '28px',
                                            borderRadius: '6px',
                                            border: "1px solid ".concat(alpha(theme.palette.divider, 0.5)),
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.action.hover, 0.5),
                                                borderColor: alpha(theme.palette.divider, 0.8),
                                            },
                                        }, children: "Today" })), _jsx(Button, { size: "small", startIcon: _jsx(FlagIcon, { sx: { fontSize: '0.875rem' } }), onClick: function () {
                                            // Cycle through priorities or open menu
                                            if (!priority) {
                                                handleSetPriority('medium');
                                            }
                                            else if (priority === 'medium') {
                                                handleSetPriority('high');
                                            }
                                            else if (priority === 'high') {
                                                handleSetPriority('low');
                                            }
                                            else {
                                                handleSetPriority('medium');
                                            }
                                        }, sx: {
                                            textTransform: 'none',
                                            fontSize: '0.8125rem',
                                            color: priority ? priorityColors[priority] : theme.palette.text.secondary,
                                            minWidth: 'auto',
                                            px: 1.25,
                                            py: 0.5,
                                            height: '28px',
                                            borderRadius: '6px',
                                            border: "1px solid ".concat(alpha(theme.palette.divider, 0.5)),
                                            backgroundColor: 'transparent',
                                            '& .MuiButton-startIcon': {
                                                color: priority ? priorityColors[priority] : theme.palette.text.secondary,
                                            },
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.action.hover, 0.5),
                                                borderColor: alpha(theme.palette.divider, 0.8),
                                            },
                                        }, children: "Priority" }), priority && (_jsx(Chip, { icon: _jsx(FlagIcon, { sx: { fontSize: '0.875rem !important', color: "".concat(priorityColors[priority], " !important") } }), label: priorityLabels[priority], size: "small", onDelete: handleRemovePriority, sx: {
                                            height: '28px',
                                            fontSize: '0.8125rem',
                                            backgroundColor: alpha(priorityColors[priority], 0.15),
                                            color: priorityColors[priority],
                                            fontWeight: 500,
                                            '& .MuiChip-deleteIcon': {
                                                fontSize: '1rem',
                                                color: priorityColors[priority],
                                            },
                                        } })), _jsx(Button, { size: "small", startIcon: _jsx(RemindersIcon, { sx: { fontSize: '0.875rem' } }), sx: {
                                            textTransform: 'none',
                                            fontSize: '0.8125rem',
                                            color: theme.palette.text.secondary,
                                            minWidth: 'auto',
                                            px: 1.25,
                                            py: 0.5,
                                            height: '28px',
                                            borderRadius: '6px',
                                            border: "1px solid ".concat(alpha(theme.palette.divider, 0.5)),
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.action.hover, 0.5),
                                                borderColor: alpha(theme.palette.divider, 0.8),
                                            },
                                        }, children: "Reminders" }), _jsx(IconButton, { size: "small", onClick: function (e) { return setMoreMenuAnchor(e.currentTarget); }, sx: {
                                            width: '28px',
                                            height: '28px',
                                            color: theme.palette.text.secondary,
                                            border: "1px solid ".concat(alpha(theme.palette.divider, 0.5)),
                                            borderRadius: '6px',
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.action.hover, 0.5),
                                            },
                                        }, children: _jsx(MoreVertIcon, { sx: { fontSize: '1rem' } }) })] })), _jsxs(Box, { sx: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.75,
                                    mt: 0.5,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        opacity: 0.8,
                                    },
                                }, onClick: function (e) { return setCategoryMenuAnchor(e.currentTarget); }, children: [_jsx(InboxIcon, { sx: { fontSize: '1rem', color: theme.palette.text.secondary } }), _jsx(Box, { component: "span", sx: {
                                            fontSize: '0.8125rem',
                                            color: theme.palette.text.secondary,
                                            fontWeight: 500,
                                        }, children: (selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.name) || 'Inbox' }), _jsx(KeyboardArrowDownIcon, { sx: { fontSize: '1rem', color: theme.palette.text.secondary } })] })] })] }), _jsxs(Menu, { anchorEl: categoryMenuAnchor, open: Boolean(categoryMenuAnchor), onClose: function () { return setCategoryMenuAnchor(null); }, PaperProps: {
                    sx: {
                        minWidth: 200,
                        mt: 1,
                    },
                }, children: [_jsxs(MenuItem, { onClick: function () {
                            setSelectedCategoryId(undefined);
                            setCategoryMenuAnchor(null);
                        }, selected: !selectedCategoryId, children: [_jsx(ListItemIcon, { children: _jsx(InboxIcon, { fontSize: "small" }) }), _jsx(ListItemText, { children: "Inbox" })] }), categories.map(function (category) { return (_jsx(MenuItem, { onClick: function () {
                            setSelectedCategoryId(category.id);
                            setCategoryMenuAnchor(null);
                        }, selected: selectedCategoryId === category.id, children: _jsx(ListItemText, { children: category.name }) }, category.id)); })] }), _jsxs(Menu, { anchorEl: moreMenuAnchor, open: Boolean(moreMenuAnchor), onClose: function () { return setMoreMenuAnchor(null); }, PaperProps: {
                    sx: {
                        minWidth: 180,
                        mt: 1,
                    },
                }, children: [_jsx(MenuItem, { onClick: function () { return setMoreMenuAnchor(null); }, children: _jsx(ListItemText, { children: "Add subtask" }) }), _jsx(MenuItem, { onClick: function () { return setMoreMenuAnchor(null); }, children: _jsx(ListItemText, { children: "Add comment" }) })] })] }));
};
export default InlineTaskEditor;
