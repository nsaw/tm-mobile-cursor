import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DualMountToggleProps {
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  showLabel?: boolean;
  opacity?: number;
}

export const DualMountToggle: React.FC<DualMountToggleProps> = ({
  position = 'top-right',
  showLabel = true,
  opacity = 0.8,
}) => {
  const theme = useTheme();
  const [isNextGen, setIsNextGen] = React.useState(true);

  React.useEffect(() => {
    // Check current environment on mount
    const checkCurrentMode = async () => {
      try {
        const currentMode = await AsyncStorage.getItem('DUAL_MOUNT_MODE');
        const envMode = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true';
        setIsNextGen(currentMode === 'nextgen' || envMode);
      } catch (error) {
        console.error('Failed to check dual mount mode:', error);
        setIsNextGen(process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true');
      }
    };
    checkCurrentMode();
  }, []);

  const handleToggle = async () => {
    try {
      const newMode = !isNextGen;
      const modeValue = newMode ? 'nextgen' : 'legacy';
      
      // Store the preference
      await AsyncStorage.setItem('DUAL_MOUNT_MODE', modeValue);
      
      // Show confirmation dialog
      Alert.alert(
        'Switch App Version',
        `Switch to ${newMode ? 'NextGen' : 'Legacy'} version? This will reload the app.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Switch',
            onPress: () => {
              console.log(`🔄 Dual Mount: Switching to ${newMode ? 'NextGen' : 'Legacy'} mode`);
              
              // In a real implementation, this would change the environment variable
              // and reload the app. For now, we'll show a message and suggest manual reload
              Alert.alert(
                'Manual Reload Required',
                `To complete the switch to ${newMode ? 'NextGen' : 'Legacy'} mode, please:\n\n1. Stop the Expo server (Ctrl+C)\n2. Set EXPO_PUBLIC_USE_NEXTGEN=${newMode ? 'true' : 'false'}\n3. Restart with: npx expo start --ios --clear`,
                [{ text: 'OK' }]
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error('Failed to toggle dual mount mode:', error);
      Alert.alert('Error', 'Failed to switch app version. Please try again.');
    }
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'top-left':
        return { top: 50, left: 24 };
      case 'top-right':
        return { top: 50, right: 24 };
      case 'top-center':
        return { top: 50, alignSelf: 'center' as const };
      case 'bottom-left':
        return { bottom: 100, left: 24 };
      case 'bottom-right':
        return { bottom: 100, right: 24 };
      case 'bottom-center':
        return { bottom: 100, alignSelf: 'center' as const };
      default:
        return { top: 50, right: 24 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          opacity,
          ...getPositionStyle(),
        },
      ]}
      onPress={handleToggle}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel="Toggle App Mode"
    >
      <Text style={[styles.icon, { color: theme.colors.text }]}>
        {isNextGen ? '🚀' : '📱'}
      </Text>
      {showLabel && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {isNextGen ? 'NextGen' : 'Legacy'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 1000,
  },
  icon: {
    fontSize: 16,
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 