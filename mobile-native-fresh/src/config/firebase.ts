import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

// Your Firebase config here (replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDtBzTLI6mbn2r4g6q1whX4LM-xHqXJg5Y",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "thoughtmarks-25replit.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "thoughtmarks-25replit",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "thoughtmarks-25replit.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "371020564944",
  appId: process.env.FIREBASE_APP_ID || "1:371020564944:web:93929f807b43caaf9c91d5",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth, GoogleAuthProvider, OAuthProvider };

// Optionally, you can configure your app here if needed, but @react-native-firebase/app auto-initializes from native config files. 