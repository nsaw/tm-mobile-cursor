// iOS OAuth Bridge for Google and Apple Sign-In
// Handles OAuth redirects in native iOS app using ASWebAuthenticationSession

declare global {
  interface Window {
    nativeOAuth?: {
      signInWithGoogle: () => void;
      signInWithApple: () => void;
    };
    handleOAuthCallback?: (data: any) => void;
  }
}

export class IOSOAuthBridge {
  private static instance: IOSOAuthBridge;
  
  static getInstance(): IOSOAuthBridge {
    if (!IOSOAuthBridge.instance) {
      IOSOAuthBridge.instance = new IOSOAuthBridge();
    }
    return IOSOAuthBridge.instance;
  }

  private constructor() {
    this.setupOAuthCallbackHandler();
  }

  isNativeIOSApp(): boolean {
    return !!(window.webkit?.messageHandlers?.nativeAuth);
  }

  private setupOAuthCallbackHandler() {
    // Handle OAuth callback from native iOS
    window.handleOAuthCallback = (data: any) => {
      try {
        const params = typeof data === 'string' ? JSON.parse(data) : data;
        
        if (params.code) {
          // OAuth authorization code received
          this.processOAuthCode(params);
        } else if (params.error) {
          console.error('OAuth error:', params.error);
          this.handleOAuthError(params.error);
        }
      } catch (error) {
        console.error('Failed to process OAuth callback:', error);
      }
    };
  }

  private async processOAuthCode(params: any) {
    try {
      // Send authorization code to backend for token exchange
      const response = await fetch('/api/auth/oauth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Trigger authentication state update
        if (result.success) {
          window.location.reload(); // Refresh to update auth state
        }
      } else {
        throw new Error('OAuth token exchange failed');
      }
    } catch (error) {
      console.error('OAuth processing error:', error);
      this.handleOAuthError('Authentication failed');
    }
  }

  private handleOAuthError(error: string) {
    // Show error to user
    const event = new CustomEvent('oauth-error', { detail: error });
    window.dispatchEvent(event);
  }

  signInWithGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isNativeIOSApp()) {
        // Use native iOS OAuth via nativeAuth bridge
        try {
          window.webkit?.messageHandlers?.nativeAuth?.postMessage({ 
            action: 'oauth',
            provider: 'google' 
          });
          resolve();
        } catch (error) {
          reject(new Error('Failed to initiate Google sign-in'));
        }
      } else {
        // Fallback to web OAuth (for development/testing)
        this.fallbackWebOAuth('google').then(resolve).catch(reject);
      }
    });
  }

  signInWithApple(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isNativeIOSApp()) {
        // Use native iOS OAuth via nativeAuth bridge
        try {
          window.webkit?.messageHandlers?.nativeAuth?.postMessage({ 
            action: 'oauth',
            provider: 'apple' 
          });
          resolve();
        } catch (error) {
          reject(new Error('Failed to initiate Apple sign-in'));
        }
      } else {
        // Fallback to web OAuth (for development/testing)
        this.fallbackWebOAuth('apple').then(resolve).catch(reject);
      }
    });
  }

  private async fallbackWebOAuth(provider: 'google' | 'apple'): Promise<void> {
    // Fallback implementation for web testing
    const redirectUri = window.location.origin + '/auth/callback';
    
    if (provider === 'google') {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('Google client ID not configured');
      }
      
      const authUrl = `https://accounts.google.com/oauth/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=openid email profile`;
      
      window.location.href = authUrl;
    } else if (provider === 'apple') {
      const clientId = import.meta.env.VITE_APPLE_CLIENT_ID || 'com.thoughtmarks.app';
      
      const authUrl = `https://appleid.apple.com/auth/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=name email&` +
        `response_mode=form_post`;
      
      window.location.href = authUrl;
    }
  }
}

// Export singleton instance
export const iosOAuthBridge = IOSOAuthBridge.getInstance();

// Make bridge available globally for native iOS integration
if (typeof window !== 'undefined') {
  window.nativeOAuth = {
    signInWithGoogle: () => iosOAuthBridge.signInWithGoogle(),
    signInWithApple: () => iosOAuthBridge.signInWithApple(),
  };
}