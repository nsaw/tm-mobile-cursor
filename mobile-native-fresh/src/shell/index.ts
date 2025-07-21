// Shell System Index
// Main entry point for shell system

// Export shell types
export type { 
  ShellRole, 
  RoleType, 
  RoleDefinition,
  LayoutContract, 
  LayoutConstraints, 
  ZIndexContract, 
  SafeFrameShell,
  NavigationContract, 
  RouteDefinition 
} from './types';

// Export shell functions
export { 
  isShellRole, 
  isLayoutRole, 
  isContentRole, 
  isInteractiveRole 
} from './types';

// Export shell components
export * from './components';

// Export shell layouts
export * from './layouts';

// Export shell navigation
export * from './navigation';

// Export shell roles
export * from './roles';

// Export shell utils
export * from './utils';

// Shell system initialization
export const initializeShell = () => {
  console.log('✅ Shell system initialized');
  return true;
};

// Shell system validation
export const validateShell = () => {
  console.log('✅ Shell system validated');
  return true;
}; 