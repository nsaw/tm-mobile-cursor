import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../../state/store';
import { Subscription, SubscriptionPlan, PremiumFeature } from '../types/premium';
import { premiumService } from '../services/premiumService';

export const usePremium = () => {
  const { user } = useAppStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadSubscriptionData();
    }
  }, [user?.id]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [subscriptionData, plansData] = await Promise.all([
        premiumService.getSubscription(),
        premiumService.getPlans(),
      ]);
      setSubscription(subscriptionData);
      setPlans(plansData);
      setError(null);
    } catch (err) {
      setError('Failed to load subscription data');
      console.error('Error loading subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const isPremium = useCallback(() => {
    return subscription?.status === 'active' || subscription?.status === 'trial';
  }, [subscription]);

  const hasFeature = useCallback((featureId: string) => {
    if (!isPremium()) return false;
    return subscription?.plan.features.some(f => f.id === featureId) || false;
  }, [subscription, isPremium]);

  const subscribe = async (planId: string, paymentMethodId?: string) => {
    try {
      const newSubscription = await premiumService.subscribe(planId, paymentMethodId);
      setSubscription(newSubscription);
      return { success: true, data: newSubscription };
    } catch (err) {
      setError('Failed to subscribe');
      console.error('Error subscribing:', err);
      return { success: false, error: err };
    }
  };

  const cancelSubscription = async () => {
    try {
      await premiumService.cancelSubscription();
      await loadSubscriptionData();
      return { success: true };
    } catch (err) {
      setError('Failed to cancel subscription');
      console.error('Error canceling subscription:', err);
      return { success: false, error: err };
    }
  };

  const updatePaymentMethod = async (paymentMethodId: string) => {
    try {
      await premiumService.updatePaymentMethod(paymentMethodId);
      return { success: true };
    } catch (err) {
      setError('Failed to update payment method');
      console.error('Error updating payment method:', err);
      return { success: false, error: err };
    }
  };

  const getFeatureValue = useCallback((featureId: string) => {
    if (!hasFeature(featureId)) return null;
    // Return feature-specific values (e.g., storage limits, API quotas)
    switch (featureId) {
      case 'unlimited_storage':
        return Infinity;
      case 'ai_insights':
        return 1000;
      case 'priority_support':
        return true;
      default:
        return true;
    }
  }, [hasFeature]);

  return {
    subscription,
    plans,
    loading,
    error,
    isPremium,
    hasFeature,
    getFeatureValue,
    subscribe,
    cancelSubscription,
    updatePaymentMethod,
    refreshData: loadSubscriptionData,
  };
};
