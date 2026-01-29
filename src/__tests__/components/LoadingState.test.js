import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import LoadingState from '../../components/ui/LoadingState';
describe('LoadingState Component', function () {
    it('renders children when not loading and no error', function () {
        render(_jsx(LoadingState, { isLoading: false, error: null, children: _jsx("div", { "data-testid": "test-content", children: "Test Content" }) }));
        expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
    it('renders loading overlay when isLoading is true', function () {
        render(_jsx(LoadingState, { isLoading: true, error: null, children: _jsx("div", { children: "Test Content" }) }));
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
    it('renders error message when error is provided', function () {
        var error = new Error('Test error message');
        render(_jsx(LoadingState, { isLoading: false, error: error, children: _jsx("div", { children: "Test Content" }) }));
        expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
        expect(screen.getByText('Test error message')).toBeInTheDocument();
    });
    it('calls retryAction when retry button is clicked', function () {
        var retryAction = jest.fn();
        var error = new Error('Test error message');
        render(_jsx(LoadingState, { isLoading: false, error: error, retryAction: retryAction, children: _jsx("div", { children: "Test Content" }) }));
        fireEvent.click(screen.getByText('Try Again'));
        expect(retryAction).toHaveBeenCalledTimes(1);
    });
    it('renders skeleton loading state when variant is skeleton', function () {
        render(_jsx(LoadingState, { isLoading: true, error: null, variant: "skeleton", children: _jsx("div", { children: "Test Content" }) }));
        // Skeleton elements should be present
        var skeletons = document.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBeGreaterThan(0);
    });
    it('renders inline loading state when variant is inline', function () {
        render(_jsx(LoadingState, { isLoading: true, error: null, variant: "inline", children: _jsx("div", { children: "Test Content" }) }));
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        // Check for inline styling
        var loadingContainer = screen.getByText('Loading...').parentElement;
        expect(loadingContainer).toHaveStyle({ display: 'flex', alignItems: 'center' });
    });
    it('renders full screen when fullScreen prop is true', function () {
        render(_jsx(LoadingState, { isLoading: true, error: null, fullScreen: true, children: _jsx("div", { children: "Test Content" }) }));
        var loadingContainer = screen.getByText('Loading...').parentElement;
        expect(loadingContainer).toHaveStyle({ height: '100vh' });
    });
});
