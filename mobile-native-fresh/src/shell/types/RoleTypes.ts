import { UILayoutRole, UIContentRole, UIInteractiveRole } from '../../types/roles';

// Shell-specific role type that's distinct from React Native's Role
export type ShellRole = UILayoutRole | UIContentRole | UIInteractiveRole;

export type RoleType = 'layout' | 'content' | 'interactive';

export interface RoleDefinition {
  name: ShellRole;
  type: RoleType;
  accessibilityRole?: string;
  props?: Record<string, any>;
}

// Type guards for shell roles
export function isShellRole(role: string): role is ShellRole {
  return isLayoutRole(role) || isContentRole(role) || isInteractiveRole(role);
}

export function isLayoutRole(role: string): role is UILayoutRole {
  return ['card', 'section', 'header', 'footer', 'navigation', 'modal', 'container'].includes(role);
}

export function isContentRole(role: string): role is UIContentRole {
  return ['heading', 'body', 'caption', 'label', 'button-text', 'link-text'].includes(role);
}

export function isInteractiveRole(role: string): role is UIInteractiveRole {
  return [
    'button-nav-primary', 'button-nav-secondary', 'card-as-nav', 'link-nav',
    'button-action', 'button-function', 'input', 'toggle', 'slider',
    'chip', 'badge', 'tag'
  ].includes(role);
} 