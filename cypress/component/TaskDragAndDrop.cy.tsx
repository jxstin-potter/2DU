import React from 'react';
import TaskDragAndDrop from '../../src/components/task-management/TaskDragAndDrop';
import { Task } from '../../src/types';

describe('TaskDragAndDrop Component', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      completed: false,
      dueDate: new Date('2023-12-31'),
      order: 0,
      tags: ['Work'],
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Task 2',
      completed: false,
      dueDate: new Date('2023-12-30'),
      order: 1,
      tags: ['Personal'],
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Task 3',
      completed: false,
      dueDate: new Date('2023-12-29'),
      order: 2,
      tags: ['Work'],
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockOnReorder = cy.stub().as('onReorder');

  beforeEach(() => {
    cy.mount(
      <TaskDragAndDrop
        tasks={mockTasks}
        onReorder={mockOnReorder}
      />
    );
  });

  it('renders task list correctly', () => {
    cy.get('[data-testid="task-list"]').should('be.visible');
    mockTasks.forEach((task) => {
      cy.contains(task.title).should('be.visible');
    });
  });

  it('shows draggable task row', () => {
    cy.get('[data-testid="task-1"]').should('be.visible');
  });

  it('handles drag over', () => {
    cy.get('[data-testid="task-1"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 100, clientY: 100 });
    cy.get('[data-testid="task-2"]')
      .trigger('mouseover')
      .trigger('mousemove', { clientX: 100, clientY: 200 });
    cy.get('[data-testid="task-1"]').should('exist');
  });

  it('calls onReorder after drop with reordered list', () => {
    cy.get('[data-testid="task-1"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 100, clientY: 100 });
    cy.get('[data-testid="task-2"]')
      .trigger('mouseover')
      .trigger('mousemove', { clientX: 100, clientY: 200 })
      .trigger('mouseup');
    cy.get('@onReorder').should('have.been.calledOnce');
    cy.get('@onReorder').then((stub) => {
      const call = stub.getCall(0);
      expect(call.args[0]).to.be.an('array');
      expect(call.args[0]).to.have.length(3);
    });
  });

  it('handles drag cancel', () => {
    cy.get('[data-testid="task-1"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 100, clientY: 100 });
    cy.get('body').trigger('mouseup');
    cy.get('[data-testid="task-1"]').should('be.visible');
  });

  it('maintains task order after drop', () => {
    cy.get('[data-testid="task-1"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 100, clientY: 100 });
    cy.get('[data-testid="task-2"]')
      .trigger('mouseover')
      .trigger('mousemove', { clientX: 100, clientY: 200 })
      .trigger('mouseup');
    cy.get('[data-testid="task-list"]')
      .find('[data-testid^="task-"]')
      .should('have.length', 3);
  });

  it('disables drag and drop during loading', () => {
    cy.mount(
      <TaskDragAndDrop
        tasks={mockTasks}
        onReorder={mockOnReorder}
        isLoading={true}
      />
    );
    cy.get('[data-testid="task-list"]').should('not.exist');
    cy.get('[role="progressbar"]').should('be.visible');
  });
});
