// Tree Shaking — Remove unused exports and dead utilities
// Removed unused: logDevState, printMemoryStats

// Only export functions that are actually used
export const logPerformance = (metric: string, value: number): void => {
  console.log(`[PERF] ${metric}: ${value}`);
};

export const logError = (error: Error, context?: string): void => {
  console.error(`[ERROR] ${context || 'Unknown'}:`, error.message);
};

export const logInfo = (message: string): void => {
  console.log(`[INFO] ${message}`);
};

// Tree-shakable utility functions
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatTime = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
};

// Side-effect free module exports for better tree shaking
export default {
  logPerformance,
  logError,
  logInfo,
  formatBytes,
  formatTime,
}; 