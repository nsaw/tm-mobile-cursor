import { tapConsole, checkNavigationContext } from './validation';

declare const console: any;

export function startRuntimeValidator() {
  tapConsole();
  checkNavigationContext();
  console.log('[✅ Runtime Validator] Initialized.');
} 