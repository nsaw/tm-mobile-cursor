import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  showChevron?: boolean;
  disabled?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  showChevron = true,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
     accessibilityRole="button" accessible={true} accessibilityLabel="Button">
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon as any}
          size={24}
          color={disabled ? '#ccc' : '#666'}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, disabled && styles.disabledText]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, disabled && styles.disabledText]}>{subtitle}</Text>
        )}
      </View>
      {showChevron && (
        <Ionicons
          name='chevron-forward'
          size={20}
          color={disabled ? '#ccc' : '#ccc'}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#ccc',
  },
});
