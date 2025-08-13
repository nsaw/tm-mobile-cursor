import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DashboardSection as DashboardSectionType } from '../types/dashboard';

interface DashboardSectionProps {
  section: DashboardSectionType;
  children: React.ReactNode;
  onToggleVisibility?: (sectionId: string) => void;
  onPress?: (sectionId: string) => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  section,
  children,
  onToggleVisibility,
  onPress,
}) => {
  if (!section.visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.titleContainer}
          onPress={() => onPress?.(section.id)}
        >
          <Text style={styles.title}>{section.title}</Text>
          <Ionicons name='chevron-forward' size={16} color='#666' />
        </TouchableOpacity>
        {onToggleVisibility && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => onToggleVisibility(section.id)}
          >
            <Ionicons name='eye-off' size={20} color='#666' />
          </TouchableOpacity>
        )}
      </View>
      <View><Text>{children}</Text></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 8,
  },
  toggleButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
});
