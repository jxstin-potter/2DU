import React from 'react';
import TaskBulkActions from '../../src/components/TaskBulkActions';
import { Task } from '../../src/types';

describe('TaskBulkActions Component', () => {
  const mockTasks: Task[] = [
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

  const mockOnBulkAction = cy.stub().as('onBulkAction');

  beforeEach(() => {
    cy.mount(
      <TaskBulkActions
        tasks={mockTasks}
        selectedTasks={[]}
        onBulkAction={mockOnBulkAction}
      />
    );
  });

  it('renders bulk actions correctly', () => {
    // Check if bulk actions section is visible
    cy.get('[data-testid="bulk-actions"]').should('be.visible');
    
    // Check if action buttons are visible
    cy.get('[data-testid="bulk-complete"]').should('be.visible');
    cy.get('[data-testid="bulk-delete"]').should('be.visible');
    cy.get('[data-testid="bulk-tag"]').should('be.visible');
  });

  it('disables actions when no tasks are selected', () => {
    // Verify action buttons are disabled
    cy.get('[data-testid="bulk-complete"]').should('be.disabled');
    cy.get('[data-testid="bulk-delete"]').should('be.disabled');
    cy.get('[data-testid="bulk-tag"]').should('be.disabled');
  });

  it('enables actions when tasks are selected', () => {
    // Mount with selected tasks
    cy.mount(
      <TaskBulkActions
        tasks={mockTasks}
        selectedTasks={['1']}
        onBulkAction={mockOnBulkAction}
      />
    );
    
    // Verify action buttons are enabled
    cy.get('[data-testid="bulk-complete"]').should('not.be.disabled');
    cy.get('[data-testid="bulk-delete"]').should('not.be.disabled');
    cy.get('[data-testid="bulk-tag"]').should('not.be.disabled');
  });

  it('handles bulk complete action', () => {
    // Mount with selected tasks
    cy.mount(
      <TaskBulkActions
        tasks={mockTasks}
        selectedTasks={['1']}
        onBulkAction={mockOnBulkAction}
      />
    );
    
    // Click complete button
    cy.get('[data-testid="bulk-complete"]').click();
    
    // Verify onBulkAction was called with correct action
    cy.get('@onBulkAction').should('have.been.calledWith', 'complete', ['1']);
  });

  it('handles bulk delete action', () => {
    // Mount with selected tasks
    cy.mount(
      <TaskBulkActions
        tasks={mockTasks}
        selectedTasks={['1']}
        onBulkAction={mockOnBulkAction}
      />
    );
    
    // Click delete button
    cy.get('[data-testid="bulk-delete"]').click();
    
    // Verify confirmation dialog is shown
    cy.contains('Are you sure you want to delete the selected tasks?').should('be.visible');
    
    // Confirm deletion
    cy.get('[data-testid="confirm-delete"]').click();
    
    // Verify onBulkAction was called with correct action
    cy.get('@onBulkAction').should('have.been.calledWith', 'delete', ['1']);
  });

  it('handles bulk tag action', () => {
    // Mount with selected tasks
    cy.mount(
      <TaskBulkActions
        tasks={mockTasks}
        selectedTasks={['1']}
        onBulkAction={mockOnBulkAction}
      />
    );
    
    // Click tag button
    cy.get('[data-testid="bulk-tag"]').click();
    
    // Select a tag
    cy.get('[data-testid="tag-select"]').click();
    cy.get('[data-testid="tag-option-Work"]').click();
    
    // Click apply button
    cy.get('[data-testid="apply-tag"]').click();
    
    // Verify onBulkAction was called with correct action
    cy.get('@onBulkAction').should('have.been.calledWith', 'tag', ['1'], 'Work');
  });

  it('displays selected tasks count', () => {
    // Mount with selected tasks
    cy.mount(
      <TaskBulkActions
        tasks={mockTasks}
        selectedTasks={['1', '2']}
        onBulkAction={mockOnBulkAction}
      />
    );
    
    // Verify selected count is displayed
    cy.contains('2 tasks selected').should('be.visible');
  });

  it('handles select all action', () => {
    // Click select all checkbox
    cy.get('[data-testid="select-all"]').click();
    
    // Verify onBulkAction was called with all task IDs
    cy.get('@onBulkAction').should('have.been.calledWith', 'select', ['1', '2']);
  });

  it('handles keyboard shortcuts', () => {
    // Mount with selected tasks
    cy.mount(
      <TaskBulkActions
        tasks={mockTasks}
        selectedTasks={['1']}
        onBulkAction={mockOnBulkAction}
      />
    );
    
    // Press Ctrl/Cmd + D for delete
    cy.get('body').type('{ctrl}d');
    
    // Verify confirmation dialog is shown
    cy.contains('Are you sure you want to delete the selected tasks?').should('be.visible');
  });

  it('displays loading state during bulk action', () => {
    // Mount with loading state
    cy.mount(
      <TaskBulkActions
        tasks={mockTasks}
        selectedTasks={['1']}
        onBulkAction={mockOnBulkAction}
        isLoading={true}
      />
    );
    
    // Verify loading indicator is shown
    cy.get('[data-testid="loading-indicator"]').should('be.visible');
    
    // Verify action buttons are disabled
    cy.get('[data-testid="bulk-complete"]').should('be.disabled');
    cy.get('[data-testid="bulk-delete"]').should('be.disabled');
    cy.get('[data-testid="bulk-tag"]').should('be.disabled');
  });
}); 