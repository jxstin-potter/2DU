import { Component, ErrorInfo, ReactNode } from 'react';
interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}
interface State {
    hasError: boolean;
    error: Error | null;
}
/**
 * Error Boundary component to catch JavaScript errors in child component tree
 * Displays a fallback UI when an error occurs
 */
declare class ErrorBoundary extends Component<Props, State> {
    state: State;
    static getDerivedStateFromError(error: Error): State;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): string | number | boolean | Iterable<ReactNode> | import("react/jsx-runtime").JSX.Element;
}
export default ErrorBoundary;
