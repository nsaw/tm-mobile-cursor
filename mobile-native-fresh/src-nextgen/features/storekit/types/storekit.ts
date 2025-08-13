export interface StoreKitProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  localizedPrice: string;
  type: 'consumable' | 'non_consumable' | 'auto_renewable' | 'non_auto_renewable';
  subscriptionPeriod?: string;
  introductoryPrice?: StoreKitIntroductoryPrice;
  isAvailable: boolean;
}

export interface StoreKitIntroductoryPrice {
  price: number;
  currency: string;
  localizedPrice: string;
  period: string;
  numberOfPeriods: number;
}

export interface StoreKitPurchase {
  id: string;
  productId: string;
  transactionId: string;
  originalTransactionId?: string;
  purchaseDate: Date;
  expirationDate?: Date;
  isExpired: boolean;
  isTrialPeriod: boolean;
  isIntroductoryPricePeriod: boolean;
  quantity: number;
  status: 'pending' | 'purchased' | 'failed' | 'restored' | 'deferred' | 'cancelled';
}

export interface StoreKitReceipt {
  bundleId: string;
  applicationVersion: string;
  originalApplicationVersion: string;
  inApp: StoreKitReceiptItem[];
  originalPurchaseDate: Date;
  expirationDate?: Date;
  isExpired: boolean;
}

export interface StoreKitReceiptItem {
  productId: string;
  transactionId: string;
  originalTransactionId: string;
  purchaseDate: Date;
  originalPurchaseDate: Date;
  expirationDate?: Date;
  quantity: number;
  isTrialPeriod: boolean;
  isIntroductoryPricePeriod: boolean;
}

export interface StoreKitError {
  code: string;
  message: string;
  userInfo?: any;
}

export interface StoreKitConfig {
  enableReceiptValidation: boolean;
  enableAutoRestore: boolean;
  enablePromotionalOffers: boolean;
  enableFamilySharing: boolean;
  receiptValidationUrl?: string;
}
