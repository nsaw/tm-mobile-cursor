import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  updatePassword,
  User as FirebaseUser,
  UserCredential 
} from 'firebase/auth';

import { auth } from '../config/firebase';

export interface AuthError {
  code: string;
  message: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
  isPremium?: boolean;
  subscriptionStatus?: string;
  trialEndsAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Update user password
 */
export const updateUserPassword = async (newPassword: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw { code: 'auth/no-user', message: 'No user is currently signed in' };
    }
    await updatePassword(user, newPassword);
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Get current Firebase user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

/**
 * Convert Firebase error codes to user-friendly messages
 */
const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email address';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed';
    case 'auth/invalid-credential':
      return 'Invalid credentials';
    default:
      return 'An error occurred. Please try again';
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }
  return { isValid: true, message: '' };
}; 