import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePremium } from '../hooks/usePremium';

export const TrialBanner: React.FC = () => {
  const { subscription } = usePremium();

  if (!subscription || subscription.status !== 'trial') {
    return null;
  }

  const trialEndDate = new Date(subscription.trialEndDate || '');
  const daysLeft = Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name='time' size={20} color='#ff9500' />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Premium Trial</Text>
          <Text style={styles.subtitle}>
            {daysLeft > 0 ? `${daysLeft} days left` : 'Trial ending today'}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.upgradeButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <Text style={styles.upgradeButtonText}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  subtitle: {
    fontSize: 12,
    color: '#856404',
    marginTop: 2,
  },
  upgradeButton: {
    backgroundColor: '#ff9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  upgradeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});
