export interface RoleDefinition {
  name: string;
  type: 'container' | 'button' | 'text' | 'image' | 'input';
  accessibilityRole?: string;
  props?: Record<string, any>;
}

export const defaultRoles: RoleDefinition[] = [
  {
    name: 'container',
    type: 'container',
    accessibilityRole: 'none'
  },
  {
    name: 'button',
    type: 'button',
    accessibilityRole: 'button'
  }
]; 