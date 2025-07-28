declare const global: any;
declare const console: any;

export function checkNavigationContext() {
  try {
    const route = global?.navigation?.getCurrentRoute?.();
    if (!route || !route.name) {
      // Don't throw error, just log that context isn't ready yet
      console.log('[Runtime Validator] Navigation context not ready yet - this is normal during app startup');
      return;
    }
    console.log('[Runtime Validator] Navigation context available:', route.name);
  } catch {
    // Log error but don't use fetch in React Native context
    console.log('[Runtime Validator] Navigation context check skipped - context not initialized yet');
  }
} 