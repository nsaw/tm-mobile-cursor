import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEnvironment } from '../hooks/useEnvironment';

interface EnvironmentIndicatorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  visible?: boolean;
  onToggle?: () => void;
}

export const EnvironmentIndicator: React.FC<EnvironmentIndicatorProps> = ({
  position = 'top-right',
  visible = true,
  onToggle,
}) => {
  const { currentEnvironment, isDevelopment } = useEnvironment();

  // Only show in development mode
  if (!isDevelopment || !visible) {
    return null;
  }

  const getPositionStyle = () => {
    switch (position) {
      case 'top-left':
        return { top: 50, left: 10 };
      case 'top-right':
        return { top: 50, right: 10 };
      case 'bottom-left':
        return { bottom: 50, left: 10 };
      case 'bottom-right':
        return { bottom: 50, right: 10 };
      default:
        return { top: 50, right: 10 };
    }
  };

  const getEnvironmentColor = () => {
    switch (currentEnvironment) {
      case 'legacy':
        return '#FF6B35'; // Orange for legacy
      case 'nextgen':
        return '#4ECDC4'; // Teal for nextgen
      default:
        return '#95A5A6'; // Gray for unknown
    }
  };

  const getEnvironmentLabel = () => {
    switch (currentEnvironment) {
      case 'legacy':
        return 'LEGACY';
      case 'nextgen':
        return 'NEXTGEN';
      default:
        return 'UNKNOWN';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, getPositionStyle()]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.indicator, { backgroundColor: getEnvironmentColor() }]}>
        <Text style={styles.text}>{getEnvironmentLabel()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  indicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    opacity: 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EnvironmentIndicator; 