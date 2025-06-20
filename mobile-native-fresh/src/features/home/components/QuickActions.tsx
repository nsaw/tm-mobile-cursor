import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface QuickActionsProps {
  onCreateThoughtmark: () => void;
  onCreateBin: () => void;
  onVoiceRecord: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateThoughtmark,
  onCreateBin,
  onVoiceRecord,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={onCreateThoughtmark}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✏️</Text>
        </View>
        <Text style={styles.actionText}>New Note</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onVoiceRecord}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎤</Text>
        </View>
        <Text style={styles.actionText}>Voice Note</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onCreateBin}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📁</Text>
        </View>
        <Text style={styles.actionText}>New Bin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
  },
});