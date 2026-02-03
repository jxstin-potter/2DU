import React from 'react';
import { render, screen, fireEvent, waitFor } from './test-utils';
import TaskManager from '../../components/task-management/TaskManager';
import { subscribeToTasks, updateTask, deleteTask } from '../../services/tasksService';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1' }, loading: false }),
}));

jest.mock('../../services/tasksService', () => ({
  subscribeToTasks: jest.fn(),
  createTaskFromData: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  updateTaskOrder: jest.fn(),
}));

describe('TaskManager', () => {
  beforeEach(() => {
    (subscribeToTasks as jest.Mock).mockImplementation((_userId: string, _params: any, callback: any) => {
      callback({
        tasks: [
          {
            id: '1',
            title: 'Test Task 1',
            completed: false,
            userId: 'u1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        lastVisible: null,
        hasMore: false,
      });
      return () => {};
    });
    (updateTask as jest.Mock).mockResolvedValue(undefined);
    (deleteTask as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders tasks from the subscription', async () => {
    render(<TaskManager />);
    expect(await screen.findByText('Test Task 1')).toBeInTheDocument();
  });

  it('toggles completion via updateTask', async () => {
    render(<TaskManager />);
    await screen.findByText('Test Task 1');

    fireEvent.click(screen.getByLabelText(/mark complete/i));
    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith('1', expect.any(Object), 'u1');
    });
  });

  it('deletes a task via deleteTask', async () => {
    render(<TaskManager />);
    await screen.findByText('Test Task 1');

    fireEvent.click(screen.getByLabelText('Delete task'));
    expect(deleteTask).toHaveBeenCalledWith('1', 'u1');
  });
});

