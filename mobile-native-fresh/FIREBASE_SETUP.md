# Firebase Setup for Mobile App

## 🔥 Your Firebase Configuration

Based on your existing Firebase setup, here's how to configure the mobile app:

### 1. Update app.json with Your Firebase Credentials

Replace the placeholder values in `app.json` with your actual Firebase configuration:

```json
{
  "expo": {
    "extra": {
      "firebaseConfig": {
        "apiKey": "YOUR_ACTUAL_FIREBASE_API_KEY",
        "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
        "projectId": "YOUR_PROJECT_ID",
        "storageBucket": "YOUR_PROJECT_ID.appspot.com",
        "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
        "appId": "YOUR_FIREBASE_APP_ID"
      },
      "googleIosClientId": "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
      "googleAndroidClientId": "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
      "googleWebClientId": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
    }
  }
}
```

### 2. Get Your Firebase Configuration Values

From your Firebase Console (https://console.firebase.google.com/):

1. **Project Settings** → **General** tab
2. **Your apps** section → Select your web app
3. Copy the configuration values:
   - `apiKey`
   - `projectId` 
   - `appId`
   - `messagingSenderId`

### 3. Get Google OAuth Client IDs

From your Firebase Console:

1. **Authentication** → **Sign-in method** → **Google**
2. **Web SDK configuration** section
3. Copy the client IDs for:
   - **iOS**: `YOUR_IOS_CLIENT_ID.apps.googleusercontent.com`
   - **Android**: `YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com`
   - **Web**: `YOUR_WEB_CLIENT_ID.apps.googleusercontent.com`

### 4. Enable Authentication Methods

In Firebase Console → **Authentication** → **Sign-in method**:

✅ **Email/Password** - Enable
✅ **Google** - Enable and configure OAuth client IDs
✅ **Apple** - Enable (for iOS)

### 5. Apple Sign-In Setup (iOS)

For Apple Sign-In to work on iOS:

1. **Apple Developer Console**:
   - Create App ID with Sign In with Apple capability
   - Create Service ID for your app
   - Configure domains and redirect URLs

2. **Firebase Console**:
   - Add Apple provider in Authentication
   - Configure Service ID and Team ID

### 6. Test the Configuration

After updating the credentials:

```bash
# Restart the development server
npm start

# Test authentication flows:
# - Email/Password sign up/sign in
# - Google OAuth
# - Apple Sign-In (iOS only)
```

## 🔧 Current Implementation

The mobile app is now configured to use Firebase with:

- **Firebase Auth** for user authentication
- **Google OAuth** with proper scopes (email, profile)
- **Apple Sign-In** with proper scopes (email, name)
- **Demo fallback** for development when Firebase is not configured
- **Token validation** with your backend API

## 🚀 Authentication Flow

1. **Firebase Authentication**: Handles user sign-up/sign-in
2. **Token Exchange**: Firebase ID token → Backend validation
3. **User Data Sync**: Backend provides premium status, etc.
4. **Fallback**: Demo login for development

## 📱 Platform Support

- **iOS**: Native Apple Sign-In + Google OAuth
- **Android**: Google OAuth + Email/Password
- **Web**: All methods via Firebase popup/redirect
- **Development**: Demo login fallback

## 🔒 Security Notes

- Firebase handles secure token management
- OAuth credentials are stored in app.json (public)
- Sensitive operations require backend validation
- Demo mode available for development

## 🐛 Troubleshooting

If authentication fails:

1. Check Firebase Console for error logs
2. Verify OAuth client IDs are correct
3. Ensure authentication methods are enabled
4. Check network connectivity
5. Review Firebase project settings

## 📞 Support

Your Firebase project is already configured with:
- ✅ Email/Password authentication
- ✅ Google OAuth with proper scopes
- ✅ Apple Sign-In with proper scopes
- ✅ Backend integration endpoint

Just update the `app.json` with your actual credentials and you're ready to go! 