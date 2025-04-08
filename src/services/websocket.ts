import { Task, Tag } from '../types';
import { store } from '../store';
import { addTodo, updateTodo, deleteTodo } from '../store/slices/todoSlice';
import { queryClient } from './queryClient';
import { 
  WebSocketEventType, 
  WebSocketEvent, 
  WebSocketEventData,
  TaskCreatedEvent,
  TaskUpdatedEvent,
  TaskDeletedEvent,
  ConnectionStatusEvent
} from '../types/websocket';

type EventCallback = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventHandlers: Map<WebSocketEventType, Set<EventCallback>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000; // Start with 1 second
  private isConnecting = false;
  private isInitialized = false;

  constructor() {
    // Don't auto-connect in constructor, wait for explicit initialization
  }

  public initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.connect();
  }

  private connect() {
    if (this.isConnecting) return;
    this.isConnecting = true;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('No auth token available for WebSocket connection');
      this.isConnecting = false;
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://api.2du.app/ws';
    this.ws = new WebSocket(`${wsUrl}?token=${token}`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.reconnectTimeout = 1000;
      this.isConnecting = false;
      
      // Notify connection status
      this.notifyConnectionStatus(true);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnecting = false;
      
      // Notify connection status
      this.notifyConnectionStatus(false);
      
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnecting = false;
      
      // Notify connection status
      this.notifyConnectionStatus(false);
    };

    this.ws.onmessage = (event) => {
      try {
        const wsEvent: WebSocketEvent = JSON.parse(event.data);
        this.handleEvent(wsEvent);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  private notifyConnectionStatus(connected: boolean) {
    const event: ConnectionStatusEvent = {
      type: 'CONNECTION_STATUS',
      data: connected
    };
    this.handleEvent(event);
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.reconnectTimeout *= 2; // Exponential backoff

    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect();
    }, this.reconnectTimeout);
  }

  private handleEvent(event: WebSocketEvent) {
    // Handle event with Redux store
    switch (event.type) {
      case 'TASK_CREATED': {
        const taskEvent = event as TaskCreatedEvent;
        store.dispatch(addTodo(taskEvent.data));
        // Invalidate React Query cache to refetch data
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        break;
      }
      case 'TASK_UPDATED': {
        const taskEvent = event as TaskUpdatedEvent;
        store.dispatch(updateTodo(taskEvent.data));
        // Invalidate React Query cache to refetch data
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        break;
      }
      case 'TASK_DELETED': {
        const taskEvent = event as TaskDeletedEvent;
        store.dispatch(deleteTodo(taskEvent.data.id));
        // Invalidate React Query cache to refetch data
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        break;
      }
      // Handle other event types as needed
    }

    // Also call any registered callbacks
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach(callback => callback(event.data));
    }
  }

  public subscribe(eventType: WebSocketEventType, callback: EventCallback) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)?.add(callback);

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(eventType)?.delete(callback);
    };
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isInitialized = false;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 