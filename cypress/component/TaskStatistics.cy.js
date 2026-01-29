"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var TaskStatistics_1 = __importDefault(require("../../src/components/TaskStatistics"));
describe('TaskStatistics Component', function () {
    var mockTasks = [
        {
            id: '1',
            title: 'Completed Task',
            completed: true,
            dueDate: new Date('2023-12-01'),
            order: 0,
            tags: ['Work'],
            userId: 'user1',
        },
        {
            id: '2',
            title: 'Active Task',
            completed: false,
            dueDate: new Date('2023-12-31'),
            order: 1,
            tags: ['Personal'],
            userId: 'user1',
        },
        {
            id: '3',
            title: 'Overdue Task',
            completed: false,
            dueDate: new Date('2023-11-30'),
            order: 2,
            tags: ['Work'],
            userId: 'user1',
        },
    ];
    var mockOnFilterChange = cy.stub().as('onFilterChange');
    beforeEach(function () {
        cy.mount((0, jsx_runtime_1.jsx)(TaskStatistics_1.default, { tasks: mockTasks, onFilterChange: mockOnFilterChange }));
    });
    it('renders statistics correctly', function () {
        // Check if total tasks count is displayed
        cy.contains('Total Tasks: 3').should('be.visible');
        // Check if completed tasks count is displayed
        cy.contains('Completed: 1').should('be.visible');
        // Check if active tasks count is displayed
        cy.contains('Active: 2').should('be.visible');
        // Check if overdue tasks count is displayed
        cy.contains('Overdue: 1').should('be.visible');
    });
    it('displays completion rate', function () {
        // Check if completion rate is displayed correctly
        cy.contains('Completion Rate: 33%').should('be.visible');
    });
    it('displays tag distribution', function () {
        // Check if tag counts are displayed
        cy.contains('Work: 2').should('be.visible');
        cy.contains('Personal: 1').should('be.visible');
    });
    it('handles filter clicks', function () {
        // Click on completed filter
        cy.get('[data-testid="filter-completed"]').click();
        // Verify onFilterChange was called with correct filter
        cy.get('@onFilterChange').should('have.been.calledWith(', completed, '););
    });
    it('updates statistics when tasks change', function () {
        // Mount with different tasks
        var newTasks = __spreadArray(__spreadArray([], mockTasks, true), [{
                id: '4',
                title: 'New Task',
                completed: false,
                dueDate: new Date('2023-12-15'),
                order: 3,
                tags: ['Work'],
                userId: 'user1',
            }], false);
        cy.mount((0, jsx_runtime_1.jsx)(TaskStatistics_1.default, { tasks: newTasks, onFilterChange: mockOnFilterChange }));
        // Verify statistics are updated
        cy.contains('Total Tasks: 4').should('be.visible');
        cy.contains('Active: 3').should('be.visible');
    });
    it('displays due date distribution', function () {
        // Check if due date distribution chart is rendered
        cy.get('[data-testid="due-date-chart"]').should('be.visible');
        // Check if chart shows correct data
        cy.get('[data-testid="chart-bar"]').should('have.length', 3);
    });
    it('handles empty task list', function () {
        // Mount with empty tasks
        cy.mount((0, jsx_runtime_1.jsx)(TaskStatistics_1.default, { tasks: [], onFilterChange: mockOnFilterChange }));
        // Verify empty state message
        cy.contains('No tasks available').should('be.visible');
        // Verify all counts are zero
        cy.contains('Total Tasks: 0').should('be.visible');
        cy.contains('Completed: 0').should('be.visible');
        cy.contains('Active: 0').should('be.visible');
        cy.contains('Overdue: 0').should('be.visible');
    });
    it('displays loading state', function () {
        // Mount with loading state
        cy.mount((0, jsx_runtime_1.jsx)(TaskStatistics_1.default, { tasks: mockTasks, onFilterChange: mockOnFilterChange, isLoading: true }));
        // Verify loading indicator is shown
        cy.get('[data-testid="loading-indicator"]').should('be.visible');
    });
});
