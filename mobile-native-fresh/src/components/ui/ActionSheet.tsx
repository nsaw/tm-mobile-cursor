import React from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { useTheme } from '../../theme/ThemeProvider';

interface ActionSheetItem {
  label: string;
  icon?: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  items: ActionSheetItem[];
  title?: string;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  onClose,
  items,
  title,
}) => {
  const { tokens } = useTheme();

  const handleItemPress = (item: ActionSheetItem) => {
    item.onPress();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessible={true}
      accessibilityLabel={title || 'Action menu'}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: designTokens.colors.backgroundSecondary,
              borderTopLeftRadius: designTokens.radius.lg,
              borderTopRightRadius: designTokens.radius.lg,
              paddingBottom: designTokens.spacing.lg,
              maxWidth: Dimensions.get('window').width,
              width: '100%',
            }}>
              {title && (
                <View style={{
                  paddingVertical: designTokens.spacing.md,
                  paddingHorizontal: designTokens.spacing.lg,
                  borderBottomWidth: 1,
                  borderBottomColor: designTokens.colors.border,
                }}>
                  <Text variant="subheading" style={{ textAlign: 'center' }}>{title}</Text>
                </View>
              )}
              
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    paddingVertical: designTokens.spacing.md,
                    paddingHorizontal: designTokens.spacing.lg,
                    borderBottomWidth: index === items.length - 1 ? 0 : 1,
                    borderBottomColor: designTokens.colors.border,
                  }}
                  onPress={() => handleItemPress(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                    {item.icon && (
                      <Ionicons
                        name={item.icon as any}
                        size={16}
                        color={item.destructive ? designTokens.colors.danger : designTokens.colors.text}
                        style={{ marginRight: designTokens.spacing.sm }}
                      />
                    )}
                    <Text 
                      variant="body" 
                      style={{
                        textAlign: 'center',
                        color: item.destructive ? designTokens.colors.danger : designTokens.colors.text,
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={{
                  paddingVertical: designTokens.spacing.md,
                  paddingHorizontal: designTokens.spacing.lg,
                  marginTop: designTokens.spacing.sm,
                  borderTopWidth: 8,
                  borderTopColor: designTokens.colors.border,
                }}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text 
                  variant="body" 
                  style={{
                    textAlign: 'center',
                    color: designTokens.colors.accent,
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}; 