import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import websocketService from '../services/websocket';
var WebSocketContext = createContext(undefined);
export var useWebSocket = function () {
    var context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
export var WebSocketProvider = function (_a) {
    var children = _a.children;
    var user = useAuth().user;
    var _b = useState(false), isConnected = _b[0], setIsConnected = _b[1];
    useEffect(function () {
        // Initialize WebSocket connection when user is authenticated
        if (user) {
            websocketService.initialize();
            // Set up connection status listener
            var handleConnectionChange = function (connected) {
                setIsConnected(connected);
            };
            // Subscribe to connection events
            var unsubscribe_1 = websocketService.subscribe('CONNECTION_STATUS', handleConnectionChange);
            return function () {
                unsubscribe_1();
                websocketService.disconnect();
            };
        }
        else {
            // Disconnect when user logs out
            websocketService.disconnect();
            setIsConnected(false);
        }
    }, [user]);
    var subscribe = function (eventType, callback) {
        return websocketService.subscribe(eventType, callback);
    };
    return (_jsx(WebSocketContext.Provider, { value: { isConnected: isConnected, subscribe: subscribe }, children: children }));
};
