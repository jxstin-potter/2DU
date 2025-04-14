import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TaskModal from '../features/TaskModal';
import { Task } from '../../types';

describe('TaskModal Component', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    completed: false,
    dueDate: new Date('2023-12-31'),
    order: 0,
    tags: ['Work'],
    userId: 'test-user-id',
  };

  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the create task modal correctly', () => {
    render(
      <TaskModal
        open={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders the edit task modal correctly', () => {
    render(
      <TaskModal
        open={true}
        task={mockTask}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2023-12-31')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <TaskModal
        open={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside the modal', () => {
    render(
      <TaskModal
        open={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('validates required fields when creating a task', async () => {
    render(
      <TaskModal
        open={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('validates date format when creating a task', async () => {
    render(
      <TaskModal
        open={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: 'invalid-date' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Invalid date format')).toBeInTheDocument();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('calls onSave with correct data when creating a task', async () => {
    render(
      <TaskModal
        open={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('Tags'), { target: { value: 'Work,Personal' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'New Task',
        completed: false,
        dueDate: expect.any(Date),
        order: 0,
        tags: ['Work', 'Personal'],
        userId: 'test-user-id',
      });
    });
  });

  it('calls onSave with correct data when editing a task', async () => {
    render(
      <TaskModal
        open={true}
        task={mockTask}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Task' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-30' } });
    fireEvent.change(screen.getByLabelText('Tags'), { target: { value: 'Work,Personal,Urgent' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        id: '1',
        title: 'Updated Task',
        completed: false,
        dueDate: expect.any(Date),
        order: 0,
        tags: ['Work', 'Personal', 'Urgent'],
        userId: 'test-user-id',
      });
    });
  });

  it('handles tag input correctly', async () => {
    render(
      <TaskModal
        open={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const tagInput = screen.getByLabelText('Tags');
    fireEvent.change(tagInput, { target: { value: 'Work' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });
    fireEvent.change(tagInput, { target: { value: 'Personal' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('removes tags when clicking the remove button', async () => {
    render(
      <TaskModal
        open={true}
        task={mockTask}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const removeButton = screen.getByTestId('remove-tag-Work');
    fireEvent.click(removeButton);

    expect(screen.queryByText('Work')).not.toBeInTheDocument();
  });

  it('disables the save button while saving', async () => {
    render(
      <TaskModal
        open={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.click(screen.getByText('Save'));

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('shows error message when save fails', async () => {
    mockOnSave.mockRejectedValueOnce(new Error('Failed to save task'));

    render(
      <TaskModal
        open={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Failed to save task')).toBeInTheDocument();
    });
  });
}); 