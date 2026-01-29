"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var TaskPagination_1 = __importDefault(require("../../src/components/TaskPagination"));
describe('TaskPagination Component', function () {
    var mockOnPageChange = cy.stub().as('onPageChange');
    var mockOnPageSizeChange = cy.stub().as('onPageSizeChange');
    beforeEach(function () {
        cy.mount((0, jsx_runtime_1.jsx)(TaskPagination_1.default, { totalItems: 100, currentPage: 1, pageSize: 10, onPageChange: mockOnPageChange, onPageSizeChange: mockOnPageSizeChange }));
    });
    it('renders pagination controls correctly', function () {
        // Check if pagination section is visible
        cy.get('[data-testid="pagination-section"]').should('be.visible');
        // Check if page size selector is visible
        cy.get('[data-testid="page-size-select"]').should('be.visible');
        // Check if page navigation is visible
        cy.get('[data-testid="page-nav"]').should('be.visible');
        // Check if total items count is visible
        cy.contains('100 items').should('be.visible');
    });
    it('displays correct page numbers', function () {
        // Check if current page is highlighted
        cy.get('[data-testid="page-1"]').should('have.class', 'active');
        // Check if total pages are displayed
        cy.contains('of 10 pages').should('be.visible');
    });
    it('handles page navigation', function () {
        // Click next page button
        cy.get('[data-testid="next-page"]').click();
        // Verify onPageChange was called with correct page
        cy.get('@onPageChange').should('have.been.calledWith(2););
    });
    it('handles page size changes', function () {
        // Change page size
        cy.get('[data-testid="page-size-select"]').click();
        cy.get('[data-testid="page-size-option-25"]').click();
        // Verify onPageSizeChange was called with correct size
        cy.get('@onPageSizeChange').should('have.been.calledWith(25););
    });
    it('disables navigation buttons appropriately', function () {
        // First page - previous button should be disabled
        cy.get('[data-testid="prev-page"]').should('be.disabled');
        // Last page - mount with last page
        cy.mount((0, jsx_runtime_1.jsx)(TaskPagination_1.default, { totalItems: 100, currentPage: 10, pageSize: 10, onPageChange: mockOnPageChange, onPageSizeChange: mockOnPageSizeChange }));
        // Last page - next button should be disabled
        cy.get('[data-testid="next-page"]').should('be.disabled');
    });
    it('handles direct page input', function () {
        // Click on page input
        cy.get('[data-testid="page-input"]').click();
        // Type page number
        cy.get('[data-testid="page-input"]').type('5{enter}');
        // Verify onPageChange was called with correct page
        cy.get('@onPageChange').should('have.been.calledWith(5););
    });
    it('validates page input', function () {
        // Try to enter invalid page number
        cy.get('[data-testid="page-input"]').type('11{enter}');
        // Verify error message is shown
        cy.contains('Invalid page number').should('be.visible');
        // Verify onPageChange was not called
        cy.get('@onPageChange').should('not.have.been.called');
    });
    it('updates total pages when page size changes', function () {
        // Change page size to 25
        cy.get('[data-testid="page-size-select"]').click();
        cy.get('[data-testid="page-size-option-25"]').click();
        // Verify total pages is updated
        cy.contains('of 4 pages').should('be.visible');
    });
    it('maintains current page when possible after page size change', function () {
        // Go to page 2
        cy.get('[data-testid="next-page"]').click();
        // Change page size
        cy.get('[data-testid="page-size-select"]').click();
        cy.get('[data-testid="page-size-option-25"]').click();
        // Verify current page is maintained
        cy.get('[data-testid="page-2"]').should('have.class', 'active');
    });
    it('handles keyboard navigation', function () {
        // Focus page input
        cy.get('[data-testid="page-input"]').focus();
        // Press arrow up to increment page
        cy.focused().type('{uparrow}');
        // Verify onPageChange was called
        cy.get('@onPageChange').should('have.been.called');
    });
});
