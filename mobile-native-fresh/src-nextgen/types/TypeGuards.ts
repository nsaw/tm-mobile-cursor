import { User, Thoughtmark, Bin, Task } from './DataTypes';
import { ApiResponse, ApiError } from './ApiTypes';
import { AppState, AuthState, UIState } from './StateTypes';

export function isUser(obj: unknown): obj is User {
  const typedObj = obj as Record<string, unknown>;
  return Boolean(
    obj &&
    typeof obj === 'object' &&
    typeof typedObj.id === 'string' &&
    typeof typedObj.email === 'string' &&
    typeof typedObj.name === 'string' &&
    typeof typedObj.isPremium === 'boolean' &&
    typeof typedObj.createdAt === 'string' &&
    typeof typedObj.updatedAt === 'string'
  );
}

export function isThoughtmark(obj: unknown): obj is Thoughtmark {
  const typedObj = obj as Record<string, unknown>;
  return Boolean(
    obj &&
    typeof obj === 'object' &&
    typeof typedObj.id === 'string' &&
    typeof typedObj.title === 'string' &&
    typeof typedObj.content === 'string' &&
    Array.isArray(typedObj.tags) &&
    typeof typedObj.binId === 'string' &&
    typeof typedObj.createdAt === 'string' &&
    typeof typedObj.updatedAt === 'string' &&
    typeof typedObj.isArchived === 'boolean' &&
    typeof typedObj.isPinned === 'boolean'
  );
}

export function isBin(obj: unknown): obj is Bin {
  const typedObj = obj as Record<string, unknown>;
  return Boolean(
    obj &&
    typeof obj === 'object' &&
    typeof typedObj.id === 'string' &&
    typeof typedObj.name === 'string' &&
    typeof typedObj.color === 'string' &&
    typeof typedObj.thoughtmarkCount === 'number' &&
    typeof typedObj.createdAt === 'string' &&
    typeof typedObj.updatedAt === 'string' &&
    typeof typedObj.isDefault === 'boolean' &&
    typeof typedObj.sortOrder === 'number'
  );
}

export function isTask(obj: unknown): obj is Task {
  const typedObj = obj as Record<string, unknown>;
  return Boolean(
    obj &&
    typeof obj === 'object' &&
    typeof typedObj.id === 'string' &&
    typeof typedObj.title === 'string' &&
    typeof typedObj.isCompleted === 'boolean' &&
    typeof typedObj.priority === 'string' &&
    ['low', 'medium', 'high'].includes(typedObj.priority as string) &&
    typeof typedObj.createdAt === 'string' &&
    typeof typedObj.updatedAt === 'string'
  );
}

export function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
  const typedObj = obj as Record<string, unknown>;
  return Boolean(
    obj &&
    typeof obj === 'object' &&
    typeof typedObj.status === 'number' &&
    typeof typedObj.message === 'string' &&
    typeof typedObj.success === 'boolean' &&
    typeof typedObj.timestamp === 'string' &&
    'data' in obj
  );
}

export function isApiError(obj: unknown): obj is ApiError {
  const typedObj = obj as Record<string, unknown>;
  return Boolean(
    obj &&
    typeof obj === 'object' &&
    typeof typedObj.code === 'string' &&
    typeof typedObj.message === 'string' &&
    typeof typedObj.timestamp === 'string'
  );
}

export function isAppState(obj: unknown): obj is AppState {
  const typedObj = obj as Record<string, unknown>;
  return Boolean(
    obj &&
    typeof obj === 'object' &&
    ['legacy', 'nextgen'].includes(typedObj.currentEnvironment as string) &&
    typeof typedObj.isFirstLaunch === 'boolean' &&
    typeof typedObj.onboardingCompleted === 'boolean' &&
    ['light', 'dark', 'system'].includes(typedObj.theme as string) &&
    typeof typedObj.notifications === 'boolean' &&
    typeof typedObj.analytics === 'boolean' &&
    typeof typedObj.version === 'string' &&
    typeof typedObj.buildNumber === 'string'
  );
}

export function isAuthState(obj: unknown): obj is AuthState {
  const typedObj = obj as Record<string, unknown>;
  return Boolean(
    obj &&
    typeof obj === 'object' &&
    (typedObj.user === null || isUser(typedObj.user)) &&
    typeof typedObj.isAuthenticated === 'boolean' &&
    typeof typedObj.isLoading === 'boolean' &&
    (typedObj.error === null || typeof typedObj.error === 'string') &&
    (typedObj.token === null || typeof typedObj.token === 'string') &&
    (typedObj.refreshToken === null || typeof typedObj.refreshToken === 'string') &&
    (typedObj.tokenExpiry === null || typeof typedObj.tokenExpiry === 'string')
  );
}

export function isUIState(obj: unknown): obj is UIState {
  const typedObj = obj as Record<string, unknown>;
  const modal = typedObj.modal as Record<string, unknown>;
  const sidebar = typedObj.sidebar as Record<string, unknown>;
  const search = typedObj.search as Record<string, unknown>;
  const toast = typedObj.toast as Record<string, unknown>;
  
  return Boolean(
    obj &&
    typeof obj === 'object' &&
    typeof typedObj.isLoading === 'boolean' &&
    (typedObj.error === null || typeof typedObj.error === 'string') &&
    modal &&
    typeof modal.isVisible === 'boolean' &&
    (modal.type === null || typeof modal.type === 'string') &&
    sidebar &&
    typeof sidebar.isOpen === 'boolean' &&
    search &&
    typeof search.query === 'string' &&
    typeof search.isActive === 'boolean' &&
    Array.isArray(search.results) &&
    toast &&
    typeof toast.isVisible === 'boolean' &&
    typeof toast.message === 'string' &&
    ['success', 'error', 'warning', 'info'].includes(toast.type as string) &&
    typeof toast.duration === 'number'
  );
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isArray<T>(value: unknown, itemGuard?: (item: unknown) => item is T): value is T[] {
  if (!Array.isArray(value)) return false;
  if (itemGuard) {
    return value.every(item => itemGuard(item));
  }
  return true;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isPromise<T>(value: unknown): value is Promise<T> {
  return Boolean(
    value && 
    typeof (value as Record<string, unknown>).then === 'function' && 
    typeof (value as Record<string, unknown>).catch === 'function'
  );
} 