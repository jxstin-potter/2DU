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
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, orderBy, serverTimestamp, getDoc, Timestamp, onSnapshot, FirestoreError, limit, startAfter, writeBatch, } from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS, CACHE_DURATION } from '../types/firestore';
import { logger } from '../utils/logger';
import { logServiceError } from '../utils/errorLogging';
// Create a service-specific logger
var tasksLogger = logger.service('tasksService');
/**
 * Validate user ID is provided and is a non-empty string
 */
var validateUserId = function (userId) {
    if (!userId) {
        tasksLogger.error('User ID validation failed: ID is required');
        throw new Error('User ID is required');
    }
    if (typeof userId !== 'string') {
        tasksLogger.error('User ID validation failed: ID must be a string', { userId: userId });
        throw new Error('User ID must be a string');
    }
    if (userId.trim() === '') {
        tasksLogger.error('User ID validation failed: ID cannot be empty');
        throw new Error('User ID cannot be empty');
    }
};
/**
 * Validate task ID is provided and is a non-empty string
 */
var validateTaskId = function (taskId) {
    if (!taskId) {
        tasksLogger.error('Task ID validation failed: ID is required');
        throw new Error('Task ID is required');
    }
    if (typeof taskId !== 'string') {
        tasksLogger.error('Task ID validation failed: ID must be a string', { taskId: taskId });
        throw new Error('Task ID must be a string');
    }
    if (taskId.trim() === '') {
        tasksLogger.error('Task ID validation failed: ID cannot be empty');
        throw new Error('Task ID cannot be empty');
    }
};
/**
 * Handle Firestore-specific errors
 */
var handleFirestoreError = function (error, operation, context) {
    var errorMessage = "Firestore error during ".concat(operation);
    switch (error.code) {
        case 'permission-denied':
            errorMessage = "Permission denied while ".concat(operation);
            break;
        case 'not-found':
            errorMessage = "Resource not found while ".concat(operation);
            break;
        case 'unavailable':
            errorMessage = "Firestore service unavailable while ".concat(operation);
            break;
        case 'failed-precondition':
            errorMessage = "Operation failed due to invalid state while ".concat(operation);
            break;
    }
    logServiceError(error, 'tasksService', errorMessage, __assign(__assign({}, context), { errorCode: error.code }));
    throw new Error(errorMessage);
};
/**
 * Create a new task in Firestore (simplified - accepts full task data)
 */
export var createTaskFromData = function (userId, taskData) { return __awaiter(void 0, void 0, void 0, function () {
    var cleanData, finalData, docRef, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                validateUserId(userId);
                if (!taskData.title || typeof taskData.title !== 'string' || taskData.title.trim() === '') {
                    tasksLogger.error('Task creation failed: Invalid title', { userId: userId });
                    throw new Error('Task title is required and cannot be empty');
                }
                tasksLogger.info('Creating new task', { userId: userId, title: taskData.title });
                cleanData = {
                    userId: userId,
                    title: taskData.title.trim(),
                    description: ((_a = taskData.description) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                    completed: (_b = taskData.completed) !== null && _b !== void 0 ? _b : false,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };
                // Only add optional fields if they have values
                if (taskData.dueDate) {
                    cleanData.dueDate = taskData.dueDate instanceof Timestamp ? taskData.dueDate : Timestamp.fromDate(taskData.dueDate);
                }
                if (taskData.tags && taskData.tags.length > 0) {
                    cleanData.tags = taskData.tags;
                }
                if (taskData.categoryId) {
                    cleanData.categoryId = taskData.categoryId;
                }
                if (taskData.category) {
                    cleanData.category = taskData.category;
                }
                if (taskData.order !== undefined) {
                    cleanData.order = taskData.order;
                }
                if (taskData.status) {
                    cleanData.status = taskData.status;
                }
                if (taskData.priority) {
                    cleanData.priority = taskData.priority;
                }
                finalData = Object.fromEntries(Object.entries(cleanData).filter(function (_a) {
                    var _ = _a[0], value = _a[1];
                    return value !== undefined;
                }));
                return [4 /*yield*/, addDoc(collection(db, COLLECTIONS.TASKS), finalData)];
            case 1:
                docRef = _c.sent();
                tasksLogger.info('Task created successfully', { taskId: docRef.id, userId: userId });
                return [2 /*return*/, docRef.id];
            case 2:
                error_1 = _c.sent();
                if (error_1 instanceof FirestoreError) {
                    handleFirestoreError(error_1, 'creating task', { userId: userId, taskData: taskData });
                }
                logServiceError(error_1, 'tasksService', 'Failed to create task', { userId: userId, taskData: taskData });
                throw new Error('Failed to create task. Please try again.');
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Create a new task in Firestore (legacy - for backward compatibility)
 */
export var createTask = function (userId, text, dueDate) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, createTaskFromData(userId, {
                title: text,
                dueDate: dueDate ? Timestamp.fromDate(dueDate) : undefined,
            })];
    });
}); };
/**
 * Get all tasks for a specific user
 */
