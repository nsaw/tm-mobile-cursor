/**
 * Enhanced 4-digit PIN authentication system with comprehensive error handling
 * Alternative to complex OAuth bridges
 */

import { errorHandler, type ErrorContext } from './error-handler';
import { userPreferences } from './user-preferences';

interface PinAuthResult {
  success: boolean;
  error?: string;
  userId?: string;
  user?: any;
}

interface StoredPinData {
  hashedPin: string;
  email: string;
  userId: string;
  createdAt: number;
}

class PinAuthSystem {
  private storageKey = 'thoughtmarks_pin_auth';
  
  /**
   * Hash a PIN using a simple but secure method
   */
  private async hashPin(pin: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate a random salt
   */
  private generateSalt(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Set up a 4-digit PIN for quick authentication
   */
  async setupPin(email: string, userId: string, pin: string): Promise<PinAuthResult> {
    const context: ErrorContext = {
      component: 'PinAuthSystem',
      action: 'setupPin',
      userId
    };

    const result = await errorHandler.withErrorHandling(async () => {
      if (!/^\d{4}$/.test(pin)) {
        throw new Error("PIN must be exactly 4 digits");
      }

      const salt = this.generateSalt();
      const hashedPin = await this.hashPin(pin, salt);
      
      const pinData: StoredPinData = {
        hashedPin: salt + ':' + hashedPin,
        email,
        userId,
        createdAt: Date.now()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(pinData));
      
      // Update user preferences to enable PIN auth
      userPreferences.togglePinAuth(true, userId);
      userPreferences.setLastLoginMethod('pin', userId);
      
      return { userId };
    }, context, "Failed to set up PIN authentication");

    if (result.success) {
      return {
        success: true,
        userId: result.data?.userId
      };
    } else {
      return {
        success: false,
        error: result.error?.userMessage || "Failed to set up PIN authentication"
      };
    }
  }

  /**
   * Authenticate with 4-digit PIN
   */
  async authenticateWithPin(pin: string): Promise<PinAuthResult> {
    const context: ErrorContext = {
      component: 'PinAuthSystem',
      action: 'authenticateWithPin'
    };

    const result = await errorHandler.withErrorHandling(async () => {
      if (!/^\d{4}$/.test(pin)) {
        throw new Error("PIN must be exactly 4 digits");
      }

      const storedData = localStorage.getItem(this.storageKey);
      if (!storedData) {
        throw new Error("No PIN set up. Please sign in with email first.");
      }

      const pinData: StoredPinData = JSON.parse(storedData);
      const [salt, storedHash] = pinData.hashedPin.split(':');
      
      if (!salt || !storedHash) {
        throw new Error("Invalid PIN data. Please set up PIN again.");
      }

      const inputHash = await this.hashPin(pin, salt);
      
      if (inputHash !== storedHash) {
        throw new Error("Incorrect PIN");
      }

      // Fetch the actual user data to ensure proper authentication state
      // For demo users, check if they have demo token stored
      const demoToken = localStorage.getItem('thoughtmarks-demo-token');
      const isDemoUser = pinData.email === 'test@thoughtmarks.app' || pinData.email === 'hello@thoughtmarks.app';
      
      let userResponse;
      if (isDemoUser && demoToken) {
        // For demo users, use the demo token for authentication
        userResponse = await fetch(`/api/users/${pinData.userId}`, {
          headers: {
            'Authorization': `Bearer ${demoToken}`
          }
        });
      } else {
        // For regular users, use standard authentication
        userResponse = await fetch(`/api/users/${pinData.userId}`);
      }
      
      if (!userResponse.ok) {
        throw new Error(`User account verification failed (${userResponse.status})`);
      }

      const responseText = await userResponse.text();
      let userData;
      
      try {
        userData = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error("Invalid user data format");
      }

      if (!userData || !userData.id) {
        throw new Error("Invalid user account data");
      }

      // Create a Firebase-compatible user object
      const user = {
        uid: userData.firebaseUid || userData.id.toString(),
        email: userData.email,
        displayName: userData.displayName,
        ...userData
      };
      
      // Store user in localStorage for API authentication
      localStorage.setItem('thoughtmarks-user', JSON.stringify(userData));
      localStorage.setItem('thoughtmarks-demo-token', `demo-token-${userData.id}`);
      
      // Update last login method preference
      userPreferences.setLastLoginMethod('pin', pinData.userId);
      
      // Dispatch custom event to trigger auth state update
      window.dispatchEvent(new CustomEvent('pinAuthSuccess', { 
        detail: { user: userData } 
      }));
      
      return {
        userId: pinData.userId,
        user: user
      };
    }, context, "PIN authentication failed");

    if (result.success) {
      return {
        success: true,
        userId: result.data?.userId,
        user: result.data?.user
      };
    } else {
      return {
        success: false,
        error: result.error?.userMessage || "Authentication failed"
      };
    }
  }

  /**
   * Check if PIN is set up
   */
  isPinSetup(): boolean {
    const storedData = localStorage.getItem(this.storageKey);
    return !!storedData;
  }

  /**
   * Get stored email for PIN setup
   */
  getStoredEmail(): string | null {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (!storedData) return null;
      
      const pinData: StoredPinData = JSON.parse(storedData);
      return pinData.email;
    } catch {
      return null;
    }
  }

  /**
   * Remove PIN authentication
   */
  removePin(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Update PIN
   */
  async updatePin(oldPin: string, newPin: string): Promise<PinAuthResult> {
    // Verify old PIN first
    const verifyResult = await this.authenticateWithPin(oldPin);
    if (!verifyResult.success) {
      return {
        success: false,
        error: "Current PIN is incorrect"
      };
    }

    // Get stored data
    const storedData = localStorage.getItem(this.storageKey);
    if (!storedData) {
      return {
        success: false,
        error: "No PIN data found"
      };
    }

    const pinData: StoredPinData = JSON.parse(storedData);
    
    // Set up new PIN
    return this.setupPin(pinData.email, pinData.userId, newPin);
  }
}

export const pinAuth = new PinAuthSystem();