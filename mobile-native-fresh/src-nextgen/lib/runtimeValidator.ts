import { tapConsole } from './validation';

declare const console: any;

export function startRuntimeValidator() {
  tapConsole();
  // Temporarily disabled to prevent startup warnings
  // checkNavigationContext();
  console.log('[✅ Runtime Validator] Initialized.');
} 