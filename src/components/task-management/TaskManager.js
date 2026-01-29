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
import { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress, Container, } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';
import { useAuth } from '../../contexts/AuthContext';
import { useTaskModal } from '../../contexts/TaskModalContext';
import { subscribeToTasks, createTaskFromData, updateTask, deleteTask } from '../../services/tasksService';
import { taskDocumentToTask, taskToTaskDocument } from '../../utils/taskHelpers';
import TaskModal from '../modals/TaskModal';
import TaskList from './TaskList';
import { DEFAULT_TAGS } from '../../constants/defaultTags';
var TaskManager = function () {
    var _a = useAuth(), user = _a.user, authLoading = _a.loading;
    var _b = useTaskModal(), isTaskModalOpen = _b.isOpen, openTaskModal = _b.openModal, closeTaskModal = _b.closeModal;
    var _c = useState([]), tasks = _c[0], setTasks = _c[1];
    var _d = useState([]), categories = _d[0], setCategories = _d[1];
    var _e = useState(DEFAULT_TAGS), tags = _e[0], setTags = _e[1];
    var _f = useState(true), loading = _f[0], setLoading = _f[1];
    var _g = useState(null), error = _g[0], setError = _g[1];
    var _h = useState(null), selectedTask = _h[0], setSelectedTask = _h[1];
    var _j = useState(null), selectedCategory = _j[0], setSelectedCategory = _j[1];
    // Subscribe to tasks using real-time listener (simplified approach)
    useEffect(function () {
        if (!(user === null || user === void 0 ? void 0 : user.id)) {
            setTasks([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        // Use real-time subscription - automatically updates when tasks change
        var unsubscribe = subscribeToTasks(user.id, { completionStatus: 'all', sortBy: 'creationDate', sortOrder: 'desc' }, function (result) {
            try {
                // Convert TaskDocument to Task using helper (with error handling per task)
                var convertedTasks = result.tasks.map(function (taskDoc) {
                    var _a;
                    try {
                        return taskDocumentToTask(taskDoc);
                    }
                    catch (taskError) {
                        // Return a minimal valid task if conversion fails
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
                setTasks(convertedTasks);
                setLoading(false);
                setError(null);
            }
            catch (error) {
                setError('Failed to process tasks');
                setLoading(false);
            }
        });
        // Load categories and tags (one-time load)
        var loadCategoriesAndTags = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, collection, getDocs, db, categoriesSnapshot, loadedCategories, tagsSnapshot, loadedTags, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, import('firebase/firestore')];
                    case 1:
                        _a = _b.sent(), collection = _a.collection, getDocs = _a.getDocs;
                        return [4 /*yield*/, import('../../firebase')];
                    case 2:
                        db = (_b.sent()).db;
                        return [4 /*yield*/, getDocs(collection(db, 'categories'))];
                    case 3:
                        categoriesSnapshot = _b.sent();
                        loadedCategories = categoriesSnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                        setCategories(loadedCategories);
                        return [4 /*yield*/, getDocs(collection(db, 'tags'))];
                    case 4:
                        tagsSnapshot = _b.sent();
                        if (!tagsSnapshot.empty) {
                            loadedTags = tagsSnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                            setTags(loadedTags);
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        console.error('Failed to load categories/tags:', error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        loadCategoriesAndTags();
        return function () {
            unsubscribe();
        };
    }, [user === null || user === void 0 ? void 0 : user.id]);
    var handleTaskSelect = function (task) {
        setSelectedTask(task);
        // For now, we'll just open the modal for editing too
        openTaskModal();
    };
    var handleTaskUpdate = function (taskId, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var taskDoc, _a, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(user === null || user === void 0 ? void 0 : user.id)) {
                        setError('Please log in to update tasks');
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    taskDoc = taskToTaskDocument(updates);
                    _a = taskDoc;
                    return [4 /*yield*/, import('firebase/firestore')];
                case 2:
                    _a.updatedAt = (_b.sent()).Timestamp.now();
                    return [4 /*yield*/, updateTask(taskId, taskDoc, user.id)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    setError(error_2 instanceof Error ? error_2.message : 'Failed to update task');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleTaskDelete = function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(user === null || user === void 0 ? void 0 : user.id)) {
                        setError('Please log in to delete tasks');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteTask(taskId, user.id)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    setError(error_3 instanceof Error ? error_3.message : 'Failed to delete task');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleTaskToggle = function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
        var task, completed, taskDoc, Timestamp, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(user === null || user === void 0 ? void 0 : user.id)) {
                        setError('Please log in to toggle tasks');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    task = tasks.find(function (t) { return t.id === taskId; });
                    if (!task)
                        return [2 /*return*/];
                    completed = !task.completed;
                    taskDoc = taskToTaskDocument({ completed: completed });
                    return [4 /*yield*/, import('firebase/firestore')];
                case 2:
                    Timestamp = (_a.sent()).Timestamp;
                    taskDoc.updatedAt = Timestamp.now();
                    return [4 /*yield*/, updateTask(taskId, taskDoc, user.id)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    setError(error_4 instanceof Error ? error_4.message : 'Failed to toggle task status');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDragEnd = function (result) { return __awaiter(void 0, void 0, void 0, function () {
        var items, reorderedItem, updatedTasks, _a, doc, updateDoc, collection, db, _i, updatedTasks_1, task, taskRef, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!result.destination || !(user === null || user === void 0 ? void 0 : user.id))
                        return [2 /*return*/];
                    items = Array.from(tasks);
                    reorderedItem = items.splice(result.source.index, 1)[0];
                    items.splice(result.destination.index, 0, reorderedItem);
                    updatedTasks = items.map(function (task, index) { return (__assign(__assign({}, task), { order: index })); });
                    setTasks(updatedTasks);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, import('firebase/firestore')];
                case 2:
                    _a = _b.sent(), doc = _a.doc, updateDoc = _a.updateDoc, collection = _a.collection;
                    return [4 /*yield*/, import('../../firebase')];
                case 3:
                    db = (_b.sent()).db;
                    _i = 0, updatedTasks_1 = updatedTasks;
                    _b.label = 4;
                case 4:
                    if (!(_i < updatedTasks_1.length)) return [3 /*break*/, 7];
                    task = updatedTasks_1[_i];
                    taskRef = doc(collection(db, 'tasks'), task.id);
                    return [4 /*yield*/, updateDoc(taskRef, { order: task.order })];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_5 = _b.sent();
                    setError('Failed to update task order');
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var filteredTasks = useMemo(function () {
        if (!selectedCategory)
            return tasks;
        return tasks.filter(function (task) { return task.categoryId === selectedCategory; });
    }, [tasks, selectedCategory]);
    var handleAddComment = function (taskId, comment) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, doc, updateDoc, Timestamp_1, db, collection, taskRef, newComment, task, updatedComments, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(user === null || user === void 0 ? void 0 : user.id)) {
                        setError('Please log in to add comments');
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, import('firebase/firestore')];
                case 2:
                    _a = _b.sent(), doc = _a.doc, updateDoc = _a.updateDoc, Timestamp_1 = _a.Timestamp;
                    return [4 /*yield*/, import('../../firebase')];
                case 3:
                    db = (_b.sent()).db;
                    return [4 /*yield*/, import('firebase/firestore')];
                case 4:
                    collection = (_b.sent()).collection;
                    taskRef = doc(collection(db, 'tasks'), taskId);
                    newComment = {
                        id: Date.now().toString(),
                        userId: user.id,
                        text: comment,
                        createdAt: Timestamp_1.now(),
                        updatedAt: Timestamp_1.now()
                    };
                    task = tasks.find(function (t) { return t.id === taskId; });
                    if (!task)
                        return [2 /*return*/];
                    updatedComments = __spreadArray(__spreadArray([], (task.comments || []), true), [__assign(__assign({}, newComment), { createdAt: new Date(), updatedAt: new Date() })], false);
                    return [4 /*yield*/, updateTask(taskId, {
                            comments: updatedComments.map(function (c) { return (__assign(__assign({}, c), { createdAt: Timestamp_1.fromDate(c.createdAt), updatedAt: Timestamp_1.fromDate(c.updatedAt) })); })
                        }, user.id)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_6 = _b.sent();
                    setError(error_6 instanceof Error ? error_6.message : 'Failed to add comment');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleAddSubtask = function (taskId, subtaskTitle) { return __awaiter(void 0, void 0, void 0, function () {
        var Timestamp_2, task, newSubtask, updatedSubtasks, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(user === null || user === void 0 ? void 0 : user.id)) {
                        setError('Please log in to add subtasks');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, import('firebase/firestore')];
                case 2:
                    Timestamp_2 = (_a.sent()).Timestamp;
                    task = tasks.find(function (t) { return t.id === taskId; });
                    if (!task)
                        return [2 /*return*/];
                    newSubtask = {
                        id: Date.now().toString(),
                        title: subtaskTitle,
                        completed: false,
                        createdAt: Timestamp_2.now(),
                        updatedAt: Timestamp_2.now()
                    };
                    updatedSubtasks = __spreadArray(__spreadArray([], (task.subtasks || []), true), [__assign(__assign({}, newSubtask), { createdAt: new Date(), updatedAt: new Date() })], false);
                    return [4 /*yield*/, updateTask(taskId, {
                            subtasks: updatedSubtasks.map(function (s) { return (__assign(__assign({}, s), { createdAt: Timestamp_2.fromDate(s.createdAt), updatedAt: Timestamp_2.fromDate(s.updatedAt) })); })
                        }, user.id)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_7 = _a.sent();
                    setError(error_7 instanceof Error ? error_7.message : 'Failed to add subtask');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleSubtask = function (taskId, subtaskId) { return __awaiter(void 0, void 0, void 0, function () {
        var Timestamp_3, task, updatedSubtasks, error_8;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(user === null || user === void 0 ? void 0 : user.id)) {
                        setError('Please log in to toggle subtasks');
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, import('firebase/firestore')];
                case 2:
                    Timestamp_3 = (_b.sent()).Timestamp;
                    task = tasks.find(function (t) { return t.id === taskId; });
                    if (!task)
                        return [2 /*return*/];
                    updatedSubtasks = (_a = task.subtasks) === null || _a === void 0 ? void 0 : _a.map(function (subtask) {
                        return subtask.id === subtaskId
                            ? __assign(__assign({}, subtask), { completed: !subtask.completed }) : subtask;
                    });
                    return [4 /*yield*/, updateTask(taskId, {
                            subtasks: updatedSubtasks === null || updatedSubtasks === void 0 ? void 0 : updatedSubtasks.map(function (s) { return (__assign(__assign({}, s), { createdAt: s.createdAt instanceof Date ? Timestamp_3.fromDate(s.createdAt) : s.createdAt, updatedAt: Timestamp_3.now() })); })
                        }, user.id)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_8 = _b.sent();
                    setError(error_8 instanceof Error ? error_8.message : 'Failed to toggle subtask');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleCreateTask = function (taskData) { return __awaiter(void 0, void 0, void 0, function () {
        var taskDoc, error_9, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (authLoading) {
                        throw new Error('Please wait for authentication to complete');
                    }
                    if (!(user === null || user === void 0 ? void 0 : user.id)) {
                        throw new Error('Please log in to create tasks');
                    }
                    taskDoc = taskToTaskDocument(__assign(__assign({}, taskData), { userId: user.id, completed: false, order: tasks.length }));
                    // Use simplified service function
                    return [4 /*yield*/, createTaskFromData(user.id, taskDoc)];
                case 1:
                    // Use simplified service function
                    _a.sent();
                    // Tasks will automatically update via the real-time subscription
                    // Close the modal after successful creation
                    setSelectedTask(null);
                    closeTaskModal();
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _a.sent();
                    errorMessage = error_9 instanceof Error ? error_9.message : 'Failed to create task';
                    setError(errorMessage);
                    console.error('Failed to create task:', error_9);
                    // Re-throw the error so the caller can handle it
                    throw error_9;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleAddTask = function () {
        setSelectedTask(null);
    };
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Container, { maxWidth: "lg", children: [_jsx(DragDropContext, { onDragEnd: handleDragEnd, children: _jsx(TaskList, { tasks: filteredTasks, loading: loading, error: error, onTaskAction: {
                        toggle: handleTaskToggle,
                        delete: handleTaskDelete,
                        update: function (taskId, updates) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, handleTaskUpdate(taskId, updates)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); },
                        edit: function (task) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                setSelectedTask(task);
                                return [2 /*return*/];
                            });
                        }); },
                    }, onCreateTask: handleCreateTask, tags: tags, categories: categories }) }), _jsx(TaskModal, { open: isTaskModalOpen, onClose: function () {
                    closeTaskModal();
                    setSelectedTask(null);
                }, onSubmit: selectedTask ?
                    function (taskData) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!selectedTask.id) return [3 /*break*/, 2];
                                    return [4 /*yield*/, handleTaskUpdate(selectedTask.id, taskData)];
                                case 1:
                                    _a.sent();
                                    closeTaskModal();
                                    setSelectedTask(null);
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); } :
                    handleCreateTask, initialTask: selectedTask, loading: loading })] }));
};
export default TaskManager;
