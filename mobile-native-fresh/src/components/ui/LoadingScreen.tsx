import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeProvider';

interface LoadingScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
  message?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  isVisible, 
  onComplete, 
  message = "let me think about that…" 
}) => {
  const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [textOpacity] = useState(new Animated.Value(0.6));
  const [dot1Anim] = useState(new Animated.Value(0));
  const [dot2Anim] = useState(new Animated.Value(0));
  const [dot3Anim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      // Fade in animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation for the brain icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Text fade animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Dot bounce animations
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1Anim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Anim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(dot2Anim, {
            toValue: 1,
            duration: 600,
            delay: 200,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(dot3Anim, {
            toValue: 1,
            duration: 600,
            delay: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Auto complete after 1.2 seconds
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 1200);

      return () => clearTimeout(completeTimer);
    } else {
      // Fade out animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, fadeAnim, scaleAnim, pulseAnim, textOpacity, dot1Anim, dot2Anim, dot3Anim, onComplete]);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: tokens.colors.background }]}>
      <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
        {/* Glow ring effect */}
        <View style={styles.glowRing} />
        
        {/* Brain icon with pulse animation */}
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons 
            name="bulb" 
            size={40} 
            color={tokens.colors.accent}
            style={styles.brainIcon}
          />
        </Animated.View>

        {/* Thinking dots */}
        <View style={styles.thinkingDots}>
          <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
          <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
        </View>

        {/* Text with fade animation */}
        <Animated.Text style={[styles.thinkingText, { opacity: textOpacity, color: tokens.colors.textSecondary }]}>
          {message}
        </Animated.Text>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <Animated.View style={styles.progressFill} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  glowRing: {
    position: 'absolute',
    top: -10,
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)', // Using the new blue accent
    borderRadius: 30,
    opacity: 0.3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  brainIcon: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  thinkingDots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  thinkingText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Ubuntu_400Regular',
    letterSpacing: 0.5,
    marginTop: 4,
    textAlign: 'center',
  },
  progressBar: {
    width: 120,
    height: 2,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 1,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    width: '40%',
    borderRadius: 1,
  },
}); 