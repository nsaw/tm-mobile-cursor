import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDualMount } from '../contexts/DualMountContext';
import { useTheme } from '../hooks/useTheme';

interface DualMountAppProps {
  nextGenComponent: React.ComponentType;
  legacyComponent: React.ComponentType;
}

export const DualMountApp: React.FC<DualMountAppProps> = ({ 
  nextGenComponent: NextGenComponent, 
  legacyComponent: LegacyComponent 
}) => {
  const { isNextGen } = useDualMount();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show loading state briefly when switching
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [isNextGen]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          🔄 Switching to {isNextGen ? 'NextGen' : 'Legacy'}...
        </Text>
      </View>
    );
  }

  return isNextGen ? <NextGenComponent /> : <LegacyComponent />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 