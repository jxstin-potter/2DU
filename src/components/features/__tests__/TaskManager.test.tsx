import React from 'react';
import { render, screen, fireEvent, waitFor } from '../__tests__/test-utils';
import { collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import TaskManager from '../TaskManager';
import { mockTasks, mockCategories, mockTags } from '../__tests__/test-utils';

// Mock the Firebase functions
const mockGetDocs = getDocs as jest.Mock;
const mockAddDoc = addDoc as jest.Mock;
const mockUpdateDoc = updateDoc as jest.Mock;
const mockDeleteDoc = deleteDoc as jest.Mock;

describe('TaskManager', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockGetDocs.mockImplementation(() => ({
      docs: mockTasks.map(task => ({
        id: task.id,
        data: () => ({ ...task }),
      })),
    }));
  });

  it('renders loading state initially', () => {
    render(<TaskManager />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders tasks after loading', async () => {
    render(<TaskManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  it('handles task completion toggle', async () => {
    render(<TaskManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Mock the updateDoc function to simulate successful update
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    // Find and click the toggle button for the first task
    const toggleButton = screen.getAllByRole('checkbox')[0];
    fireEvent.click(toggleButton);

    // Verify that updateDoc was called
    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  it('handles task deletion', async () => {
    render(<TaskManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Mock the deleteDoc function to simulate successful deletion
    mockDeleteDoc.mockResolvedValueOnce(undefined);

    // Find and click the delete button for the first task
    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    // Verify that deleteDoc was called
    await waitFor(() => {
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });

  it('handles error state', async () => {
    // Mock getDocs to throw an error
    mockGetDocs.mockRejectedValueOnce(new Error('Failed to load data'));

    render(<TaskManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });
  });

  it('switches between list and calendar views', async () => {
    render(<TaskManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Find and click the calendar view tab
    const calendarTab = screen.getByRole('tab', { name: /calendar view/i });
    fireEvent.click(calendarTab);

    // Verify that the view has changed
    expect(calendarTab).toHaveAttribute('aria-selected', 'true');
  });
}); 