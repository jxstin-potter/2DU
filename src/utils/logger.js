// Logging levels
export var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (LogLevel = {}));
// Main logging function
var log = function (level, message, context, data) {
    if (context === void 0) { context = {}; }
    var timestamp = new Date().toISOString();
    var contextString = Object.entries(context)
        .filter(function (_a) {
        var _ = _a[0], value = _a[1];
        return value !== undefined;
    })
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return "[".concat(key, ":").concat(value, "]");
    })
        .join(' ');
    var logMessage = "[".concat(timestamp, "] [").concat(level, "] ").concat(contextString, " ").concat(message);
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
export var logger = {
    debug: function (message, context, data) {
        if (context === void 0) { context = {}; }
        return log(LogLevel.DEBUG, message, context, data);
    },
    info: function (message, context, data) {
        if (context === void 0) { context = {}; }
        return log(LogLevel.INFO, message, context, data);
    },
    warn: function (message, context, data) {
        if (context === void 0) { context = {}; }
        return log(LogLevel.WARN, message, context, data);
    },
    error: function (message, context, data) {
        if (context === void 0) { context = {}; }
        return log(LogLevel.ERROR, message, context, data);
    },
    // Component-specific loggers
    component: function (componentName) { return ({
        debug: function (message, data) {
            return logger.debug(message, { component: componentName }, data);
        },
        info: function (message, data) {
            return logger.info(message, { component: componentName }, data);
        },
        warn: function (message, data) {
            return logger.warn(message, { component: componentName }, data);
        },
        error: function (message, data) {
            return logger.error(message, { component: componentName }, data);
        },
    }); },
    // Service-specific loggers
    service: function (serviceName) { return ({
        debug: function (message, data) {
            return logger.debug(message, { service: serviceName }, data);
        },
        info: function (message, data) {
            return logger.info(message, { service: serviceName }, data);
        },
        warn: function (message, data) {
            return logger.warn(message, { service: serviceName }, data);
        },
        error: function (message, data) {
            return logger.error(message, { service: serviceName }, data);
        },
    }); },
    // Hook-specific loggers
    hook: function (hookName) { return ({
        debug: function (message, data) {
            return logger.debug(message, { hook: hookName }, data);
        },
        info: function (message, data) {
            return logger.info(message, { hook: hookName }, data);
        },
        warn: function (message, data) {
            return logger.warn(message, { hook: hookName }, data);
        },
        error: function (message, data) {
            return logger.error(message, { hook: hookName }, data);
        },
    }); },
};
