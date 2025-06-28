// Native iOS Authentication Bridge
// This file integrates with the native iOS authentication bridge for TestFlight apps

declare global {
  interface Window {
    nativeAuth?: {
      isBiometricAvailable(): Promise<boolean>;
      authenticateWithBiometric(): Promise<{success: boolean; error?: string}>;
      enablePasswordAutofill(): void;
      saveCredentials(username: string, password: string): void;
      signInWithGoogle(): Promise<void>;
      signInWithApple(): Promise<void>;
    };
    webkit?: {
      messageHandlers?: {
        nativeAuth?: {
          postMessage(message: any): void;
        };
      };
    };
  }
}

export class NativeIOSAuth {
  private isNativeApp = false;

  constructor() {
    // Detect if running in native iOS app wrapper
    this.isNativeApp = !!(window.webkit?.messageHandlers?.nativeAuth || window.nativeAuth);
  }

  isAvailable(): boolean {
    return this.isNativeApp;
  }

  async isBiometricSupported(): Promise<boolean> {
    if (!this.isNativeApp || !window.nativeAuth) {
      return false;
    }

    try {
      return await window.nativeAuth.isBiometricAvailable();
    } catch (error) {
      console.error('Native biometric check failed:', error);
      return false;
    }
  }

  async authenticateWithBiometric(): Promise<{success: boolean; error?: string}> {
    if (!this.isNativeApp || !window.nativeAuth) {
      return { success: false, error: 'Native authentication not available' };
    }

    try {
      return await window.nativeAuth.authenticateWithBiometric();
    } catch (error) {
      console.error('Native biometric authentication failed:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  enablePasswordAutofill(): void {
    if (this.isNativeApp && window.nativeAuth) {
      window.nativeAuth.enablePasswordAutofill();
    }
  }

  saveCredentials(username: string, password: string): void {
    if (this.isNativeApp && window.nativeAuth) {
      window.nativeAuth.saveCredentials(username, password);
    }
  }

  async signInWithGoogle(): Promise<void> {
    if (!this.isNativeApp || !window.nativeAuth) {
      throw new Error('Native authentication not available');
    }

    try {
      await window.nativeAuth.signInWithGoogle();
    } catch (error) {
      console.error('Native Google sign-in failed:', error);
      throw new Error('Google sign-in failed');
    }
  }

  async signInWithApple(): Promise<void> {
    if (!this.isNativeApp || !window.nativeAuth) {
      throw new Error('Native authentication not available');
    }

    try {
      await window.nativeAuth.signInWithApple();
    } catch (error) {
      console.error('Native Apple sign-in failed:', error);
      throw new Error('Apple sign-in failed');
    }
  }

  // Enhanced input configuration for iOS autofill
  configureAutofillInput(input: HTMLInputElement, type: 'username' | 'password' | 'new-password'): void {
    if (!this.isNativeApp) return;

    switch (type) {
      case 'username':
        input.setAttribute('autocomplete', 'username');
        input.setAttribute('name', 'username');
        input.setAttribute('id', 'username');
        break;
      case 'password':
        input.setAttribute('autocomplete', 'current-password');
        input.setAttribute('name', 'password');
        input.setAttribute('id', 'password');
        break;
      case 'new-password':
        input.setAttribute('autocomplete', 'new-password');
        input.setAttribute('name', 'new-password');
        input.setAttribute('id', 'new-password');
        break;
    }
  }

  // Configure form for iOS autofill
  configureForm(form: HTMLFormElement): void {
    if (!this.isNativeApp) return;

    // Add proper form attributes for iOS recognition
    form.setAttribute('autocomplete', 'on');
    
    // Find and configure username/email inputs
    const usernameInputs = form.querySelectorAll('input[type="email"], input[type="text"]');
    usernameInputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        this.configureAutofillInput(input, 'username');
      }
    });

    // Find and configure password inputs
    const passwordInputs = form.querySelectorAll('input[type="password"]');
    passwordInputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        // Check if this is a new password field (registration/change password)
        const isNewPassword = input.name?.includes('new') || 
                              input.placeholder?.toLowerCase().includes('new') ||
                              form.querySelector('input[name*="confirm"]');
        
        this.configureAutofillInput(input, isNewPassword ? 'new-password' : 'password');
      }
    });
  }
}

export const nativeIOSAuth = new NativeIOSAuth();