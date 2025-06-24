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
import { colors, spacing } from '../../theme/theme';

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
      <BlurView intensity={70} tint="dark" style={styles.blurContainer}>
        <Animated.View style={[styles.fab, { transform: [{ scale: scaleValue }] }]}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={handlePress}
            onLongPress={handleLongPress}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={isRecording ? 'stop' : 'plus'}
              size={26}
              color="#007AFF"
            />
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
      
      {/* Voice recording indicator */}
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
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
    backgroundColor: 'rgba(24, 24, 24, 0.3)',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 16, // Squircle shape
    // Dark square background
    backgroundColor: '#1C1C1E',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    borderRadius: 16, // Squircle shape
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    // Round blue glow effect
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  recordingIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
  },
}); 