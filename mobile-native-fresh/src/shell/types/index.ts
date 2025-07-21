// Shell Types Index
// Type definitions for shell system

export type { ShellRole, RoleType, RoleDefinition } from './RoleTypes';
export { isShellRole, isLayoutRole, isContentRole, isInteractiveRole } from './RoleTypes';
export type { LayoutContract, LayoutConstraints, ZIndexContract, SafeFrameShell } from './LayoutTypes';
export type { NavigationContract, RouteDefinition } from './NavigationTypes';

// Shell system version and status
export const ShellTypes = {
  version: '1.4.200',
  status: 'initialized'
};

// Export shell types as they are created
export default ShellTypes; 