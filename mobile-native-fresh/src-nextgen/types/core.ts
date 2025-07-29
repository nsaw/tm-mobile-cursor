// Core type definitions for the nextgen system

// ============================================================================
// Component Types
// ============================================================================

// Base component props interface
export interface BaseComponentProps {
  id?: string;
  className?: string;
  style?: any;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: any;
  accessibilityValue?: any;
  accessibilityActions?: any[];
  accessibilityElementsHidden?: boolean;
  accessibilityViewIsModal?: boolean;
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
  accessibilityIgnoresInvertColors?: boolean;
  accessibilityImportantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  accessibilityTraits?: string | string[];
  accessibilityComponentType?: 'none' | 'button' | 'radiobutton_checked' | 'radiobutton_unchecked';
}

// Component role types
export type ComponentRole = 
  | 'container'
  | 'button'
  | 'text'
  | 'image'
  | 'input'
  | 'list'
  | 'listItem'
  | 'header'
  | 'footer'
  | 'navigation'
  | 'content'
  | 'overlay'
  | 'modal'
  | 'card'
  | 'form'
  | 'field'
  | 'label'
  | 'icon'
  | 'avatar'
  | 'badge'
  | 'chip'
  | 'divider'
  | 'spacer'
  | 'skeleton'
  | 'loading'
  | 'error'
  | 'empty'
  | 'custom';

// Component variant types
export type ComponentVariant = 
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info'
  | 'default'
  | 'custom';

// Component size types
export type ComponentSize = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';

// Component state types
export type ComponentState = 
  | 'default'
  | 'hover'
  | 'active'
  | 'focus'
  | 'disabled'
  | 'loading'
  | 'error'
  | 'success'
  | 'warning';

// ============================================================================
// Role Types
// ============================================================================

// Role configuration interface
export interface RoleConfig {
  name: string;
  description: string;
  componentType: ComponentRole;
  variants: ComponentVariant[];
  sizes: ComponentSize[];
  states: ComponentState[];
  props: Record<string, any>;
  styles: Record<string, any>;
  behaviors: string[];
  accessibility: {
    role: string;
    traits: string[];
    actions: string[];
    hints: string[];
  };
}

// Role type mapping
export interface RoleTypeMap {
  [key: string]: RoleConfig;
}

// Role context interface
export interface RoleContext {
  role: string;
  variant: ComponentVariant;
  size: ComponentSize;
  state: ComponentState;
  props: Record<string, any>;
  theme: ThemeConfig;
}

// ============================================================================
// Theme Types
// ============================================================================

// Color palette interface
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  disabled: string;
  overlay: string;
  shadow: string;
}

// Typography configuration interface
export interface TypographyConfig {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
    light: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    bold: string;
  };
}

// Spacing configuration interface
export interface SpacingConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

// Border radius configuration interface
export interface BorderRadiusConfig {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

// Shadow configuration interface
export interface ShadowConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// Theme configuration interface
export interface ThemeConfig {
  name: string;
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  borderRadius: BorderRadiusConfig;
  shadows: ShadowConfig;
  isDark: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

// Deep partial type utility
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Required fields type utility
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Optional fields type utility
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Pick fields type utility
export type PickFields<T, K extends keyof T> = Pick<T, K>;

// Omit fields type utility
export type OmitFields<T, K extends keyof T> = Omit<T, K>;

// Union to intersection type utility
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// Extract function return type utility
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract function parameters type utility
export type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// ============================================================================
// Event Types
// ============================================================================

// Base event interface
export interface BaseEvent {
  type: string;
  timestamp: number;
  source: string;
  target?: string;
  data?: any;
}

// Component event interface
export interface ComponentEvent extends BaseEvent {
  componentId: string;
  role: string;
  variant: ComponentVariant;
  size: ComponentSize;
  state: ComponentState;
  props: Record<string, any>;
}

// Theme change event interface
export interface ThemeChangeEvent extends BaseEvent {
  previousTheme: string;
  currentTheme: string;
  reason: 'user' | 'system' | 'auto';
}

// Validation event interface
export interface ValidationEvent extends BaseEvent {
  validationType: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: any;
}

// Performance event interface
export interface PerformanceEvent extends BaseEvent {
  metric: string;
  value: number;
  unit: string;
  threshold?: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

// ============================================================================
// Validation Types
// ============================================================================

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: any;
}

// Validation rule interface
export interface ValidationRule {
  name: string;
  validate: (value: any, context?: any) => ValidationResult;
  message?: string;
  severity?: 'error' | 'warning';
}

// Validation schema interface
export interface ValidationSchema {
  [key: string]: ValidationRule | ValidationSchema;
}

// ============================================================================
// Performance Types
// ============================================================================

// Performance metric interface
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  componentId?: string;
  role?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  state?: ComponentState;
}

// Performance threshold interface
export interface PerformanceThreshold {
  metric: string;
  warning: number;
  error: number;
  critical: number;
  unit: string;
}

// Performance report interface
export interface PerformanceReport {
  metrics: PerformanceMetric[];
  summary: {
    total: number;
    warnings: number;
    errors: number;
    critical: number;
  };
  timestamp: number;
  duration: number;
}

// ============================================================================
// Environment Types
// ============================================================================

// Environment configuration interface
export interface EnvironmentConfig {
  apiUrl: string;
  apiKey: string;
  environment: 'development' | 'staging' | 'production';
  debugMode: boolean;
  timeout: number;
  retryAttempts: number;
  cacheEnabled: boolean;
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
}

// Environment validation result interface
export interface EnvironmentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingKeys: string[];
  invalidValues: string[];
}

// ============================================================================
// Hook Types
// ============================================================================

// Hook result interface
export interface HookResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Hook options interface
export interface HookOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  retry?: number | boolean;
  retryDelay?: number;
  staleTime?: number;
  cacheTime?: number;
}

// ============================================================================
// Context Types
// ============================================================================

// Theme context interface
export interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (themeName: string) => Promise<void>;
  toggleTheme: () => Promise<void>;
  availableThemes: string[];
  isDark: boolean;
}

// Role context interface
export interface RoleContextType {
  role: string;
  variant: ComponentVariant;
  size: ComponentSize;
  state: ComponentState;
  props: Record<string, any>;
  updateRole: (updates: Partial<RoleContext>) => void;
}

// Environment context interface
export interface EnvironmentContextType {
  config: EnvironmentConfig;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  reloadConfig: () => Promise<void>;
}

// All types are exported inline above 