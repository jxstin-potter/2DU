"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var TaskBulkActions_1 = __importDefault(require("../../src/components/TaskBulkActions"));
describe('TaskBulkActions Component', function () {
    var mockTasks = [
        {
            id: '1',
            title: 'Task 1',
            completed: false,
            dueDate: new Date('2023-12-31'),
            order: 0,
            tags: ['Work'],
            userId: 'user1',
        },
        {
            id: '2',
            title: 'Task 2',
            completed: true,
            dueDate: new Date('2023-12-30'),
            order: 1,
            tags: ['Personal'],
            userId: 'user1',
        },
    ];
    var mockOnBulkAction = cy.stub().as('onBulkAction');
    beforeEach(function () {
        cy.mount((0, jsx_runtime_1.jsx)(TaskBulkActions_1.default, { tasks: mockTasks, selectedTasks: [], onBulkAction: mockOnBulkAction }));
    });
    it('renders bulk actions correctly', function () {
        // Check if bulk actions section is visible
        cy.get('[data-testid="bulk-actions"]').should('be.visible');
        // Check if action buttons are visible
        cy.get('[data-testid="bulk-complete"]').should('be.visible');
        cy.get('[data-testid="bulk-delete"]').should('be.visible');
        cy.get('[data-testid="bulk-tag"]').should('be.visible');
    });
    it('disables actions when no tasks are selected', function () {
        // Verify action buttons are disabled
        cy.get('[data-testid="bulk-complete"]').should('be.disabled');
        cy.get('[data-testid="bulk-delete"]').should('be.disabled');
        cy.get('[data-testid="bulk-tag"]').should('be.disabled');
    });
    it('enables actions when tasks are selected', function () {
        // Mount with selected tasks
        cy.mount((0, jsx_runtime_1.jsx)(TaskBulkActions_1.default, { tasks: mockTasks, selectedTasks: ['1'], onBulkAction: mockOnBulkAction }));
        // Verify action buttons are enabled
        cy.get('[data-testid="bulk-complete"]').should('not.be.disabled');
        cy.get('[data-testid="bulk-delete"]').should('not.be.disabled');
        cy.get('[data-testid="bulk-tag"]').should('not.be.disabled');
    });
    it('handles bulk complete action', function () {
        // Mount with selected tasks
        cy.mount((0, jsx_runtime_1.jsx)(TaskBulkActions_1.default, { tasks: mockTasks, selectedTasks: ['1'], onBulkAction: mockOnBulkAction }));
        // Click complete button
        cy.get('[data-testid="bulk-complete"]').click();
        // Verify onBulkAction was called with correct action
        cy.get('@onBulkAction').should('have.been.calledWith(', complete, ', [', 1, ']););
    });
    it('handles bulk delete action', function () {
        // Mount with selected tasks
        cy.mount((0, jsx_runtime_1.jsx)(TaskBulkActions_1.default, { tasks: mockTasks, selectedTasks: ['1'], onBulkAction: mockOnBulkAction }));
        // Click delete button
        cy.get('[data-testid="bulk-delete"]').click();
        // Verify confirmation dialog is shown
        cy.contains('Are you sure you want to delete the selected tasks?').should('be.visible');
        // Confirm deletion
        cy.get('[data-testid="confirm-delete"]').click();
        // Verify onBulkAction was called with correct action
        cy.get('@onBulkAction').should('have.been.calledWith(', delete ', [', 1, ']););
    });
    it('handles bulk tag action', function () {
        // Mount with selected tasks
        cy.mount((0, jsx_runtime_1.jsx)(TaskBulkActions_1.default, { tasks: mockTasks, selectedTasks: ['1'], onBulkAction: mockOnBulkAction }));
        // Click tag button
        cy.get('[data-testid="bulk-tag"]').click();
        // Select a tag
        cy.get('[data-testid="tag-select"]').click();
        cy.get('[data-testid="tag-option-Work"]').click();
        // Click apply button
        cy.get('[data-testid="apply-tag"]').click();
        // Verify onBulkAction was called with correct action
        cy.get('@onBulkAction').should('have.been.calledWith(', tag, ', [', 1, '], ', Work, '););
    });
    it('displays selected tasks count', function () {
        // Mount with selected tasks
        cy.mount((0, jsx_runtime_1.jsx)(TaskBulkActions_1.default, { tasks: mockTasks, selectedTasks: ['1', '2'], onBulkAction: mockOnBulkAction }));
        // Verify selected count is displayed
        cy.contains('2 tasks selected').should('be.visible');
    });
    it('handles select all action', function () {
        // Click select all checkbox
        cy.get('[data-testid="select-all"]').click();
        // Verify onBulkAction was called with all task IDs
        cy.get('@onBulkAction').should('have.been.calledWith(', select, ', [', 1, ', ', 2, ']););
    });
    it('handles keyboard shortcuts', function () {
        // Mount with selected tasks
        cy.mount((0, jsx_runtime_1.jsx)(TaskBulkActions_1.default, { tasks: mockTasks, selectedTasks: ['1'], onBulkAction: mockOnBulkAction }));
        // Press Ctrl/Cmd + D for delete
        cy.get('body').type('{ctrl}d');
        // Verify confirmation dialog is shown
        cy.contains('Are you sure you want to delete the selected tasks?').should('be.visible');
    });
    it('displays loading state during bulk action', function () {
        // Mount with loading state
        cy.mount((0, jsx_runtime_1.jsx)(TaskBulkActions_1.default, { tasks: mockTasks, selectedTasks: ['1'], onBulkAction: mockOnBulkAction, isLoading: true }));
        // Verify loading indicator is shown
        cy.get('[data-testid="loading-indicator"]').should('be.visible');
        // Verify action buttons are disabled
        cy.get('[data-testid="bulk-complete"]').should('be.disabled');
        cy.get('[data-testid="bulk-delete"]').should('be.disabled');
        cy.get('[data-testid="bulk-tag"]').should('be.disabled');
    });
});
