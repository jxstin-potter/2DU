import React from 'react';
import TaskFilter from '../../src/components/TaskFilter';

describe('TaskFilter Component', () => {
  const mockOnFilterChange = cy.stub().as('onFilterChange');
  const mockTags = ['Work', 'Personal', 'Shopping', 'Health'];

  beforeEach(() => {
    cy.mount(
      <TaskFilter
        onFilterChange={mockOnFilterChange}
        availableTags={mockTags}
      />
    );
  });

  it('renders filter options correctly', () => {
    // Check if filter section is visible
    cy.get('[data-testid="filter-section"]').should('be.visible');
    
    // Check if status filter is visible
    cy.get('[data-testid="status-filter"]').should('be.visible');
    cy.contains('All').should('be.visible');
    cy.contains('Active').should('be.visible');
    cy.contains('Completed').should('be.visible');
    
    // Check if tag filter is visible
    cy.get('[data-testid="tag-filter"]').should('be.visible');
    mockTags.forEach(tag => {
      cy.contains(tag).should('be.visible');
    });
  });

  it('handles status filter changes', () => {
    // Select active filter
    cy.get('[data-testid="status-filter"]').click();
    cy.get('[data-testid="status-option-active"]').click();
    
    // Verify onFilterChange was called with correct status
    cy.get('@onFilterChange').should('have.been.calledWith', {
      status: 'active',
      tags: []
    });
  });

  it('handles tag filter changes', () => {
    // Select multiple tags
    cy.get('[data-testid="tag-Work"]').click();
    cy.get('[data-testid="tag-Personal"]').click();
    
    // Verify onFilterChange was called with correct tags
    cy.get('@onFilterChange').should('have.been.calledWith', {
      status: 'all',
      tags: ['Work', 'Personal']
    });
  });

  it('handles combined status and tag filters', () => {
    // Select completed status
    cy.get('[data-testid="status-filter"]').click();
    cy.get('[data-testid="status-option-completed"]').click();
    
    // Select a tag
    cy.get('[data-testid="tag-Work"]').click();
    
    // Verify onFilterChange was called with correct filters
    cy.get('@onFilterChange').should('have.been.calledWith', {
      status: 'completed',
      tags: ['Work']
    });
  });

  it('clears all filters', () => {
    // Select some filters
    cy.get('[data-testid="status-filter"]').click();
    cy.get('[data-testid="status-option-active"]').click();
    cy.get('[data-testid="tag-Work"]').click();
    
    // Click clear filters button
    cy.get('[data-testid="clear-filters"]').click();
    
    // Verify onFilterChange was called with empty filters
    cy.get('@onFilterChange').should('have.been.calledWith', {
      status: 'all',
      tags: []
    });
  });

  it('displays active filter count', () => {
    // Select multiple filters
    cy.get('[data-testid="status-filter"]').click();
    cy.get('[data-testid="status-option-active"]').click();
    cy.get('[data-testid="tag-Work"]').click();
    cy.get('[data-testid="tag-Personal"]').click();
    
    // Verify filter count is displayed
    cy.get('[data-testid="filter-count"]').should('contain', '3');
  });

  it('handles tag search', () => {
    // Type in tag search
    cy.get('[data-testid="tag-search"]').type('Work');
    
    // Verify only matching tags are visible
    cy.contains('Work').should('be.visible');
    cy.contains('Personal').should('not.be.visible');
    cy.contains('Shopping').should('not.be.visible');
    cy.contains('Health').should('not.be.visible');
  });

  it('maintains filter state', () => {
    // Mount with initial filters
    cy.mount(
      <TaskFilter
        onFilterChange={mockOnFilterChange}
        availableTags={mockTags}
        initialStatus="completed"
        initialTags={['Work']}
      />
    );
    
    // Verify initial filters are selected
    cy.get('[data-testid="status-filter"]').should('contain', 'Completed');
    cy.get('[data-testid="tag-Work"]').should('have.class', 'selected');
  });

  it('handles keyboard navigation', () => {
    // Focus status filter
    cy.get('[data-testid="status-filter"]').focus();
    
    // Press arrow down to open options
    cy.focused().type('{downarrow}');
    
    // Press arrow down to select next option
    cy.focused().type('{downarrow}');
    
    // Press enter to select option
    cy.focused().type('{enter}');
    
    // Verify onFilterChange was called
    cy.get('@onFilterChange').should('have.been.called');
  });
}); 