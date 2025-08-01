import { useMemo } from 'react';

export interface AccessibilityProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    busy?: boolean;
    expanded?: boolean;
  };
}

export function useAccessibility(options: {
  label?: string;
  hint?: string;
  role?: string;
  state?: AccessibilityProps['accessibilityState'];
} = {}): AccessibilityProps {
  return useMemo(() => ({
    accessible: true,
    accessibilityLabel: options.label,
    accessibilityHint: options.hint,
    accessibilityRole: options.role,
    accessibilityState: options.state,
  }), [options.label, options.hint, options.role, options.state]);
} 