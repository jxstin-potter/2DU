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
/**
 * Helper to safely convert Timestamp or Date to Date
 */
var toDate = function (value) {
    if (!value)
        return new Date();
    if (value instanceof Date)
        return value;
    if (value && typeof value.toDate === 'function')
        return value.toDate();
    if (typeof value === 'string' || typeof value === 'number')
        return new Date(value);
    return new Date();
};
/**
 * Convert Firestore TaskDocument to app Task type (robust version)
 */
export var taskDocumentToTask = function (doc) {
    var _a, _b, _c, _d, _e;
    return {
        id: doc.id || '',
        title: doc.title || '',
        description: doc.description,
        completed: (_a = doc.completed) !== null && _a !== void 0 ? _a : false,
        userId: doc.userId || '',
        createdAt: toDate(doc.createdAt),
        updatedAt: toDate(doc.updatedAt),
        dueDate: doc.dueDate ? toDate(doc.dueDate) : undefined,
        tags: doc.tags || [],
        order: (_b = doc.order) !== null && _b !== void 0 ? _b : 0,
        notes: doc.notes,
        categoryId: doc.categoryId,
        category: doc.category,
        status: doc.status,
        subtasks: (_c = doc.subtasks) === null || _c === void 0 ? void 0 : _c.map(function (subtask) { return (__assign(__assign({}, subtask), { createdAt: toDate(subtask.createdAt), updatedAt: toDate(subtask.updatedAt) })); }),
        comments: (_d = doc.comments) === null || _d === void 0 ? void 0 : _d.map(function (comment) { return (__assign(__assign({}, comment), { createdAt: toDate(comment.createdAt), updatedAt: toDate(comment.updatedAt) })); }),
        attachments: (_e = doc.attachments) === null || _e === void 0 ? void 0 : _e.map(function (attachment) { return (__assign(__assign({}, attachment), { uploadedAt: toDate(attachment.uploadedAt) })); }),
        sharedWith: doc.sharedWith,
        isShared: doc.isShared,
        lastSharedAt: doc.lastSharedAt ? toDate(doc.lastSharedAt) : undefined,
        estimatedTime: doc.estimatedTime,
        actualTime: doc.actualTime,
        assignedTo: doc.assignedTo,
        priority: doc.priority,
    };
};
/**
 * Parse time from natural language text and return the time and cleaned text
 * Supports formats like "3pm", "3 pm", "at 3pm", "3:00pm", "3am", etc.
 * @param text - The text to parse
 * @returns Object with time (Date for today at parsed time, or null) and cleanedText
 */
