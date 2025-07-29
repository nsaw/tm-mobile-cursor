/**
 * TypeGuards - Type guard functions for runtime type checking
 * Provides type-safe validation functions for the NextGen system
 */

import { typeValidator } from './TypeValidation';

// Data type guards
export function isUser(value: unknown): value is { id: string; name: string; email: string; age: number } {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isString(value.id) &&
    typeValidator.isString(value.name) &&
    typeValidator.isEmail(value.email) &&
    typeValidator.isNumber(value.age)
  );
}

export function isThoughtmark(value: unknown): value is { id: string; title: string; content: string; userId: string; createdAt: string } {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isString(value.id) &&
    typeValidator.isString(value.title) &&
    typeValidator.isString(value.content) &&
    typeValidator.isString(value.userId) &&
    typeValidator.isDateString(value.createdAt)
  );
}

export function isBin(value: unknown): value is { id: string; name: string; userId: string; thoughtmarkIds: string[] } {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isString(value.id) &&
    typeValidator.isString(value.name) &&
    typeValidator.isString(value.userId) &&
    typeValidator.isArray(value.thoughtmarkIds) &&
    value.thoughtmarkIds.every((id: unknown) => typeValidator.isString(id))
  );
}

export function isTask(value: unknown): value is { id: string; title: string; completed: boolean; priority: 'low' | 'medium' | 'high' } {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isString(value.id) &&
    typeValidator.isString(value.title) &&
    typeValidator.isBoolean(value.completed) &&
    typeValidator.isString(value.priority) &&
    ['low', 'medium', 'high'].includes(value.priority)
  );
}

// API type guards
export function isApiResponse<T>(value: unknown): value is { data: T; status: number; message?: string } {
  if (!typeValidator.isObject(value)) return false;
  return (
    'data' in value &&
    typeValidator.isNumber(value.status) &&
    (value.message === undefined || typeValidator.isString(value.message))
  );
}

export function isApiError(value: unknown): value is { error: string; status: number; details?: unknown } {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isString(value.error) &&
    typeValidator.isNumber(value.status)
  );
}

// State type guards
export function isAppState(value: unknown): value is { 
  theme: string; 
  environment: string; 
  isInitialized: boolean; 
  lastUpdated: string;
} {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isString(value.theme) &&
    typeValidator.isString(value.environment) &&
    typeValidator.isBoolean(value.isInitialized) &&
    typeValidator.isDateString(value.lastUpdated)
  );
}

export function isAuthState(value: unknown): value is { 
  isAuthenticated: boolean; 
  userId?: string; 
  token?: string; 
  expiresAt?: string;
} {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isBoolean(value.isAuthenticated) &&
    (value.userId === undefined || typeValidator.isString(value.userId)) &&
    (value.token === undefined || typeValidator.isString(value.token)) &&
    (value.expiresAt === undefined || typeValidator.isDateString(value.expiresAt))
  );
}

export function isUIState(value: unknown): value is { 
  isLoading: boolean; 
  error?: string; 
  modalOpen: boolean; 
  sidebarOpen: boolean;
} {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isBoolean(value.isLoading) &&
    (value.error === undefined || typeValidator.isString(value.error)) &&
    typeValidator.isBoolean(value.modalOpen) &&
    typeValidator.isBoolean(value.sidebarOpen)
  );
}

// Performance type guards
export function isPerformanceMetrics(value: unknown): value is {
  componentRenderTime: number;
  memoryUsage: number;
  timestamp: string;
} {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isNumber(value.componentRenderTime) &&
    typeValidator.isNumber(value.memoryUsage) &&
    typeValidator.isDateString(value.timestamp)
  );
}

export function isValidationResult(value: unknown): value is {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  duration: number;
} {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isBoolean(value.isValid) &&
    typeValidator.isArray(value.errors) &&
    value.errors.every((error: unknown) => typeValidator.isString(error)) &&
    typeValidator.isArray(value.warnings) &&
    value.warnings.every((warning: unknown) => typeValidator.isString(warning)) &&
    typeValidator.isNumber(value.duration)
  );
}

// Navigation type guards
export function isNavigationState(value: unknown): value is {
  currentRoute: string;
  params: Record<string, unknown>;
  history: string[];
} {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isString(value.currentRoute) &&
    typeValidator.isObject(value.params) &&
    typeValidator.isArray(value.history) &&
    value.history.every((route: unknown) => typeValidator.isString(route))
  );
}

// Theme type guards
export function isTheme(value: unknown): value is {
  name: string;
  colors: Record<string, string>;
  typography: Record<string, { fontSize: number; fontWeight: string }>;
} {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isString(value.name) &&
    typeValidator.isObject(value.colors) &&
    typeValidator.isObject(value.typography)
  );
}

// Accessibility type guards
export function isAccessibilityState(value: unknown): value is {
  isScreenReaderEnabled: boolean;
  isHighContrastEnabled: boolean;
  isReduceMotionEnabled: boolean;
  fontSize: number;
} {
  if (!typeValidator.isObject(value)) return false;
  return (
    typeValidator.isBoolean(value.isScreenReaderEnabled) &&
    typeValidator.isBoolean(value.isHighContrastEnabled) &&
    typeValidator.isBoolean(value.isReduceMotionEnabled) &&
    typeValidator.isNumber(value.fontSize)
  );
}

// Utility type guards
export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isPrimitive(value: unknown): value is string | number | boolean | null | undefined {
  return (
    typeValidator.isString(value) ||
    typeValidator.isNumber(value) ||
    typeValidator.isBoolean(value) ||
    typeValidator.isNull(value) ||
    typeValidator.isUndefined(value)
  );
}

export function isFunction(value: unknown): value is Function {
  return typeValidator.isFunction(value);
}

export function isAsyncFunction(value: unknown): value is (...args: unknown[]) => Promise<unknown> {
  return typeValidator.isFunction(value) && value.constructor.name === 'AsyncFunction';
}

// Array type guards
export function isStringArray(value: unknown): value is string[] {
  return typeValidator.isStringArray(value);
}

export function isNumberArray(value: unknown): value is number[] {
  return typeValidator.isNumberArray(value);
}

export function isObjectArray(value: unknown): value is Record<string, unknown>[] {
  return typeValidator.isObjectArray(value);
}

// Date type guards
export function isDate(value: unknown): value is Date {
  return typeValidator.isDate(value);
}

export function isDateString(value: unknown): value is string {
  return typeValidator.isDateString(value);
}

// Email and URL type guards
export function isEmail(value: unknown): value is string {
  return typeValidator.isEmail(value);
}

export function isURL(value: unknown): value is string {
  return typeValidator.isURL(value);
}

export function isUUID(value: unknown): value is string {
  return typeValidator.isUUID(value);
} 