import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface RoleHeatmapDevtoolProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

interface RoleType {
  name: string;
  color: string;
  description: string;
}

const ROLE_COLORS: Record<string, RoleType> = {
  'button': { name: 'Button', color: '#FF6B6B', description: 'Interactive button elements' },
  'text': { name: 'Text', color: '#4ECDC4', description: 'Text content elements' },
  'image': { name: 'Image', color: '#45B7D1', description: 'Image and media elements' },
  'input': { name: 'Input', color: '#96CEB4', description: 'Form input elements' },
  'container': { name: 'Container', color: '#FFEAA7', description: 'Layout container elements' },
  'navigation': { name: 'Navigation', color: '#DDA0DD', description: 'Navigation elements' },
  'list': { name: 'List', color: '#98D8C8', description: 'List and collection elements' },
  'card': { name: 'Card', color: '#F7DC6F', description: 'Card and panel elements' },
  'modal': { name: 'Modal', color: '#BB8FCE', description: 'Modal and overlay elements' },
  'default': { name: 'Default', color: '#BDC3C7', description: 'Unassigned or default elements' }
};

export const RoleHeatmapDevtool: React.FC<RoleHeatmapDevtoolProps> = ({
  enabled = false,
  onToggle
}) => {
  const [isVisible, setIsVisible] = useState(enabled);
  const [roleStats, setRoleStats] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isVisible) {
      analyzeRoleDistribution();
    }
  }, [isVisible]);

  const analyzeRoleDistribution = () => {
    // This would analyze the current component tree for role assignments
    // For now, we'll simulate some statistics
    const mockStats = {
      'button': 12,
      'text': 45,
      'image': 8,
      'input': 6,
      'container': 23,
      'navigation': 4,
      'list': 15,
      'card': 9,
      'modal': 2,
      'default': 18
    };
    setRoleStats(mockStats);
  };

  const toggleHeatmap = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    onToggle?.(newState);
  };

  const getRoleColor = (roleType: string): string => {
    return ROLE_COLORS[roleType]?.color || ROLE_COLORS.default.color;
  };

  const getRoleName = (roleType: string): string => {
    return ROLE_COLORS[roleType]?.name || ROLE_COLORS.default.name;
  };

  if (!isVisible) {
    return (
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleHeatmap}
        accessibilityLabel="Enable role heatmap"
      >
        <Text style={styles.toggleButtonText}>🔍 Show Role Heatmap</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Role Statistics Panel */}
      <View style={styles.statsPanel}>
        <View style={styles.header}>
          <Text style={styles.title}>Role Heatmap Analysis</Text>
          <TouchableOpacity onPress={toggleHeatmap} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.legend}>
          {Object.entries(ROLE_COLORS).map(([key, role]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.colorSwatch, { backgroundColor: role.color }]} />
              <Text style={styles.legendText}>
                {role.name}: {roleStats[key] || 0}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Total Elements: {Object.values(roleStats).reduce((sum, count) => sum + count, 0)}
          </Text>
          <Text style={styles.summaryText}>
            Role Coverage: {Object.keys(roleStats).filter(key => roleStats[key] > 0).length}/{Object.keys(ROLE_COLORS).length}
          </Text>
        </View>
      </View>

      {/* Heatmap Overlay Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          💡 Elements are color-coded by their assigned role type.
          {'\n'}Toggle off to return to normal view.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 9999,
  },
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10000,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsPanel: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 300,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 12,
    color: '#666',
  },
  legend: {
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
  summaryText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  instructions: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 12,
  },
  instructionsText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default RoleHeatmapDevtool; 