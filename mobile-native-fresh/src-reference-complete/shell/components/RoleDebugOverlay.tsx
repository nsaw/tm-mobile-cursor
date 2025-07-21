import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

interface RoleDebugOverlayProps {
  enabled?: boolean;
  showRoleLabels?: boolean;
  showZIndex?: boolean;
  showLayoutBounds?: boolean;
}

interface RoleInfo {
  id: string;
  role: string;
  zIndex?: number;
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const RoleDebugOverlay: React.FC<RoleDebugOverlayProps> = ({
  enabled = false,
  showRoleLabels = true,
  showZIndex = true,
  showLayoutBounds = true,
}) => {
  const { tokens: designTokens } = useTheme();
  const [roleInfo, setRoleInfo] = useState<RoleInfo[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (enabled) {
      setIsVisible(true);
      // Simulate collecting role information
      const mockRoleInfo: RoleInfo[] = [
        { id: 'button-1', role: 'button-action', zIndex: 1 },
        { id: 'text-1', role: 'text-display', zIndex: 0 },
        { id: 'chip-1', role: 'chip-select', zIndex: 2 },
        { id: 'header-1', role: 'header-navigation', zIndex: 10 },
        { id: 'nav-1', role: 'navigation', zIndex: 100 },
      ];
      setRoleInfo(mockRoleInfo);
    } else {
      setIsVisible(false);
    }
  }, [enabled]);

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      {/* Debug Controls */}
      <View style={[styles.debugPanel, { backgroundColor: designTokens.colors.surface }]}>
        <Text style={[styles.debugTitle, { color: designTokens.colors.text }]}>
          Role Debug Overlay
        </Text>
        
        <View style={styles.debugControls}>
          <TouchableOpacity
            style={[styles.debugButton, { backgroundColor: designTokens.colors.accent }]}
            onPress={() => setIsVisible(false)}
          >
            <Text style={[styles.debugButtonText, { color: designTokens.colors.buttonText }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Role Highlights */}
      {roleInfo.map((info) => (
        <View
          key={info.id}
          style={[
            styles.roleHighlight,
            {
              borderColor: getRoleColor(info.role),
              zIndex: info.zIndex || 0,
            },
          ]}
        >
          {showRoleLabels && (
            <View style={[styles.roleLabel, { backgroundColor: getRoleColor(info.role) }]}>
              <Text style={styles.roleLabelText}>
                {info.role}
              </Text>
            </View>
          )}
          
          {showZIndex && info.zIndex !== undefined && (
            <View style={[styles.zIndexLabel, { backgroundColor: designTokens.colors.accent }]}>
              <Text style={styles.zIndexLabelText}>
                z:{info.zIndex}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const getRoleColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    'button-action': '#FF6B6B',
    'text-display': '#4ECDC4',
    'chip-select': '#45B7D1',
    'header-navigation': '#96CEB4',
    'navigation': '#FFEAA7',
    'text-heading': '#DDA0DD',
    'text-label': '#98D8C8',
    'text-caption': '#F7DC6F',
  };
  return colorMap[role] || '#CCCCCC';
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  debugPanel: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugControls: {
    flexDirection: 'row',
    gap: 8,
  },
  debugButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  debugButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  roleHighlight: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  roleLabel: {
    position: 'absolute',
    top: -20,
    left: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  zIndexLabel: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  zIndexLabelText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
});

// Hook for toggling debug overlay
export const useRoleDebug = () => {
  const [debugEnabled, setDebugEnabled] = useState(false);

  const toggleDebug = () => setDebugEnabled(!debugEnabled);
  const enableDebug = () => setDebugEnabled(true);
  const disableDebug = () => setDebugEnabled(false);

  return {
    debugEnabled,
    toggleDebug,
    enableDebug,
    disableDebug,
  };
}; 