"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var TaskItem_1 = __importDefault(require("../../src/components/TaskItem"));
describe('TaskItem Component', function () {
    var mockTask = {
        id: '1',
        title: 'Test Task',
        completed: false,
        dueDate: new Date('2023-12-31'),
        order: 0,
        tags: ['Work', 'Personal'],
        userId: 'user1',
    };
    var mockOnTaskAction = {
        toggle: cy.stub().as('toggleTask'),
        delete: cy.stub().as('deleteTask'),
        update: cy.stub().as('updateTask'),
        edit: cy.stub().as('editTask'),
    };
    beforeEach(function () {
        cy.mount((0, jsx_runtime_1.jsx)(TaskItem_1.default, { task: mockTask, onTaskAction: mockOnTaskAction }));
    });
    it('renders task item correctly', function () {
        // Check if title is rendered
        cy.contains('Test Task').should('be.visible');
        // Check if due date is rendered
        cy.contains('Dec 31, 2023').should('be.visible');
        // Check if tags are rendered
        cy.contains('Work').should('be.visible');
        cy.contains('Personal').should('be.visible');
    });
    it('handles task completion toggle', function () {
        // Click on the checkbox
        cy.get('[data-testid="task-checkbox"]').click();
        // Verify toggle function was called with correct task ID
        cy.get('@toggleTask').should('have.been.calledWith', '1');
    });
    it('handles task deletion', function () {
        // Click on the delete button
        cy.get('[data-testid="task-delete-button"]').click();
        // Verify delete function was called with correct task ID
        cy.get('@deleteTask').should('have.been.calledWith', '1');
    });
    it('handles task editing', function () {
        // Click on the edit button
        cy.get('[data-testid="task-edit-button"]').click();
        // Verify edit function was called with correct task
        cy.get('@editTask').should('have.been.calledWith', mockTask);
    });
    it('displays completed task styling', function () {
        // Mount with completed task
        cy.mount((0, jsx_runtime_1.jsx)(TaskItem_1.default, { task: __assign(__assign({}, mockTask), { completed: true }), onTaskAction: mockOnTaskAction }));
        // Check if completed styling is applied
        cy.get('[data-testid="task-item"]').should('have.class', 'completed');
        cy.get('[data-testid="task-title"]').should('have.class', 'strikethrough');
    });
    it('displays overdue task styling', function () {
        // Mount with overdue task
        var overdueDate = new Date();
        overdueDate.setDate(overdueDate.getDate() - 1);
        cy.mount((0, jsx_runtime_1.jsx)(TaskItem_1.default, { task: __assign(__assign({}, mockTask), { dueDate: overdueDate }), onTaskAction: mockOnTaskAction }));
        // Check if overdue styling is applied
        cy.get('[data-testid="task-due-date"]').should('have.class', 'overdue');
    });
    it('handles tag click navigation', function () {
        // Click on a tag
        cy.get('[data-testid="tag-Work"]').click();
        // Verify navigation occurred (this would depend on your routing setup)
        // For example, if using React Router:
        cy.url().should('include', '/tags/Work');
    });
});
