# Apple Sign in with Apple - Server-to-Server Notifications

## Implementation Status ✅

The server-to-server notification endpoint has been implemented at:
`POST /api/auth/apple/notifications`

## Required Setup

### 1. Environment Variables
```bash
APPLE_BUNDLE_ID=com.thoughtmarks.app
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
APPLE_NOTIFICATION_ENDPOINT=https://your-production-server.com/api/auth/apple/notifications
```

### 2. Apple Developer Console
1. Go to Apple Developer Console
2. Configure Sign in with Apple for your app
3. Set **Server-to-Server Notification Endpoint** to:
   ```
   https://your-production-server.com/api/auth/apple/notifications
   ```

## Features Implemented

- ✅ JWT verification using Apple's JWKS
- ✅ Handles all notification types (ACCOUNT_DELETE, EMAIL_DISABLED, etc.)
- ✅ Secure logging (partial payload only)
- ✅ Error handling and validation
- ✅ Configuration management

## Next Steps

1. Set environment variables in production
2. Configure endpoint URL in Apple Developer Console
3. Test with real Apple notifications
4. Implement database operations for each notification type

## Security

- TLS 1.2+ required
- JWT signature verification
- Secure logging practices
- Proper error handling 