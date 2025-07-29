import { useMemo } from 'react';

import { AccessibilityProps, AccessibilityRole, AccessibilityState, useAccessibility } from './useAccessibility';

export interface UseAccessibilityPropsOptions {
  role?: AccessibilityRole;
  label?: string;
  hint?: string;
  state?: AccessibilityState;
  value?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
  actions?: Array<{
    name: string;
    label?: string;
  }>;
  onAction?: (actionName: string) => void;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
}

export const useAccessibilityProps = (options: UseAccessibilityPropsOptions = {}): AccessibilityProps => {
  const { isScreenReaderEnabled } = useAccessibility();

  return useMemo(() => {
    const {
      role,
      label,
      hint,
      state,
      value,
      actions,
      onAction,
      importantForAccessibility = 'auto',
    } = options;

    const props: AccessibilityProps = {
      accessible: true, // Default to true, will be adjusted based on conditions
      importantForAccessibility,
    };

    if (label) {
      props.accessibilityLabel = label;
    }

    if (hint) {
      props.accessibilityHint = hint;
    }

    if (role) {
      props.accessibilityRole = role;
    }

    if (state) {
      props.accessibilityState = state;
    }

    if (value) {
      props.accessibilityValue = value;
    }

    if (actions && actions.length > 0) {
      props.accessibilityActions = actions;
    }

    if (onAction) {
      props.onAccessibilityAction = (event) => {
        onAction(event.nativeEvent.actionName);
      };
    }

    // Only apply accessibility props if screen reader is enabled or explicitly requested
    if (!isScreenReaderEnabled && importantForAccessibility === 'auto') {
      props.accessible = false;
    }

    return props;
  }, [isScreenReaderEnabled, options]);
}; 