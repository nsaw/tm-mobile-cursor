export type LayoutType = 'container' | 'wrapper' | 'grid' | 'flex';

export interface LayoutProps {
  type: LayoutType;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} 