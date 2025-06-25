import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Text, Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import { User } from 'lucide-react-native';

const ProfileScreen: React.FC = () => {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: designTokens.colors.background, padding: designTokens.spacing.xl }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: designTokens.colors.accentMuted, alignItems: 'center', justifyContent: 'center', marginBottom: designTokens.spacing.lg }}>
        <User size={32} color={designTokens.colors.background} />
      </View>
      <Heading level={1} style={{ color: designTokens.colors.text, marginBottom: designTokens.spacing.sm }}>Profile</Heading>
      <Caption style={{ color: designTokens.colors.textMuted, textAlign: 'center', marginBottom: designTokens.spacing.lg }}>
        Manage your account information and personal details here. Edit your name, email, and more.
      </Caption>
      <Button disabled style={{ width: 180, backgroundColor: designTokens.colors.accent, opacity: 0.5 }}>
        <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>Edit Profile</Text>
      </Button>
    </View>
  );
};

export default ProfileScreen; 