import { User, Thoughtmark, Bin, Task } from './DataTypes';
import { ApiResponse, ApiError } from './ApiTypes';
import { AppState, AuthState, UIState } from './StateTypes';

export function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.isPremium === 'boolean' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  );
}

export function isThoughtmark(obj: any): obj is Thoughtmark {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.content === 'string' &&
    Array.isArray(obj.tags) &&
    typeof obj.binId === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string' &&
    typeof obj.isArchived === 'boolean' &&
    typeof obj.isPinned === 'boolean'
  );
}

export function isBin(obj: any): obj is Bin {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.color === 'string' &&
    typeof obj.thoughtmarkCount === 'number' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string' &&
    typeof obj.isDefault === 'boolean' &&
    typeof obj.sortOrder === 'number'
  );
}

export function isTask(obj: any): obj is Task {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.isCompleted === 'boolean' &&
    typeof obj.priority === 'string' &&
    ['low', 'medium', 'high'].includes(obj.priority) &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  );
}

export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.status === 'number' &&
    typeof obj.message === 'string' &&
    typeof obj.success === 'boolean' &&
    typeof obj.timestamp === 'string' &&
    'data' in obj
  );
}

export function isApiError(obj: any): obj is ApiError {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.code === 'string' &&
    typeof obj.message === 'string' &&
    typeof obj.timestamp === 'string'
  );
}

export function isAppState(obj: any): obj is AppState {
  return (
    obj &&
    typeof obj === 'object' &&
    ['legacy', 'nextgen'].includes(obj.currentEnvironment) &&
    typeof obj.isFirstLaunch === 'boolean' &&
    typeof obj.onboardingCompleted === 'boolean' &&
    ['light', 'dark', 'system'].includes(obj.theme) &&
    typeof obj.notifications === 'boolean' &&
    typeof obj.analytics === 'boolean' &&
    typeof obj.version === 'string' &&
    typeof obj.buildNumber === 'string'
  );
}

export function isAuthState(obj: any): obj is AuthState {
  return (
    obj &&
    typeof obj === 'object' &&
    (obj.user === null || isUser(obj.user)) &&
    typeof obj.isAuthenticated === 'boolean' &&
    typeof obj.isLoading === 'boolean' &&
    (obj.error === null || typeof obj.error === 'string') &&
    (obj.token === null || typeof obj.token === 'string') &&
    (obj.refreshToken === null || typeof obj.refreshToken === 'string') &&
    (obj.tokenExpiry === null || typeof obj.tokenExpiry === 'string')
  );
}

export function isUIState(obj: any): obj is UIState {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.isLoading === 'boolean' &&
    (obj.error === null || typeof obj.error === 'string') &&
    obj.modal &&
    typeof obj.modal.isVisible === 'boolean' &&
    (obj.modal.type === null || typeof obj.modal.type === 'string') &&
    obj.sidebar &&
    typeof obj.sidebar.isOpen === 'boolean' &&
    obj.search &&
    typeof obj.search.query === 'string' &&
    typeof obj.search.isActive === 'boolean' &&
    Array.isArray(obj.search.results) &&
    obj.toast &&
    typeof obj.toast.isVisible === 'boolean' &&
    typeof obj.toast.message === 'string' &&
    ['success', 'error', 'warning', 'info'].includes(obj.toast.type) &&
    typeof obj.toast.duration === 'number'
  );
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isArray<T>(value: any, itemGuard?: (item: any) => item is T): value is T[] {
  if (!Array.isArray(value)) return false;
  if (itemGuard) {
    return value.every(item => itemGuard(item));
  }
  return true;
}

export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isDate(value: any): value is Date {
  return value instanceof Date;
}

export function isPromise<T>(value: any): value is Promise<T> {
  return value && typeof value.then === 'function' && typeof value.catch === 'function';
} 