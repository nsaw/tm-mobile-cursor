import { View } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Text, Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';

const ThemeScreen: React.FC = () => {
  const { tokens: designTokens } = useTheme();

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: designTokens.colors.background, 
      padding: designTokens.spacing.xl 
    }}>
      <View style={{ 
        width: 64, 
        height: 64, 
        borderRadius: 32, 
        backgroundColor: designTokens.colors.accentMuted, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: designTokens.spacing.lg 
      }}>
        <MaterialCommunityIcons name="palette-outline" size={32} color={designTokens.colors.background} />
      </View>
      
      <Heading><Text>Theme</Text></Heading>
      <Caption><Text>Customize the appearance of your app with different themes and color schemes.</Text></Caption>
      
      <Button><Text>Coming Soon</Text></Button>
    </View>
  );
};

export default ThemeScreen; 