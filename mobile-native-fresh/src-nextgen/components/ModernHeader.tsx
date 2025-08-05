import {
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../theme/ThemeProvider';
import { AutoRoleView } from './AutoRoleView';

import { Text } from './Text';

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  showBackButton?: boolean;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  showBackButton = true,
}) => {
  const theme = useTheme();

  return (
            <AutoRoleView>
      <View style={{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 2,
        minHeight: 40,
        // Cross-platform shadow
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          },
          android: {
            elevation: 8,
          },
        }),
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 32,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
            {showBackButton && onBack && (
              <TouchableOpacity 
                style={{
                                  marginRight: theme.spacing.md,
                padding: theme.spacing.xs,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: theme.colors.surface,
                }} 
                onPress={onBack}
               accessibilityRole="button" accessible={true} accessibilityLabel="Button">
                <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            )}
            <View style={{ flex: 1 }}>
              <Text 
                variant="heading" 
                style={{ 
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {title}
              </Text>
              {subtitle && (
                <Text 
                  variant="body" 
                  size="small"
                  style={{ 
                    marginTop: 1,
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
          
          {rightAction && (
            <TouchableOpacity 
              style={{
                padding: theme.spacing.xs,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: theme.colors.surface,
              }} 
              onPress={rightAction.onPress}
             accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Ionicons name={rightAction.icon} size={20} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </AutoRoleView>
  );
}; 