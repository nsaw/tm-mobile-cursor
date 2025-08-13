import { apiClient } from '../../../services/api/apiClient';
import {
  Subscription,
  SubscriptionPlan,
  BillingInfo,
  PaymentMethod,
} from '../types/premium';

class PremiumService {
  private readonly baseUrl = '/premium';

  async getSubscription(): Promise<Subscription | null> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/subscription`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/plans`);
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  }

  async subscribe(planId: string, paymentMethodId?: string): Promise<Subscription> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/subscribe`, {
        planId,
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      console.error('Error subscribing:', error);
      throw error;
    }
  }

  async cancelSubscription(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/cancel`);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  async updatePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await apiClient.patch(`${this.baseUrl}/payment-method`, {
        paymentMethodId,
      });
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  }

  async getBillingInfo(): Promise<BillingInfo> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/billing`);
      return response.data;
    } catch (error) {
      console.error('Error fetching billing info:', error);
      throw error;
    }
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/payment-methods`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }
}

export const premiumService = new PremiumService();
