import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from 'lucide-react-native';

import { useTheme } from '../../../theme/ThemeProvider';
import { Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';

export const ProfileScreen: React.FC = () => {
  const { tokens: designTokens } = useTheme();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: designTokens.colors.accent,
      opacity: 0.5,
      width: 180,
    },
    container: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.background,
      flex: 1,
      justifyContent: 'center',
      padding: designTokens.spacing.xl,
    },
    iconContainer: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.accentMuted,
      borderRadius: 32,
      height: 64,
      justifyContent: 'center',
      marginBottom: designTokens.spacing.lg,
      width: 64,
    },
    subtitle: {
      color: designTokens.colors.textMuted,
      marginBottom: designTokens.spacing.lg,
      textAlign: 'center',
    },
    title: {
      color: designTokens.colors.text,
      marginBottom: designTokens.spacing.sm,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <User size={32} color={designTokens.colors.background} />
        </View>
        
        <Heading><Text>Profile</Text></Heading>
        <Caption><Text>This feature is coming soon. We're working hard to bring you the best experience.</Text></Caption>
        
        <Button disabled style={styles.button}>
          <Text style={{ color: designTokens.colors.background, fontWeight: '600' }}>Coming Soon</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}; 