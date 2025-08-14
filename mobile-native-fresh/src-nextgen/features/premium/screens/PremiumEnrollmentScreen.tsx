import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePremium } from '../hooks/usePremium';
import { PremiumFeatureCard } from '../components/PremiumFeatureCard';
import { PaymentMethod } from '../types/premium';

export const PremiumEnrollmentScreen: React.FC = () => {
  const { subscription, plans, loading, error, isPremium, subscribe, cancelSubscription } = usePremium();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const mockPaymentMethod: PaymentMethod = {
        id: 'mock_payment_method',
        type: 'card',
        last4: '1234',
        brand: 'visa',
        isDefault: true,
      };
      const result = await subscribe('premium_monthly', mockPaymentMethod.id);
      const success = result.success;
      if (success) {
        Alert.alert('Success', 'Welcome to Premium!');
      } else {
        Alert.alert('Error', 'Failed to upgrade to premium');
      }
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancel = async () => {
    Alert.alert(
      'Cancel Premium',
      'Are you sure you want to cancel your premium subscription?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelSubscription();
            const success = result.success;
            if (success) {
              Alert.alert('Success', 'Premium subscription cancelled');
            } else {
              Alert.alert('Error', 'Failed to cancel premium');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading premium features...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Premium Features</Text>
        <Text style={styles.subtitle}>Unlock the full potential of Thoughtmarks</Text>
      </View>

      {isPremium() && (
        <View style={styles.premiumStatus}>
          <Text style={styles.premiumStatusText}>You are a Premium member!</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={styles.cancelButtonText}>Cancel Premium</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.featuresContainer}>
        {plans[0]?.features.map((feature) => (
          <PremiumFeatureCard key={feature.id} feature={feature} />
        ))}
      </View>

      {!isPremium() && (
        <TouchableOpacity
          style={[styles.upgradeButton, upgrading && styles.upgradeButtonDisabled]}
          onPress={handleUpgrade}
          disabled={upgrading}
         accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Text style={styles.upgradeButtonText}>
            {upgrading ? 'Processing...' : 'Upgrade to Premium - $9.99/month'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  premiumStatus: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  premiumStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d5a2d',
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  featuresContainer: {
    padding: 20,
  },
  upgradeButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ff4444',
    marginTop: 50,
  },
});
