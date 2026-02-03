import React from 'react';
import TaskSort from '../../src/components/TaskSort';

describe('TaskSort Component', () => {
  const mockOnSortChange = cy.stub().as('onSortChange');

  beforeEach(() => {
    cy.mount(
      <TaskSort
        onSortChange={mockOnSortChange}
      />
    );
  });

  it('renders sort options correctly', () => {
    // Check if sort select is visible
    cy.get('[data-testid="sort-select"]').should('be.visible');
    
    // Check if sort options are visible
    cy.contains('Due Date').should('be.visible');
    cy.contains('Title').should('be.visible');
    cy.contains('Created Date').should('be.visible');
    cy.contains('Priority').should('be.visible');
  });

  it('handles sort by due date', () => {
    // Select due date sort
    cy.get('[data-testid="sort-select"]').click();
    cy.get('[data-testid="sort-option-dueDate"]').click();
    
    // Verify onSortChange was called with correct sort option
    cy.get('@onSortChange').should('have.been.calledWith', 'dueDate', 'asc');
  });

  it('handles sort by title', () => {
    // Select title sort
    cy.get('[data-testid="sort-select"]').click();
    cy.get('[data-testid="sort-option-title"]').click();
    
    // Verify onSortChange was called with correct sort option
    cy.get('@onSortChange').should('have.been.calledWith', 'title', 'asc');
  });

  it('handles sort by created date', () => {
    // Select created date sort
    cy.get('[data-testid="sort-select"]').click();
    cy.get('[data-testid="sort-option-createdDate"]').click();
    
    // Verify onSortChange was called with correct sort option
    cy.get('@onSortChange').should('have.been.calledWith', 'createdDate', 'asc');
  });

  it('handles sort by priority', () => {
    // Select priority sort
    cy.get('[data-testid="sort-select"]').click();
    cy.get('[data-testid="sort-option-priority"]').click();
    
    // Verify onSortChange was called with correct sort option
    cy.get('@onSortChange').should('have.been.calledWith', 'priority', 'asc');
  });

  it('toggles sort direction', () => {
    // Select due date sort
    cy.get('[data-testid="sort-select"]').click();
    cy.get('[data-testid="sort-option-dueDate"]').click();
    
    // Click sort direction toggle
    cy.get('[data-testid="sort-direction-toggle"]').click();
    
    // Verify onSortChange was called with descending direction
    cy.get('@onSortChange').should('have.been.calledWith', 'dueDate', 'desc');
  });

  it('maintains sort direction when changing sort field', () => {
    // Select due date sort with descending direction
    cy.get('[data-testid="sort-select"]').click();
    cy.get('[data-testid="sort-option-dueDate"]').click();
    cy.get('[data-testid="sort-direction-toggle"]').click();
    
    // Change to title sort
    cy.get('[data-testid="sort-select"]').click();
    cy.get('[data-testid="sort-option-title"]').click();
    
    // Verify onSortChange was called with descending direction
    cy.get('@onSortChange').should('have.been.calledWith', 'title', 'desc');
  });

  it('displays current sort option', () => {
    // Mount with initial sort option
    cy.mount(
      <TaskSort
        onSortChange={mockOnSortChange}
        currentSort="dueDate"
        currentDirection="desc"
      />
    );
    
    // Verify current sort option is displayed
    cy.get('[data-testid="sort-select"]').should('contain', 'Due Date');
    cy.get('[data-testid="sort-direction-toggle"]').should('have.class', 'desc');
  });

  it('handles keyboard navigation', () => {
    // Focus sort select
    cy.get('[data-testid="sort-select"]').focus();
    
    // Press arrow down to open options
    cy.focused().type('{downarrow}');
    
    // Press arrow down to select next option
    cy.focused().type('{downarrow}');
    
    // Press enter to select option
    cy.focused().type('{enter}');
    
    // Verify onSortChange was called
    cy.get('@onSortChange').should('have.been.called');
  });
}); 