import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoadingState from '../../components/ui/LoadingState';

describe('LoadingState Component', () => {
  it('renders children when not loading and no error', () => {
    render(
      <LoadingState isLoading={false} error={null}>
        <div data-testid="test-content">Test Content</div>
      </LoadingState>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('renders loading overlay when isLoading is true', () => {
    render(
      <LoadingState isLoading={true} error={null}>
        <div>Test Content</div>
      </LoadingState>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when error is provided', () => {
    const error = new Error('Test error message');
    
    render(
      <LoadingState isLoading={false} error={error}>
        <div>Test Content</div>
      </LoadingState>
    );
    
    expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('calls retryAction when retry button is clicked', () => {
    const retryAction = jest.fn();
    const error = new Error('Test error message');
    
    render(
      <LoadingState 
        isLoading={false} 
        error={error} 
        retryAction={retryAction}
      >
        <div>Test Content</div>
      </LoadingState>
    );
    
    fireEvent.click(screen.getByText('Try Again'));
    expect(retryAction).toHaveBeenCalledTimes(1);
  });

  it('renders skeleton loading state when variant is skeleton', () => {
    render(
      <LoadingState 
        isLoading={true} 
        error={null} 
        variant="skeleton"
      >
        <div>Test Content</div>
      </LoadingState>
    );
    
    // Skeleton elements should be present
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders inline loading state when variant is inline', () => {
    render(
      <LoadingState 
        isLoading={true} 
        error={null} 
        variant="inline"
      >
        <div>Test Content</div>
      </LoadingState>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Check for inline styling
    const loadingContainer = screen.getByText('Loading...').parentElement;
    expect(loadingContainer).toHaveStyle({ display: 'flex', alignItems: 'center' });
  });

  it('renders full screen when fullScreen prop is true', () => {
    render(
      <LoadingState 
        isLoading={true} 
        error={null} 
        fullScreen={true}
      >
        <div>Test Content</div>
      </LoadingState>
    );
    
    const loadingContainer = screen.getByText('Loading...').parentElement;
    expect(loadingContainer).toHaveStyle({ height: '100vh' });
  });
}); 