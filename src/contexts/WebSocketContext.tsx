import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import websocketService from '../services/websocket';
import { WebSocketEventType } from '../types/websocket';

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (eventType: WebSocketEventType, callback: (data: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection when user is authenticated
    if (user) {
      websocketService.initialize();
      
      // Set up connection status listener
      const handleConnectionChange = (connected: boolean) => {
        setIsConnected(connected);
      };
      
      // Subscribe to connection events
      const unsubscribe = websocketService.subscribe('CONNECTION_STATUS', handleConnectionChange);
      
      return () => {
        unsubscribe();
        websocketService.disconnect();
      };
    } else {
      // Disconnect when user logs out
      websocketService.disconnect();
      setIsConnected(false);
    }
  }, [user]);

  const subscribe = (eventType: WebSocketEventType, callback: (data: any) => void) => {
    return websocketService.subscribe(eventType, callback);
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
}; 