export var getUserTasks = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var q, querySnapshot, tasks, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validateUserId(userId);
                tasksLogger.info('Fetching user tasks', { userId: userId });
                q = query(collection(db, COLLECTIONS.TASKS), where('userId', '==', userId), orderBy('createdAt', 'desc'));
                return [4 /*yield*/, getDocs(q)];
            case 1:
                querySnapshot = _a.sent();
                tasks = querySnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                tasksLogger.info('Successfully fetched user tasks', {
                    userId: userId,
                    taskCount: tasks.length
                });
                return [2 /*return*/, tasks];
            case 2:
                error_2 = _a.sent();
                logServiceError(error_2, 'tasksService', 'Failed to fetch user tasks', { userId: userId });
                throw new Error('Failed to fetch tasks');
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Get filtered and sorted tasks for a specific user
 */
export var getFilteredTasks = function (userId_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([userId_1], args_1, true), void 0, function (userId, filterParams) {
        var conditions, sortDirection_1, q, querySnapshot, tasks, now_1, now, today_1, tomorrow_1, error_3;
        if (filterParams === void 0) { filterParams = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Validate userId
                    validateUserId(userId);
                    conditions = [
                        where('userId', '==', userId),
                    ];
                    // Add completion status filter
                    if (filterParams.completionStatus === 'active') {
                        conditions.push(where('completed', '==', false));
                    }
                    else if (filterParams.completionStatus === 'completed') {
                        conditions.push(where('completed', '==', true));
                    }
                    sortDirection_1 = filterParams.sortOrder === 'asc' ? 'asc' : 'desc';
                    q = query.apply(void 0, __spreadArray(__spreadArray([collection(db, COLLECTIONS.TASKS)], conditions, false), [filterParams.sortBy === 'dueDate' ? orderBy('dueDate', sortDirection_1) : orderBy('createdAt', sortDirection_1)], false));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _a.sent();
                    tasks = querySnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    // If sorting by dueDate, handle null dueDate values (Firebase can't mix null and non-null in orderBy)
                    if (filterParams.sortBy === 'dueDate') {
                        // Sort tasks with missing due dates to the end if descending, start if ascending
                        tasks.sort(function (a, b) {
                            // If either task has no dueDate
                            if (!a.dueDate && !b.dueDate)
                                return 0;
                            if (!a.dueDate)
                                return sortDirection_1 === 'asc' ? -1 : 1;
                            if (!b.dueDate)
                                return sortDirection_1 === 'asc' ? 1 : -1;
                            // Both have due dates, compare them
                            var dateA = a.dueDate.toDate().getTime();
                            var dateB = b.dueDate.toDate().getTime();
                            return sortDirection_1 === 'asc' ? dateA - dateB : dateB - dateA;
                        });
                    }
                    // Apply view-specific filters after Firestore query
                    if (filterParams.view === 'upcoming' || filterParams.filterFutureDates) {
                        now_1 = new Date();
                        // For upcoming view, filter to only include tasks with future due dates
                        tasks = tasks.filter(function (task) {
                            if (!task.dueDate)
                                return false;
                            var taskDate = task.dueDate.toDate();
                            return taskDate > now_1;
                        });
                    }
                    else if (filterParams.view === 'today') {
                        now = new Date();
                        today_1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        tomorrow_1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                        // For today view, only include tasks due today
                        tasks = tasks.filter(function (task) {
                            if (!task.dueDate)
                                return false;
                            var taskDate = task.dueDate.toDate();
                            return taskDate >= today_1 && taskDate < tomorrow_1;
                        });
                    }
                    return [2 /*return*/, tasks];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error fetching filtered tasks:', error_3);
                    throw new Error('Failed to fetch tasks');
                case 3: return [2 /*return*/];
            }
        });
    });
};
// Cache management
var getCachedTasks = function (userId, filterParams) {
    var cacheKey = "tasks_".concat(userId, "_").concat(JSON.stringify(filterParams));
    var cached = localStorage.getItem(cacheKey);
    if (cached) {
        var _a = JSON.parse(cached), data = _a.data, timestamp = _a.timestamp, cachedParams = _a.filterParams;
        if (Date.now() - timestamp < CACHE_DURATION &&
            JSON.stringify(filterParams) === JSON.stringify(cachedParams)) {
            return data;
        }
    }
    return null;
};
var setCachedTasks = function (userId, filterParams, tasks) {
    var cacheKey = "tasks_".concat(userId, "_").concat(JSON.stringify(filterParams));
    var cache = {
        data: tasks,
        timestamp: Date.now(),
        filterParams: filterParams
    };
    localStorage.setItem(cacheKey, JSON.stringify(cache));
};
/**
 * Build Firestore query based on filter parameters
 */
