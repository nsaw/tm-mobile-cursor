import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';

export const HelpScreen: React.FC = () => {
  const { tokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: tokens.colors.background,
      padding: tokens.spacing.xl,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: tokens.colors.accentMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: tokens.spacing.lg,
    },
    title: {
      color: tokens.colors.text,
      marginBottom: tokens.spacing.sm,
    },
    subtitle: {
      color: tokens.colors.textMuted,
      textAlign: 'center',
      marginBottom: tokens.spacing.lg,
    },
    button: {
      width: 180,
      backgroundColor: tokens.colors.accent,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="help-circle-outline" size={32} color={tokens.colors.background} />
        </View>
        
        <Heading><Text>Help & Support</Text></Heading>
        <Caption><Text>This feature is coming soon. We're working hard to bring you the best experience.</Text></Caption>
        
        <Button style={styles.button}>
          <Text style={{ color: tokens.colors.background, fontWeight: '600' }}>Get Help</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}; 