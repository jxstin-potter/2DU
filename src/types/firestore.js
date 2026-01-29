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
import { Timestamp } from 'firebase/firestore';
export var CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
/**
 * Helper function to convert Firestore Timestamp to Date
 */
export var timestampToDate = function (timestamp) {
    if (!timestamp)
        return null;
    return timestamp.toDate();
};
/**
 * Helper function to convert Date to Firestore Timestamp
 */
export var dateToTimestamp = function (date) {
    if (!date)
        return null;
    return Timestamp.fromDate(date);
};
/**
 * Convert TaskDocument to Task
 */
export var taskDocumentToTask = function (doc) {
    var _a, _b, _c;
    return __assign(__assign({}, doc), { createdAt: doc.createdAt.toDate(), updatedAt: doc.updatedAt.toDate(), dueDate: timestampToDate(doc.dueDate), subtasks: (_a = doc.subtasks) === null || _a === void 0 ? void 0 : _a.map(function (subtask) { return (__assign(__assign({}, subtask), { createdAt: subtask.createdAt.toDate(), updatedAt: subtask.updatedAt.toDate() })); }), comments: (_b = doc.comments) === null || _b === void 0 ? void 0 : _b.map(function (comment) { return (__assign(__assign({}, comment), { createdAt: comment.createdAt.toDate(), updatedAt: comment.updatedAt.toDate() })); }), attachments: (_c = doc.attachments) === null || _c === void 0 ? void 0 : _c.map(function (attachment) { return (__assign(__assign({}, attachment), { uploadedAt: attachment.uploadedAt.toDate() })); }), lastSharedAt: timestampToDate(doc.lastSharedAt) });
};
/**
 * Convert Task to TaskDocument
 */
export var taskToTaskDocument = function (task) {
    var _a, _b, _c;
    return __assign(__assign({}, task), { createdAt: dateToTimestamp(task.createdAt) || Timestamp.now(), updatedAt: dateToTimestamp(task.updatedAt) || Timestamp.now(), dueDate: dateToTimestamp(task.dueDate), subtasks: (_a = task.subtasks) === null || _a === void 0 ? void 0 : _a.map(function (subtask) { return (__assign(__assign({}, subtask), { createdAt: dateToTimestamp(subtask.createdAt) || Timestamp.now(), updatedAt: dateToTimestamp(subtask.updatedAt) || Timestamp.now() })); }), comments: (_b = task.comments) === null || _b === void 0 ? void 0 : _b.map(function (comment) { return (__assign(__assign({}, comment), { createdAt: dateToTimestamp(comment.createdAt) || Timestamp.now(), updatedAt: dateToTimestamp(comment.updatedAt) || Timestamp.now() })); }), attachments: (_c = task.attachments) === null || _c === void 0 ? void 0 : _c.map(function (attachment) { return (__assign(__assign({}, attachment), { uploadedAt: dateToTimestamp(attachment.uploadedAt) || Timestamp.now() })); }), lastSharedAt: dateToTimestamp(task.lastSharedAt) });
};
/**
 * Collection paths in Firestore
 */
export var COLLECTIONS = {
    TASKS: 'tasks',
    USERS: 'users'
};
