"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var TaskExport_1 = __importDefault(require("../../src/components/TaskExport"));
describe('TaskExport Component', function () {
    var mockTasks = [
        {
            id: '1',
            title: 'Task 1',
            completed: true,
            dueDate: new Date('2023-12-01'),
            order: 0,
            tags: ['Work'],
            userId: 'user1',
        },
        {
            id: '2',
            title: 'Task 2',
            completed: false,
            dueDate: new Date('2023-12-31'),
            order: 1,
            tags: ['Personal'],
            userId: 'user1',
        },
    ];
    var mockOnExport = cy.stub().as('onExport');
    beforeEach(function () {
        cy.mount((0, jsx_runtime_1.jsx)(TaskExport_1.default, { tasks: mockTasks, onExport: mockOnExport }));
    });
    it('renders export options correctly', function () {
        // Check if export button is visible
        cy.get('[data-testid="export-button"]').should('be.visible');
        // Check if format options are visible
        cy.get('[data-testid="export-format-select"]').should('be.visible');
        cy.contains('CSV').should('be.visible');
        cy.contains('JSON').should('be.visible');
        cy.contains('PDF').should('be.visible');
    });
    it('handles CSV export', function () {
        // Select CSV format
        cy.get('[data-testid="export-format-select"]').click();
        cy.get('[data-testid="format-option-csv"]').click();
        // Click export button
        cy.get('[data-testid="export-button"]').click();
        // Verify onExport was called with correct format
        cy.get('@onExport').should('have.been.calledWith(', csv, '););
    });
    it('handles JSON export', function () {
        // Select JSON format
        cy.get('[data-testid="export-format-select"]').click();
        cy.get('[data-testid="format-option-json"]').click();
        // Click export button
        cy.get('[data-testid="export-button"]').click();
        // Verify onExport was called with correct format
        cy.get('@onExport').should('have.been.calledWith(', json, '););
    });
    it('handles PDF export', function () {
        // Select PDF format
        cy.get('[data-testid="export-format-select"]').click();
        cy.get('[data-testid="format-option-pdf"]').click();
        // Click export button
        cy.get('[data-testid="export-button"]').click();
        // Verify onExport was called with correct format
        cy.get('@onExport').should('have.been.calledWith(', pdf, '););
    });
    it('handles date range selection', function () {
        // Open date range picker
        cy.get('[data-testid="date-range-picker"]').click();
        // Select date range
        cy.get('[data-testid="start-date-input"]')
            .clear()
            .type('2023-12-01');
        cy.get('[data-testid="end-date-input"]')
            .clear()
            .type('2023-12-31');
        // Click export button
        cy.get('[data-testid="export-button"]').click();
        // Verify onExport was called with date range
        cy.get('@onExport').should('have.been.calledWith(expect.any(String), {, startDate, new Date('2023-12-01'), endDate, new Date('2023-12-31'));
    });
});
it('handles tag filtering', function () {
    // Select tag filter
    cy.get('[data-testid="tag-filter"]').click();
    cy.get('[data-testid="tag-option-Work"]').click();
    // Click export button
    cy.get('[data-testid="export-button"]').click();
    // Verify onExport was called with tag filter
    cy.get('@onExport').should('have.been.calledWith(expect.any(String), {, tags, ['Work']);
});
;
it('handles completion status filtering', function () {
    // Select completion status
    cy.get('[data-testid="completion-filter"]').click();
    cy.get('[data-testid="status-option-completed"]').click();
    // Click export button
    cy.get('[data-testid="export-button"]').click();
    // Verify onExport was called with completion filter
    cy.get('@onExport').should('have.been.calledWith(expect.any(String), {, completed, true);
});
;
it('displays loading state during export', function () {
    // Mount with loading state
    cy.mount((0, jsx_runtime_1.jsx)(TaskExport_1.default, { tasks: mockTasks, onExport: mockOnExport, isLoading: true }));
    // Verify loading indicator is shown
    cy.get('[data-testid="loading-indicator"]').should('be.visible');
    // Verify export button is disabled
    cy.get('[data-testid="export-button"]').should('be.disabled');
});
it('handles export error', function () {
    // Mount with error state
    cy.mount((0, jsx_runtime_1.jsx)(TaskExport_1.default, { tasks: mockTasks, onExport: mockOnExport, error: "Export failed" }));
    // Verify error message is shown
    cy.contains('Export failed').should('be.visible');
});
;
