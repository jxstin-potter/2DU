import { Task } from './task';
import { Tag } from './tag';

export type WebSocketEventType = 
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_DELETED'
  | 'TAG_CREATED'
  | 'TAG_UPDATED'
  | 'TAG_DELETED'
  | 'CONNECTION_STATUS';

export interface TaskCreatedEvent {
  type: 'TASK_CREATED';
  data: Task;
}

export interface TaskUpdatedEvent {
  type: 'TASK_UPDATED';
  data: Task;
}

export interface TaskDeletedEvent {
  type: 'TASK_DELETED';
  data: { id: string };
}

export interface TagCreatedEvent {
  type: 'TAG_CREATED';
  data: Tag;
}

export interface TagUpdatedEvent {
  type: 'TAG_UPDATED';
  data: Tag;
}

export interface TagDeletedEvent {
  type: 'TAG_DELETED';
  data: { name: string };
}

export interface ConnectionStatusEvent {
  type: 'CONNECTION_STATUS';
  data: boolean;
}

export type WebSocketEvent = 
  | TaskCreatedEvent
  | TaskUpdatedEvent
  | TaskDeletedEvent
  | TagCreatedEvent
  | TagUpdatedEvent
  | TagDeletedEvent
  | ConnectionStatusEvent; 

export type WebSocketEventData = WebSocketEvent['data'];