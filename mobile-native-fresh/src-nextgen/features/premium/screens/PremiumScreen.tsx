import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePremium } from '../hooks/usePremium';
import { TrialBanner } from '../components/TrialBanner';

export const PremiumScreen: React.FC = () => {
  const {
    subscription,
    plans,
    loading,
    error,
    isPremium,
    subscribe,
    cancelSubscription,
  } = usePremium();

  const handleSubscribe = async (planId: string) => {
    try {
      const result = await subscribe(planId);
      if (result.success) {
        console.log('Subscription successful');
      } else {
        console.error('Subscription failed:', result.error);
      }
    } catch (err) {
      console.error('Error subscribing:', err);
    }
  };

  const handleCancel = async () => {
    try {
      const result = await cancelSubscription();
      if (result.success) {
        console.log('Subscription cancelled');
      } else {
        console.error('Cancellation failed:', result.error);
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Premium</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TrialBanner />

        {isPremium() ? (
          <View style={styles.currentPlanContainer}>
            <View style={styles.currentPlanHeader}>
              <Ionicons name='diamond' size={32} color='#007AFF' />
              <Text style={styles.currentPlanTitle}>Current Plan</Text>
            </View>
            <Text style={styles.planName}>{subscription?.plan.name}</Text>
            <Text style={styles.planPrice}>
              ${subscription?.plan.price}/{subscription?.plan.interval}
            </Text>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.plansContainer}>
            <Text style={styles.sectionTitle}>Choose Your Plan</Text>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.planCard}
                onPress={() => handleSubscribe(plan.id)}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>
                    ${plan.price}/{plan.interval}
                  </Text>
                </View>
                <View style={styles.featuresList}>
                  {plan.features.map((feature) => (
                    <View key={feature.id} style={styles.featureItem}>
                      <Ionicons name='checkmark-circle' size={16} color='#34c759' />
                      <Text style={styles.featureText}>{feature.description}</Text>
                    </View>
                  ))}
                </View>
                {plan.trialDays > 0 && (
                  <Text style={styles.trialText}>{plan.trialDays}-day free trial</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  currentPlanContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  currentPlanHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  currentPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  plansContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  planHeader: {
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  trialText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
});
