import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../auth/hooks/useAuth';
import { storeKitService, StoreKitProduct, StoreKitPurchase } from '../../../services/storekit';

export const useStoreKit = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<StoreKitProduct[]>([]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const availableProducts = await storeKitService.getProducts();
      setProducts(availableProducts);
      return availableProducts;
    } catch (error) {
      console.error('Failed to load products:', error);
      Alert.alert('Error', 'Failed to load premium products. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const purchaseProduct = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      console.log('🛒 useStoreKit: Starting purchase for product:', productId);
      
      const purchase = await storeKitService.purchaseProduct(productId);
      console.log('🛒 useStoreKit: Purchase successful:', purchase);
      
      // Refresh user data to get updated premium status
      await refreshUser();
      
      Alert.alert(
        'Purchase Successful!',
        'Thank you for upgrading to Premium! You now have access to all premium features.',
        [{ text: 'OK' }]
      );
      
      return purchase;
    } catch (error: any) {
      console.error('🛒 useStoreKit: Purchase failed:', error);
      
      let errorMessage = 'Purchase failed. Please try again.';
      
      if (error.message?.includes('cancelled')) {
        errorMessage = 'Purchase was cancelled.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message?.includes('payment')) {
        errorMessage = 'Payment failed. Please check your payment method and try again.';
      }
      
      Alert.alert('Purchase Failed', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  const restorePurchases = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🛒 useStoreKit: Starting purchase restore...');
      
      const restoredPurchases = await storeKitService.restorePurchases();
      console.log('🛒 useStoreKit: Restore completed:', restoredPurchases);
      
      if (restoredPurchases.length > 0) {
        // Refresh user data to get updated premium status
        await refreshUser();
        
        Alert.alert(
          'Purchases Restored!',
          `Successfully restored ${restoredPurchases.length} purchase(s). Your premium features are now available.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found to restore.',
          [{ text: 'OK' }]
        );
      }
      
      return restoredPurchases;
    } catch (error: any) {
      console.error('🛒 useStoreKit: Restore failed:', error);
      
      let errorMessage = 'Failed to restore purchases. Please try again.';
      
      if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      Alert.alert('Restore Failed', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  const isPremium = user?.isPremium || user?.isTestUser || false;
  const isAvailable = storeKitService.isAvailable();

  return {
    loading,
    products,
    isPremium,
    isAvailable,
    loadProducts,
    purchaseProduct,
    restorePurchases,
  };
}; 