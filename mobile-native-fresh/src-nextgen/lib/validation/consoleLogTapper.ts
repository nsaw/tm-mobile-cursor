declare const console: any;

export function tapConsole() {
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    if (args.join(' ').includes('ERROR') || args.join(' ').includes('Exception')) {
      // Log error but don't use fetch in React Native context
      console.warn('[Runtime Validator] Error detected:', args);
    }
    originalLog(...args);
  };
} 