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
var TaskForm_1 = __importDefault(require("../../src/components/TaskForm"));
describe('TaskForm Component', function () {
    var mockOnSubmit = cy.stub().as('onSubmit');
    var mockOnCancel = cy.stub().as('onCancel');
    var mockTask = {
        id: '1',
        title: 'Test Task',
        completed: false,
        dueDate: new Date('2023-12-31'),
        order: 0,
        tags: ['Work'],
        userId: 'user1',
    };
    beforeEach(function () {
        cy.mount((0, jsx_runtime_1.jsx)(TaskForm_1.default, { onSubmit: mockOnSubmit, onCancel: mockOnCancel, initialTask: mockTask }));
    });
    it('renders form with initial task data', function () {
        // Check if title is pre-filled
        cy.get('[data-testid="task-title-input"]').should('have.value', 'Test Task');
        // Check if due date is pre-filled
        cy.get('[data-testid="task-due-date-input"]').should('have.value', '2023-12-31');
        // Check if tags are pre-filled
        cy.get('[data-testid="task-tags-input"]').should('contain', 'Work');
    });
    it('handles form submission with updated data', function () {
        // Update title
        cy.get('[data-testid="task-title-input"]')
            .clear()
            .type('Updated Task');
        // Update due date
        cy.get('[data-testid="task-due-date-input"]')
            .clear()
            .type('2024-01-01');
        // Add new tag
        cy.get('[data-testid="task-tags-input"]')
            .type('Personal{enter}');
        // Submit form
        cy.get('[data-testid="task-submit-button"]').click();
        // Verify onSubmit was called with updated task
        cy.get('@onSubmit').should('have.been.calledWith', __assign(__assign({}, mockTask), { title: 'Updated Task', dueDate: new Date('2024-01-01'), tags: ['Work', 'Personal'] }));
    });
    it('validates required fields', function () {
        // Clear title
        cy.get('[data-testid="task-title-input"]').clear();
        // Try to submit
        cy.get('[data-testid="task-submit-button"]').click();
        // Check for error message
        cy.contains('Title is required').should('be.visible');
        // Verify onSubmit was not called
        cy.get('@onSubmit').should('not.have.been.called');
    });
    it('handles cancel action', function () {
        // Click cancel button
        cy.get('[data-testid="task-cancel-button"]').click();
        // Verify onCancel was called
        cy.get('@onCancel').should('have.been.called');
    });
    it('handles tag removal', function () {
        // Remove existing tag
        cy.get('[data-testid="tag-Work"]')
            .find('[data-testid="remove-tag"]')
            .click();
        // Verify tag was removed
        cy.get('[data-testid="tag-Work"]').should('not.exist');
    });
    it('validates date format', function () {
        // Enter invalid date
        cy.get('[data-testid="task-due-date-input"]')
            .clear()
            .type('invalid-date');
        // Try to submit
        cy.get('[data-testid="task-submit-button"]').click();
        // Check for error message
        cy.contains('Invalid date format').should('be.visible');
        // Verify onSubmit was not called
        cy.get('@onSubmit').should('not.have.been.called');
    });
});
