import React from 'react';
import { render, screen, fireEvent, waitFor } from './test-utils';
import TaskModal from '../../components/modals/TaskModal';
import { Task } from '../../types';

describe('TaskModal', () => {
  it('renders the modal fields and actions', () => {
    render(
      <TaskModal
        open={true}
        onClose={jest.fn()}
        onSubmit={jest.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByText(/Task name/i)).toBeInTheDocument();
    expect(screen.getAllByText('Date').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Priority').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Description').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
  });

  it('validates that task name is required', async () => {
    render(
      <TaskModal
        open={true}
        onClose={jest.fn()}
        onSubmit={jest.fn().mockResolvedValue(undefined)}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));
    expect(await screen.findByText('Task name is required')).toBeInTheDocument();
  });

  it('prefills fields when editing an existing task', async () => {
    const initialTask: Task = {
      id: 't1',
      title: 'Existing task',
      completed: false,
      userId: 'u1',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: new Date('2023-12-31T12:00:00.000Z'),
      priority: 'medium',
    };

    render(
      <TaskModal
        open={true}
        onClose={jest.fn()}
        onSubmit={jest.fn().mockResolvedValue(undefined)}
        initialTask={initialTask}
      />
    );

    const label = screen.getByText(/Task name/i);
    const editable = label.parentElement?.querySelector('[contenteditable="true"]') as HTMLElement | null;
    expect(editable).not.toBeNull();

    await waitFor(() => {
      expect(editable?.textContent).toContain('Existing task');
    });
  });
});

