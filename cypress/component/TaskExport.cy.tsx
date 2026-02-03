import React from 'react';
import TaskExport from '../../src/components/TaskExport';
import { Task } from '../../src/types';

describe('TaskExport Component', () => {
  const mockTasks: Task[] = [
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

  const mockOnExport = cy.stub().as('onExport');

  beforeEach(() => {
    cy.mount(
      <TaskExport
        tasks={mockTasks}
        onExport={mockOnExport}
      />
    );
  });

  it('renders export options correctly', () => {
    // Check if export button is visible
    cy.get('[data-testid="export-button"]').should('be.visible');
    
    // Check if format options are visible
    cy.get('[data-testid="export-format-select"]').should('be.visible');
    cy.contains('CSV').should('be.visible');
    cy.contains('JSON').should('be.visible');
    cy.contains('PDF').should('be.visible');
  });

  it('handles CSV export', () => {
    // Select CSV format
    cy.get('[data-testid="export-format-select"]').click();
    cy.get('[data-testid="format-option-csv"]').click();
    
    // Click export button
    cy.get('[data-testid="export-button"]').click();
    
    // Verify onExport was called with correct format
    cy.get('@onExport').should('have.been.calledWith', 'csv');
  });

  it('handles JSON export', () => {
    // Select JSON format
    cy.get('[data-testid="export-format-select"]').click();
    cy.get('[data-testid="format-option-json"]').click();
    
    // Click export button
    cy.get('[data-testid="export-button"]').click();
    
    // Verify onExport was called with correct format
    cy.get('@onExport').should('have.been.calledWith', 'json');
  });

  it('handles PDF export', () => {
    // Select PDF format
    cy.get('[data-testid="export-format-select"]').click();
    cy.get('[data-testid="format-option-pdf"]').click();
    
    // Click export button
    cy.get('[data-testid="export-button"]').click();
    
    // Verify onExport was called with correct format
    cy.get('@onExport').should('have.been.calledWith', 'pdf');
  });

  it('handles date range selection', () => {
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
    cy.get('@onExport').should('have.been.calledWith', Cypress.sinon.match.string, {
      startDate: new Date('2023-12-01'),
      endDate: new Date('2023-12-31')
    });
  });

  it('handles tag filtering', () => {
    // Select tag filter
    cy.get('[data-testid="tag-filter"]').click();
    cy.get('[data-testid="tag-option-Work"]').click();
    
    // Click export button
    cy.get('[data-testid="export-button"]').click();
    
    // Verify onExport was called with tag filter
    cy.get('@onExport').should('have.been.calledWith', Cypress.sinon.match.string, {
      tags: ['Work']
    });
  });

  it('handles completion status filtering', () => {
    // Select completion status
    cy.get('[data-testid="completion-filter"]').click();
    cy.get('[data-testid="status-option-completed"]').click();
    
    // Click export button
    cy.get('[data-testid="export-button"]').click();
    
    // Verify onExport was called with completion filter
    cy.get('@onExport').should('have.been.calledWith', Cypress.sinon.match.string, {
      completed: true
    });
  });

  it('displays loading state during export', () => {
    // Mount with loading state
    cy.mount(
      <TaskExport
        tasks={mockTasks}
        onExport={mockOnExport}
        isLoading={true}
      />
    );
    
    // Verify loading indicator is shown
    cy.get('[data-testid="loading-indicator"]').should('be.visible');
    
    // Verify export button is disabled
    cy.get('[data-testid="export-button"]').should('be.disabled');
  });

  it('handles export error', () => {
    // Mount with error state
    cy.mount(
      <TaskExport
        tasks={mockTasks}
        onExport={mockOnExport}
        error="Export failed"
      />
    );
    
    // Verify error message is shown
    cy.contains('Export failed').should('be.visible');
  });
}); 