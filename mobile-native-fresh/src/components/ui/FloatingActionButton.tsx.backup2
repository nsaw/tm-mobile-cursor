import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Vibration,
} from 'react-native';
import { BlurView } from 'expo-blur';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../theme/ThemeProvider';

interface FloatingActionButtonProps {
  onPress?: () => void;
  onVoiceRecord?: () => void;
  isRecording?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  onVoiceRecord,
  isRecording = false,
}) => {










  const insets = useSafeAreaInsets();
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePress = () => {
    Vibration.vibrate(50);
    
    // Animate the button press with scale and pulse
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) {
      onPress();
    }
  };

  const handleLongPress = () => {
    Vibration.vibrate(100);
    if (onVoiceRecord) {
      onVoiceRecord();
    }
  };

  return (
    <View style={[styles.container, { bottom: insets.bottom + 70 }]}>
      <BlurView intensity={70} tint="dark" style={[styles.blurContainer, { backgroundColor: designTokens.colors.backgroundSecondary }]}>
        <Animated.View style={[styles.fab, { 
          transform: [{ scale: scaleValue }],
          backgroundColor: designTokens.colors.backgroundSecondary,
          shadowColor: designTokens.colors.accent,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.6,
          shadowRadius: 24,
          elevation: 16,
        }]}>
          <TouchableOpacity
            style={[styles.fabButton, {
              shadowColor: designTokens.colors.accent,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 12,
            }]}
            onPress={handlePress}
            onLongPress={handleLongPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel="Floating action button">
            <MaterialCommunityIcons
              name={isRecording ? 'stop' : 'plus'}
              size={26}
              color={designTokens.colors.accent}
            />
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
      
      {/* Voice recording indicator */}
      {isRecording && (
        <View style={[styles.recordingIndicator, { backgroundColor: designTokens.colors.danger }]}>
          <View style={[styles.recordingDot, { backgroundColor: designTokens.colors.background }]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -30 }], // Center the button (60/2)
    zIndex: 40,
    alignItems: 'center',
  },
  blurContainer: {
    borderRadius: 16, // Squircle shape
    overflow: 'hidden',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 16, // Squircle shape
  },
  fabButton: {
    width: '100%',
    height: '100%',
    borderRadius: 16, // Squircle shape
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
}); 