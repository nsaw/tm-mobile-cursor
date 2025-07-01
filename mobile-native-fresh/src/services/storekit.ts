import { Platform } from 'react-native';

// Product IDs for different platforms
const PRODUCT_IDS = {
  PREMIUM_MONTHLY: Platform.select({
    ios: 'com.thoughtmarks.premium.monthly',
    android: 'premium_monthly',
    default: 'premium_monthly',
  }) || 'premium_monthly',
  PREMIUM_YEARLY: Platform.select({
    ios: 'com.thoughtmarks.premium.yearly',
    android: 'premium_yearly',
    default: 'premium_yearly',
  }) || 'premium_yearly',
  PREMIUM_LIFETIME: Platform.select({
    ios: 'com.thoughtmarks.premium.lifetime',
    android: 'premium_lifetime',
    default: 'premium_lifetime',
  }) || 'premium_lifetime',
};

export interface PurchaseResult {
  success: boolean;
  error?: string;
  transactionId?: string;
  productId?: string;
}

export interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
}

// Mock products for testing
const MOCK_PRODUCTS: Product[] = [
  {
    productId: PRODUCT_IDS.PREMIUM_MONTHLY,
    title: 'Premium Monthly',
    description: 'Unlock all premium features for one month',
    price: '$4.99',
  },
  {
    productId: PRODUCT_IDS.PREMIUM_YEARLY,
    title: 'Premium Yearly',
    description: 'Unlock all premium features for one year (Save 40%)',
    price: '$29.99',
  },
  {
    productId: PRODUCT_IDS.PREMIUM_LIFETIME,
    title: 'Premium Lifetime',
    description: 'Unlock all premium features forever',
    price: '$99.99',
  },
];

class StoreKitService {
  private isInitialized = false;
  private mockPurchases: string[] = [];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 500));
      this.isInitialized = true;
      console.log('🛒 StoreKit: Connected to store (mock)');
    } catch (error) {
      console.error('🛒 StoreKit: Failed to connect:', error);
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    await this.initialize();

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('🛒 StoreKit: Retrieved products:', MOCK_PRODUCTS);
      return MOCK_PRODUCTS;
    } catch (error) {
      console.error('🛒 StoreKit: Error getting products:', error);
      return [];
    }
  }

  async purchaseProduct(productId: string): Promise<PurchaseResult> {
    await this.initialize();

    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate 90% success rate for testing
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        const transactionId = `mock_transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.mockPurchases.push(productId);
        
        console.log('🛒 StoreKit: Purchase successful:', { productId, transactionId });
        
        return {
          success: true,
          transactionId,
          productId,
        };
      } else {
        console.log('🛒 StoreKit: Purchase failed (simulated)');
        return {
          success: false,
          error: 'Purchase failed: User cancelled',
        };
      }
    } catch (error) {
      console.error('🛒 StoreKit: Purchase error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async restorePurchases(): Promise<PurchaseResult[]> {
    await this.initialize();

    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const restoredPurchases: PurchaseResult[] = this.mockPurchases.map(productId => ({
        success: true,
        transactionId: `restored_${productId}_${Date.now()}`,
        productId,
      }));
      
      console.log('🛒 StoreKit: Restored purchases:', restoredPurchases);
      return restoredPurchases;
    } catch (error) {
      console.error('🛒 StoreKit: Restore error:', error);
      return [{
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }];
    }
  }

  async disconnect(): Promise<void> {
    if (this.isInitialized) {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        this.isInitialized = false;
        console.log('🛒 StoreKit: Disconnected from store (mock)');
      } catch (error) {
        console.error('🛒 StoreKit: Failed to disconnect:', error);
      }
    }
  }

  getProductIds() {
    return PRODUCT_IDS;
  }

  // Mock method to simulate existing purchases
  hasActivePurchase(productId: string): boolean {
    return this.mockPurchases.includes(productId);
  }
}

export const storeKitService = new StoreKitService(); 