export var parseTimeFromText = function (text) {
    var _a;
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/34247929-af1b-4eac-ae69-aa4ba0eeeaf9', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'taskHelpers.ts:65', message: 'parseTimeFromText called', data: { text: text, textLength: text.length }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(function () { });
    // #endregion
    // Regex pattern matches: "at 3pm", "3pm", "3 pm", "3:00pm", "3:00 pm", "at 3:30pm", "Trash 3pm", etc.
    // Pattern breakdown:
    // - (?:^|\s) - start of string or whitespace (captured for removal)
    // - (?:at\s+)? - optional "at" followed by spaces
    // - (\d{1,2}) - hour (1-2 digits)
    // - (?::(\d{2}))? - optional colon and minutes
    // - \s* - optional whitespace
    // - (am|pm) - am or pm
    // - \b - word boundary
    // Note: "at" is optional - just typing "3pm" or "Trash 3pm" works fine
    var timePattern = /(?:^|\s)(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/gi;
    var match = timePattern.exec(text);
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/34247929-af1b-4eac-ae69-aa4ba0eeeaf9', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'taskHelpers.ts:77', message: 'Regex match result', data: { matched: !!match, matchIndex: match === null || match === void 0 ? void 0 : match.index, matchLength: (_a = match === null || match === void 0 ? void 0 : match[0]) === null || _a === void 0 ? void 0 : _a.length, matchFull: match === null || match === void 0 ? void 0 : match[0], matchGroups: match === null || match === void 0 ? void 0 : match.slice(1) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(function () { });
    // #endregion
    if (!match) {
        // #region agent log
        fetch('http://127.0.0.1:7246/ingest/34247929-af1b-4eac-ae69-aa4ba0eeeaf9', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'taskHelpers.ts:80', message: 'No match found - returning null', data: { text: text }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'A' }) }).catch(function () { });
        // #endregion
        return { time: null, cleanedText: text };
    }
    // Store match info for highlighting
    var matchStart = match.index;
    var matchEnd = matchStart + match[0].length;
    var matchText = match[0].trim();
    var hour = parseInt(match[1], 10);
    var minutes = match[2] ? parseInt(match[2], 10) : 0;
    var period = match[3].toLowerCase();
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/34247929-af1b-4eac-ae69-aa4ba0eeeaf9', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'taskHelpers.ts:83', message: 'Parsed time components', data: { hour: hour, minutes: minutes, period: period }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E' }) }).catch(function () { });
    // #endregion
    // Validate hour and minutes
    if (hour < 1 || hour > 12 || minutes < 0 || minutes > 59) {
        // #region agent log
        fetch('http://127.0.0.1:7246/ingest/34247929-af1b-4eac-ae69-aa4ba0eeeaf9', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'taskHelpers.ts:88', message: 'Invalid hour/minutes - returning null', data: { hour: hour, minutes: minutes }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E' }) }).catch(function () { });
        // #endregion
        return { time: null, cleanedText: text };
    }
    // Convert to 24-hour format
    var hour24 = hour;
    if (period === 'pm' && hour !== 12) {
        hour24 = hour + 12;
    }
    else if (period === 'am' && hour === 12) {
        hour24 = 0;
    }
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/34247929-af1b-4eac-ae69-aa4ba0eeeaf9', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'taskHelpers.ts:95', message: '24-hour conversion', data: { hour24: hour24, period: period, hour: hour }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E' }) }).catch(function () { });
    // #endregion
    // Create date for today at the parsed time
    var today = new Date();
    var time = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour24, minutes, 0);
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/34247929-af1b-4eac-ae69-aa4ba0eeeaf9', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'taskHelpers.ts:102', message: 'Date created', data: { timeISO: time.toISOString(), timeString: time.toString(), hour24: hour24, minutes: minutes }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'E' }) }).catch(function () { });
    // #endregion
    // Keep the original text - don't remove the time expression
    // Like Todoist, we keep "3pm" visible in the input but parse and set the time
    // The time text stays in the title so users can see what they typed
    var cleanedText = text;
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/34247929-af1b-4eac-ae69-aa4ba0eeeaf9', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'taskHelpers.ts:133', message: 'Time parsed - keeping original text', data: { cleanedText: text, originalText: text, matchStart: matchStart, matchEnd: matchEnd, matchText: matchText }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'C' }) }).catch(function () { });
    // #endregion
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/34247929-af1b-4eac-ae69-aa4ba0eeeaf9', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'taskHelpers.ts:143', message: 'Returning result', data: { hasTime: !!time, timeISO: time === null || time === void 0 ? void 0 : time.toISOString(), cleanedText: cleanedText, originalText: text, matchInfo: { start: matchStart, end: matchEnd, text: matchText } }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run2', hypothesisId: 'ALL' }) }).catch(function () { });
    // #endregion
    return {
        time: time,
        cleanedText: cleanedText,
        matchInfo: {
            start: matchStart,
            end: matchEnd,
            text: matchText
        }
    };
};
/**
 * Convert app Task to Firestore TaskDocument (for creating/updating)
 */
export var taskToTaskDocument = function (task) {
    var doc = {};
    if (task.title !== undefined)
        doc.title = task.title;
    if (task.description !== undefined)
        doc.description = task.description || undefined;
    if (task.completed !== undefined)
        doc.completed = task.completed;
    if (task.userId !== undefined)
        doc.userId = task.userId;
    if (task.dueDate !== undefined) {
        doc.dueDate = task.dueDate ? Timestamp.fromDate(task.dueDate) : null;
    }
    if (task.tags !== undefined)
        doc.tags = task.tags;
    if (task.order !== undefined)
        doc.order = task.order;
    if (task.notes !== undefined)
        doc.notes = task.notes;
    if (task.categoryId !== undefined)
        doc.categoryId = task.categoryId;
    if (task.category !== undefined)
        doc.category = task.category;
    if (task.status !== undefined)
        doc.status = task.status;
    if (task.priority !== undefined)
        doc.priority = task.priority;
    // Only include fields that are defined (not undefined)
    return Object.fromEntries(Object.entries(doc).filter(function (_a) {
        var _ = _a[0], value = _a[1];
        return value !== undefined;
    }));
};
