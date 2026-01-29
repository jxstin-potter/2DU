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
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createTask, updateTask, deleteTask, subscribeToTasks, loadMoreTasks } from '../services/tasksService';
import { Timestamp } from 'firebase/firestore';
import { logger } from '../utils/logger';
import { logHookError } from '../utils/errorLogging';
// Create a hook-specific logger
var tasksHookLogger = logger.hook('useTasks');
// Helper function to convert Firestore task to app task
var convertFirestoreTaskToAppTask = function (task) {
    var _a, _b, _c, _d, _e;
    var appTask = __assign(__assign({}, task), { createdAt: task.createdAt.toDate(), updatedAt: task.updatedAt.toDate(), dueDate: ((_a = task.dueDate) === null || _a === void 0 ? void 0 : _a.toDate()) || undefined, lastSharedAt: ((_b = task.lastSharedAt) === null || _b === void 0 ? void 0 : _b.toDate()) || undefined, subtasks: (_c = task.subtasks) === null || _c === void 0 ? void 0 : _c.map(function (subtask) { return (__assign(__assign({}, subtask), { createdAt: subtask.createdAt.toDate(), updatedAt: subtask.updatedAt.toDate() })); }), comments: (_d = task.comments) === null || _d === void 0 ? void 0 : _d.map(function (comment) { return (__assign(__assign({}, comment), { createdAt: comment.createdAt.toDate(), updatedAt: comment.updatedAt.toDate() })); }), attachments: (_e = task.attachments) === null || _e === void 0 ? void 0 : _e.map(function (attachment) { return (__assign(__assign({}, attachment), { uploadedAt: attachment.uploadedAt.toDate() })); }) });
    return appTask;
};
// Helper function to convert app task to Firestore task
var convertAppTaskToFirestoreTask = function (task) {
    var firestoreTask = {};
    // Copy all non-date fields
    Object.entries(task).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'dueDate' &&
            key !== 'lastSharedAt' && key !== 'subtasks' && key !== 'comments' &&
            key !== 'attachments') {
            firestoreTask[key] = value;
        }
    });
    // Handle date fields
    if (task.dueDate) {
        firestoreTask.dueDate = Timestamp.fromDate(task.dueDate);
    }
    if (task.lastSharedAt) {
        firestoreTask.lastSharedAt = Timestamp.fromDate(task.lastSharedAt);
    }
    // Handle subtasks
    if (task.subtasks) {
        firestoreTask.subtasks = task.subtasks.map(function (subtask) { return (__assign(__assign({}, subtask), { createdAt: Timestamp.fromDate(subtask.createdAt), updatedAt: Timestamp.fromDate(subtask.updatedAt) })); });
    }
    // Handle comments
    if (task.comments) {
        firestoreTask.comments = task.comments.map(function (comment) { return (__assign(__assign({}, comment), { createdAt: Timestamp.fromDate(comment.createdAt), updatedAt: Timestamp.fromDate(comment.updatedAt) })); });
    }
    // Handle attachments
    if (task.attachments) {
        firestoreTask.attachments = task.attachments.map(function (attachment) { return (__assign(__assign({}, attachment), { uploadedAt: Timestamp.fromDate(attachment.uploadedAt) })); });
    }
    return firestoreTask;
};
export var useTasks = function () {
    var _a = useState([]), tasks = _a[0], setTasks = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState({
        completionStatus: 'all',
        sortBy: 'creationDate',
        sortOrder: 'desc',
        view: undefined,
        limit: 20
    }), filterParamsState = _d[0], setFilterParamsState = _d[1];
    var _e = useState(null), lastVisible = _e[0], setLastVisible = _e[1];
    var _f = useState(true), hasMore = _f[0], setHasMore = _f[1];
    var _g = useState(false), isLoadingMore = _g[0], setIsLoadingMore = _g[1];
    var user = useAuth().user;
    // Memoize filterParams to prevent unnecessary re-subscriptions
    var filterParams = useMemo(function () { return filterParamsState; }, [filterParamsState]);
    // Helper function to set error state with proper typing
    var setTaskError = function (message, code, details) {
        logHookError(new Error(message), 'useTasks', message, { code: code, details: details });
        setError({ message: message, code: code, details: details });
    };
    // Helper function to clear error state
    var clearError = function () {
        setError(null);
    };
    // Load more tasks
    var loadMore = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, newTasks_1, err_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user || !lastVisible || !hasMore || isLoadingMore) {
                        tasksHookLogger.debug('Skipping loadMore', {
                            hasUser: !!user,
                            hasLastVisible: !!lastVisible,
                            hasMore: hasMore,
                            isLoadingMore: isLoadingMore
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setIsLoadingMore(true);
                    clearError();
                    tasksHookLogger.info('Loading more tasks', {
                        userId: user.id,
                        currentTaskCount: tasks.length,
                        filterParams: filterParams
                    });
                    return [4 /*yield*/, loadMoreTasks(user.id, filterParams, lastVisible)];
                case 2:
                    result = _a.sent();
                    newTasks_1 = result.tasks.map(convertFirestoreTaskToAppTask);
                    setTasks(function (prev) { return __spreadArray(__spreadArray([], prev, true), newTasks_1, true); });
                    setLastVisible(result.lastVisible);
                    setHasMore(result.hasMore);
                    tasksHookLogger.info('Successfully loaded more tasks', {
                        userId: user.id,
                        newTaskCount: newTasks_1.length,
                        totalTaskCount: tasks.length + newTasks_1.length,
                        hasMore: result.hasMore
                    });
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    error_1 = err_1 instanceof Error ? err_1 : new Error('Unknown error occurred');
                    logHookError(error_1, 'useTasks', 'Failed to load more tasks', {
                        userId: user === null || user === void 0 ? void 0 : user.id,
                        filterParams: filterParams,
                        error: error_1.message
                    });
                    setTaskError('Failed to load more tasks', 'NETWORK_ERROR', { error: err_1 });
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoadingMore(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [user, lastVisible, hasMore, isLoadingMore, filterParams]);
    useEffect(function () {
        if (!user) {
            tasksHookLogger.info('No user found, clearing tasks state');
            setTasks([]);
            setLoading(false);
            clearError();
            return;
        }
        setLoading(true);
        clearError();
        tasksHookLogger.info('Setting up task subscription', {
            userId: user.id,
            filterParams: filterParams
        });
        var unsubscribe;
        try {
            unsubscribe = subscribeToTasks(user.id, filterParams, function (result) {
                try {
                    var processedTasks = result.tasks.map(convertFirestoreTaskToAppTask);
                    setTasks(processedTasks);
                    setLastVisible(result.lastVisible);
                    setHasMore(result.hasMore);
                    setLoading(false);
                    clearError();
                    tasksHookLogger.info('Received task updates', {
                        userId: user.id,
                        taskCount: processedTasks.length,
                        hasMore: result.hasMore
                    });
                }
                catch (err) {
                    var error_2 = err instanceof Error ? err : new Error('Unknown error occurred');
                    logHookError(error_2, 'useTasks', 'Failed to process tasks data', {
                        userId: user.id,
                        filterParams: filterParams,
                        error: error_2.message
                    });
                    setTaskError('Failed to process tasks data', 'PROCESSING_ERROR', { error: err });
                    setLoading(false);
                    setTasks([]);
                }
            });
        }
        catch (err) {
            var error_3 = err instanceof Error ? err : new Error('Unknown error occurred');
            logHookError(error_3, 'useTasks', 'Failed to establish connection with tasks service', {
                userId: user.id,
                filterParams: filterParams,
                error: error_3.message
            });
            setTaskError('Failed to establish connection with tasks service', 'NETWORK_ERROR', { error: err });
            setLoading(false);
        }
        return function () {
            if (unsubscribe) {
                tasksHookLogger.info('Cleaning up task subscription', { userId: user.id });
                unsubscribe();
            }
        };
    }, [user, filterParams]);
    // Set the view filter (today, upcoming, calendar, etc.)
    var setView = useCallback(function (view) {
        tasksHookLogger.info('Updating task view', {
            userId: user === null || user === void 0 ? void 0 : user.id,
            newView: view
        });
        setFilterParamsState(function (prevFilters) { return (__assign(__assign({}, prevFilters), { view: view || undefined })); });
    }, [user === null || user === void 0 ? void 0 : user.id]);
    // Update filters
    var updateFilters = useCallback(function (newFilters) {
        tasksHookLogger.info('Updating task filters', {
            userId: user === null || user === void 0 ? void 0 : user.id,
            newFilters: newFilters
        });
        setFilterParamsState(function (prevFilters) { return (__assign(__assign({}, prevFilters), newFilters)); });
        setLastVisible(null);
        setHasMore(true);
    }, [user === null || user === void 0 ? void 0 : user.id]);
    var addTask = useCallback(function (title) { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user) {
                        setTaskError('Please log in to add tasks', 'AUTH_REQUIRED');
                        return [2 /*return*/];
                    }
                    tasksHookLogger.info('Adding new task', {
                        userId: user.id,
                        title: title
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    clearError();
                    return [4 /*yield*/, createTask(user.id, title)];
                case 2:
                    _a.sent();
                    tasksHookLogger.info('Task created successfully', {
                        userId: user.id
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    setTaskError('Failed to create new task', 'NETWORK_ERROR', { error: err_2, taskTitle: title });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [user]);
    var removeTask = useCallback(function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user) {
                        setTaskError('Please log in to remove tasks', 'AUTH_REQUIRED');
                        return [2 /*return*/];
                    }
                    tasksHookLogger.info('Removing task', {
                        userId: user.id,
                        taskId: taskId
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    clearError();
                    return [4 /*yield*/, deleteTask(taskId, user.id)];
                case 2:
                    _a.sent();
                    tasksHookLogger.info('Task removed successfully', {
                        userId: user.id,
                        taskId: taskId
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    setTaskError('Failed to remove task', 'NETWORK_ERROR', { error: err_3, taskId: taskId });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [user]);
    var toggleComplete = useCallback(function (taskId, completed) { return __awaiter(void 0, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user) {
                        setTaskError('Please log in to update tasks', 'AUTH_REQUIRED');
                        return [2 /*return*/];
                    }
                    tasksHookLogger.info('Toggling task completion', {
                        userId: user.id,
                        taskId: taskId,
                        completed: completed
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    clearError();
                    return [4 /*yield*/, updateTask(taskId, { completed: completed }, user.id)];
                case 2:
                    _a.sent();
                    tasksHookLogger.info('Task completion updated successfully', {
                        userId: user.id,
                        taskId: taskId,
                        completed: completed
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    setTaskError('Failed to update task status', 'NETWORK_ERROR', { error: err_4, taskId: taskId, completed: completed });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [user]);
    var editTask = function (task) { return __awaiter(void 0, void 0, void 0, function () {
        var firestoreTask, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user) {
                        setTaskError('Please log in to edit tasks', 'AUTH_REQUIRED');
                        return [2 /*return*/];
                    }
                    tasksHookLogger.info('Editing task', {
                        userId: user.id,
                        taskId: task.id,
                        updates: task
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    clearError();
                    firestoreTask = convertAppTaskToFirestoreTask(task);
                    return [4 /*yield*/, updateTask(task.id, firestoreTask, user.id)];
                case 2:
                    _a.sent();
                    tasksHookLogger.info('Task updated successfully', {
                        userId: user.id,
                        taskId: task.id
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _a.sent();
                    setTaskError('Failed to update task', 'NETWORK_ERROR', { error: err_5, taskId: task.id, updates: task });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return useMemo(function () { return ({
        tasks: tasks,
        loading: loading,
        error: error,
        addTask: addTask,
        removeTask: removeTask,
        toggleComplete: toggleComplete,
        editTask: editTask,
        loadMore: loadMore,
        isLoadingMore: isLoadingMore,
        hasMore: hasMore,
        setView: setView,
        updateFilters: updateFilters
    }); }, [tasks, loading, error, addTask, removeTask, toggleComplete, editTask, loadMore, isLoadingMore, hasMore, setView, updateFilters]);
};
