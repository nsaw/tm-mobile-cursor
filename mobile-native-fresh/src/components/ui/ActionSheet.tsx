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
              backgroundColor: tokens.colors.backgroundSecondary,
              borderTopLeftRadius: tokens.radius.lg,
              borderTopRightRadius: tokens.radius.lg,
              paddingBottom: tokens.spacing.lg,
              maxWidth: Dimensions.get('window').width,
              width: '100%',
            }}>
              {title && (
                <View style={{
                  paddingVertical: tokens.spacing.md,
                  paddingHorizontal: tokens.spacing.lg,
                  borderBottomWidth: 1,
                  borderBottomColor: tokens.colors.border,
                }}>
                  <Text variant="subheading" style={{ textAlign: 'center' }}>{title}</Text>
                </View>
              )}
              
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    paddingVertical: tokens.spacing.md,
                    paddingHorizontal: tokens.spacing.lg,
                    borderBottomWidth: index === items.length - 1 ? 0 : 1,
                    borderBottomColor: tokens.colors.border,
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
                        color={item.destructive ? tokens.colors.danger : tokens.colors.text}
                        style={{ marginRight: tokens.spacing.sm }}
                      />
                    )}
                    <Text 
                      variant="body" 
                      style={{
                        textAlign: 'center',
                        color: item.destructive ? tokens.colors.danger : tokens.colors.text,
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={{
                  paddingVertical: tokens.spacing.md,
                  paddingHorizontal: tokens.spacing.lg,
                  marginTop: tokens.spacing.sm,
                  borderTopWidth: 8,
                  borderTopColor: tokens.colors.border,
                }}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text 
                  variant="body" 
                  style={{
                    textAlign: 'center',
                    color: tokens.colors.accent,
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