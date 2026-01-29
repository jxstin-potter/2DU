import { WebSocketEventType } from '../types/websocket';
type EventCallback = (data: any) => void;
declare class WebSocketService {
    private ws;
    private eventListeners;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectTimeout;
    private isConnecting;
    private lastConnectionAttempt;
    private readonly MIN_RECONNECT_INTERVAL;
    private readonly MAX_RECONNECT_INTERVAL;
    private readonly WS_URL;
    initialize(): void;
    private handleConnectionError;
    disconnect(): void;
    subscribe(eventType: WebSocketEventType, callback: EventCallback): () => void;
    private handleOpen;
    private handleClose;
    private handleError;
    private handleMessage;
    private attemptReconnect;
    private notifyConnectionStatus;
    private setupFallbackMechanism;
}
declare const websocketService: WebSocketService;
export default websocketService;
