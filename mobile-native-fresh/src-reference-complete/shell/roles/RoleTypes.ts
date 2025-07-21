export type RoleType = 'container' | 'button' | 'text' | 'image' | 'input';

export interface RoleProps {
  type: RoleType;
  children?: React.ReactNode;
  accessibilityRole?: string;
} 