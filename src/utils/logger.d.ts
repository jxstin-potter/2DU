export declare enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}
interface LogContext {
    component?: string;
    service?: string;
    hook?: string;
    action?: string;
    userId?: string;
    taskId?: string;
    [key: string]: any;
}
export declare const logger: {
    debug: (message: string, context?: LogContext, data?: any) => void;
    info: (message: string, context?: LogContext, data?: any) => void;
    warn: (message: string, context?: LogContext, data?: any) => void;
    error: (message: string, context?: LogContext, data?: any) => void;
    component: (componentName: string) => {
        debug: (message: string, data?: any) => void;
        info: (message: string, data?: any) => void;
        warn: (message: string, data?: any) => void;
        error: (message: string, data?: any) => void;
    };
    service: (serviceName: string) => {
        debug: (message: string, data?: any) => void;
        info: (message: string, data?: any) => void;
        warn: (message: string, data?: any) => void;
        error: (message: string, data?: any) => void;
    };
    hook: (hookName: string) => {
        debug: (message: string, data?: any) => void;
        info: (message: string, data?: any) => void;
        warn: (message: string, data?: any) => void;
        error: (message: string, data?: any) => void;
    };
};
export {};
