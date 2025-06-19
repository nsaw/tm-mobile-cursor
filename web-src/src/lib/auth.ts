import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithRedirect, signInWithPopup, getRedirectResult, User as FirebaseUser } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "./firebase";
import { apiRequest } from "./queryClient";
import type { User, InsertUser } from "@shared/schema";

export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser | any> {
  // Check if this is a demo account
  if ((email === 'test@thoughtmarks.app' || email === 'hello@thoughtmarks.app') && password === 'password') {
    try {
      const response = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('thoughtmarks-user', JSON.stringify(data.user));
        localStorage.setItem('thoughtmarks-demo-token', data.token);
        return { uid: data.user.firebaseUid, email: data.user.email };
      }
    } catch (error) {
      console.error('Demo auth failed:', error);
    }
  }



  try {
    // Regular Firebase authentication for other users
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;
    
    // Clear any existing demo data to prevent conflicts
    localStorage.removeItem('thoughtmarks-demo-token');
    
    // Firebase authentication succeeded, now sync user data
    try {
      let user = await getCurrentUser(firebaseUser.uid);
      
      // If user doesn't exist in our database, create them
      if (!user && firebaseUser.email) {
        const userData: InsertUser = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "",
          firebaseUid: firebaseUser.uid,
        };
        
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
          credentials: "include",
        });
        
        if (response.ok) {
          user = await response.json();
          localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
        }
      } else if (user) {
        localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
      }
    } catch (dbError) {
      console.warn('Database user sync failed, user has basic Firebase access:', dbError);
      // Clear any cached demo data that might be interfering
      localStorage.removeItem('thoughtmarks-user');
      localStorage.removeItem('thoughtmarks-demo-token');
    }
    
    return firebaseUser;
  } catch (error: any) {
    console.error('Firebase auth error:', error);
    
    // Provide more specific error messages
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    } else if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email address. Please sign up first.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later.');
    } else if (error.code === 'auth/invalid-api-key') {
      throw new Error('Authentication service configuration error. Please contact support.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    throw error;
  }
}

export async function registerWithEmail(email: string, password: string, displayName?: string, firstName?: string, lastName?: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = result.user;
  
  // Create user in our database
  const userData: InsertUser = {
    email: firebaseUser.email!,
    displayName: displayName || firebaseUser.displayName || "",
    firstName: firstName || "",
    lastName: lastName || "",
    firebaseUid: firebaseUser.uid,
  };
  
  const response = await apiRequest("POST", "/api/users", userData);
  const user = await response.json();
  
  // Store user in localStorage for API authentication
  localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
  
  return user;
}

// Helper function to handle OAuth success
async function handleOAuthSuccess(firebaseUser: FirebaseUser): Promise<void> {
  try {
    // Get or create user in our database
    let user = await getCurrentUser(firebaseUser.uid);
    
    // If user doesn't exist, create them
    if (!user && firebaseUser.email) {
      const userData: InsertUser = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        firebaseUid: firebaseUser.uid,
      };
      
      const response = await apiRequest("POST", "/api/users", userData);
      if (response.ok) {
        user = await response.json();
      }
    }
    
    if (user) {
      localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
      // Force page reload to update authentication state
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error('OAuth success handler error:', error);
    throw error;
  }
}

// Google OAuth Sign-In
export async function signInWithGoogle(): Promise<void> {
  try {
    console.log('Starting Google sign-in...');
    console.log('Firebase config check:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 10) + '...',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      authDomain: auth.config.authDomain
    });
    
    // Check if Firebase is properly configured
    if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "demo-api-key") {
      throw new Error('Firebase configuration incomplete. Please check your environment variables.');
    }
    
    // Verify auth instance is ready
    await auth.authStateReady();
    
    // Use popup instead of redirect for better user experience
    const result = await signInWithPopup(auth, googleProvider);
    if (result && result.user) {
      console.log('Google sign-in successful, processing user...');
      await handleOAuthSuccess(result.user);
    }
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    
    // Provide specific error messages
    if (error.code === 'auth/internal-error') {
      console.error('Internal error details:', error.customData);
      
      // Check if we're in development environment
      const isDevelopment = window.location.hostname.includes('replit') || window.location.hostname === 'localhost';
      if (isDevelopment) {
        throw new Error('Google Sign-In is not available in development environment due to security restrictions. Please use email authentication or test on production.');
      } else {
        throw new Error('Google Sign-In provider is not enabled in Firebase console. Please enable it in Authentication > Sign-in method.');
      }
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked. Please allow popups and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Google Sign-In.');
    }
    
    throw error;
  }
}

// Apple OAuth Sign-In
export async function signInWithApple(): Promise<void> {
  try {
    console.log('Starting Apple sign-in...');
    console.log('Firebase config check:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 10) + '...',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      authDomain: auth.config.authDomain
    });
    
    // Check if Firebase is properly configured
    if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "demo-api-key") {
      throw new Error('Firebase configuration incomplete. Please check your environment variables.');
    }
    
    // Verify auth instance is ready
    await auth.authStateReady();
    
    // Use popup instead of redirect for better user experience
    const result = await signInWithPopup(auth, appleProvider);
    if (result && result.user) {
      console.log('Apple sign-in successful, processing user...');
      await handleOAuthSuccess(result.user);
    }
  } catch (error: any) {
    console.error('Apple sign-in error:', error);
    
    // Provide specific error messages
    if (error.code === 'auth/internal-error') {
      console.error('Internal error details:', error.customData);
      
      // Check if we're in development environment
      const isDevelopment = window.location.hostname.includes('replit') || window.location.hostname === 'localhost';
      if (isDevelopment) {
        throw new Error('Apple Sign-In is not available in development environment due to security restrictions. Please use email authentication or test on production.');
      } else {
        throw new Error('Apple Sign-In provider is not enabled in Firebase console. Please enable it in Authentication > Sign-in method.');
      }
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked. Please allow popups and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Apple Sign-In.');
    }
    
    throw error;
  }
}

// Handle redirect result for Google/Apple sign-in (fallback)
export async function handleAuthRedirect(): Promise<FirebaseUser | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      await handleOAuthSuccess(result.user);
      return result.user;
    }
  } catch (error) {
    console.error('Auth redirect error:', error);
  }
  return null;
}

export async function logout(): Promise<void> {
  localStorage.removeItem('thoughtmarks-user');
  localStorage.removeItem('current-firebase-uid');
  // Clear user cache to prevent authentication bugs
  userCache.clear();
  await signOut(auth);
}

// Cache user data to reduce API calls
const userCache = new Map<string, { user: User; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCurrentUser(firebaseUid: string): Promise<User | null> {
  // Clear cache when switching users to prevent authentication bugs
  const currentCachedUid = localStorage.getItem('current-firebase-uid');
  if (currentCachedUid && currentCachedUid !== firebaseUid) {
    userCache.clear();
    localStorage.removeItem('thoughtmarks-user');
  }
  localStorage.setItem('current-firebase-uid', firebaseUid);

  // Check cache first
  const cached = userCache.get(firebaseUid);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.user;
  }

  try {
    const response = await fetch(`/api/users/by-firebase/${firebaseUid}`, {
      credentials: "include",
    });
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    
    const user = await response.json();
    
    // Store user in localStorage for API authentication
    localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
    
    // Cache the user data
    userCache.set(firebaseUid, { user, timestamp: Date.now() });
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
