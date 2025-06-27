import {
  TouchableOpacity,
  Platform,
  useSafeAreaInsets,
} from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Brain } from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeProvider';
import AutoRoleView from '../wrappers/AutoRoleView';

interface BottomNavProps {
  onNavigate: (path: string) => void;
  onVoiceRecord?: () => void;
  showCreateButton?: boolean;
  currentRoute?: string;
  onCreateNew?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onNavigate,
  onVoiceRecord,
  showCreateButton = true,
  currentRoute = '/',
  onCreateNew,
}) => {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const handleAIToolsClick = () => {
    // TODO: Implement AI tools modal
    console.log('AI Tools clicked');
  };

  const navItems = [
    { icon: 'home', label: 'Home', path: '/', iconType: 'material' },
    { icon: 'magnify', label: 'Search', path: '/search', iconType: 'material' },
    { icon: 'plus', label: 'Create', action: 'create', iconType: 'material' },
    { icon: 'microphone', label: 'Voice', action: 'voice', iconType: 'material' },
    { icon: Brain, label: 'AI Tools', action: 'ai-tools', iconType: 'lucide' },
  ];

  const renderIcon = (item: any, isActive: boolean, isHome: boolean, isVoice: boolean) => {
    const iconColor = isHome
      ? tokens.colors.accent // Always blue for Home
      : isActive
      ? tokens.colors.accent // Blue active tint for other active items
      : isVoice
      ? tokens.colors.danger // Red tint for Voice
      : item.action === 'ai-tools'
      ? '#FFD700' // Gold tint for AI
      : tokens.colors.textMuted; // Light gray for inactive

    if (item.iconType === 'lucide') {
      return (
        <Brain
          size={27}
          strokeWidth={2}
          color={iconColor}
        />
      );
    }

    return (
      <MaterialCommunityIcons
        name={item.icon as any}
        size={32}
        color={iconColor}
      />
    );
  };

  return (
    <AutoRoleView style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: 440,
      alignSelf: 'center',
      width: '100%',
      zIndex: tokens.zIndex.modal,
      paddingBottom: 0,
    }} forceRole="navigation">
      <AutoRoleView style={{
        backgroundColor: tokens.colors.backgroundSecondary,
        borderTopWidth: 1,
        borderTopColor: tokens.colors.divider,
        // Cross-platform shadow
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          },
          android: {
            elevation: 12,
          },
        }),
      }} forceRole="section">
        <AutoRoleView style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: tokens.spacing.md,
          paddingHorizontal: tokens.spacing.lg,
          minHeight: 107,
        }} forceRole="container">
          {navItems.map((item, _index) => {
            const { label, path, action } = item;
            const isActive = currentRoute === path;
            const isVoice = action === 'voice';
            const isHome = path === '/';

            return (
              <TouchableOpacity
                key={path || action || label}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: tokens.spacing.sm,
                  paddingHorizontal: tokens.spacing.sm,
                  borderRadius: tokens.radius.sm,
                  backgroundColor: 'transparent',
                  minHeight: 59,
                  minWidth: 59,
                  position: 'relative',
                }}
                onPress={() => {
                  if (isVoice && onVoiceRecord) {
                    onVoiceRecord();
                  } else if (action === 'ai-tools') {
                    handleAIToolsClick();
                  } else if (path) {
                    onNavigate(path);
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={`${label} ${isActive ? 'selected' : ''}`}
              >
                {renderIcon(item, isActive, isHome, isVoice)}
                {isActive && (
                  <AutoRoleView style={{
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    borderRadius: tokens.radius.md,
                    backgroundColor: `${tokens.colors.accent}1A`,
                    borderWidth: 1,
                    borderColor: `${tokens.colors.accent}4D`,
                  }} forceRole="badge" />
                )}
              </TouchableOpacity>
            );
          })}
        </AutoRoleView>
      </AutoRoleView>

      {/* Floating New Thoughtmark Button */}
      {showCreateButton && currentRoute !== '/' && (
        <AutoRoleView style={{
          position: 'absolute',
          left: '50%',
          transform: [{ translateX: -43 }],
          zIndex: tokens.zIndex.tooltip,
          alignItems: 'center',
          justifyContent: 'center',
          bottom: (insets.bottom + 40) * 1.34,
        }} forceRole="button">
          <AutoRoleView style={{
            width: 83,
            height: 83,
            borderRadius: 56,
            padding: 4,
            backgroundColor: `${tokens.colors.accent}E6`,
            borderWidth: 4,
            borderColor: `${tokens.colors.accent}E6`,
            alignItems: 'center',
            justifyContent: 'center',
            // Cross-platform shadow
            ...Platform.select({
              ios: {
                shadowColor: tokens.colors.accent,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.6,
                shadowRadius: 32,
              },
              android: {
                elevation: 27,
              },
            }),
          }} forceRole="button-wrapper">
            <TouchableOpacity
              style={{
                width: 78,
                height: 78,
                borderRadius: tokens.radius.lg,
                backgroundColor: tokens.colors.background,
                alignItems: 'center',
                justifyContent: 'center',
                // Cross-platform shadow
                ...Platform.select({
                  ios: {
                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                  },
                  android: {
                    elevation: 16,
                  },
                }),
              }}
              onPress={() => {
                if (onCreateNew) {
                  onCreateNew();
                } else {
                  onNavigate('CreateThoughtmark');
                }
              }}
              accessibilityRole="button"
              
            >
              <MaterialCommunityIcons name="plus" size={47} color={tokens.colors.accent} />
            </TouchableOpacity>
          </AutoRoleView>
        </AutoRoleView>
      )}
    </AutoRoleView>
  );
}; 