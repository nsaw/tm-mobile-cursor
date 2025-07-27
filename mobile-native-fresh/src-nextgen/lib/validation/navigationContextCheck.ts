declare const global: any;

export function checkNavigationContext() {
  try {
    const route = global?.navigation?.getCurrentRoute?.();
    if (!route || !route.name) {
      throw new Error('SlotBridge missing navigation context');
    }
  } catch (err) {
    // Log error but don't use fetch in React Native context
    console.warn('Navigation context check failed:', err);
  }
} 