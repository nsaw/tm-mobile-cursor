import React from 'react';
import { View, TouchableOpacity, AccessibilityRole, Role } from 'react-native';

import { usePerformanceMonitor } from '../utils/PerformanceMonitor';

interface AutoRoleViewProps {
  children: React.ReactNode;
  layoutRole?: string;
  style?: any;
  onPress?: () => void;
  accessibilityRole?: AccessibilityRole;
  accessible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  role?: Role;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaHidden?: boolean;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  ariaChecked?: boolean;
  ariaSelected?: boolean;
  ariaDisabled?: boolean;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  ariaLive?: 'off' | 'polite' | 'assertive';
  ariaAtomic?: boolean;
  ariaRelevant?: string;
  ariaBusy?: boolean;
  ariaControls?: string;
  ariaOwns?: string;
  ariaLabelledBy?: string;
  // Performance monitoring props
  enablePerformanceMonitoring?: boolean;
  componentName?: string;
  // Error boundary props
  errorBoundary?: boolean;
  fallback?: React.ComponentType<{ error?: Error }>;
  // Validation props
  validateProps?: boolean;
  strictMode?: boolean;
}

export const AutoRoleView: React.FC<AutoRoleViewProps> = ({
  children,
  layoutRole: _layoutRole, // eslint-disable-line no-unused-vars
  style,
  onPress,
  accessibilityRole,
  accessible,
  accessibilityLabel,
  testID,
  role,
  ariaLabel,
  ariaDescribedBy,
  ariaHidden,
  ariaExpanded,
  ariaPressed,
  ariaChecked,
  ariaSelected,
  ariaDisabled,
  ariaRequired,
  ariaInvalid,
  ariaLive,
  ariaAtomic,
  ariaRelevant,
  ariaBusy,
  ariaControls,
  ariaOwns,
  ariaLabelledBy,
  enablePerformanceMonitoring = false,
  componentName = 'AutoRoleView',
  errorBoundary = false,
  fallback,
  validateProps = false,
  strictMode = false,
  ...props
}) => {
  // Prop validation in strict mode
  if (validateProps || strictMode) {
    if (!children) {
      console.warn('AutoRoleView: children prop is required');
    }
    if (accessible && !accessibilityLabel) {
      console.warn('AutoRoleView: accessibilityLabel is required when accessible is true');
    }
  }

  // Performance monitoring
  const { recordComponentRender } = usePerformanceMonitor();
  React.useEffect(() => {
    if (enablePerformanceMonitoring) {
      const startTime = Date.now();
      const cleanup = recordComponentRender(componentName, 'nextgen')(Date.now() - startTime);
      return cleanup;
    }
  }, [enablePerformanceMonitoring, componentName, recordComponentRender]);

  // Error boundary wrapper
  if (errorBoundary && fallback) {
    return React.createElement(fallback, { error: undefined });
  }

  const accessibilityProps = {
    accessible,
    accessibilityRole,
    accessibilityLabel,
    testID,
    role,
    ariaLabel,
    ariaDescribedBy,
    ariaHidden,
    ariaExpanded,
    ariaPressed,
    ariaChecked,
    ariaSelected,
    ariaDisabled,
    ariaRequired,
    ariaInvalid,
    ariaLive,
    ariaAtomic,
    ariaRelevant,
    ariaBusy,
    ariaControls,
    ariaOwns,
    ariaLabelledBy,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        {...accessibilityProps}
        style={style}
        onPress={onPress}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      {...accessibilityProps}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
};
