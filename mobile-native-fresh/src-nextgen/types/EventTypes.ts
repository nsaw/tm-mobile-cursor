export interface BaseEvent {
  id: string;
  timestamp: Date;
  type: string;
  source: string;
}

export interface UserEvent extends BaseEvent {
  type: 'user_action';
  userId: string;
  action: string;
  metadata: Record<string, unknown>;
}

export interface SystemEvent extends BaseEvent {
  type: 'system_event';
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  context: Record<string, unknown>;
}

export interface NavigationEvent extends BaseEvent {
  type: 'navigation';
  from: string;
  to: string;
  params?: Record<string, unknown>;
}

export interface ErrorEvent extends BaseEvent {
  type: 'error';
  error: Error;
  stack?: string;
  context?: Record<string, unknown>;
}

export interface PerformanceEvent extends BaseEvent {
  type: 'performance';
  metric: string;
  value: number;
  unit: string;
}

export interface AnalyticsEvent extends BaseEvent {
  type: 'analytics';
  eventName: string;
  properties: Record<string, unknown>;
  userId?: string;
}

export type AppEvent = 
  | UserEvent 
  | SystemEvent 
  | NavigationEvent 
  | ErrorEvent 
  | PerformanceEvent 
  | AnalyticsEvent;

export interface EventHandler<T extends AppEvent = AppEvent> {
  (event: T): void | Promise<void>;
}

export interface EventListener {
  eventType: string;
  handler: EventHandler;
  priority?: number;
}

export interface EventBus {
  subscribe<T extends AppEvent>(eventType: string, handler: EventHandler<T>): () => void;
  publish<T extends AppEvent>(event: T): void;
  unsubscribe(eventType: string, handler: EventHandler): void;
} 