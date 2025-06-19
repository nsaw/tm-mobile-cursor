interface BiometricCredentials {
  id: string;
  rawId: ArrayBuffer;
  response: {
    clientDataJSON: ArrayBuffer;
    authenticatorData: ArrayBuffer;
    signature: ArrayBuffer;
    userHandle?: ArrayBuffer;
  };
  type: string;
}

interface BiometricRegistration {
  id: string;
  rawId: ArrayBuffer;
  response: {
    clientDataJSON: ArrayBuffer;
    attestationObject: ArrayBuffer;
  };
  type: string;
}

export class BiometricAuth {
  private static instance: BiometricAuth;
  
  static getInstance(): BiometricAuth {
    if (!BiometricAuth.instance) {
      BiometricAuth.instance = new BiometricAuth();
    }
    return BiometricAuth.instance;
  }

  async isSupported(): Promise<boolean> {
    try {
      const hasCredentials = !!window.PublicKeyCredential;
      console.log("PublicKeyCredential available:", hasCredentials);
      
      if (!hasCredentials) return false;
      
      const hasAuthenticator = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      console.log("Platform authenticator available:", hasAuthenticator);
      
      return hasAuthenticator;
    } catch (error) {
      console.log("Biometric support check error:", error);
      return false;
    }
  }

  async isConditionalMediationSupported(): Promise<boolean> {
    try {
      return !!(window.PublicKeyCredential && 
               PublicKeyCredential.isConditionalMediationAvailable &&
               await PublicKeyCredential.isConditionalMediationAvailable());
    } catch {
      return false;
    }
  }

  async registerBiometric(userId: string, username: string): Promise<boolean> {
    try {
      if (!await this.isSupported()) {
        throw new Error('Biometric authentication not supported');
      }

      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userIdBytes = new TextEncoder().encode(userId);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "Thoughtmarks",
          id: window.location.hostname,
        },
        user: {
          id: userIdBytes,
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        timeout: 60000,
        attestation: "direct",
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create credential');
      }

      // Store credential ID for future authentication (userId should be Firebase UID)
      localStorage.setItem('biometric_credential_id', credential.id);
      localStorage.setItem('biometric_user_id', userId); // This should be Firebase UID
      localStorage.setItem('biometric_enabled', 'true');

      return true;
    } catch (error) {
      console.error('Biometric registration failed:', error);
      return false;
    }
  }

  async authenticateWithBiometric(): Promise<{ success: boolean; userId?: string }> {
    try {
      if (!await this.isSupported()) {
        return { success: false };
      }

      const credentialId = localStorage.getItem('biometric_credential_id');
      const firebaseUid = localStorage.getItem('biometric_user_id');
      
      if (!credentialId || !firebaseUid) {
        return { success: false };
      }

      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const credentialIdBytes = Uint8Array.from(atob(credentialId), c => c.charCodeAt(0));

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [{
          id: credentialIdBytes,
          type: 'public-key',
        }],
        userVerification: 'required',
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      }) as PublicKeyCredential;

      if (!assertion) {
        throw new Error('Authentication failed');
      }

      // Fetch and set user data after successful authentication
      try {
        const response = await fetch(`/api/users/by-firebase/${firebaseUid}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          localStorage.setItem('thoughtmarks-user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }

      return { success: true, userId: firebaseUid };
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return { success: false };
    }
  }

  async authenticateWithConditionalUI(): Promise<{ success: boolean; userId?: string }> {
    try {
      if (!await this.isConditionalMediationSupported()) {
        return { success: false };
      }

      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        userVerification: 'preferred',
        timeout: 300000, // 5 minutes for conditional UI
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
        mediation: 'conditional' as any,
      }) as PublicKeyCredential;

      if (!assertion) {
        return { success: false };
      }

      const firebaseUid = localStorage.getItem('biometric_user_id');
      if (firebaseUid) {
        // Fetch and set user data
        try {
          const response = await fetch(`/api/users/by-firebase/${firebaseUid}`, {
            credentials: 'include'
          });
          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('thoughtmarks-user', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
      return { success: true, userId: firebaseUid ?? undefined };
    } catch (error) {
      console.error('Conditional UI authentication failed:', error);
      return { success: false };
    }
  }

  isBiometricEnabled(): boolean {
    return localStorage.getItem('biometric_enabled') === 'true';
  }

  disableBiometric(): void {
    localStorage.removeItem('biometric_credential_id');
    localStorage.removeItem('biometric_user_id');
    localStorage.removeItem('biometric_enabled');
  }

  async promptForBiometricSetup(userId: string, username: string): Promise<boolean> {
    if (!await this.isSupported()) {
      return false;
    }

    if (this.isBiometricEnabled()) {
      return true;
    }

    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Enable Face ID</h3>
            <p class="text-gray-400 text-sm">Use Face ID to sign in quickly and securely</p>
          </div>
          <div class="space-y-3">
            <button id="enable-biometric" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium">
              Enable Face ID
            </button>
            <button id="skip-biometric" class="w-full border border-gray-600 text-gray-300 hover:bg-gray-800 py-3 px-4 rounded-lg font-medium">
              Skip for now
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const enableBtn = modal.querySelector('#enable-biometric') as HTMLButtonElement;
      const skipBtn = modal.querySelector('#skip-biometric') as HTMLButtonElement;

      enableBtn.onclick = async () => {
        const success = await this.registerBiometric(userId, username);
        document.body.removeChild(modal);
        resolve(success);
      };

      skipBtn.onclick = () => {
        document.body.removeChild(modal);
        resolve(false);
      };
    });
  }
}

export const biometricAuth = BiometricAuth.getInstance();