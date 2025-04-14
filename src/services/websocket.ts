import { WebSocketEventType, WebSocketEventData } from '../types/websocket';
import { logError } from '../utils/errorLogging';

type EventCallback = (data: any) => void;

interface WebSocketError extends Error {
  code?: number;
  reason?: string;
  wasClean?: boolean;
}

// Create a type guard for WebSocketEventType
const isValidEventType = (type: any): type is WebSocketEventType => {
  const validTypes = ['CONNECTION_STATUS', 'TASK_UPDATE', 'TASK_DELETE', 'TASK_CREATE'] as const;
  return typeof type === 'string' && validTypes.includes(type as typeof validTypes[number]);
};

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventListeners: Map<WebSocketEventType, Set<EventCallback>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private lastConnectionAttempt: number = 0;
  private readonly MIN_RECONNECT_INTERVAL = 1000; // 1 second
  private readonly MAX_RECONNECT_INTERVAL = 30000; // 30 seconds

  private readonly WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

  public initialize(): void {
    if (this.ws || this.isConnecting) {
      console.warn('WebSocket connection already in progress or established');
      return;
    }
    
    // Validate WebSocket URL
    if (!this.WS_URL.startsWith('ws://') && !this.WS_URL.startsWith('wss://')) {
      const error = new Error('Invalid WebSocket URL format. Must start with ws:// or wss://');
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
    } catch (error) {
      this.handleConnectionError(error as Error);
    }
  }

  private handleConnectionError(error: Error): void {
    logError(error, 'Failed to create WebSocket connection', {
      url: this.WS_URL,
      reconnectAttempt: this.reconnectAttempts
    });
    
    this.isConnecting = false;
    this.notifyConnectionStatus(false);
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnect();
    } else {
      this.setupFallbackMechanism();
    }
  }

  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      try {
        this.ws.close(1000, 'Client disconnecting');
      } catch (error) {
        logError(error as Error, 'Error during WebSocket disconnect', {
          readyState: this.ws.readyState
        });
      }
      this.ws = null;
    }

    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.notifyConnectionStatus(false);
  }

  public subscribe(eventType: WebSocketEventType, callback: EventCallback): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    
    this.eventListeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.eventListeners.delete(eventType);
        }
      }
    };
  }

  private handleOpen(): void {
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.notifyConnectionStatus(true);
  }

  private handleClose(event: CloseEvent): void {
    const error: WebSocketError = new Error('WebSocket connection closed');
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
  }

  private handleError(error: Event): void {
    const wsError = error as ErrorEvent;
    const errorObj = new Error(wsError.message || 'Unknown WebSocket error');
    errorObj.name = 'WebSocketError';
    
    const errorDetails = {
      message: wsError.message || 'Unknown error',
      type: wsError.type,
      timestamp: new Date().toISOString(),
      readyState: this.ws?.readyState,
      url: this.WS_URL,
      reconnectAttempt: this.reconnectAttempts + 1
    };
    
    logError(errorObj, 'WebSocket error occurred', errorDetails);
    
    this.isConnecting = false;
    this.notifyConnectionStatus(false);
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnect();
    } else {
      this.setupFallbackMechanism();
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      if (typeof event.data !== 'string') {
        throw new Error('Received non-string message data');
      }

      const message = JSON.parse(event.data);
      
      // Validate message structure
      if (!message || typeof message !== 'object') {
        throw new Error('Invalid message format: not an object');
      }
      
      if (!message.type || !isValidEventType(message.type)) {
        throw new Error(`Invalid message type: ${message.type}`);
      }
      
      const listeners = this.eventListeners.get(message.type);
      if (listeners) {
        listeners.forEach(callback => {
          try {
            callback(message.data);
          } catch (callbackError) {
            logError(callbackError as Error, 'Error in WebSocket event callback', {
              eventType: message.type,
              data: message.data
            });
          }
        });
      }
    } catch (error) {
      logError(error as Error, 'Error processing WebSocket message', {
        rawData: event.data,
        readyState: this.ws?.readyState
      });
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logError(
        new Error('Max reconnection attempts reached'),
        'WebSocket reconnection failed',
        { maxAttempts: this.maxReconnectAttempts }
      );
      this.setupFallbackMechanism();
      return;
    }
    
    const timeSinceLastAttempt = Date.now() - this.lastConnectionAttempt;
    if (timeSinceLastAttempt < this.MIN_RECONNECT_INTERVAL) {
      // Ensure minimum time between reconnection attempts
      const delay = this.MIN_RECONNECT_INTERVAL - timeSinceLastAttempt;
      this.reconnectTimeout = setTimeout(() => this.attemptReconnect(), delay);
      return;
    }
    
    this.reconnectAttempts++;
    const backoffTime = Math.min(
      this.MIN_RECONNECT_INTERVAL * Math.pow(2, this.reconnectAttempts - 1),
      this.MAX_RECONNECT_INTERVAL
    );
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      this.initialize();
    }, backoffTime);
  }

  private notifyConnectionStatus(connected: boolean, mode?: 'websocket' | 'fallback'): void {
    const listeners = this.eventListeners.get('CONNECTION_STATUS');
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback({ connected, mode: mode || 'websocket' });
        } catch (error) {
          logError(error as Error, 'Error in connection status callback', {
            connected,
            mode
          });
        }
      });
    }
  }

  private setupFallbackMechanism(): void {
    logError(
      new Error('WebSocket connection failed'),
      'Switching to fallback mechanism',
      { reconnectAttempts: this.reconnectAttempts }
    );
    this.notifyConnectionStatus(false, 'fallback');
  }
}

const websocketService = new WebSocketService();
export default websocketService; 