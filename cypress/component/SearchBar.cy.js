"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var SearchBar_1 = __importDefault(require("../../src/components/SearchBar"));
describe('SearchBar Component', function () {
    var mockOnSearch = cy.stub().as('onSearch');
    var mockOnFilterChange = cy.stub().as('onFilterChange');
    var mockOnSortChange = cy.stub().as('onSortChange');
    beforeEach(function () {
        cy.mount((0, jsx_runtime_1.jsx)(SearchBar_1.default, { onSearch: mockOnSearch, onFilterChange: mockOnFilterChange, onSortChange: mockOnSortChange }));
    });
    it('renders search input correctly', function () {
        // Check if search input is rendered
        cy.get('[data-testid="search-input"]').should('be.visible');
        // Check if search icon is present
        cy.get('[data-testid="search-icon"]').should('be.visible');
    });
    it('handles search input changes', function () {
        var searchTerm = 'test task';
        // Type in search input
        cy.get('[data-testid="search-input"]')
            .type(searchTerm);
        // Verify onSearch was called with the search term
        cy.get('@onSearch').should('have.been.calledWith(searchTerm););
    });
    it('handles filter changes', function () {
        // Select a filter option
        cy.get('[data-testid="filter-select"]')
            .click()
            .get('[data-testid="filter-option-completed"]')
            .click();
        // Verify onFilterChange was called with the correct filter
        cy.get('@onFilterChange').should('have.been.calledWith(', completed, '););
    });
    it('handles sort changes', function () {
        // Select a sort option
        cy.get('[data-testid="sort-select"]')
            .click()
            .get('[data-testid="sort-option-dueDate"]')
            .click();
        // Verify onSortChange was called with the correct sort option
        cy.get('@onSortChange').should('have.been.calledWith(', dueDate, '););
    });
    it('debounces search input', function () {
        // Type quickly in search input
        cy.get('[data-testid="search-input"]')
            .type('test');
        // Verify onSearch was not called immediately
        cy.get('@onSearch').should('not.have.been.called');
        // Wait for debounce time
        cy.wait(500);
        // Verify onSearch was called after debounce
        cy.get('@onSearch').should('have.been.calledWith(', test, '););
    });
    it('clears search input', function () {
        // Type in search input
        cy.get('[data-testid="search-input"]')
            .type('test task');
        // Click clear button
        cy.get('[data-testid="clear-search"]').click();
        // Verify search input is cleared
        cy.get('[data-testid="search-input"]').should('have.value', '');
        // Verify onSearch was called with empty string
        cy.get('@onSearch').should('have.been.calledWith(', '););
    });
    it('handles keyboard shortcuts', function () {
        // Press Ctrl/Cmd + F
        cy.get('body').type('{ctrl}f');
        // Verify search input is focused
        cy.get('[data-testid="search-input"]').should('be.focused');
    });
    it('shows search suggestions', function () {
        // Type in search input
        cy.get('[data-testid="search-input"]')
            .type('test');
        // Verify suggestions are shown
        cy.get('[data-testid="search-suggestions"]').should('be.visible');
        // Click a suggestion
        cy.get('[data-testid="search-suggestion"]').first().click();
        // Verify onSearch was called with the suggestion
        cy.get('@onSearch').should('have.been.called');
    });
});
