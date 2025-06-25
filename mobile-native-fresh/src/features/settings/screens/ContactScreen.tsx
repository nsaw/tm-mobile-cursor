import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { Text, Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';

const ContactScreen: React.FC = () => {
  const { tokens } = useTheme();

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: tokens.colors.background, 
      padding: tokens.spacing.xl 
    }}>
      <View style={{ 
        width: 64, 
        height: 64, 
        borderRadius: 32, 
        backgroundColor: tokens.colors.accentMuted, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: tokens.spacing.lg 
      }}>
        <MaterialCommunityIcons name="email-outline" size={32} color={tokens.colors.background} />
      </View>
      
      <Heading level={1} style={{ color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Contact Support</Heading>
      <Caption style={{ color: tokens.colors.textMuted, textAlign: 'center', marginBottom: tokens.spacing.lg }}>
        Need help? We're here to assist you with any questions or issues.
      </Caption>
      
      <Button disabled style={{ width: 180, backgroundColor: tokens.colors.accent, opacity: 0.5 }}>
        Coming Soon
      </Button>
    </View>
  );
};

export default ContactScreen; 