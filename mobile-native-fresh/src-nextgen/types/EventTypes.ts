export interface BaseEvent {
  id: string;
  type: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface UserEvent extends BaseEvent {
  type: 'user_action' | 'user_preference' | 'user_error';
  action: string;
  target?: string;
  value?: any;
}

export interface NavigationEvent extends BaseEvent {
  type: 'navigation';
  from: string;
  to: string;
  method: 'push' | 'pop' | 'replace' | 'reset';
}

export interface PerformanceEvent extends BaseEvent {
  type: 'performance';
  metric: string;
  value: number;
  unit: string;
  context?: string;
}

export interface ErrorEvent extends BaseEvent {
  type: 'error';
  error: {
    message: string;
    stack?: string;
    code?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  handled: boolean;
}

export type AppEvent = UserEvent | NavigationEvent | PerformanceEvent | ErrorEvent;

export interface EventHandler<T extends AppEvent = AppEvent> {
  (event: T): void | Promise<void>;
}

export interface EventEmitter {
  on<T extends AppEvent>(type: T['type'], handler: EventHandler<T>): void;
  off<T extends AppEvent>(type: T['type'], handler: EventHandler<T>): void;
  emit<T extends AppEvent>(event: T): void;
  once<T extends AppEvent>(type: T['type'], handler: EventHandler<T>): void;
} 