var buildTaskQuery = function (userId, filterParams, lastVisible) {
    if (filterParams === void 0) { filterParams = {}; }
    var conditions = [where('userId', '==', userId)];
    // Add completion status filter
    if (filterParams.completionStatus === 'active') {
        conditions.push(where('completed', '==', false));
    }
    else if (filterParams.completionStatus === 'completed') {
        conditions.push(where('completed', '==', true));
    }
    // Add date-based filters
    if (filterParams.view === 'today') {
        var today = new Date();
        var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        conditions.push(where('dueDate', '>=', Timestamp.fromDate(today)), where('dueDate', '<', Timestamp.fromDate(tomorrow)));
    }
    else if (filterParams.view === 'upcoming' || filterParams.filterFutureDates) {
        conditions.push(where('dueDate', '>', Timestamp.fromDate(new Date())));
    }
    // Add sorting
    var sortDirection = filterParams.sortOrder === 'asc' ? 'asc' : 'desc';
    if (filterParams.sortBy === 'dueDate') {
        conditions.push(orderBy('dueDate', sortDirection));
    }
    else if (filterParams.completionStatus === 'completed') {
        // For completed tasks, sort by updatedAt (completion time) to avoid index requirement
        conditions.push(orderBy('updatedAt', sortDirection));
    }
    else {
        conditions.push(orderBy('createdAt', sortDirection));
    }
    // Add pagination
    if (filterParams.limit) {
        conditions.push(limit(filterParams.limit));
    }
    // Create the query
    var q = query.apply(void 0, __spreadArray([collection(db, COLLECTIONS.TASKS)], conditions, false));
    // Add startAfter for pagination
    if (lastVisible) {
        q = query(q, startAfter(lastVisible));
    }
    return q;
};
/**
 * Subscribe to tasks for a user (real-time)
 */
