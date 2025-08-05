import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@thoughtmarks_pin';
const PIN_ENABLED_KEY = '@thoughtmarks_pin_enabled';

export interface PINAuthResult {
  success: boolean;
  error?: string;
}

export class PINAuth {
  /**
   * Check if PIN authentication is enabled
   */
  static async isEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(PIN_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking PIN status:', error);
      return false;
    }
  }

  /**
   * Enable PIN authentication
   */
  static async enable(): Promise<void> {
    try {
      await AsyncStorage.setItem(PIN_ENABLED_KEY, 'true');
    } catch (error) {
      console.error('Error enabling PIN:', error);
      throw error;
    }
  }

  /**
   * Disable PIN authentication
   */
  static async disable(): Promise<void> {
    try {
      await AsyncStorage.setItem(PIN_ENABLED_KEY, 'false');
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error disabling PIN:', error);
      throw error;
    }
  }

  /**
   * Set up a new PIN
   */
  static async setupPIN(pin: string): Promise<PINAuthResult> {
    try {
      if (pin.length !== 4) {
        return { success: false, error: 'PIN must be 4 digits' };
      }

      await AsyncStorage.setItem(STORAGE_KEY, pin);
      await this.enable();
      
      return { success: true };
    } catch (error) {
      console.error('Error setting up PIN:', error);
      return { success: false, error: 'Failed to set up PIN' };
    }
  }

  /**
   * Verify a PIN
   */
  static async verifyPIN(pin: string): Promise<PINAuthResult> {
    try {
      const storedPin = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (!storedPin) {
        return { success: false, error: 'No PIN set up' };
      }

      if (pin === storedPin) {
        return { success: true };
      } else {
        return { success: false, error: 'Incorrect PIN' };
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return { success: false, error: 'Failed to verify PIN' };
    }
  }

  /**
   * Change PIN (requires current PIN verification)
   */
  static async changePIN(currentPin: string, newPin: string): Promise<PINAuthResult> {
    try {
      // First verify current PIN
      const verifyResult = await this.verifyPIN(currentPin);
      if (!verifyResult.success) {
        return verifyResult;
      }

      // Then set up new PIN
      return await this.setupPIN(newPin);
    } catch (error) {
      console.error('Error changing PIN:', error);
      return { success: false, error: 'Failed to change PIN' };
    }
  }

  /**
   * Remove PIN (requires current PIN verification)
   */
  static async removePIN(pin: string): Promise<PINAuthResult> {
    try {
      // First verify current PIN
      const verifyResult = await this.verifyPIN(pin);
      if (!verifyResult.success) {
        return verifyResult;
      }

      // Then disable PIN
      await this.disable();
      return { success: true };
    } catch (error) {
      console.error('Error removing PIN:', error);
      return { success: false, error: 'Failed to remove PIN' };
    }
  }

  /**
   * Check if PIN is set up
   */
  static async hasPIN(): Promise<boolean> {
    try {
      const pin = await AsyncStorage.getItem(STORAGE_KEY);
      return pin !== null;
    } catch (error) {
      console.error('Error checking PIN existence:', error);
      return false;
    }
  }

  /**
   * Get PIN setup status
   */
  static async getPINStatus(): Promise<{
    hasPIN: boolean;
    isEnabled: boolean;
  }> {
    try {
      const [hasPIN, isEnabled] = await Promise.all([
        this.hasPIN(),
        this.isEnabled(),
      ]);

      return { hasPIN, isEnabled };
    } catch (error) {
      console.error('Error getting PIN status:', error);
      return { hasPIN: false, isEnabled: false };
    }
  }
} 