# Thoughtmarks React Native Setup

## Prerequisites
- Node.js 16+ installed
- React Native development environment configured
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

## Installation Steps

1. Install dependencies:
```bash
npm install
```

2. For iOS (macOS only):
```bash
cd ios && pod install && cd ..
```

3. Start Metro bundler:
```bash
npm start
```

4. Run on device/simulator:
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/       # API and external services
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── contexts/       # React context providers
```

## Build Instructions

### Android APK
```bash
cd android
./gradlew assembleRelease
# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### iOS IPA (requires Apple Developer Account)
```bash
# Build in Xcode or use:
npx react-native run-ios --configuration Release
```

## Environment Configuration
1. Copy .env.example to .env
2. Configure Firebase credentials
3. Update API endpoint URLs
4. Set up push notification certificates

## Troubleshooting
- Clear Metro cache: `npx react-native start --reset-cache`
- Clean builds: `cd android && ./gradlew clean`
- Rebuild node_modules: `rm -rf node_modules && npm install`
