import { useAppStore } from '../state/store';

interface PremiumFeaturesHook {
  isPremium: boolean;
  checkPremiumAccess: (feature: string) => boolean;
}

export const usePremiumFeatures = (): PremiumFeaturesHook => {
  const { user } = useAppStore();
  const isPremium = user?.isPremium || false;

  const checkPremiumAccess = (feature: string) => {
    if (!isPremium) {
      console.warn(`Premium feature ${feature} requires subscription`);
      return false;
    }
    return true;
  };

  return {
    isPremium,
    checkPremiumAccess,
  };
};
