import {
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../theme/ThemeProvider';

import { Text } from './Text';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  showBackButton?: boolean;
  layoutRole?: 'header-navigation' | 'header-title' | 'header-actions';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  showBackButton = true,
  layoutRole = 'header-navigation',
}) => {
  const { designTokens } = useTheme();

  return (
    <View 
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderBottomWidth: 1,
        borderBottomColor: designTokens.colors.divider,
        paddingHorizontal: designTokens.spacing.md,
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
      }}
      accessibilityRole="header"
      accessibilityLabel={`${layoutRole}: ${title}`}
    >
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
                marginRight: designTokens.spacing.md,
                padding: designTokens.spacing.xs,
                borderRadius: designTokens.radius.sm,
                backgroundColor: designTokens.colors.surface,
              }} 
              onPress={onBack}
              accessibilityRole="button" 
              accessible={true} 
              accessibilityLabel={`${layoutRole}-back-button`}
            >
              <Ionicons name="arrow-back" size={20} color={designTokens.colors.text.primary} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text 
              variant="heading2" 
              contentRole="text-heading"
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
                contentRole="text-display"
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
              padding: designTokens.spacing.xs,
              borderRadius: designTokens.radius.sm,
              backgroundColor: designTokens.colors.surface,
            }} 
            onPress={rightAction.onPress}
            accessibilityRole="button" 
            accessible={true} 
            accessibilityLabel={`${layoutRole}-action-button`}
          >
            <Ionicons name={rightAction.icon as any} size={20} color={designTokens.colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}; 