import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Text, Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ExportScreen: React.FC = () => {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: designTokens.colors.background, padding: designTokens.spacing.xl }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: designTokens.colors.accentMuted, alignItems: 'center', justifyContent: 'center', marginBottom: designTokens.spacing.lg }}>
        <MaterialCommunityIcons name="download-outline" size={32} color={designTokens.colors.background} />
      </View>
      <Heading level={1} style={{ color: designTokens.colors.text, marginBottom: designTokens.spacing.sm }}>Export Data</Heading>
      <Caption style={{ color: designTokens.colors.textMuted, textAlign: 'center', marginBottom: designTokens.spacing.lg }}>
        Export your thoughtmarks and bins for backup or migration.
      </Caption>
      <Button disabled style={{ width: 180, backgroundColor: designTokens.colors.accent, opacity: 0.5 }}>
        <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>Export Now</Text>
      </Button>
    </View>
  );
};

export default ExportScreen; 