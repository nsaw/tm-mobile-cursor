// Apple Sign in with Apple Configuration
export const appleConfig = {
  // Your app's bundle identifier (e.g., com.yourcompany.yourapp)
  bundleId: process.env.APPLE_BUNDLE_ID || 'com.thoughtmarks.app',
  
  // Apple Team ID (found in Apple Developer account)
  teamId: process.env.APPLE_TEAM_ID || '',
  
  // Apple Key ID (found in Apple Developer account)
  keyId: process.env.APPLE_KEY_ID || '',
  
  // Apple private key (P8 file content)
  privateKey: process.env.APPLE_PRIVATE_KEY || '',
  
  // Server-to-server notification endpoint URL
  // This should be your production server URL
  notificationEndpoint: process.env.APPLE_NOTIFICATION_ENDPOINT || 
    'https://your-production-server.com/api/auth/apple/notifications',
  
  // Apple's JWKS endpoint
  jwksUrl: 'https://appleid.apple.com/auth/keys',
  
  // Apple's token endpoint
  tokenEndpoint: 'https://appleid.apple.com/auth/token',
  
  // Apple's authorization endpoint
  authEndpoint: 'https://appleid.apple.com/auth/authorize',
};

// Environment variables that need to be set:
// APPLE_BUNDLE_ID=com.thoughtmarks.app
// APPLE_TEAM_ID=your_team_id
// APPLE_KEY_ID=your_key_id
// APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
// APPLE_NOTIFICATION_ENDPOINT=https://your-production-server.com/api/auth/apple/notifications 