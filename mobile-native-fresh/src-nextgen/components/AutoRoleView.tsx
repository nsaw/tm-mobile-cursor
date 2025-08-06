import React from 'react';
import { View, ViewProps, AccessibilityRole } from 'react-native';

export interface AutoRoleViewProps extends Omit<ViewProps, 'accessibilityRole'> {
  componentRole?: 'screen' | 'screen-container' | 'header-section' | 'avatar-container' | 'content' | 'interactive' | 'layout' | 'navigation' | 'form' | 'list' | 'card' | 'button' | 'text' | 'image' | 'input' | 'modal' | 'overlay' | 'toolbar' | 'tab' | 'tab-icon' | 'menu' | 'dialog' | 'alert' | 'progress' | 'status' | 'separator' | 'group' | 'section' | 'container' | 'wrapper' | 'item' | 'element' | 'feedback';
  interactiveRole?: string;
  contentRole?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: Record<string, unknown>;
  children: React.ReactNode;
}

export const AutoRoleView: React.FC<AutoRoleViewProps> = ({
  componentRole,
  interactiveRole,
  contentRole,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole: customAccessibilityRole,
  accessibilityState,
  children,
  style,
  ...props
}) => {
  const getAccessibilityRole = (): AccessibilityRole | undefined => {
    if (customAccessibilityRole) return customAccessibilityRole;
    
    switch (componentRole) {
      case 'screen':
      case 'screen-container':
        return 'none';
      case 'header-section':
        return 'header';
      case 'button':
        return 'button';
      case 'list':
        return 'list';
      case 'card':
        return 'none';
      case 'form':
        return 'none';
      case 'navigation':
        return 'none';
      case 'modal':
        return 'none';
      case 'dialog':
        return 'none';
      case 'alert':
        return 'alert';
      case 'progress':
        return 'progressbar';
      case 'status':
        return 'none';
      case 'tab':
        return 'tab';
      case 'tab-icon':
        return 'none';
      case 'menu':
        return 'menu';
      case 'toolbar':
        return 'none';
      case 'separator':
        return 'none';
      case 'group':
        return 'none';
      case 'section':
        return 'none';
      case 'container':
      case 'wrapper':
        return 'none';
      case 'item':
        return 'none';
      case 'element':
        return 'none';
      case 'feedback':
        return 'none';
      default:
        return 'none';
    }
  };

  const getAccessibilityLabel = (): string | undefined => {
    if (accessibilityLabel) return accessibilityLabel;
    
    if (interactiveRole) {
      return `${interactiveRole} ${componentRole || 'element'}`;
    }
    
    if (contentRole) {
      return `${contentRole} content`;
    }
    
    return componentRole ? `${componentRole} element` : undefined;
  };

  return (
    <View
      style={style}
      accessibilityRole={getAccessibilityRole()}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
      {...props}
    >
      {children}
    </View>
  );
}; 