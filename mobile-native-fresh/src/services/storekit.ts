import { Platform } from 'react-native';

import { apiService } from './api';

// StoreKit product identifiers
export const PREMIUM_PRODUCT_ID = 'thoughtmarks_premium_monthly';
export const PREMIUM_PRODUCT_ID_YEARLY = 'thoughtmarks_premium_yearly';

export interface StoreKitProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  priceAmount: number;
  currency: string;
  localizedPrice: string;
}

export interface StoreKitPurchase {
  productId: string;
  transactionId: string;
  purchaseDate: string;
  expirationDate?: string;
}

export interface StoreKitError {
  code: string;
  message: string;
  details?: any;
}

class StoreKitService {
  private isInitialized = false;
  private products: StoreKitProduct[] = [];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🛒 StoreKit: Initializing...');
      
      if (Platform.OS === 'ios') {
        // Initialize StoreKit for iOS
        await this.initializeIOS();
      } else {
        // For Android, we'll use a mock implementation for now
        await this.initializeAndroid();
      }

      this.isInitialized = true;
      console.log('🛒 StoreKit: Initialized successfully');
    } catch (error) {
      console.error('🛒 StoreKit: Initialization failed:', error);
      throw error;
    }
  }

  private async initializeIOS(): Promise<void> {
    // TODO: Implement actual StoreKit initialization for iOS
    // This would typically involve:
    // - Setting up StoreKit listeners
    // - Loading product information
    // - Restoring previous purchases
    
    console.log('🛒 StoreKit: iOS initialization (mock)');
    
    // Mock product data for development
    this.products = [
      {
        id: PREMIUM_PRODUCT_ID,
        title: 'Thoughtmarks Premium Monthly',
        description: 'Unlock all premium features including AI insights, smart reminders, and advanced search.',
        price: '$4.99',
        priceAmount: 4.99,
        currency: 'USD',
        localizedPrice: '$4.99'
      },
      {
        id: PREMIUM_PRODUCT_ID_YEARLY,
        title: 'Thoughtmarks Premium Yearly',
        description: 'Unlock all premium features with 2 months free when billed annually.',
        price: '$49.99',
        priceAmount: 49.99,
        currency: 'USD',
        localizedPrice: '$49.99'
      }
    ];
  }

  private async initializeAndroid(): Promise<void> {
    // TODO: Implement Google Play Billing for Android
    console.log('🛒 StoreKit: Android initialization (mock)');
    
    // Mock product data for development
    this.products = [
      {
        id: PREMIUM_PRODUCT_ID,
        title: 'Thoughtmarks Premium Monthly',
        description: 'Unlock all premium features including AI insights, smart reminders, and advanced search.',
        price: '$4.99',
        priceAmount: 4.99,
        currency: 'USD',
        localizedPrice: '$4.99'
      },
      {
        id: PREMIUM_PRODUCT_ID_YEARLY,
        title: 'Thoughtmarks Premium Yearly',
        description: 'Unlock all premium features with 2 months free when billed annually.',
        price: '$49.99',
        priceAmount: 49.99,
        currency: 'USD',
        localizedPrice: '$49.99'
      }
    ];
  }

  async getProducts(): Promise<StoreKitProduct[]> {
    await this.initialize();
    return this.products;
  }

  async purchaseProduct(productId: string): Promise<StoreKitPurchase> {
    await this.initialize();
    
    console.log('🛒 StoreKit: Attempting purchase for product:', productId);
    
    try {
      // Mock purchase flow for development
      if (Platform.OS === 'ios') {
        return await this.purchaseProductIOS(productId);
      } else {
        return await this.purchaseProductAndroid(productId);
      }
    } catch (error) {
      console.error('🛒 StoreKit: Purchase failed:', error);
      throw error;
    }
  }

  private async purchaseProductIOS(productId: string): Promise<StoreKitPurchase> {
    // TODO: Implement actual StoreKit purchase for iOS
    console.log('🛒 StoreKit: iOS purchase (mock) for product:', productId);
    
    // Simulate purchase delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful purchase
    const purchase: StoreKitPurchase = {
      productId,
      transactionId: `mock_transaction_${Date.now()}`,
      purchaseDate: new Date().toISOString(),
      expirationDate: productId === PREMIUM_PRODUCT_ID_YEARLY 
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Update user premium status via backend
    await this.updatePremiumStatus(purchase);
    
    return purchase;
  }

  private async purchaseProductAndroid(productId: string): Promise<StoreKitPurchase> {
    // TODO: Implement Google Play Billing purchase
    console.log('🛒 StoreKit: Android purchase (mock) for product:', productId);
    
    // Simulate purchase delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful purchase
    const purchase: StoreKitPurchase = {
      productId,
      transactionId: `mock_transaction_${Date.now()}`,
      purchaseDate: new Date().toISOString(),
      expirationDate: productId === PREMIUM_PRODUCT_ID_YEARLY 
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Update user premium status via backend
    await this.updatePremiumStatus(purchase);
    
    return purchase;
  }

  async restorePurchases(): Promise<StoreKitPurchase[]> {
    await this.initialize();
    
    console.log('🛒 StoreKit: Restoring purchases...');
    
    try {
      if (Platform.OS === 'ios') {
        return await this.restorePurchasesIOS();
      } else {
        return await this.restorePurchasesAndroid();
      }
    } catch (error) {
      console.error('🛒 StoreKit: Restore failed:', error);
      throw error;
    }
  }

  private async restorePurchasesIOS(): Promise<StoreKitPurchase[]> {
    // TODO: Implement actual StoreKit restore for iOS
    console.log('🛒 StoreKit: iOS restore (mock)');
    
    // Simulate restore delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock restored purchases (empty for now)
    const restoredPurchases: StoreKitPurchase[] = [];
    
    // Update user premium status if any purchases were restored
    if (restoredPurchases.length > 0) {
      await this.updatePremiumStatus(restoredPurchases[0]);
    }
    
    return restoredPurchases;
  }

  private async restorePurchasesAndroid(): Promise<StoreKitPurchase[]> {
    // TODO: Implement Google Play Billing restore
    console.log('🛒 StoreKit: Android restore (mock)');
    
    // Simulate restore delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock restored purchases (empty for now)
    const restoredPurchases: StoreKitPurchase[] = [];
    
    // Update user premium status if any purchases were restored
    if (restoredPurchases.length > 0) {
      await this.updatePremiumStatus(restoredPurchases[0]);
    }
    
    return restoredPurchases;
  }

  private async updatePremiumStatus(purchase: StoreKitPurchase): Promise<void> {
    try {
      console.log('🛒 StoreKit: Updating premium status with backend...');
      
      const response = await apiService.updatePremiumStatus({
        productId: purchase.productId,
        transactionId: purchase.transactionId,
        purchaseDate: purchase.purchaseDate,
        expirationDate: purchase.expirationDate
      });

      if (response.success) {
        console.log('🛒 StoreKit: Premium status updated successfully');
      } else {
        console.error('🛒 StoreKit: Failed to update premium status:', response.error);
        throw new Error('Failed to update premium status');
      }
    } catch (error) {
      console.error('🛒 StoreKit: Error updating premium status:', error);
      throw error;
    }
  }

  async validateReceipt(receipt: string): Promise<boolean> {
    // TODO: Implement receipt validation with Apple/Google servers
    console.log('🛒 StoreKit: Validating receipt (mock)');
    
    // Mock validation - always return true for development
    return true;
  }

  isAvailable(): boolean {
    return Platform.OS === 'ios' || Platform.OS === 'android';
  }
}

export const storeKitService = new StoreKitService(); 