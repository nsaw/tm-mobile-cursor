import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PremiumFeature } from '../types/premium';

interface PremiumFeatureCardProps {
  feature: PremiumFeature;
}

export const PremiumFeatureCard: React.FC<PremiumFeatureCardProps> = ({ feature }) => {
  return (
    <View style={[styles.card, !feature.isEnabled && styles.disabledCard]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{feature.icon}</Text>
        <Text style={styles.name}>{feature.name}</Text>
      </View>
      <Text style={styles.description}>{feature.description}</Text>
      {!feature.isEnabled && <Text style={styles.upgradeText}>Upgrade to Premium</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  disabledCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
});
