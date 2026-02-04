import { logger } from './logger';

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
  [key: string]: unknown;
}

/**
 * Log an error with additional context and severity level
 * 
 * In a production app, this would typically send the error to a logging service
 * while maintaining the same structured format
 */
export const logError = (
  error: Error,
  message: string,
  context: ErrorContext = {},
  severity: 'error' | 'warn' | 'info' = 'error'
) => {
  const errorContext = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...context
  };

  switch (severity) {
    case 'error':
      logger.error(message, errorContext);
      break;
    case 'warn':
      logger.warn(message, errorContext);
      break;
    case 'info':
      logger.info(message, errorContext);
      break;
  }
};

/**
 * Log a component error with context
 */
export const logComponentError = (
  error: Error,
  componentName: string,
  message: string,
  context: Omit<ErrorContext, 'component'> = {}
) => {
  logError(error, message, { component: componentName, ...context });
};

/**
 * Log a service error with context
 */
export const logServiceError = (
  error: Error,
  serviceName: string,
  message: string,
  context: Omit<ErrorContext, 'service'> = {}
) => {
  logError(error, message, { service: serviceName, ...context });
};

/**
 * Log a hook error with context
 */
export const logHookError = (
  error: Error,
  hookName: string,
  message: string,
  context: Omit<ErrorContext, 'hook'> = {}
) => {
  logError(error, message, { hook: hookName, ...context });
}; 