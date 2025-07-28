import React from 'react';
import { View, TouchableOpacity, StyleSheet, AccessibilityRole } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

interface AutoRoleViewProps {
  children: React.ReactNode;
  layoutRole?: string;
  style?: any;
  onPress?: () => void;
  accessibilityRole?: AccessibilityRole;
  accessible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  role?: string;
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
  role: _role, // eslint-disable-line no-unused-vars
  ariaLabel: _ariaLabel, // eslint-disable-line no-unused-vars
  ariaDescribedBy: _ariaDescribedBy, // eslint-disable-line no-unused-vars
  ariaHidden: _ariaHidden, // eslint-disable-line no-unused-vars
  ariaExpanded: _ariaExpanded, // eslint-disable-line no-unused-vars
  ariaPressed: _ariaPressed, // eslint-disable-line no-unused-vars
  ariaChecked: _ariaChecked, // eslint-disable-line no-unused-vars
  ariaSelected: _ariaSelected, // eslint-disable-line no-unused-vars
  ariaDisabled: _ariaDisabled, // eslint-disable-line no-unused-vars
  ariaRequired: _ariaRequired, // eslint-disable-line no-unused-vars
  ariaInvalid: _ariaInvalid, // eslint-disable-line no-unused-vars
  ariaLive: _ariaLive, // eslint-disable-line no-unused-vars
  ariaAtomic: _ariaAtomic, // eslint-disable-line no-unused-vars
  ariaRelevant: _ariaRelevant, // eslint-disable-line no-unused-vars
  ariaBusy: _ariaBusy, // eslint-disable-line no-unused-vars
  ariaControls: _ariaControls, // eslint-disable-line no-unused-vars
  ariaOwns: _ariaOwns, // eslint-disable-line no-unused-vars
  ariaLabelledBy: _ariaLabelledBy, // eslint-disable-line no-unused-vars
  ...props
}) => {
  // const { designTokens } = useTheme(); // Commented out as not used

  // Filter out React Native accessibility props
  const reactNativeAccessibilityProps = {
    accessible,
    accessibilityRole,
    accessibilityLabel,
    testID,
  };

  // Filter out non-React Native props for View/TouchableOpacity
  const viewProps = props;

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        {...reactNativeAccessibilityProps}
        {...viewProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[styles.container, style]}
      {...reactNativeAccessibilityProps}
      {...viewProps}
    >
      {children}
    </View>
  );
};

export const ActionButton: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
}> = ({ children, onPress, style, disabled }) => {
  const { designTokens } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        styles.actionButtonDynamic,
        {
          backgroundColor: designTokens.colors.primary,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel="Action button"
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Default container styles
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDynamic: {
    opacity: 1,
  },
}); 