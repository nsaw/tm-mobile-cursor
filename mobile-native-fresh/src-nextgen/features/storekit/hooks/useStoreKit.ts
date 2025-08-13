import { useState, useEffect, useCallback } from 'react';
import {
  StoreKitProduct,
  StoreKitPurchase,
  StoreKitError,
} from '../types/storekit';
import { storeKitService } from '../services/storekitService';

export const useStoreKit = () => {
  const [products, setProducts] = useState<StoreKitProduct[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<StoreKitPurchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<StoreKitError | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    initializeStoreKit();
  }, []);

  const initializeStoreKit = async () => {
    try {
      setLoading(true);
      setError(null);
      await storeKitService.initialize();
      await loadProducts();
      await loadActiveSubscription();
    } catch (err) {
      setError({
        code: 'INITIALIZATION_FAILED',
        message: err instanceof Error ? err.message : 'Failed to initialize StoreKit',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const productsData = await storeKitService.loadProducts();
      setProducts(productsData);
    } catch (err) {
      setError({
        code: 'LOAD_PRODUCTS_FAILED',
        message: err instanceof Error ? err.message : 'Failed to load products',
      });
    }
  };

  const loadActiveSubscription = async () => {
    try {
      const subscription = await storeKitService.getActiveSubscription();
      setActiveSubscription(subscription);
    } catch (err) {
      console.error('Failed to load active subscription:', err);
    }
  };

  const purchaseProduct = useCallback(async (productId: string): Promise<StoreKitPurchase> => {
    try {
      setPurchasing(true);
      setError(null);
      const purchase = await storeKitService.purchaseProduct(productId);
      await loadActiveSubscription();
      return purchase;
    } catch (err) {
      const error: StoreKitError = {
        code: 'PURCHASE_FAILED',
        message: err instanceof Error ? err.message : 'Purchase failed',
      };
      setError(error);
      throw error;
    } finally {
      setPurchasing(false);
    }
  }, []);

  const restorePurchases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await storeKitService.restorePurchases();
      await loadActiveSubscription();
    } catch (err) {
      setError({
        code: 'RESTORE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to restore purchases',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelSubscription = useCallback(async () => {
    try {
      setError(null);
      await storeKitService.cancelSubscription();
      await loadActiveSubscription();
    } catch (err) {
      setError({
        code: 'CANCEL_FAILED',
        message: err instanceof Error ? err.message : 'Failed to cancel subscription',
      });
    }
  }, []);

  return {
    products,
    activeSubscription,
    loading,
    error,
    purchasing,
    purchaseProduct,
    restorePurchases,
    cancelSubscription,
    refresh: initializeStoreKit,
  };
};
