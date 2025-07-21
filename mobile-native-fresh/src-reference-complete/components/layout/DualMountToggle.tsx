import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '../ui/Text';
import { AutoRoleView } from '../AutoRoleView';
import { toggleEnvironment, getCurrentEnvironment, addEnvironmentChangeCallback, removeEnvironmentChangeCallback } from '../../utils/dualMountToggle';

interface DualMountToggleProps {
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right';
  showLabel?: boolean;
  opacity?: number;
}

export const DualMountToggle: React.FC<DualMountToggleProps> = ({
  position = 'top-right',
  showLabel = true,
  opacity = 0.8,
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState<'legacy' | 'nextgen'>('legacy');
  const insets = useSafeAreaInsets();

  // Update local state when environment changes
  useEffect(() => {
    const updateEnvironment = () => {
      const env = getCurrentEnvironment();
      setCurrentEnvironment(env);
    };

    // Set initial environment
    updateEnvironment();

    // Add callback for environment changes
    addEnvironmentChangeCallback(updateEnvironment);

    // Cleanup callback on unmount
    return () => {
      removeEnvironmentChangeCallback(updateEnvironment);
    };
  }, []);

  const handleToggle = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    
    try {
      const result = await toggleEnvironment();
      
      if (result.success) {
        // Update local state immediately
        setCurrentEnvironment(result.currentEnvironment);
        
        Alert.alert(
          'Environment Switched',
          `Switched from ${result.previousEnvironment} to ${result.currentEnvironment}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Force app reload to apply new environment
                // In a real app, you might want to restart the app or reload the navigation
                console.log('Environment toggled successfully');
              }
            }
          ]
        );
      } else {
        Alert.alert('Toggle Failed', result.reason || 'Unknown error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle environment');
      console.error('Toggle error:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      zIndex: 1000,
    };

    switch (position) {
      case 'top-left':
        return {
          ...baseStyle,
          top: insets.top + 10,
          left: 10,
        };
      case 'top-right':
        return {
          ...baseStyle,
          top: insets.top + 10,
          right: 10,
        };
      case 'bottom-left':
        return {
          ...baseStyle,
          bottom: insets.bottom + 10,
          left: 10,
        };
      case 'bottom-right':
        return {
          ...baseStyle,
          bottom: insets.bottom + 10,
          right: 10,
        };
      case 'top-center':
        return {
          ...baseStyle,
          top: insets.top + 10,
          left: '50%' as any,
          transform: [{ translateX: -30 }], // Center the button (assuming 60px width)
        };
      default:
        return {
          ...baseStyle,
          top: insets.top + 10,
          right: 10,
        };
    }
  };

  return (
    <AutoRoleView layoutRole="container" style={[styles.container, getPositionStyle()]}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            opacity,
            backgroundColor: currentEnvironment === 'nextgen' ? '#4CAF50' : '#FF9800',
          }
        ]}
        onPress={handleToggle}
        disabled={isToggling}
        activeOpacity={0.7}
        accessibilityLabel={`Toggle to ${currentEnvironment === 'nextgen' ? 'legacy' : 'nextgen'} environment`}
        accessibilityRole="button"
        accessibilityState={{ disabled: isToggling }}
      >
        <View style={styles.content}>
          <View style={[styles.indicator, { backgroundColor: currentEnvironment === 'nextgen' ? '#2E7D32' : '#E65100' }]} />
          {showLabel && (
            <Text 
              variant="body" 
              size="sm" 
              style={styles.label}
              accessibilityLabel={`Current environment: ${currentEnvironment}`}
            >
              {currentEnvironment === 'nextgen' ? 'NEXT' : 'LEGACY'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
}); 