import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface DraggableSectionProps {
  title: string;
  children: React.ReactNode;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  style?: ViewStyle;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const DraggableSection: React.FC<DraggableSectionProps> = ({
  title,
  children,
  onReorder,
  style,
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const { colors, spacing, typography } = useTheme();
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const handleToggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          marginBottom: spacing.md,
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.header,
          {
            borderBottomColor: colors.border,
          },
        ]}
        onPress={handleToggleCollapse}
        disabled={!collapsible}
       accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <View style={styles.headerContent}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: typography.h2.fontSize,
                fontWeight: typography.h2.fontWeight,
              },
            ]}
          >
            {title}
          </Text>
          
          {collapsible && (
            <Text
              style={[
                styles.collapseIcon,
                {
                  color: colors.textSecondary,
                  fontSize: typography.body.fontSize,
                },
              ]}
            >
              {isCollapsed ? '▼' : '▲'}
            </Text>
          )}
        </View>
        
        {onReorder && (
          <View style={styles.dragHandle}>
            <View
              style={[
                styles.dragDot,
                {
                  backgroundColor: colors.textMuted,
                },
              ]}
            />
            <View
              style={[
                styles.dragDot,
                {
                  backgroundColor: colors.textMuted,
                },
              ]}
            />
            <View
              style={[
                styles.dragDot,
                {
                  backgroundColor: colors.textMuted,
                },
              ]}
            />
          </View>
        )}
      </TouchableOpacity>
      
      {!isCollapsed && (
        <View><Text>{children}</Text></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
  },
  collapseIcon: {
    marginLeft: 8,
  },
  dragHandle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  dragDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  content: {
    minHeight: 20,
  },
});
