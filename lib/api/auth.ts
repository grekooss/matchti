/**
 * Funkcje API dla systemu autoryzacji
 */
import { supabase } from '../supabase/client';
// Warunkowy import SecureStore - dla Expo Go użyjemy fallback
let SecureStore: any = null;
try {
  SecureStore = require('expo-secure-store');
} catch (error) {
  console.warn('SecureStore not available - using fallback. Sessions will not persist securely.');
  // Fallback dla Expo Go - wykorzysta localStorage/pamięć
  SecureStore = {
    setItemAsync: (key: string, value: string) => Promise.resolve(),
    getItemAsync: (key: string) => Promise.resolve(null),
    deleteItemAsync: (key: string) => Promise.resolve(),
  };
}
// Warunkowy import AuthSession - dla Expo Go użyjemy fallback
let AuthSession: any = null;
try {
  AuthSession = require('expo-auth-session');
} catch (error) {
  console.warn('AuthSession not available - using fallback');
  AuthSession = {
    makeRedirectUri: () => 'exp://localhost:8081',
  };
}

// Warunkowy import AppleAuthentication - dla Expo Go użyjemy fallback
let AppleAuthentication: any = null;
try {
  AppleAuthentication = require('expo-apple-authentication');
} catch (error) {
  console.warn('AppleAuthentication not available - using fallback');
  AppleAuthentication = {
    signInAsync: () => Promise.reject(new Error('Apple Authentication not available in Expo Go')),
    isAvailableAsync: () => Promise.resolve(false),
    AppleAuthenticationScope: {
      FULL_NAME: 'fullName',
      EMAIL: 'email',
    },
  };
}
import { Platform } from 'react-native';
import type { SignUpData, SignInData, ResetPasswordData } from '../types/auth';
import type { Session } from '@supabase/supabase-js';

// Klucze dla bezpiecznego przechowywania
const SECURE_STORE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_SESSION: 'auth_user_session',
} as const;

/**
 * Rejestracja użytkownika za pomocą e-mail i hasła
 */
export const signUpWithEmail = async ({ email, password }: Omit<SignUpData, 'confirmPassword'>) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${AuthSession.makeRedirectUri()}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    // Zapisz sesję w bezpiecznym storage
    if (data.session) {
      await saveAuthSession(data.session);
    }

    return { data };
  } catch (error) {
    return { error: 'Wystąpił nieoczekiwany błąd podczas rejestracji' };
  }
};

/**
 * Logowanie użytkownika za pomocą e-mail i hasła
 */
export const signInWithEmail = async ({ email, password }: SignInData) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    // Zapisz sesję w bezpiecznym storage
    if (data.session) {
      await saveAuthSession(data.session);
    }

    return { data };
  } catch (error) {
    return { error: 'Wystąpił nieoczekiwany błąd podczas logowania' };
  }
};

/**
 * Logowanie przez Google
 */
export const signInWithGoogle = async () => {
  try {
    const redirectUrl = AuthSession.makeRedirectUri();
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    return { error: 'Wystąpił błąd podczas logowania przez Google' };
  }
};

/**
 * Logowanie przez Apple ID (tylko iOS)
 */
export const signInWithApple = async () => {
  try {
    if (Platform.OS !== 'ios') {
      return { error: 'Logowanie przez Apple jest dostępne tylko na iOS' };
    }

    // Sprawdź dostępność Apple Authentication
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return { error: 'Apple Authentication nie jest dostępne na tym urządzeniu' };
    }

    // Przeprowadź autoryzację Apple
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return { error: 'Nie udało się uzyskać tokenu autoryzacji Apple' };
    }

    // Zaloguj w Supabase używając Apple ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });

    if (error) {
      return { error: error.message };
    }

    // Zapisz sesję w bezpiecznym storage
    if (data.session) {
      await saveAuthSession(data.session);
    }

    return { data };
  } catch (error: any) {
    if (error.code === 'ERR_REQUEST_CANCELED') {
      return { error: 'Logowanie zostało anulowane' };
    }
    return { error: 'Wystąpił błąd podczas logowania przez Apple' };
  }
};

/**
 * Wylogowanie użytkownika
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    // Usuń dane z bezpiecznego storage
    await clearAuthSession();

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Błąd podczas wylogowywania:', error);
    throw error;
  }
};

/**
 * Resetowanie hasła
 */
export const resetPassword = async ({ email }: ResetPasswordData) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${AuthSession.makeRedirectUri()}/auth/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { error: 'Wystąpił błąd podczas resetowania hasła' };
  }
};

/**
 * Pobranie aktualnej sesji
 */
export const getCurrentSession = async () => {
  try {
    // Dodajmy timeout dla operacji Supabase
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Session check timeout')), 5000)
    );
    
    const sessionPromise = supabase.auth.getSession();
    
    const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Supabase session error:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Błąd podczas pobierania sesji:', error);
    return null;
  }
};

/**
 * Odświeżenie sesji
 */
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      throw error;
    }

    // Zapisz odświeżoną sesję
    if (data.session) {
      await saveAuthSession(data.session);
    }

    return data.session;
  } catch (error) {
    console.error('Błąd podczas odświeżania sesji:', error);
    throw error;
  }
};

/**
 * Zapisanie sesji autoryzacji w bezpiecznym storage
 */
const saveAuthSession = async (session: Session) => {
  try {
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN, session.access_token);
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN, session.refresh_token);
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.USER_SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Błąd podczas zapisywania sesji:', error);
  }
};

/**
 * Pobranie sesji z bezpiecznego storage
 */
export const getStoredAuthSession = async (): Promise<Session | null> => {
  try {
    const sessionData = await SecureStore.getItemAsync(SECURE_STORE_KEYS.USER_SESSION);
    if (sessionData) {
      return JSON.parse(sessionData);
    }
    return null;
  } catch (error) {
    console.error('Błąd podczas pobierania zapisanej sesji:', error);
    return null;
  }
};

/**
 * Usunięcie sesji z bezpiecznego storage
 */
const clearAuthSession = async () => {
  try {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.USER_SESSION);
  } catch (error) {
    console.error('Błąd podczas usuwania sesji:', error);
  }
};