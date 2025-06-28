// Simplified Passkeys implementation for production launch
// Focus on working functionality rather than perfect TypeScript compliance

export class SimplePasskeyAuth {
  private static instance: SimplePasskeyAuth;
  private isSupported: boolean = false;

  constructor() {
    this.checkSupport();
  }

  static getInstance(): SimplePasskeyAuth {
    if (!SimplePasskeyAuth.instance) {
      SimplePasskeyAuth.instance = new SimplePasskeyAuth();
    }
    return SimplePasskeyAuth.instance;
  }

  private checkSupport(): void {
    this.isSupported = !!(
      window.PublicKeyCredential &&
      navigator.credentials &&
      navigator.credentials.create &&
      navigator.credentials.get
    );
  }

  isPasskeySupported(): boolean {
    return this.isSupported;
  }

  async setupPasskey(email: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isSupported) {
      return { success: false, error: 'Passkeys not supported on this device' };
    }

    try {
      // Generate a proper WebAuthn credential
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: "Thoughtmarks",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(email),
            name: email,
            displayName: email.split('@')[0],
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            requireResidentKey: true,
          },
          timeout: 60000,
          attestation: "direct",
        },
      }) as PublicKeyCredential;

      if (credential) {
        // Store credential info for later authentication
        const credentialData = {
          email,
          credentialId: Array.from(new Uint8Array(credential.rawId)),
          timestamp: Date.now(),
        };
        
        localStorage.setItem('thoughtmarks_passkey', JSON.stringify(credentialData));
        return { success: true };
      } else {
        return { success: false, error: 'Failed to create passkey' };
      }
    } catch (error: any) {
      console.error('Passkey setup error:', error);
      return { success: false, error: error.message || 'Failed to set up passkey' };
    }
  }

  async authenticateWithPasskey(): Promise<{ success: boolean; email?: string; error?: string }> {
    if (!this.isSupported) {
      return { success: false, error: 'Passkeys not supported on this device' };
    }

    try {
      const stored = localStorage.getItem('thoughtmarks_passkey');
      if (!stored) {
        return { success: false, error: 'No passkey found for this device' };
      }

      const credentialData = JSON.parse(stored);
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [{
            id: new Uint8Array(credentialData.credentialId),
            type: 'public-key',
          }],
          userVerification: 'required',
          timeout: 60000,
        },
      }) as PublicKeyCredential;

      if (credential) {
        return { success: true, email: credentialData.email };
      } else {
        return { success: false, error: 'Authentication failed' };
      }
    } catch (error: any) {
      console.error('Passkey authentication error:', error);
      if (error.name === 'NotAllowedError') {
        return { success: false, error: 'Authentication was cancelled or failed' };
      }
      return { success: false, error: error.message || 'Authentication failed' };
    }
  }

  hasPasskey(): boolean {
    return !!localStorage.getItem('thoughtmarks_passkey');
  }

  removePasskey(): void {
    localStorage.removeItem('thoughtmarks_passkey');
  }
}

export const simplePasskeyAuth = SimplePasskeyAuth.getInstance();