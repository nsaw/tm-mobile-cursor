import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Text, Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import { User } from 'lucide-react-native';

const ProfileScreen: React.FC = () => {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tokens.colors.background, padding: tokens.spacing.xl }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: tokens.colors.accentMuted, alignItems: 'center', justifyContent: 'center', marginBottom: tokens.spacing.lg }}>
        <User size={32} color={tokens.colors.background} />
      </View>
      <Heading level={1} style={{ color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Profile</Heading>
      <Caption style={{ color: tokens.colors.textMuted, textAlign: 'center', marginBottom: tokens.spacing.lg }}>
        Manage your account information and personal details here. Edit your name, email, and more.
      </Caption>
      <Button disabled style={{ width: 180, backgroundColor: tokens.colors.accent, opacity: 0.5 }}>
        <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>Edit Profile</Text>
      </Button>
    </View>
  );
};

export default ProfileScreen; 