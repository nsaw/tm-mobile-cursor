import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Text, Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PrivacyScreen: React.FC = () => {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tokens.colors.background, padding: tokens.spacing.xl }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: tokens.colors.accentMuted, alignItems: 'center', justifyContent: 'center', marginBottom: tokens.spacing.lg }}>
        <MaterialCommunityIcons name="shield-outline" size={32} color={tokens.colors.background} />
      </View>
      <Heading level={1} style={{ color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Privacy Policy</Heading>
      <Caption style={{ color: tokens.colors.textMuted, textAlign: 'center', marginBottom: tokens.spacing.lg }}>
        Review our privacy policy to understand how your data is protected.
      </Caption>
      <Button style={{ width: 180, backgroundColor: tokens.colors.accent }}>
        <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>Read Full Policy</Text>
      </Button>
    </View>
  );
};

export default PrivacyScreen; 