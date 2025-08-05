import React from 'react';
import { View, ViewProps, Text } from 'react-native';
import { RoleWrapper } from './RoleWrapper';
import { ComponentRole } from './types';

export type InteractiveRole = 
  | 'button-action'
  | 'button-navigation'
  | 'button-toggle'
  | 'input-text'
  | 'input-select'
  | 'link-external'
  | 'link-internal';

export type ContentRole = 
  | 'text-display'
  | 'text-label'
  | 'text-caption'
  | 'text-heading'
  | 'image-display'
  | 'image-icon'
  | 'list-item'
  | 'list-header';

export type LayoutRole = 
  | 'container-main'
  | 'container-section'
  | 'container-card'
  | 'container-modal'
  | 'spacer'
  | 'divider'
  | 'header-navigation'
  | 'navigation';

export type Role = InteractiveRole | ContentRole | LayoutRole;

export interface AutoRoleViewProps extends ViewProps {
  interactiveRole?: InteractiveRole;
  contentRole?: ContentRole;
  layoutRole?: LayoutRole;
  children: React.ReactNode;
  debug?: boolean;
  _style?: React.CSSProperties;
}

/**
 * AutoRoleView - Role-based wrapper component with debug overlay support
 * 
 * This component provides automatic role-based styling and accessibility
 * based on the assigned role. It supports interactive, content, and layout roles.
 * 
 * Debug Features:
 * - Visual overlay highlighting active roles
 * - Environment variable toggle: EXPO_PUBLIC_DEBUG_ROLES=true
 * - Runtime role assignment display
 * - Color-coded role identification
 * 
 * Usage:
 * <AutoRoleView interactiveRole="button-action">
 *   <TouchableOpacity accessibilityRole="button" accessible={true} accessibilityLabel="Button"><Text>Press Me</Text></TouchableOpacity>
 * </AutoRoleView>
 */
export const AutoRoleView: React.FC<AutoRoleViewProps> = ({
  interactiveRole,
  contentRole,
  layoutRole,
  children,
  _style,
  debug = false,
  ..._props
}) => {
  // Determine the primary role (interactive takes precedence)
  const primaryRole = interactiveRole || contentRole || layoutRole;
  
  // Map role to RoleWrapper component role
  const getRoleWrapperRole = (role?: Role): ComponentRole => {
    if (!role) return 'content';
    
    if (interactiveRole) return 'interactive';
    if (contentRole) return 'content';
    if (layoutRole) return 'layout';
    
    return 'content';
  };

  // Generate role-based styles
  const _roleStyles = getRoleStyles(primaryRole);
  
  // Generate accessibility props
  const _accessibilityProps = getAccessibilityProps(primaryRole);

  // Check for debug environment variable
  const debugEnabled = process.env.EXPO_PUBLIC_DEBUG_ROLES === 'true' || debug;

  return (
    <RoleWrapper
      role={getRoleWrapperRole(primaryRole)}
      config={{
        debug: debugEnabled,
        validation: true,
        priority: 1,
        protected: false
      }}
    >
      <View><Text>{children}</Text></View>
    </RoleWrapper>
  );
};

/**
 * Get role-based styles
 */
function getRoleStyles(role?: Role) {
  if (!role) return {};

  const baseStyles = {
    // Interactive roles
    'button-action': {
      cursor: 'pointer',
    },
    'button-navigation': {
      cursor: 'pointer',
    },
    'button-toggle': {
      cursor: 'pointer',
    },
    'input-text': {
      cursor: 'text',
    },
    'input-select': {
      cursor: 'pointer',
    },
    'link-external': {
      cursor: 'pointer',
    },
    'link-internal': {
      cursor: 'pointer',
    },
    
    // Content roles
    'text-display': {
      userSelect: 'text',
    },
    'text-label': {
      userSelect: 'none',
    },
    'text-caption': {
      userSelect: 'none',
    },
    'text-heading': {
      userSelect: 'none',
    },
    'image-display': {
      userSelect: 'none',
    },
    'image-icon': {
      userSelect: 'none',
    },
    'list-item': {
      userSelect: 'none',
    },
    'list-header': {
      userSelect: 'none',
    },
    
    // Layout roles
    'container-main': {
      flex: 1,
    },
    'container-section': {
      flex: 1,
    },
    'container-card': {
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    'container-modal': {
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    'spacer': {
      flex: 1,
    },
    'divider': {
      height: 1,
      backgroundColor: '#E5E5EA',
    },
    'header-navigation': {
      position: 'relative',
    },
    'navigation': {
      position: 'relative',
    },
  };

  return baseStyles[role] || {};
}

/**
 * Get accessibility props based on role
 */
function getAccessibilityProps(role?: Role) {
  if (!role) return {};

  const accessibilityProps = {
    // Interactive roles
    'button-action': {
      accessibilityRole: 'button',
      accessibilityHint: 'Double tap to activate',
    },
    'button-navigation': {
      accessibilityRole: 'button',
      accessibilityHint: 'Double tap to navigate',
    },
    'button-toggle': {
      accessibilityRole: 'button',
      accessibilityHint: 'Double tap to toggle',
    },
    'input-text': {
      accessibilityRole: 'text',
      accessibilityHint: 'Double tap to edit',
    },
    'input-select': {
      accessibilityRole: 'button',
      accessibilityHint: 'Double tap to select',
    },
    'link-external': {
      accessibilityRole: 'link',
      accessibilityHint: 'Double tap to open external link',
    },
    'link-internal': {
      accessibilityRole: 'link',
      accessibilityHint: 'Double tap to navigate',
    },
    
    // Content roles
    'text-display': {
      accessibilityRole: 'text',
    },
    'text-label': {
      accessibilityRole: 'text',
    },
    'text-caption': {
      accessibilityRole: 'text',
    },
    'text-heading': {
      accessibilityRole: 'header',
    },
    'image-display': {
      accessibilityRole: 'image',
    },
    'image-icon': {
      accessibilityRole: 'image',
    },
    'list-item': {
      accessibilityRole: 'button',
    },
    'list-header': {
      accessibilityRole: 'header',
    },
    
    // Layout roles
    'container-main': {
      accessibilityRole: 'main',
    },
    'container-section': {
      accessibilityRole: 'region',
    },
    'container-card': {
      accessibilityRole: 'button',
    },
    'container-modal': {
      accessibilityRole: 'dialog',
    },
    'spacer': {
      accessibilityRole: 'none',
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no',
    },
    'divider': {
      accessibilityRole: 'separator',
    },
    'header-navigation': {
      accessibilityRole: 'header',
    },
    'navigation': {
      accessibilityRole: 'navigation',
    },
  };

  return accessibilityProps[role] || {};
}

export default AutoRoleView; 