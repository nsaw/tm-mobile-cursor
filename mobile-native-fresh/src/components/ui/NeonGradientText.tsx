import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/theme';

interface NeonGradientTextProps {
  children: string;
  style?: any;
}

export const NeonGradientText: React.FC<NeonGradientTextProps> = ({ 
  children, 
  style 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 4000, // 4 seconds to match the original CSS animation
        useNativeDriver: false,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const gradientColors = ['#C6D600', '#00FFFF', '#FF00FF', '#C6D600'];
  
  const interpolatedColor = animatedValue.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: gradientColors,
  });

  return (
    <Animated.Text
      style={[
        styles.neonText,
        {
          color: interpolatedColor,
        },
        style,
      ]}
    >
      {children}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  neonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    fontFamily: 'Ubuntu',
    textShadowColor: '#C6D600',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
}); 