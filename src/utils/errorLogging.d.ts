/**
 * Enhanced error logging utility
 * Provides structured error logging with context and severity levels
 */
interface ErrorContext {
    component?: string;
    service?: string;
    hook?: string;
    action?: string;
    userId?: string;
    taskId?: string;
    [key: string]: any;
}
/**
 * Log an error with additional context and severity level
 *
 * In a production app, this would typically send the error to a logging service
 * while maintaining the same structured format
 */
export declare const logError: (error: Error, message: string, context?: ErrorContext, severity?: "error" | "warn" | "info") => void;
/**
 * Log a component error with context
 */
export declare const logComponentError: (error: Error, componentName: string, message: string, context?: Omit<ErrorContext, "component">) => void;
/**
 * Log a service error with context
 */
export declare const logServiceError: (error: Error, serviceName: string, message: string, context?: Omit<ErrorContext, "service">) => void;
/**
 * Log a hook error with context
 */
export declare const logHookError: (error: Error, hookName: string, message: string, context?: Omit<ErrorContext, "hook">) => void;
export {};
