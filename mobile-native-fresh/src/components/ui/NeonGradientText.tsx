import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

interface NeonGradientTextProps {
  children: string;
  style?: any;
}

export const NeonGradientText: React.FC<NeonGradientTextProps> = ({ 
  children, 
  style 
}) => {
  const { tokens } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  const styles = getStyles(tokens);

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

const getStyles = (tokens: any) => StyleSheet.create({
  neonText: {
    fontSize: 22, // Increased from 19 to 22 for better readability
    fontWeight: '700',
    fontFamily: 'Ubuntu',
    textShadowColor: '#C6D600',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 11, // 8 * 1.34
  },
}); 