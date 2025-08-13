import React from 'react';
import { useAuthStore } from '../../../state/stores/authStore';
// import { PremiumFeature, FeatureGate } from '../types/premium';

export const useFeatureGate = (featureId: string): {
  isEnabled: boolean;
  requiresAuth: boolean;
  requiresSubscription: boolean;
  canAccess: boolean;
} => {
  const { isAuthenticated, user } = useAuthStore();

  const isFeatureEnabled = (): boolean => {
    // Check if user is authenticated
    if (!isAuthenticated) return false;

    // Check if user has active subscription
    if (user?.isPremium) return true;

    // Check if user is demo user (limited access)
    if (user?.isPremium === false && user?.email?.includes('demo')) {
      return ['basic-features', 'limited-ai'].includes(featureId);
    }

    return false;
  };

  const getFeatureAccess = (): {
    isEnabled: boolean;
    requiresAuth: boolean;
    requiresSubscription: boolean;
    canAccess: boolean;
  } => {
    const isEnabled = isFeatureEnabled();
    const requiresAuth = !isAuthenticated;
    const requiresSubscription = isAuthenticated && !user?.isPremium;

    return {
      isEnabled,
      requiresAuth,
      requiresSubscription,
      canAccess: isEnabled,
    };
  };

  return getFeatureAccess();
};

export const withFeatureGate = <P extends object>(
  Component: React.ComponentType<P>,
  featureId: string,
  FallbackComponent?: React.ComponentType<P>
): React.ComponentType<P> => {
  const Wrapped: React.FC<P> = (props: P) => {
    const { isEnabled } = useFeatureGate(featureId);

    if (!isEnabled) {
      if (FallbackComponent) {
        return React.createElement(FallbackComponent, props);
      }
      return null;
    }

    return React.createElement(Component, props);
  };
  Wrapped.displayName = `WithFeatureGate(Feature)`;
  return Wrapped;
};