export var subscribeToTasks = function (userId, filterParams, callback) {
    if (filterParams === void 0) { filterParams = {}; }
    try {
        // Check cache first
        var cachedTasks = getCachedTasks(userId, filterParams);
        if (cachedTasks) {
            callback({
                tasks: cachedTasks,
                lastVisible: null,
                hasMore: false
            });
        }
        var q = buildTaskQuery(userId, filterParams);
        // Subscribe to query results
        var unsubscribe_1 = onSnapshot(q, function (querySnapshot) {
            try {
                var tasks = querySnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                // Update cache
                setCachedTasks(userId, filterParams, tasks);
                callback({
                    tasks: tasks,
                    lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
                    hasMore: querySnapshot.docs.length === (filterParams.limit || 20)
                });
            }
            catch (error) {
                tasksLogger.error('Error processing task data', {
                    userId: userId,
                    filterParams: filterParams,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
                callback({
                    tasks: [],
                    lastVisible: null,
                    hasMore: false
                });
            }
        }, function (error) {
            if (error instanceof FirestoreError) {
                handleFirestoreError(error, 'task subscription', { userId: userId, filterParams: filterParams });
            }
            else {
                tasksLogger.error('Unexpected error in task subscription', {
                    userId: userId,
                    filterParams: filterParams,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
            // Call callback with empty result so loading state gets updated
            callback({
                tasks: [],
                lastVisible: null,
                hasMore: false
            });
        });
        return function () {
            try {
                unsubscribe_1();
            }
            catch (error) {
                tasksLogger.error('Error during subscription cleanup', { userId: userId });
            }
        };
    }
    catch (error) {
        if (error instanceof FirestoreError) {
            handleFirestoreError(error, 'setting up task subscription', { userId: userId, filterParams: filterParams });
        }
        else {
            tasksLogger.error('Failed to set up task subscription', {
                userId: userId,
                filterParams: filterParams,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        // Call callback with empty result so loading state gets updated
        callback({
            tasks: [],
            lastVisible: null,
            hasMore: false
        });
        return function () { };
    }
};
/**
 * Load more tasks (pagination)
 */
export var loadMoreTasks = function (userId, filterParams, lastVisible) { return __awaiter(void 0, void 0, void 0, function () {
    var q, querySnapshot, tasks, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                q = buildTaskQuery(userId, filterParams, lastVisible);
                return [4 /*yield*/, getDocs(q)];
            case 1:
                querySnapshot = _a.sent();
                tasks = querySnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                return [2 /*return*/, {
                        tasks: tasks,
                        lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
                        hasMore: querySnapshot.docs.length === (filterParams.limit || 20)
                    }];
            case 2:
                error_4 = _a.sent();
                tasksLogger.error('Failed to load more tasks', {
                    userId: userId,
                    filterParams: filterParams,
                    error: error_4 instanceof Error ? error_4.message : 'Unknown error'
                });
                throw error_4;
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Batch update tasks
 */
export var batchUpdateTasks = function (updates, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var batch, _i, updates_1, _a, id, data, taskRef, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                batch = writeBatch(db);
                for (_i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
                    _a = updates_1[_i], id = _a.id, data = _a.data;
                    taskRef = doc(db, COLLECTIONS.TASKS, id);
                    batch.update(taskRef, __assign(__assign({}, data), { updatedAt: serverTimestamp() }));
                }
                return [4 /*yield*/, batch.commit()];
            case 1:
                _b.sent();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                tasksLogger.error('Failed to batch update tasks', {
                    updates: updates,
                    userId: userId,
                    error: error_5 instanceof Error ? error_5.message : 'Unknown error'
                });
                throw error_5;
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Verify task ownership before any update/delete operation
 */
var verifyTaskOwnership = function (taskId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var taskDoc, taskData, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validateTaskId(taskId);
                validateUserId(userId);
                return [4 /*yield*/, getDoc(doc(db, COLLECTIONS.TASKS, taskId))];
            case 1:
                taskDoc = _a.sent();
                if (!taskDoc.exists()) {
                    throw new Error("Task with ID ".concat(taskId, " not found"));
                }
                taskData = taskDoc.data();
                if (taskData.userId !== userId) {
                    throw new Error("User ".concat(userId, " does not own task ").concat(taskId));
                }
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                if (error_6 instanceof FirestoreError) {
                    handleFirestoreError(error_6, 'verifying task ownership', { taskId: taskId, userId: userId });
                }
                tasksLogger.error('Failed to verify task ownership', {
                    taskId: taskId,
                    userId: userId,
                    error: error_6 instanceof Error ? error_6.message : 'Unknown error'
                });
                throw error_6;
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Update a task's completion status
 */
export var updateTaskStatus = function (taskId, isCompleted, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                validateTaskId(taskId);
                validateUserId(userId);
                return [4 /*yield*/, verifyTaskOwnership(taskId, userId)];
            case 1:
                _a.sent();
                return [4 /*yield*/, updateDoc(doc(db, COLLECTIONS.TASKS, taskId), {
                        isCompleted: isCompleted,
                        updatedAt: serverTimestamp()
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                if (error_7 instanceof FirestoreError) {
                    handleFirestoreError(error_7, 'updating task status', { taskId: taskId, userId: userId, isCompleted: isCompleted });
                }
                tasksLogger.error('Failed to update task status', {
                    taskId: taskId,
                    userId: userId,
                    isCompleted: isCompleted,
                    error: error_7 instanceof Error ? error_7.message : 'Unknown error'
                });
                throw new Error('Failed to update task status. Please try again.');
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Update a task's text
 */
export var updateTaskText = function (taskId, text, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var taskRef, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                // Verify task ownership
                return [4 /*yield*/, verifyTaskOwnership(taskId, userId)];
            case 1:
                // Verify task ownership
                _a.sent();
                if (!text || typeof text !== 'string' || text.trim() === '') {
                    throw new Error('Task text is required');
                }
                taskRef = doc(db, COLLECTIONS.TASKS, taskId);
                return [4 /*yield*/, updateDoc(taskRef, { text: text.trim() })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                console.error('Error updating task text:', error_8);
                throw new Error('Failed to update task');
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Update an entire task with all fields
 */
export var updateTask = function (taskId, taskData, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var taskRef, cleanedData, error_9;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                // Verify task ownership
                return [4 /*yield*/, verifyTaskOwnership(taskId, userId)];
            case 1:
                // Verify task ownership
                _b.sent();
                // Validate required fields if they are being updated
                if (taskData.text !== undefined && (!taskData.text || typeof taskData.text !== 'string' || taskData.text.trim() === '')) {
                    throw new Error('Task text is required');
                }
                taskRef = doc(db, COLLECTIONS.TASKS, taskId);
                cleanedData = {};
                if (taskData.title !== undefined) {
                    cleanedData.title = taskData.title.trim();
                }
                if (taskData.description !== undefined) {
                    cleanedData.description = ((_a = taskData.description) === null || _a === void 0 ? void 0 : _a.trim()) || undefined;
                }
                if (taskData.completed !== undefined) {
                    cleanedData.completed = taskData.completed;
                }
                if (taskData.notes !== undefined) {
                    cleanedData.notes = taskData.notes.trim();
                }
                if (taskData.dueDate !== undefined) {
                    cleanedData.dueDate = taskData.dueDate;
                }
                if (taskData.priority !== undefined) {
                    cleanedData.priority = taskData.priority;
                }
                if (taskData.status !== undefined) {
                    cleanedData.status = taskData.status;
                }
                if (taskData.categoryId !== undefined) {
                    cleanedData.categoryId = taskData.categoryId;
                }
                if (taskData.order !== undefined) {
                    cleanedData.order = taskData.order;
                }
                if (taskData.tags !== undefined) {
                    cleanedData.tags = taskData.tags;
                }
                // Always update updatedAt timestamp
                cleanedData.updatedAt = serverTimestamp();
                return [4 /*yield*/, updateDoc(taskRef, cleanedData)];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                error_9 = _b.sent();
                console.error('Error updating task:', error_9);
                throw new Error('Failed to update task');
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Batch update task order for reordering. Uses Firestore writeBatch.
 */
export var reorderTasks = function (userId, updates) { return __awaiter(void 0, void 0, void 0, function () {
    var batch, _i, updates_2, _a, taskId, order, taskRef, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                validateUserId(userId);
                if (!updates.length)
                    return [2 /*return*/];
                return [4 /*yield*/, Promise.all(updates.map(function (_a) {
                        var taskId = _a.taskId;
                        return verifyTaskOwnership(taskId, userId);
                    }))];
            case 1:
                _b.sent();
                batch = writeBatch(db);
                for (_i = 0, updates_2 = updates; _i < updates_2.length; _i++) {
                    _a = updates_2[_i], taskId = _a.taskId, order = _a.order;
                    taskRef = doc(db, COLLECTIONS.TASKS, taskId);
                    batch.update(taskRef, { order: order, updatedAt: serverTimestamp() });
                }
                return [4 /*yield*/, batch.commit()];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                error_10 = _b.sent();
                if (error_10 instanceof FirestoreError) {
                    handleFirestoreError(error_10, 'reorder tasks', { userId: userId, count: updates.length });
                }
                tasksLogger.error('Failed to reorder tasks', {
                    userId: userId,
                    count: updates.length,
                    error: error_10 instanceof Error ? error_10.message : 'Unknown error',
                });
                throw new Error('Failed to update task order.');
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Delete a task
 */
export var deleteTask = function (taskId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                validateTaskId(taskId);
                validateUserId(userId);
                return [4 /*yield*/, verifyTaskOwnership(taskId, userId)];
            case 1:
                _a.sent();
                return [4 /*yield*/, deleteDoc(doc(db, COLLECTIONS.TASKS, taskId))];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_11 = _a.sent();
                if (error_11 instanceof FirestoreError) {
                    handleFirestoreError(error_11, 'deleting task', { taskId: taskId, userId: userId });
                }
                tasksLogger.error('Failed to delete task', {
                    taskId: taskId,
                    userId: userId,
                    error: error_11 instanceof Error ? error_11.message : 'Unknown error'
                });
                throw new Error('Failed to delete task. Please try again.');
            case 4: return [2 /*return*/];
        }
    });
}); };
