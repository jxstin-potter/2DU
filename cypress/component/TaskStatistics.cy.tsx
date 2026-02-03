import React from 'react';
import TaskStatistics from '../../src/components/TaskStatistics';
import { Task } from '../../src/types';

describe('TaskStatistics Component', () => {
  const mockTasks: Task[] = [
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

  const mockOnFilterChange = cy.stub().as('onFilterChange');

  beforeEach(() => {
    cy.mount(
      <TaskStatistics
        tasks={mockTasks}
        onFilterChange={mockOnFilterChange}
      />
    );
  });

  it('renders statistics correctly', () => {
    // Check if total tasks count is displayed
    cy.contains('Total Tasks: 3').should('be.visible');
    
    // Check if completed tasks count is displayed
    cy.contains('Completed: 1').should('be.visible');
    
    // Check if active tasks count is displayed
    cy.contains('Active: 2').should('be.visible');
    
    // Check if overdue tasks count is displayed
    cy.contains('Overdue: 1').should('be.visible');
  });

  it('displays completion rate', () => {
    // Check if completion rate is displayed correctly
    cy.contains('Completion Rate: 33%').should('be.visible');
  });

  it('displays tag distribution', () => {
    // Check if tag counts are displayed
    cy.contains('Work: 2').should('be.visible');
    cy.contains('Personal: 1').should('be.visible');
  });

  it('handles filter clicks', () => {
    // Click on completed filter
    cy.get('[data-testid="filter-completed"]').click();
    
    // Verify onFilterChange was called with correct filter
    cy.get('@onFilterChange').should('have.been.calledWith', 'completed');
  });

  it('updates statistics when tasks change', () => {
    // Mount with different tasks
    const newTasks = [...mockTasks, {
      id: '4',
      title: 'New Task',
      completed: false,
      dueDate: new Date('2023-12-15'),
      order: 3,
      tags: ['Work'],
      userId: 'user1',
    }];
    
    cy.mount(
      <TaskStatistics
        tasks={newTasks}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    // Verify statistics are updated
    cy.contains('Total Tasks: 4').should('be.visible');
    cy.contains('Active: 3').should('be.visible');
  });

  it('displays due date distribution', () => {
    // Check if due date distribution chart is rendered
    cy.get('[data-testid="due-date-chart"]').should('be.visible');
    
    // Check if chart shows correct data
    cy.get('[data-testid="chart-bar"]').should('have.length', 3);
  });

  it('handles empty task list', () => {
    // Mount with empty tasks
    cy.mount(
      <TaskStatistics
        tasks={[]}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    // Verify empty state message
    cy.contains('No tasks available').should('be.visible');
    
    // Verify all counts are zero
    cy.contains('Total Tasks: 0').should('be.visible');
    cy.contains('Completed: 0').should('be.visible');
    cy.contains('Active: 0').should('be.visible');
    cy.contains('Overdue: 0').should('be.visible');
  });

  it('displays loading state', () => {
    // Mount with loading state
    cy.mount(
      <TaskStatistics
        tasks={mockTasks}
        onFilterChange={mockOnFilterChange}
        isLoading={true}
      />
    );
    
    // Verify loading indicator is shown
    cy.get('[data-testid="loading-indicator"]').should('be.visible');
  });
}); 