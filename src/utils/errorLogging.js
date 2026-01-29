var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { logger } from './logger';
/**
 * Log an error with additional context and severity level
 *
 * In a production app, this would typically send the error to a logging service
 * while maintaining the same structured format
 */
export var logError = function (error, message, context, severity) {
    if (context === void 0) { context = {}; }
    if (severity === void 0) { severity = 'error'; }
    var errorContext = __assign({ name: error.name, message: error.message, stack: error.stack }, context);
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
export var logComponentError = function (error, componentName, message, context) {
    if (context === void 0) { context = {}; }
    logError(error, message, __assign({ component: componentName }, context));
};
/**
 * Log a service error with context
 */
export var logServiceError = function (error, serviceName, message, context) {
    if (context === void 0) { context = {}; }
    logError(error, message, __assign({ service: serviceName }, context));
};
/**
 * Log a hook error with context
 */
export var logHookError = function (error, hookName, message, context) {
    if (context === void 0) { context = {}; }
    logError(error, message, __assign({ hook: hookName }, context));
};
