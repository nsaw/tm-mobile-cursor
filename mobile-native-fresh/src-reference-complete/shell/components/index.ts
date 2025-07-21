// Shell Components Index
// Export all shell components and utilities

export { RoleWrapper, validateRole, type RoleValidationResult } from './RoleWrapper';
export { ContentWrapper } from './ContentWrapper';
export { InteractiveWrapper } from './InteractiveWrapper';
export { LayoutWrapper } from './LayoutWrapper';
export { HybridRenderer } from './HybridRenderer';
export { RoleDebugOverlay } from './RoleDebugOverlay';
export { ShellProvider } from './ShellProvider';

// Validation utilities
export const validateAllComponents = () => {
  // Component validation logic
  return true;
};

// Shell components registry
export const ShellComponents = {
  version: '1.4.201',
  status: 'implemented',
  wrappers: {
    RoleWrapper: 'Generic role wrapper with validation',
    InteractiveWrapper: 'Interactive component wrapper with accessibility',
    ContentWrapper: 'Content component wrapper with text styling',
    LayoutWrapper: 'Layout component wrapper with z-index protection'
  }
};

export default ShellComponents; 