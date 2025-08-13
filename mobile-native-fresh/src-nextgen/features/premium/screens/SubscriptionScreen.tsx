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

export const SubscriptionScreen: React.FC = () => {
  const {
    subscription,
    loading,
    error,
    updatePaymentMethod,
  } = usePremium();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!subscription) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name='card' size={64} color='#ccc' />
          <Text style={styles.emptyText}>No active subscription</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscription</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.subscriptionCard}>
          <View style={styles.cardHeader}>
            <Ionicons name='diamond' size={24} color='#007AFF' />
            <Text style={styles.cardTitle}>Current Plan</Text>
          </View>

          <View style={styles.planDetails}>
            <Text style={styles.planName}>{subscription.plan.name}</Text>
            <Text style={styles.planPrice}>
              ${subscription.plan.price}/{subscription.plan.interval}
            </Text>
            <Text style={styles.planStatus}>
              Status: {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </Text>
          </View>

          <View style={styles.datesContainer}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Started</Text>
              <Text style={styles.dateValue}>
                {new Date(subscription.startDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Next Billing</Text>
              <Text style={styles.dateValue}>
                {new Date(subscription.endDate).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.actionButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name='card' size={20} color='#007AFF' />
            <Text style={styles.actionButtonText}>Update Payment Method</Text>
          </TouchableOpacity>
        </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  subscriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  planDetails: {
    marginBottom: 16,
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
    marginBottom: 4,
  },
  planStatus: {
    fontSize: 14,
    color: '#666',
  },
  datesContainer: {
    marginBottom: 16,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 8,
  },
});
