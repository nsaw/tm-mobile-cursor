import {
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeProvider';
import AutoRoleView from '../wrappers/AutoRoleView';

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
  const { tokens } = useTheme();

  return (
    <AutoRoleView style={{
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
      paddingHorizontal: tokens.spacing.md,
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
    }} forceRole="header">
      <AutoRoleView style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 32,
      }} forceRole="section">
        <AutoRoleView style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }} forceRole="container">
          {showBackButton && onBack && (
            <TouchableOpacity 
              style={{
                marginRight: tokens.spacing.md,
                padding: tokens.spacing.xs,
                borderRadius: tokens.radius.sm,
                backgroundColor: tokens.colors.surface,
              }} 
              onPress={onBack}
             accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Ionicons name="arrow-back" size={20} color={tokens.colors.text} />
            </TouchableOpacity>
          )}
          <AutoRoleView style={{ flex: 1 }} forceRole="section">
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
                size="sm"
                style={{ 
                  marginTop: 1,
                }}
              >
                {subtitle}
              </Text>
            )}
          </AutoRoleView>
        </AutoRoleView>
        
        {rightAction && (
          <TouchableOpacity 
            style={{
              padding: tokens.spacing.xs,
              borderRadius: tokens.radius.sm,
              backgroundColor: tokens.colors.surface,
            }} 
            onPress={rightAction.onPress}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name={rightAction.icon as any} size={20} color={tokens.colors.text} />
          </TouchableOpacity>
        )}
      </AutoRoleView>
    </AutoRoleView>
  );
}; 