import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-client';
import { appleConfig } from '../config/apple';

// Initialize JWKS client
const client = jwksClient({
  jwksUri: appleConfig.jwksUrl,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000, // 10 minutes
});

// Get signing key from Apple's JWKS
const getSigningKey = (kid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err: any, key: any) => {
      if (err) {
        reject(err);
      } else {
        const signingKey = key?.getPublicKey();
        if (signingKey) {
          resolve(signingKey);
        } else {
          reject(new Error('Failed to get signing key'));
        }
      }
    });
  });
};

// Verify Apple JWT token
export const verifyAppleJWT = async (token: string): Promise<any> => {
  try {
    // Decode the token header to get the key ID
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || typeof decodedHeader === 'string') {
      throw new Error('Invalid token format');
    }

    const { kid } = decodedHeader.header;
    if (!kid) {
      throw new Error('No key ID found in token');
    }

    // Get the signing key
    const signingKey = await getSigningKey(kid);

    // Verify the token
    const decoded = jwt.verify(token, signingKey, {
      algorithms: ['RS256'],
      audience: appleConfig.bundleId,
      issuer: 'https://appleid.apple.com',
    });

    return decoded;
  } catch (error) {
    console.error('Apple JWT verification failed:', error);
    throw error;
  }
};

// Apple notification types
export enum AppleNotificationType {
  ACCOUNT_DELETE = 'ACCOUNT_DELETE',
  EMAIL_DISABLED = 'EMAIL_DISABLED',
  CONSENT_REVOKED = 'CONSENT_REVOKED',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
}

// Process Apple notification
export const processAppleNotification = async (payload: any) => {
  const { events } = payload;
  
  if (!events || !Array.isArray(events)) {
    throw new Error('Invalid notification format: missing events array');
  }

  const results = [];

  for (const event of events) {
    const { type, sub, email, isPrivateEmail } = event;
    
    console.log('Processing Apple notification event:', {
      type,
      sub, // Apple's unique user identifier
      email,
      isPrivateEmail,
      timestamp: new Date().toISOString()
    });

    switch (type) {
      case AppleNotificationType.ACCOUNT_DELETE:
        // User deleted their Apple account
        results.push({
          type: 'ACCOUNT_DELETE',
          sub,
          action: 'User account deleted',
          timestamp: new Date().toISOString()
        });
        // TODO: Implement account deletion logic
        // - Mark user account as deleted
        // - Remove personal data
        // - Update subscription status
        break;

      case AppleNotificationType.EMAIL_DISABLED:
        // User disabled email forwarding
        results.push({
          type: 'EMAIL_DISABLED',
          sub,
          action: 'Email forwarding disabled',
          timestamp: new Date().toISOString()
        });
        // TODO: Implement email handling logic
        // - Update user's email preferences
        // - Handle communication changes
        break;

      case AppleNotificationType.CONSENT_REVOKED:
        // User revoked consent
        results.push({
          type: 'CONSENT_REVOKED',
          sub,
          action: 'Consent revoked',
          timestamp: new Date().toISOString()
        });
        // TODO: Implement consent handling logic
        // - Update user's consent status
        // - Handle data processing changes
        break;

      case AppleNotificationType.ACCOUNT_NOT_FOUND:
        // Apple account not found
        results.push({
          type: 'ACCOUNT_NOT_FOUND',
          sub,
          action: 'Account not found',
          timestamp: new Date().toISOString()
        });
        // TODO: Implement account handling logic
        // - Handle orphaned accounts
        // - Clean up invalid references
        break;

      default:
        console.warn('Unknown Apple notification type:', type);
        results.push({
          type: 'UNKNOWN',
          sub,
          action: 'Unknown notification type',
          timestamp: new Date().toISOString()
        });
    }
  }

  return results;
}; 