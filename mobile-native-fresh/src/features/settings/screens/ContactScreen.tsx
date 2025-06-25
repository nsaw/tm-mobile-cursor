import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Text, Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ContactScreen: React.FC = () => {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: designTokens.colors.background, padding: designTokens.spacing.xl }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: designTokens.colors.accentMuted, alignItems: 'center', justifyContent: 'center', marginBottom: designTokens.spacing.lg }}>
        <MaterialCommunityIcons name="email-outline" size={32} color={designTokens.colors.background} />
      </View>
      <Heading level={1} style={{ color: designTokens.colors.text, marginBottom: designTokens.spacing.sm }}>Contact Support</Heading>
      <Caption style={{ color: designTokens.colors.textMuted, textAlign: 'center', marginBottom: designTokens.spacing.lg }}>
        Need help? Reach out to our support team and we'll get back to you within 24 hours.
      </Caption>
      <Button disabled style={{ width: 180, backgroundColor: designTokens.colors.accent, opacity: 0.5 }}>
        <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>Send Message</Text>
      </Button>
    </View>
  );
};

export default ContactScreen; 