/* Polyfill: TextDecoder for React Native */
if (typeof globalThis.TextDecoder === 'undefined') {
  const { TextDecoder } = require('text-encoding');
  globalThis.TextDecoder = TextDecoder;
}

if (typeof globalThis.TextEncoder === 'undefined') {
  const { TextEncoder } = require('text-encoding');
  globalThis.TextEncoder = TextEncoder;
}

// Also ensure they're available on global for older code
if (typeof global.TextDecoder === 'undefined') {
  const { TextDecoder } = require('text-encoding');
  global.TextDecoder = TextDecoder;
}

if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder } = require('text-encoding');
  global.TextEncoder = TextEncoder;
}

console.log('[Polyfill] TextDecoder/TextEncoder polyfills registered successfully'); 