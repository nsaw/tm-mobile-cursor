# Mobile App Setup Guide

## 🚀 Current Status: Mock Data Mode

The app is currently running with **mock data** for immediate testing. You can see the dashboard with sample thoughtmarks and bins without needing any backend setup.

### What's Working:
- ✅ Dashboard with mock data
- ✅ Thoughtmark cards with full functionality
- ✅ Bin management
- ✅ Task management
- ✅ Search and filtering
- ✅ Mock authentication (auto-logs in as demo user)

### How to Test:
1. Run `npm start` in the `mobile-native-fresh` directory
2. Open Expo Go on your device or use the simulator
3. The app will automatically log you in as a demo user
4. Navigate to the Dashboard to see all the components working

## 🔥 Next Steps: Firebase Authentication

To add real Firebase authentication, you'll need to:

### 1. Set up Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication with Email/Password, Google, and Apple providers
4. Get your Firebase config

### 2. Configure Environment Variables
Create a `.env` file in the `mobile-native-fresh` directory:

```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Update Google OAuth Client IDs
Update the `app.json` file with your real Google OAuth client IDs:

```json
{
  "expo": {
    "extra": {
      "googleIosClientId": "your-ios-client-id.apps.googleusercontent.com",
      "googleAndroidClientId": "your-android-client-id.apps.googleusercontent.com",
      "googleWebClientId": "your-web-client-id.apps.googleusercontent.com"
    }
  }
}
```

### 4. Switch from Mock to Real Auth
Once Firebase is configured, update the `useAuth.ts` hook to use real Firebase authentication instead of mock data.

## 🗄️ Backend Setup (Optional)

If you want to set up the full backend with PostgreSQL:

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set up PostgreSQL Database
- Install PostgreSQL locally or use a cloud service
- Create a database for the app
- Set up environment variables for database connection

### 3. Run Database Migrations
```bash
npm run migrate
```

### 4. Start the Backend
```bash
npm run dev
```

## 📱 Current App Structure

```
mobile-native-fresh/
├── src/
│   ├── features/
│   │   ├── auth/          # Authentication (mock mode)
│   │   ├── home/          # Dashboard and main screens
│   │   └── content/       # Content management
│   ├── components/
│   │   └── ui/           # Reusable UI components
│   ├── navigation/       # App navigation
│   ├── services/         # API services
│   ├── theme/           # Design system
│   └── types/           # TypeScript types
```

## 🎨 Design System

The app uses a consistent design system with:
- **Font**: Oswald (variable weight)
- **Colors**: Dark theme with accent colors
- **Spacing**: Consistent spacing tokens
- **Components**: Reusable UI components

## 🔄 Migration Status

- ✅ Dashboard Screen
- ✅ ThoughtmarkCard Component
- ✅ Bin Management
- ✅ Task Management
- ✅ Navigation Structure
- ✅ Theme System
- 🔄 Authentication (mock → Firebase)
- 🔄 Backend Integration
- 🔄 Real-time Sync

## 🚀 Quick Commands

```bash
# Start the mobile app
cd mobile-native-fresh
npm start

# Start backend (when ready)
cd backend
npm run dev

# Run tests
npm test
``` 