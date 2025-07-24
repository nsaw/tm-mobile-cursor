# Android Setup for Firebase Authentication

## 🔧 Getting SHA-1 Fingerprint

### Option 1: Using Android Studio (Recommended)

1. **Open Android Studio**
2. **Open your project** (or create a new Android project)
3. **View** → **Tool Windows** → **Gradle**
4. In the Gradle panel, navigate to:
   ```
   Your App > Tasks > android > signingReport
   ```
5. **Double-click** on `signingReport`
6. Look for the **SHA-1** fingerprint in the output

### Option 2: Using Command Line (if Java is installed)

#### For Debug Keystore:
```{ { { { bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

#### For Release Keystore:
```{ { { { bash
keytool -list -v -keystore path-to-your-release-keystore -alias your-key-alias & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### Option 3: Using Expo EAS (if using EAS Build)

```{ { { { bash
# Install EAS CLI & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { npm install -g @expo/eas-cli & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Login to Expo
eas login

# Get credentials
eas credentials:manager
```

### Option 4: Using Firebase Console (Alternative)

1. Go to [Firebase Console](https://console.firebase.google.com/project/thoughtmarks-25replit)
2. **Project Settings** → **General** tab
3. **Your apps** section → **Add app** → **Android**
4. Enter your package name: `com.thoughtmarks.app`
5. Firebase will provide the `google-services.json` file
6. The SHA-1 can be added later in the Firebase Console

## 📱 Android App Configuration

### 1. Update app.json with Android Package Name

Your `app.json` already has the correct package name:
```json
{
  "expo": {
    "android": {
      "package": "com.thoughtmarks.app"
    }
  }
}
```

### 2. Add Android App to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/project/thoughtmarks-25replit)
2. **Project Settings** → **General** tab
3. **Your apps** section → **Add app** → **Android**
4. **Android package name**: `com.thoughtmarks.app`
5. **App nickname**: `Thoughtmarks Mobile` (optional)
6. **Debug signing certificate SHA-1**: (add your SHA-1 here)
7. Click **Register app**

### 3. Download google-services.json

After registering the Android app:
1. Download the `google-services.json` file
2. Place it in the `mobile-native-fresh/` directory
3. Add it to your `.gitignore` file (it contains sensitive information)

### 4. Update app.json with Google OAuth Client ID

Once you have the Android app registered in Firebase:
1. Go to **Authentication** → **Sign-in method** → **Google**
2. Copy the **Android client ID** (format: `123456789-abcdefg.apps.googleusercontent.com`)
3. Update `app.json`:

```json
{
  "expo": {
    "extra": {
      "googleAndroidClientId": "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com"
    }
  }
}
```

## 🍎 Apple App Configuration

### Your Apple App Details:
- **Bundle ID**: `com.thoughtmarks.app`
- **Team ID**: `72SVDSY448`
- **App ID Prefix**: `72SVDSY448`

### 1. Add iOS App to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/project/thoughtmarks-25replit)
2. **Project Settings** → **General** tab
3. **Your apps** section → **Add app** → **iOS**
4. **iOS bundle ID**: `com.thoughtmarks.app`
5. **App nickname**: `Thoughtmarks Mobile` (optional)
6. Click **Register app**

### 2. Download GoogleService-Info.plist

After registering the iOS app:
1. Download the `GoogleService-Info.plist` file
2. Place it in the `mobile-native-fresh/` directory
3. Add it to your `.gitignore` file

### 3. Update app.json with iOS OAuth Client ID

Once you have the iOS app registered in Firebase:
1. Go to **Authentication** → **Sign-in method** → **Google**
2. Copy the **iOS client ID** (format: `123456789-abcdefg.apps.googleusercontent.com`)
3. Update `app.json`:

```json
{
  "expo": {
    "extra": {
      "googleIosClientId": "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com"
    }
  }
}
```

## 🌐 Web App Configuration

### 1. Get Web OAuth Client ID

1. Go to **Authentication** → **Sign-in method** → **Google**
2. Copy the **Web client ID** (format: `123456789-abcdefg.apps.googleusercontent.com`)
3. Update `app.json`:

```json
{
  "expo": {
    "extra": {
      "googleWebClientId": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
    }
  }
}
```

## 📋 Complete app.json Example

After getting all the client IDs:

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
        "appId": "YOUR_WEB_APP_ID"
      },
      "googleIosClientId": "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
      "googleAndroidClientId": "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
      "googleWebClientId": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
    }
  }
}
```

## 🚀 Testing

After completing the setup:

```{ { { { bash
# Restart the development server & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { npm start & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Test on different platforms:
# - iOS Simulator: Google OAuth + Apple Sign-In
# - Android Emulator: Google OAuth + Email/Password
# - Web Browser: All methods
```

## 🔒 Security Notes

- Keep `google-services.json` and `GoogleService-Info.plist` secure
- Add them to `.gitignore` to prevent committing to version control
- SHA-1 fingerprints are used for Google OAuth verification
- Different SHA-1s needed for debug vs release builds

## 🐛 Troubleshooting

### Common Issues:
1. **SHA-1 mismatch**: Ensure you're using the correct keystore
2. **OAuth client ID not found**: Check Firebase Console configuration
3. **Package name mismatch**: Verify bundle ID matches Firebase app
4. **Missing google-services.json**: Download from Firebase Console

### Getting Help:
- Check Firebase Console error logs
- Verify all client IDs are correct
- Ensure authentication methods are enabled
- Test with different platforms 