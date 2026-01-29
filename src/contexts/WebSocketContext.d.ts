import React from 'react';
import { WebSocketEventType } from '../types/websocket';
interface WebSocketContextType {
    isConnected: boolean;
    subscribe: (eventType: WebSocketEventType, callback: (data: any) => void) => () => void;
}
export declare const useWebSocket: () => WebSocketContextType;
interface WebSocketProviderProps {
    children: React.ReactNode;
}
export declare const WebSocketProvider: React.FC<WebSocketProviderProps>;
export {};
