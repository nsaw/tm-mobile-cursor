/**
 * Shell Architecture Index
 * 
 * This file serves as the main entry point for the hybrid renderer shell.
 * It exports all shell components, utilities, and contracts for the nextgen architecture.
 */

// Shell directory structure exports
export * from './wrappers';
export * from './contracts';
export * from './navigation';
export * from './mounts';
export * from './validation';

// Shell configuration
export const SHELL_CONFIG = {
  version: '1.4.200',
  architecture: 'hybrid-renderer',
  environment: 'nextgen',
  validation: {
    enabled: true,
    strict: true,
    runtime: true
  }
};

// Shell initialization
export const initializeShell = (): {
  status: string;
  timestamp: string;
  config: typeof SHELL_CONFIG;
} => {
  console.log('🔧 Initializing Hybrid Renderer Shell...');
  console.log(`Version: ${SHELL_CONFIG.version}`);
  console.log(`Architecture: ${SHELL_CONFIG.architecture}`);
  console.log(`Environment: ${SHELL_CONFIG.environment}`);
  
  return {
    status: 'initialized',
    timestamp: new Date().toISOString(),
    config: SHELL_CONFIG
  };
}; 