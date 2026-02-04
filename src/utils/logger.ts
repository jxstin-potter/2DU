// Logging levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

// Logging context interface
interface LogContext {
  component?: string;
  service?: string;
  hook?: string;
  action?: string;
  userId?: string;
  taskId?: string;
  [key: string]: unknown;
}

// Main logging function
const log = (level: LogLevel, message: string, context: LogContext = {}, data?: unknown) => {
  const timestamp = new Date().toISOString();
  const contextString = Object.entries(context)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `[${key}:${value}]`)
    .join(' ');

  const logMessage = `[${timestamp}] [${level}] ${contextString} ${message}`;

  switch (level) {
    case LogLevel.DEBUG:
      console.debug(logMessage, data || '');
      break;
    case LogLevel.INFO:
      console.info(logMessage, data || '');
      break;
    case LogLevel.WARN:
      console.warn(logMessage, data || '');
      break;
    case LogLevel.ERROR:
      console.error(logMessage, data || '');
      break;
  }
};

// Helper functions for different logging levels
export const logger = {
  debug: (message: string, context: LogContext = {}, data?: unknown) => 
    log(LogLevel.DEBUG, message, context, data),
  
  info: (message: string, context: LogContext = {}, data?: unknown) => 
    log(LogLevel.INFO, message, context, data),
  
  warn: (message: string, context: LogContext = {}, data?: unknown) => 
    log(LogLevel.WARN, message, context, data),
  
  error: (message: string, context: LogContext = {}, data?: unknown) => 
    log(LogLevel.ERROR, message, context, data),

  // Component-specific loggers
  component: (componentName: string) => ({
    debug: (message: string, data?: unknown) => 
      logger.debug(message, { component: componentName }, data),
    info: (message: string, data?: unknown) => 
      logger.info(message, { component: componentName }, data),
    warn: (message: string, data?: unknown) => 
      logger.warn(message, { component: componentName }, data),
    error: (message: string, data?: unknown) => 
      logger.error(message, { component: componentName }, data),
  }),

  // Service-specific loggers
  service: (serviceName: string) => ({
    debug: (message: string, data?: unknown) => 
      logger.debug(message, { service: serviceName }, data),
    info: (message: string, data?: unknown) => 
      logger.info(message, { service: serviceName }, data),
    warn: (message: string, data?: unknown) => 
      logger.warn(message, { service: serviceName }, data),
    error: (message: string, data?: unknown) => 
      logger.error(message, { service: serviceName }, data),
  }),

  // Hook-specific loggers
  hook: (hookName: string) => ({
    debug: (message: string, data?: unknown) => 
      logger.debug(message, { hook: hookName }, data),
    info: (message: string, data?: unknown) => 
      logger.info(message, { hook: hookName }, data),
    warn: (message: string, data?: unknown) => 
      logger.warn(message, { hook: hookName }, data),
    error: (message: string, data?: unknown) => 
      logger.error(message, { hook: hookName }, data),
  }),
}; 