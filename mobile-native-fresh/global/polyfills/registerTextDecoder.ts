/* Polyfill: TextDecoder for React Native */
console.log('[Polyfill] Starting TextDecoder/TextEncoder polyfill registration...');

try {
  if (typeof globalThis.TextDecoder === 'undefined') {
    console.log('[Polyfill] TextDecoder not found, applying polyfill...');
    const { TextDecoder } = require('text-encoding');
    globalThis.TextDecoder = TextDecoder;
    console.log('[Polyfill] TextDecoder polyfill applied to globalThis');
  } else {
    console.log('[Polyfill] TextDecoder already available on globalThis');
  }

  if (typeof globalThis.TextEncoder === 'undefined') {
    console.log('[Polyfill] TextEncoder not found, applying polyfill...');
    const { TextEncoder } = require('text-encoding');
    globalThis.TextEncoder = TextEncoder;
    console.log('[Polyfill] TextEncoder polyfill applied to globalThis');
  } else {
    console.log('[Polyfill] TextEncoder already available on globalThis');
  }

  // Also ensure they're available on global for older code
  if (typeof global.TextDecoder === 'undefined') {
    console.log('[Polyfill] TextDecoder not found on global, applying polyfill...');
    const { TextDecoder } = require('text-encoding');
    global.TextDecoder = TextDecoder;
    console.log('[Polyfill] TextDecoder polyfill applied to global');
  } else {
    console.log('[Polyfill] TextDecoder already available on global');
  }

  if (typeof global.TextEncoder === 'undefined') {
    console.log('[Polyfill] TextEncoder not found on global, applying polyfill...');
    const { TextEncoder } = require('text-encoding');
    global.TextEncoder = TextEncoder;
    console.log('[Polyfill] TextEncoder polyfill applied to global');
  } else {
    console.log('[Polyfill] TextEncoder already available on global');
  }

  // Test the polyfills
  try {
    const testDecoder = new globalThis.TextDecoder();
    const testEncoder = new globalThis.TextEncoder();
    console.log('[Polyfill] TextDecoder/TextEncoder polyfills registered successfully');
    console.log('[Polyfill] Test: TextDecoder instance created:', !!testDecoder);
    console.log('[Polyfill] Test: TextEncoder instance created:', !!testEncoder);
  } catch (testError) {
    console.error('[Polyfill] Error testing polyfills:', testError);
  }
} catch (error) {
  console.error('[Polyfill] Error applying TextDecoder/TextEncoder polyfills:', error);
  console.error('[Polyfill] Stack trace:', error.stack);
} 