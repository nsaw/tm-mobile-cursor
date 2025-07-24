# Firebase Setup for Mobile App

## 🔥 Your Firebase Configuration

**Project Details:**
- **Project Name**: Thoughtmarks
- **Project ID**: thoughtmarks-25replit
- **Project Number**: 371020564944
- **Web API Key**: AIzaSyDtBzTLI6mbn2r4g6q1whX4LM-xHqXJg5Y

## ✅ What's Already Configured

Your Firebase project is already set up with:
- ✅ Email/Password authentication
- ✅ Google OAuth with proper scopes
- ✅ Apple Sign-In with proper scopes
- ✅ Backend integration endpoint

## 🔧 Next Ste{ { { { ps to Complete Setup & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

### 1. Get Your App ID

You need to get the **App ID** from your Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/project/thoughtmarks-25replit)
2. **Project Settings** → **General** tab
3. **Your apps** section → Find your web app
4. Copy the **App ID** (format: `1:371020564944:web:xxxxxxxx`)

### 2. Update app.json with App ID

Replace `"your-app-id"` in `app.json` with your actual App ID:

```json
{
  "expo": {
    "extra": {
      "firebaseConfig": {
        "apiKey": "AIzaSyDtBzTLI6mbn2r4g6q1whX4LM-xHqXJg5Y",
        "authDomain": "thoughtmarks-25replit.firebaseapp.com",
        "projectId": "thoughtmarks-25replit",
        "storageBucket": "thoughtmarks-25replit.appspot.com",
        "messagingSenderId": "371020564944",
        "appId": "YOUR_ACTUAL_APP_ID_HERE"
      }
    }
  }
}
```

### 3. Get Google OAuth Client IDs

From your Firebase Console:

1. **Authentication** → **Sign-in method** → **Google**
2. **Web SDK configuration** section
3. Copy the client IDs for:
   - **iOS**: `YOUR_IOS_CLIENT_ID.apps.googleusercontent.com`
   - **Android**: `YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com`
   - **Web**: `YOUR_WEB_CLIENT_ID.apps.googleusercontent.com`

### 4. Update OAuth Client IDs

Replace the placeholder OAuth client IDs in `app.json`:

```json
{
  "expo": {
    "extra": {
      "googleIosClientId": "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
      "googleAndroidClientId": "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
      "googleWebClientId": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
    }
  }
}
```

## 🚀 Test the Configuration

After updating the App ID and OAuth client IDs:

```{ { { { bash
# Restart the development server & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { npm start & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Test authentication flows:
# - Email/Password sign up/sign in
# - Google OAuth
# - Apple Sign-In (iOS only)
```

## 🔧 Current Implementation

The mobile app is now configured to use your Firebase project with:

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

Just add your App ID and OAuth client IDs to complete the setup! 