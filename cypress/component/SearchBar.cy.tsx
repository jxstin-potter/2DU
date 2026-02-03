import React from 'react';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = cy.stub().as('onSearch');
  const mockOnFilterChange = cy.stub().as('onFilterChange');
  const mockOnSortChange = cy.stub().as('onSortChange');

  beforeEach(() => {
    cy.mount(
      <SearchBar
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
      />
    );
  });

  it('renders search input correctly', () => {
    // Check if search input is rendered
    cy.get('[data-testid="search-input"]').should('be.visible');
    
    // Check if search icon is present
    cy.get('[data-testid="search-icon"]').should('be.visible');
  });

  it('handles search input changes', () => {
    const searchTerm = 'test task';
    
    // Type in search input
    cy.get('[data-testid="search-input"]')
      .type(searchTerm);
    
    // Verify onSearch was called with the search term
    cy.get('@onSearch').should('have.been.calledWith', searchTerm);
  });

  it('handles filter changes', () => {
    // Select a filter option
    cy.get('[data-testid="filter-select"]')
      .click()
      .get('[data-testid="filter-option-completed"]')
      .click();
    
    // Verify onFilterChange was called with the correct filter
    cy.get('@onFilterChange').should('have.been.calledWith', 'completed');
  });

  it('handles sort changes', () => {
    // Select a sort option
    cy.get('[data-testid="sort-select"]')
      .click()
      .get('[data-testid="sort-option-dueDate"]')
      .click();
    
    // Verify onSortChange was called with the correct sort option
    cy.get('@onSortChange').should('have.been.calledWith', 'dueDate');
  });

  it('debounces search input', () => {
    // Type quickly in search input
    cy.get('[data-testid="search-input"]')
      .type('test');
    
    // Verify onSearch was not called immediately
    cy.get('@onSearch').should('not.have.been.called');
    
    // Wait for debounce time
    cy.wait(500);
    
    // Verify onSearch was called after debounce
    cy.get('@onSearch').should('have.been.calledWith', 'test');
  });

  it('clears search input', () => {
    // Type in search input
    cy.get('[data-testid="search-input"]')
      .type('test task');
    
    // Click clear button
    cy.get('[data-testid="clear-search"]').click();
    
    // Verify search input is cleared
    cy.get('[data-testid="search-input"]').should('have.value', '');
    
    // Verify onSearch was called with empty string
    cy.get('@onSearch').should('have.been.calledWith', '');
  });

  it('handles keyboard shortcuts', () => {
    // Press Ctrl/Cmd + F
    cy.get('body').type('{ctrl}f');
    
    // Verify search input is focused
    cy.get('[data-testid="search-input"]').should('be.focused');
  });

  it('shows search suggestions', () => {
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