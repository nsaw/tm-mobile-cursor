import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Text, Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PremiumScreen: React.FC = () => {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: designTokens.colors.background, padding: designTokens.spacing.xl }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFD70033', alignItems: 'center', justifyContent: 'center', marginBottom: designTokens.spacing.lg }}>
        <MaterialCommunityIcons name="crown-outline" size={36} color="#FFD700" />
      </View>
      <Heading level={1} style={{ color: designTokens.colors.text, marginBottom: designTokens.spacing.sm }}>Premium Features</Heading>
      <Caption style={{ color: designTokens.colors.textMuted, textAlign: 'center', marginBottom: designTokens.spacing.lg }}>
        Unlock advanced AI, unlimited bins, priority support, and more.
      </Caption>
      <Button style={{ width: 180, backgroundColor: '#FFD700' }}>
        <Text style={{ color: designTokens.colors.background, fontWeight: '700', textAlign: 'center' }}>Upgrade Now</Text>
      </Button>
    </View>
  );
};

export default PremiumScreen; 