import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

// Your Firebase config here (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyDtBzTLI6mbn2r4g6q1whX4LM-xHqXJg5Y",
  authDomain: "thoughtmarks-25replit.firebaseapp.com",
  projectId: "thoughtmarks-25replit",
  storageBucket: "thoughtmarks-25replit.appspot.com",
  messagingSenderId: "371020564944",
  appId: "1:371020564944:web:93929f807b43caaf9c91d5",
};

// Initialize Firebase app only once
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize auth
const auth = getAuth(app);

export { auth, GoogleAuthProvider, OAuthProvider }; 