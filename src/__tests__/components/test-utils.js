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
import { jsx as _jsx } from "react/jsx-runtime";
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
// Mock Firebase
jest.mock('../../firebase', function () { return ({
    db: {},
}); });
// Mock Firebase Firestore
jest.mock('firebase/firestore', function () { return ({
    collection: jest.fn(),
    getDocs: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    doc: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
    where: jest.fn(),
}); });
// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', function () { return ({
    DragDropContext: function (_a) {
        var children = _a.children;
        return _jsx("div", { children: children });
    },
    Droppable: function (_a) {
        var children = _a.children;
        return _jsx("div", { children: children });
    },
    Draggable: function (_a) {
        var children = _a.children;
        return _jsx("div", { children: children });
    },
}); });
// Create a theme instance
var theme = createTheme();
// Custom render function that includes providers
var customRender = function (ui, options) {
    if (options === void 0) { options = {}; }
    return render(ui, __assign({ wrapper: function (_a) {
            var children = _a.children;
            return (_jsx(ThemeProvider, { theme: theme, children: children }));
        } }, options));
};
// Mock task data
export var mockTasks = [
    {
        id: '1',
        title: 'Test Task 1',
        description: 'Test Description 1',
        status: 'todo',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 0,
        category: 'Work',
        categoryId: 'work',
        tags: [],
        subtasks: [],
        attachments: [],
    },
    {
        id: '2',
        title: 'Test Task 2',
        description: 'Test Description 2',
        status: 'in-progress',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 1,
        category: 'Personal',
        categoryId: 'personal',
        tags: [],
        subtasks: [],
        attachments: [],
    },
];
// Mock categories data
export var mockCategories = [
    {
        id: 'work',
        name: 'Work',
        order: 0,
    },
    {
        id: 'personal',
        name: 'Personal',
        order: 1,
    },
];
// Mock tags data
export var mockTags = [
    {
        id: '1',
        name: 'Work',
        color: '#4CAF50',
    },
    {
        id: '2',
        name: 'Personal',
        color: '#2196F3',
    },
];
// Export everything
export * from '@testing-library/react';
export { customRender as render };
