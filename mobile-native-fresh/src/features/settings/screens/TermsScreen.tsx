import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';

export const TermsScreen: React.FC = () => {

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: designTokens.colors.background,
      padding: designTokens.spacing.xl,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: designTokens.colors.accentMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: designTokens.spacing.lg,
    },
    title: {
      color: designTokens.colors.text,
      marginBottom: designTokens.spacing.sm,
    },
    subtitle: {
      color: designTokens.colors.textMuted,
      textAlign: 'center',
      marginBottom: designTokens.spacing.lg,
    },
    button: {
      width: 180,
      backgroundColor: designTokens.colors.accent,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="file-document-outline" size={32} color={designTokens.colors.background} />
      </View>
        
        <Heading><Text>Terms of Service</Text></Heading>
        <Caption><Text>This feature is coming soon. We're working hard to bring you the best experience.</Text></Caption>
        
        <Button style={styles.button}>
          <Text style={{ color: designTokens.colors.background, fontWeight: '600' }}>Coming Soon</Text>
      </Button>
    </View>
    </SafeAreaView>
  );
};