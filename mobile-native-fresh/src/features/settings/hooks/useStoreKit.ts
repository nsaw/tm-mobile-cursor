import { useState, useEffect } from 'react';

import { storeKitService, type Product, type PurchaseResult } from '../../../services/storekit';
import { apiService } from '../../../services/api';

export const useStoreKit = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const availableProducts = await storeKitService.getProducts();
      setProducts(availableProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const purchaseProduct = async (productId: string): Promise<PurchaseResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await storeKitService.purchaseProduct(productId);
      
      if (result.success) {
        // Update user's premium status on backend
        await updatePremiumStatus(productId);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const restorePurchases = async (): Promise<PurchaseResult[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await storeKitService.restorePurchases();
      
      // Update premium status for any restored purchases
      for (const result of results) {
        if (result.success && result.productId) {
          await updatePremiumStatus(result.productId);
        }
      }
      
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Restore failed';
      setError(errorMessage);
      return [{
        success: false,
        error: errorMessage,
      }];
    } finally {
      setLoading(false);
    }
  };

  const updatePremiumStatus = async (productId: string) => {
    try {
      // Call backend to update user's premium status
      const response = await apiService.updatePremiumStatus({
        productId,
        transactionId: `mock_${Date.now()}`,
      });
      
      if (response.success) {
        console.log('Premium status updated successfully');
      } else {
        console.error('Failed to update premium status:', response.error);
      }
    } catch (err) {
      console.error('Error updating premium status:', err);
    }
  };

  const hasActivePurchase = (productId: string): boolean => {
    return storeKitService.hasActivePurchase(productId);
  };

  return {
    products,
    loading,
    error,
    purchaseProduct,
    restorePurchases,
    loadProducts,
    hasActivePurchase,
  };
}; 