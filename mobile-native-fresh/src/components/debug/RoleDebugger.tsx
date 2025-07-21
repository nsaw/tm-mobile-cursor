/**
 * 🔍 ROLE DEBUGGER - Visual Role Debugging Component
 * 
 * This component provides visual debugging for the bulletproof role system.
 * It shows role information, validation status, and style previews in development mode.
 * 
 * USAGE:
 * <RoleDebugger roleProps={props}>
 *   <YourComponent />
 * </RoleDebugger>
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

import { RoleProps, getRoleDebugInfo } from '../../types/roles';
import { validateRolePropsStrict } from '../../utils/roleValidation';

interface RoleDebuggerProps {
  roleProps: RoleProps;
  children: React.ReactNode;
  showDebugInfo?: boolean;
  showValidation?: boolean;
  showStylePreview?: boolean;
  debugStyle?: ViewStyle;
}

export const RoleDebugger: React.FC<RoleDebuggerProps> = ({
  roleProps,
  children,
  showDebugInfo = __DEV__,
  showValidation = __DEV__,
  showStylePreview = __DEV__,
  debugStyle,
}) => {
  // Only show debugging in development
  if (!__DEV__) {
    return <>{children}</>;
  }

  const debugInfo = getRoleDebugInfo(roleProps);
  const validation = validateRolePropsStrict(roleProps);

  const getDebugBorderColor = (): string => {
    if (!debugInfo.isValid) return '#ff4444'; // Red for invalid
    if (validation.warnings.length > 0) return '#ffaa00'; // Orange for warnings
    if (debugInfo.roleType === 'none') return '#888888'; // Gray for no role
    return '#44ff44'; // Green for valid
  };

  const getDebugBackgroundColor = (): string => {
    switch (debugInfo.roleType) {
      case 'content': return 'rgba(255, 255, 0, 0.1)'; // Yellow
      case 'layout': return 'rgba(0, 255, 255, 0.1)'; // Cyan
      case 'interactive': return 'rgba(255, 0, 255, 0.1)'; // Magenta
      default: return 'rgba(128, 128, 128, 0.1)'; // Gray
    }
  };

  const debugContainerStyle: ViewStyle = {
    borderWidth: 2,
    borderColor: getDebugBorderColor(),
    backgroundColor: getDebugBackgroundColor(),
    padding: 4,
    margin: 2,
    ...debugStyle,
  };

  const renderDebugInfo = () => {
    if (!showDebugInfo) return null;

    return (
      <View style={styles.debugInfoContainer}>
        <Text style={[styles.debugText, { color: getDebugBorderColor() }]}>
          🏷️ {debugInfo.roleType.toUpperCase()}: {debugInfo.roleValue || 'NONE'}
        </Text>
        {debugInfo.description && (
          <Text style={styles.debugDescription}>{debugInfo.description}</Text>
        )}
      </View>
    );
  };

  const renderValidation = () => {
    if (!showValidation) return null;

    return (
      <View style={styles.validationContainer}>
        {validation.errors.map((error, index) => (
          <Text key={index} style={styles.errorText}>
            ❌ {error}
          </Text>
        ))}
        {validation.warnings.map((warning, index) => (
          <Text key={index} style={styles.warningText}>
            ⚠️ {warning}
          </Text>
        ))}
      </View>
    );
  };

  const renderStylePreview = () => {
    if (!showStylePreview || debugInfo.roleType === 'none') return null;

    return (
      <View style={styles.stylePreviewContainer}>
        <Text style={styles.stylePreviewTitle}>Style Preview:</Text>
        <View style={styles.stylePreviewBox}>
          <Text style={styles.stylePreviewText}>
            {debugInfo.roleType === 'content' && 'Text styling applied'}
            {debugInfo.roleType === 'layout' && 'Layout spacing applied'}
            {debugInfo.roleType === 'interactive' && 'Interactive styling applied'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={debugContainerStyle}>
      {renderDebugInfo()}
      {renderValidation()}
      {renderStylePreview()}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  debugInfoContainer: {
    padding: 4,
    marginBottom: 4,
  },
  debugText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  debugDescription: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
  validationContainer: {
    padding: 4,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 8,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 8,
    color: '#ffaa00',
    fontWeight: 'bold',
  },
  stylePreviewContainer: {
    padding: 4,
    marginBottom: 4,
  },
  stylePreviewTitle: {
    fontSize: 8,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  stylePreviewBox: {
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  stylePreviewText: {
    fontSize: 8,
    color: '#666',
  },
});

export default RoleDebugger; 