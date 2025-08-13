export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  trialEndDate?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: PremiumFeature[];
  trialDays: number;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'ai' | 'storage' | 'analytics' | 'customization' | 'support';
  required: boolean;
}

export interface BillingInfo {
  customerId: string;
  email: string;
  name: string;
  address?: string;
  country?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}
