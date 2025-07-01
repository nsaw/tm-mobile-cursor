// WebAuthn Passkeys Implementation
// Provides fast, secure authentication using Face ID, Touch ID, or hardware keys

interface PasskeyCredential {
  id: string;
  publicKey: string;
  counter: number;
  userHandle: string;
}

interface PasskeyRegistrationOptions {
  challenge: string;
  rp: { name: string; id: string };
  user: { id: string; name: string; displayName: string };
  pubKeyCredParams: { type: string; alg: number }[];
  timeout: number;
  attestation: string;
  authenticatorSelection: {
    authenticatorAttachment: string;
    userVerification: string;
    requireResidentKey: boolean;
  };
}

interface PasskeyAuthenticationOptions {
  challenge: string;
  rpId: string;
  allowCredentials: { type: string; id: string }[];
  timeout: number;
  userVerification: string;
}

export class PasskeyAuth {
  private static instance: PasskeyAuth;
  private isSupported: boolean = false;

  constructor() {
    this.checkSupport();
  }

  static getInstance(): PasskeyAuth {
    if (!PasskeyAuth.instance) {
      PasskeyAuth.instance = new PasskeyAuth();
    }
    return PasskeyAuth.instance;
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

  async isConditionalMediationAvailable(): Promise<boolean> {
    if (!this.isSupported) return false;
    
    try {
      return await PublicKeyCredential.isConditionalMediationAvailable?.() ?? false;
    } catch {
      return false;
    }
  }

  async registerPasskey(email: string, displayName: string): Promise<{ success: boolean; credential?: any; error?: string }> {
    if (!this.isSupported) {
      return { success: false, error: 'Passkeys not supported on this device' };
    }

    try {
      // Get registration options from server
      const optionsResponse = await fetch('/api/passkeys/register/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, displayName }),
        credentials: 'include',
      });

      if (!optionsResponse.ok) {
        throw new Error('Failed to get registration options');
      }

      const options: PasskeyRegistrationOptions = await optionsResponse.json();

      // Convert challenge and user ID from base64url
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        ...options,
        challenge: this.base64urlToBuffer(options.challenge),
        user: {
          ...options.user,
          id: this.base64urlToBuffer(options.user.id),
        },
        pubKeyCredParams: options.pubKeyCredParams.map(param => ({
          ...param,
          type: "public-key" as const,
        })),
        attestation: options.attestation as AttestationConveyancePreference,
        authenticatorSelection: {
          ...options.authenticatorSelection,
          authenticatorAttachment: options.authenticatorSelection.authenticatorAttachment as AuthenticatorAttachment,
          userVerification: options.authenticatorSelection.userVerification as UserVerificationRequirement,
        },
      };

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('No credential created');
      }

      // Prepare credential for server
      const credentialJson = {
        id: credential.id,
        rawId: this.bufferToBase64url(credential.rawId),
        response: {
          clientDataJSON: this.bufferToBase64url((credential.response as AuthenticatorAttestationResponse).clientDataJSON),
          attestationObject: this.bufferToBase64url((credential.response as AuthenticatorAttestationResponse).attestationObject),
        },
        type: credential.type,
      };

      // Send to server for verification
      const verifyResponse = await fetch('/api/passkeys/register/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialJson, email }),
        credentials: 'include',
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify registration');
      }

      const result = await verifyResponse.json();
      return { success: true, credential: result };

    } catch (error: any) {
      console.error('Passkey registration failed:', error);
      return { success: false, error: error.message };
    }
  }

  async authenticateWithPasskey(email?: string): Promise<{ success: boolean; user?: any; error?: string }> {
    if (!this.isSupported) {
      return { success: false, error: 'Passkeys not supported on this device' };
    }

    try {
      // Get authentication options from server
      const optionsResponse = await fetch('/api/passkeys/authenticate/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      if (!optionsResponse.ok) {
        throw new Error('Failed to get authentication options');
      }

      const options: PasskeyAuthenticationOptions = await optionsResponse.json();

      // Convert challenge and credential IDs from base64url
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        ...options,
        challenge: this.base64urlToBuffer(options.challenge),
        userVerification: options.userVerification as UserVerificationRequirement,
        allowCredentials: options.allowCredentials.map(cred => ({
          ...cred,
          type: "public-key" as const,
          id: this.base64urlToBuffer(cred.id),
        })),
      };

      // Get credential
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('No credential received');
      }

      // Prepare credential for server
      const credentialJson = {
        id: credential.id,
        rawId: this.bufferToBase64url(credential.rawId),
        response: {
          clientDataJSON: this.bufferToBase64url((credential.response as AuthenticatorAssertionResponse).clientDataJSON),
          authenticatorData: this.bufferToBase64url((credential.response as AuthenticatorAssertionResponse).authenticatorData),
          signature: this.bufferToBase64url((credential.response as AuthenticatorAssertionResponse).signature),
          userHandle: (credential.response as AuthenticatorAssertionResponse).userHandle 
            ? this.bufferToBase64url((credential.response as AuthenticatorAssertionResponse).userHandle!) 
            : null,
        },
        type: credential.type,
      };

      // Send to server for verification
      const verifyResponse = await fetch('/api/passkeys/authenticate/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialJson, email }),
        credentials: 'include',
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify authentication');
      }

      const result = await verifyResponse.json();
      return { success: true, user: result.user };

    } catch (error: any) {
      console.error('Passkey authentication failed:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserPasskeys(userId: number): Promise<PasskeyCredential[]> {
    try {
      const response = await fetch(`/api/passkeys/user/${userId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to get user passkeys');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user passkeys:', error);
      return [];
    }
  }

  async removePasskey(credentialId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/passkeys/${credentialId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      return response.ok;
    } catch (error) {
      console.error('Error removing passkey:', error);
      return false;
    }
  }

  // Utility functions for base64url encoding/decoding
  private bufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private base64urlToBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padded = base64 + '==='.slice(0, (4 - base64.length % 4) % 4);
    const binary = atob(padded);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return buffer;
  }
}

export const passkeyAuth = PasskeyAuth.getInstance();