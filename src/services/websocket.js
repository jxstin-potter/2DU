import { logError } from '../utils/errorLogging';
// Create a type guard for WebSocketEventType
var isValidEventType = function (type) {
    var validTypes = ['CONNECTION_STATUS', 'TASK_UPDATE', 'TASK_DELETE', 'TASK_CREATE'];
    return typeof type === 'string' && validTypes.includes(type);
};
var WebSocketService = /** @class */ (function () {
    function WebSocketService() {
        this.ws = null;
        this.eventListeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectTimeout = null;
        this.isConnecting = false;
        this.lastConnectionAttempt = 0;
        this.MIN_RECONNECT_INTERVAL = 1000; // 1 second
        this.MAX_RECONNECT_INTERVAL = 30000; // 30 seconds
        this.WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
    }
    WebSocketService.prototype.initialize = function () {
        if (this.ws || this.isConnecting) {
            console.warn('WebSocket connection already in progress or established');
            return;
        }
        // Validate WebSocket URL
        if (!this.WS_URL.startsWith('ws://') && !this.WS_URL.startsWith('wss://')) {
            var error = new Error('Invalid WebSocket URL format. Must start with ws:// or wss://');
            logError(error, 'WebSocket URL validation failed', { url: this.WS_URL });
            return;
        }
        this.isConnecting = true;
        this.lastConnectionAttempt = Date.now();
        try {
            this.ws = new WebSocket(this.WS_URL);
            this.ws.onopen = this.handleOpen.bind(this);
            this.ws.onclose = this.handleClose.bind(this);
            this.ws.onerror = this.handleError.bind(this);
            this.ws.onmessage = this.handleMessage.bind(this);
        }
        catch (error) {
            this.handleConnectionError(error);
        }
    };
    WebSocketService.prototype.handleConnectionError = function (error) {
        logError(error, 'Failed to create WebSocket connection', {
            url: this.WS_URL,
            reconnectAttempt: this.reconnectAttempts
        });
        this.isConnecting = false;
        this.notifyConnectionStatus(false);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
        }
        else {
            this.setupFallbackMechanism();
        }
    };
    WebSocketService.prototype.disconnect = function () {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.ws) {
            try {
                this.ws.close(1000, 'Client disconnecting');
            }
            catch (error) {
                logError(error, 'Error during WebSocket disconnect', {
                    readyState: this.ws.readyState
                });
            }
            this.ws = null;
        }
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.notifyConnectionStatus(false);
    };
    WebSocketService.prototype.subscribe = function (eventType, callback) {
        var _this = this;
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, new Set());
        }
        this.eventListeners.get(eventType).add(callback);
        // Return unsubscribe function
        return function () {
            var listeners = _this.eventListeners.get(eventType);
            if (listeners) {
                listeners.delete(callback);
                if (listeners.size === 0) {
                    _this.eventListeners.delete(eventType);
                }
            }
        };
    };
    WebSocketService.prototype.handleOpen = function () {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.notifyConnectionStatus(true);
    };
    WebSocketService.prototype.handleClose = function (event) {
        var error = new Error('WebSocket connection closed');
        error.code = event.code;
        error.reason = event.reason;
        error.wasClean = event.wasClean;
        logError(error, 'WebSocket connection closed', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
            reconnectAttempt: this.reconnectAttempts
        });
        this.isConnecting = false;
        this.notifyConnectionStatus(false);
        // Only attempt reconnect if the closure wasn't clean (unexpected)
        if (!event.wasClean) {
            this.attemptReconnect();
        }
    };
    WebSocketService.prototype.handleError = function (error) {
        var _a;
        var wsError = error;
        var errorObj = new Error(wsError.message || 'Unknown WebSocket error');
        errorObj.name = 'WebSocketError';
        var errorDetails = {
            message: wsError.message || 'Unknown error',
            type: wsError.type,
            timestamp: new Date().toISOString(),
            readyState: (_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState,
            url: this.WS_URL,
            reconnectAttempt: this.reconnectAttempts + 1
        };
        logError(errorObj, 'WebSocket error occurred', errorDetails);
        this.isConnecting = false;
        this.notifyConnectionStatus(false);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
        }
        else {
            this.setupFallbackMechanism();
        }
    };
    WebSocketService.prototype.handleMessage = function (event) {
        var _a;
        try {
            if (typeof event.data !== 'string') {
                throw new Error('Received non-string message data');
            }
            var message_1 = JSON.parse(event.data);
            // Validate message structure
            if (!message_1 || typeof message_1 !== 'object') {
                throw new Error('Invalid message format: not an object');
            }
            if (!message_1.type || !isValidEventType(message_1.type)) {
                throw new Error("Invalid message type: ".concat(message_1.type));
            }
            var listeners = this.eventListeners.get(message_1.type);
            if (listeners) {
                listeners.forEach(function (callback) {
                    try {
                        callback(message_1.data);
                    }
                    catch (callbackError) {
                        logError(callbackError, 'Error in WebSocket event callback', {
                            eventType: message_1.type,
                            data: message_1.data
                        });
                    }
                });
            }
        }
        catch (error) {
            logError(error, 'Error processing WebSocket message', {
                rawData: event.data,
                readyState: (_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState
            });
        }
    };
    WebSocketService.prototype.attemptReconnect = function () {
        var _this = this;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            logError(new Error('Max reconnection attempts reached'), 'WebSocket reconnection failed', { maxAttempts: this.maxReconnectAttempts });
            this.setupFallbackMechanism();
            return;
        }
        var timeSinceLastAttempt = Date.now() - this.lastConnectionAttempt;
        if (timeSinceLastAttempt < this.MIN_RECONNECT_INTERVAL) {
            // Ensure minimum time between reconnection attempts
            var delay = this.MIN_RECONNECT_INTERVAL - timeSinceLastAttempt;
            this.reconnectTimeout = setTimeout(function () { return _this.attemptReconnect(); }, delay);
            return;
        }
        this.reconnectAttempts++;
        var backoffTime = Math.min(this.MIN_RECONNECT_INTERVAL * Math.pow(2, this.reconnectAttempts - 1), this.MAX_RECONNECT_INTERVAL);
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        this.reconnectTimeout = setTimeout(function () {
            _this.initialize();
        }, backoffTime);
    };
    WebSocketService.prototype.notifyConnectionStatus = function (connected, mode) {
        var listeners = this.eventListeners.get('CONNECTION_STATUS');
        if (listeners) {
            listeners.forEach(function (callback) {
                try {
                    callback({ connected: connected, mode: mode || 'websocket' });
                }
                catch (error) {
                    logError(error, 'Error in connection status callback', {
                        connected: connected,
                        mode: mode
                    });
                }
            });
        }
    };
    WebSocketService.prototype.setupFallbackMechanism = function () {
        logError(new Error('WebSocket connection failed'), 'Switching to fallback mechanism', { reconnectAttempts: this.reconnectAttempts });
        this.notifyConnectionStatus(false, 'fallback');
    };
    return WebSocketService;
}());
var websocketService = new WebSocketService();
export default websocketService;
