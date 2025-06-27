import { View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Text, Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';

const ContactScreen: React.FC = () => {
  

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
        <Ionicons name="mail-outline" size={32} color={tokens.colors.background} />
      </View>
      
      <Heading><Text>Contact Support</Text></Heading>
      <Caption><Text>Need help? We're here to assist you with any questions or issues.</Text></Caption>
      
      <Button><Text>Coming Soon</Text></Button>
    </View>
  );
};

export default ContactScreen; 