import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

// Your Firebase config here (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyDtBzTLI6mbn2r4g6q1whX4LM-xHqXJg5Y",
  authDomain: "thoughtmarks-25replit.firebaseapp.com", // placeholder, update if needed
  projectId: "thoughtmarks-25replit",
  storageBucket: "thoughtmarks-25replit.appspot.com", // placeholder, update if needed
  messagingSenderId: "371020564944", // placeholder, update if needed
  appId: "1:371020564944:web:93929f807b43caaf9c91d5",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth, GoogleAuthProvider, OAuthProvider };

// Optionally, you can configure your app here if needed, but @react-native-firebase/app auto-initializes from native config files. 