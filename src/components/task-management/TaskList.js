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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Box, Typography, Button, Menu, MenuItem, ListItemText, CircularProgress, Alert, useTheme, useMediaQuery, } from '@mui/material';
import { Sort as SortIcon, } from '@mui/icons-material';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import { FixedSizeList } from 'react-window';
import TaskItem from './TaskItem';
import InlineTaskEditor from './InlineTaskEditor';
import { useTaskModal } from '../../contexts/TaskModalContext';
var TaskList = function (_a) {
    var tasks = _a.tasks, _b = _a.loading, loading = _b === void 0 ? false : _b, _c = _a.error, error = _c === void 0 ? null : _c, onTaskAction = _a.onTaskAction, onCreateTask = _a.onCreateTask, _d = _a.draggable, draggable = _d === void 0 ? false : _d, tags = _a.tags, categories = _a.categories, onLoadMore = _a.onLoadMore, _e = _a.hasMore, hasMore = _e === void 0 ? false : _e, _f = _a.isLoadingMore, isLoadingMore = _f === void 0 ? false : _f, defaultCategoryId = _a.defaultCategoryId;
    var theme = useTheme();
    var _g = useTaskModal(), isTaskModalOpen = _g.isOpen, closeTaskModal = _g.closeModal;
    var _h = useState(null), sortAnchorEl = _h[0], setSortAnchorEl = _h[1];
    var _j = useState('dueDate'), sortBy = _j[0], setSortBy = _j[1];
    var _k = useState(null), actionInProgress = _k[0], setActionInProgress = _k[1];
    var _l = useState(false), showInlineEditor = _l[0], setShowInlineEditor = _l[1];
    // Don't auto-show inline editor - it should only be triggered explicitly
    // The inline editor is for quick adding within the list, not for sidebar "Add task"
    // Keep this disabled for now - inline editor can be added via a separate trigger if needed
    useEffect(function () {
        setShowInlineEditor(false);
    }, []);
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
    var handleTaskAction = useCallback(function (action) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            var actionFn, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (actionInProgress)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        setActionInProgress(action);
                        actionFn = onTaskAction[action];
                        if (!actionFn) return [3 /*break*/, 3];
                        return [4 /*yield*/, actionFn.apply(void 0, args)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        setActionInProgress(null);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }, [actionInProgress, onTaskAction]);
    var handleDragEnd = function (result) { return __awaiter(void 0, void 0, void 0, function () {
        var source, destination, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!result.destination || actionInProgress)
                        return [2 /*return*/];
                    source = result.source, destination = result.destination;
                    if (source.index === destination.index)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setActionInProgress('update');
                    return [4 /*yield*/, onTaskAction.update(tasks[source.index].id, {
                            order: destination.index
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    setActionInProgress(null);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSortClick = function (event) {
        setSortAnchorEl(event.currentTarget);
    };
    var handleSortClose = function () {
        setSortAnchorEl(null);
    };
    var handleSortSelect = function (option) {
        setSortBy(option);
        handleSortClose();
    };
    // Memoized sorted tasks
    var sortedTasks = useMemo(function () {
        return __spreadArray([], tasks, true).sort(function (a, b) {
            switch (sortBy) {
                case 'dueDate':
                    if (!a.dueDate)
                        return 1;
                    if (!b.dueDate)
                        return -1;
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'createdAt':
                    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
                default:
                    return 0;
            }
        });
    }, [tasks, sortBy]);
    // Virtualized list item renderer
    var Row = useCallback(function (_a) {
        var index = _a.index, style = _a.style;
        var task = sortedTasks[index];
        if (!task)
            return null;
        return (_jsx("div", { style: style, children: draggable ? (_jsx(Draggable, { draggableId: task.id, index: index, children: function (provided) { return (_jsx("div", __assign({ ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps, { children: _jsx(TaskItem, { task: task, onToggleComplete: function () { return handleTaskAction('toggle', task.id); }, onDelete: function () { return handleTaskAction('delete', task.id); }, onEdit: function () { return handleTaskAction('edit', task); }, onUpdate: onTaskAction.update, tags: tags, categories: categories, isActionInProgress: actionInProgress !== null }) }))); } })) : (_jsx(TaskItem, { task: task, onToggleComplete: function () { return handleTaskAction('toggle', task.id); }, onDelete: function () { return handleTaskAction('delete', task.id); }, onEdit: function () { return handleTaskAction('edit', task); }, onUpdate: onTaskAction.update, tags: tags, categories: categories, isActionInProgress: actionInProgress !== null })) }));
    }, [sortedTasks, tags, categories, actionInProgress, draggable, handleTaskAction]);
    // Throttle scroll handler to prevent excessive calls
    var scrollThrottleRef = React.useRef(null);
    var lastScrollOffsetRef = React.useRef(0);
    // Handle infinite scroll with throttling
    var handleScroll = useCallback(function (_a) {
        var scrollOffset = _a.scrollOffset, scrollUpdateWasRequested = _a.scrollUpdateWasRequested;
        // Throttle scroll events to max once per 100ms
        if (scrollThrottleRef.current) {
            return;
        }
        scrollThrottleRef.current = setTimeout(function () {
            scrollThrottleRef.current = null;
            // Only process if scroll offset changed significantly (at least 50px)
            if (Math.abs(scrollOffset - lastScrollOffsetRef.current) < 50 && !scrollUpdateWasRequested) {
                return;
            }
            lastScrollOffsetRef.current = scrollOffset;
            if (!scrollUpdateWasRequested && hasMore && !isLoadingMore && onLoadMore) {
                var listHeight_1 = 600; // Base height
                var scrollThreshold = listHeight_1 * 0.8; // Load more when 80% scrolled
                if (scrollOffset > scrollThreshold) {
                    onLoadMore();
                }
            }
        }, 100);
    }, [hasMore, isLoadingMore, onLoadMore]);
    // Cleanup throttle on unmount
    useEffect(function () {
        return function () {
            if (scrollThrottleRef.current) {
                clearTimeout(scrollThrottleRef.current);
            }
        };
    }, []);
    var isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    var listHeight = isMobile ? 400 : 600;
    if (loading) {
        return (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 3 }, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Box, { sx: { p: 2 }, children: _jsx(Alert, { severity: "error", children: _jsx(Typography, { variant: "body1", children: error }) }) }));
    }
    var listContent = (_jsx(FixedSizeList, { height: listHeight, width: "100%", itemCount: sortedTasks.length, itemSize: 72, onScroll: handleScroll, children: Row }));
    return (_jsxs(Box, { children: [_jsx(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 1,
                }, children: _jsxs(Button, { size: "small", startIcon: _jsx(SortIcon, {}), onClick: handleSortClick, children: ["Sort: ", sortBy === 'dueDate' ? 'Due Date' :
                            sortBy === 'title' ? 'Title' : 'Created'] }) }), showInlineEditor && onCreateTask && (_jsx(Box, { sx: { mb: 2 }, children: _jsx(InlineTaskEditor, { onSubmit: handleCreateTask, onCancel: handleCancelEditor, categories: categories, defaultCategoryId: defaultCategoryId }) })), draggable ? (_jsx(DragDropContext, { onDragEnd: handleDragEnd, children: _jsx(Droppable, { droppableId: "task-list", mode: "virtual", children: function (provided) { return (_jsxs("div", __assign({ ref: provided.innerRef }, provided.droppableProps, { children: [listContent, provided.placeholder] }))); } }) })) : (listContent), isLoadingMore && (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 2 }, children: _jsx(CircularProgress, { size: 24 }) })), _jsxs(Menu, { anchorEl: sortAnchorEl, open: Boolean(sortAnchorEl), onClose: handleSortClose, children: [_jsx(MenuItem, { onClick: function () { return handleSortSelect('dueDate'); }, children: _jsx(ListItemText, { children: "Due Date" }) }), _jsx(MenuItem, { onClick: function () { return handleSortSelect('title'); }, children: _jsx(ListItemText, { children: "Title" }) }), _jsx(MenuItem, { onClick: function () { return handleSortSelect('createdAt'); }, children: _jsx(ListItemText, { children: "Created Date" }) })] })] }));
};
export default TaskList;
