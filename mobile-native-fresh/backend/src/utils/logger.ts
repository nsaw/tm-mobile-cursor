export const logger = {
  info: (message: string, meta?: unknown): void => {
    console.log(`[INFO] ${message}`, meta || '');
  },
  
  error: (message: string, meta?: unknown): void => {
    console.error(`[ERROR] ${message}`, meta || '');
  },
  
  warn: (message: string, meta?: unknown): void => {
    console.warn(`[WARN] ${message}`, meta || '');
  },
  
  debug: (message: string, meta?: unknown): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, meta || '');
    }
  },
}; 