export interface BaseEvent {
  id: string;
  timestamp: string;
  type: string;
  source: string;
}

export interface UserEvent extends BaseEvent {
  type: 'user_action';
  userId: string;
  action: string;
  data?: Record<string, any>;
}

export interface NavigationEvent extends BaseEvent {
  type: 'navigation';
  from: string;
  to: string;
  params?: Record<string, any>;
}

export interface ErrorEvent extends BaseEvent {
  type: 'error';
  error: string;
  stack?: string;
  componentStack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceEvent extends BaseEvent {
  type: 'performance';
  metric: string;
  value: number;
  unit: string;
  context?: Record<string, any>;
}

export interface ApiEvent extends BaseEvent {
  type: 'api';
  method: string;
  url: string;
  status: number;
  duration: number;
  success: boolean;
}

export interface AppEvent extends BaseEvent {
  type: 'app';
  action: 'launch' | 'background' | 'foreground' | 'close';
  sessionId: string;
}

export type Event = UserEvent | NavigationEvent | ErrorEvent | PerformanceEvent | ApiEvent | AppEvent;

export interface EventHandler<T extends Event = Event> {
  (event: T): void;
}

export interface EventEmitter {
  on<T extends Event>(type: T['type'], handler: EventHandler<T>): void;
  off<T extends Event>(type: T['type'], handler: EventHandler<T>): void;
  emit<T extends Event>(event: T): void;
  once<T extends Event>(type: T['type'], handler: EventHandler<T>): void;
} 