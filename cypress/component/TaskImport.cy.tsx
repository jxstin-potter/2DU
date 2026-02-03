import React from 'react';
import TaskImport from '../../src/components/TaskImport';

describe('TaskImport Component', () => {
  const mockOnImport = cy.stub().as('onImport');

  beforeEach(() => {
    cy.mount(
      <TaskImport
        onImport={mockOnImport}
      />
    );
  });

  it('renders import options correctly', () => {
    // Check if import button is visible
    cy.get('[data-testid="import-button"]').should('be.visible');
    
    // Check if file input is present but hidden
    cy.get('[data-testid="file-input"]').should('exist');
    
    // Check if supported formats are listed
    cy.contains('Supported formats: CSV, JSON').should('be.visible');
  });

  it('handles CSV file import', () => {
    // Create a CSV file
    const csvContent = 'title,completed,dueDate,tags\nTask 1,false,2023-12-31,Work';
    
    // Trigger file input change
    cy.get('[data-testid="file-input"]').attachFile({
      fileContent: csvContent,
      fileName: 'tasks.csv',
      mimeType: 'text/csv'
    });
    
    // Verify onImport was called with correct data
    cy.get('@onImport').should('have.been.calledWith', Cypress.sinon.match.array, 'csv');
  });

  it('handles JSON file import', () => {
    // Create a JSON file
    const jsonContent = JSON.stringify([
      {
        title: 'Task 1',
        completed: false,
        dueDate: '2023-12-31',
        tags: ['Work']
      }
    ]);
    
    // Trigger file input change
    cy.get('[data-testid="file-input"]').attachFile({
      fileContent: jsonContent,
      fileName: 'tasks.json',
      mimeType: 'application/json'
    });
    
    // Verify onImport was called with correct data
    cy.get('@onImport').should('have.been.calledWith', Cypress.sinon.match.array, 'json');
  });

  it('validates file format', () => {
    // Try to import unsupported format
    const invalidContent = 'Some invalid content';
    
    // Trigger file input change
    cy.get('[data-testid="file-input"]').attachFile({
      fileContent: invalidContent,
      fileName: 'tasks.txt',
      mimeType: 'text/plain'
    });
    
    // Verify error message is shown
    cy.contains('Unsupported file format').should('be.visible');
    
    // Verify onImport was not called
    cy.get('@onImport').should('not.have.been.called');
  });

  it('validates file content', () => {
    // Try to import invalid CSV content
    const invalidCsvContent = 'invalid,headers\nTask 1,false';
    
    // Trigger file input change
    cy.get('[data-testid="file-input"]').attachFile({
      fileContent: invalidCsvContent,
      fileName: 'tasks.csv',
      mimeType: 'text/csv'
    });
    
    // Verify error message is shown
    cy.contains('Invalid file content').should('be.visible');
    
    // Verify onImport was not called
    cy.get('@onImport').should('not.have.been.called');
  });

  it('handles drag and drop', () => {
    // Create a CSV file
    const csvContent = 'title,completed,dueDate,tags\nTask 1,false,2023-12-31,Work';
    
    // Trigger drag and drop
    cy.get('[data-testid="drop-zone"]')
      .trigger('dragenter')
      .trigger('drop', {
        dataTransfer: {
          files: [new File([csvContent], 'tasks.csv', { type: 'text/csv' })]
        }
      });
    
    // Verify onImport was called with correct data
    cy.get('@onImport').should('have.been.calledWith', Cypress.sinon.match.array, 'csv');
  });

  it('displays loading state during import', () => {
    // Mount with loading state
    cy.mount(
      <TaskImport
        onImport={mockOnImport}
        isLoading={true}
      />
    );
    
    // Verify loading indicator is shown
    cy.get('[data-testid="loading-indicator"]').should('be.visible');
    
    // Verify import button is disabled
    cy.get('[data-testid="import-button"]').should('be.disabled');
  });

  it('handles import error', () => {
    // Mount with error state
    cy.mount(
      <TaskImport
        onImport={mockOnImport}
        error="Import failed"
      />
    );
    
    // Verify error message is shown
    cy.contains('Import failed').should('be.visible');
  });

  it('shows import preview', () => {
    // Create a CSV file with multiple tasks
    const csvContent = 'title,completed,dueDate,tags\nTask 1,false,2023-12-31,Work\nTask 2,true,2023-12-30,Personal';
    
    // Trigger file input change
    cy.get('[data-testid="file-input"]').attachFile({
      fileContent: csvContent,
      fileName: 'tasks.csv',
      mimeType: 'text/csv'
    });
    
    // Verify preview is shown
    cy.get('[data-testid="import-preview"]').should('be.visible');
    cy.contains('Task 1').should('be.visible');
    cy.contains('Task 2').should('be.visible');
  });
}); 