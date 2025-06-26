import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect } from 'react';
import Constants from 'expo-constants';
import { signInWithCredential } from 'firebase/auth';

import { auth, GoogleAuthProvider, OAuthProvider } from '../../../config/firebase';

// Get client IDs from app.json extra
const ANDROID_CLIENT_ID = Constants.expoConfig?.extra?.googleAndroidClientId;
const IOS_CLIENT_ID = Constants.expoConfig?.extra?.googleIosClientId;

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const googleCredential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, googleCredential);
    }
  }, [response]);

  return { promptAsync, request, response };
}

export async function signInWithApple() {
  try {
    const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const { identityToken } = appleAuthRequestResponse;
    if (identityToken) {
      const appleProvider = new OAuthProvider('apple.com');
      const appleCredential = appleProvider.credential({ idToken: identityToken });
      await signInWithCredential(auth, appleCredential);
    } else {
      throw new Error('No identity token returned');
    }
  } catch (error) {
    throw error;
  }
} 