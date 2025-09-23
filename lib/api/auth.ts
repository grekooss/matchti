/**
 * Funkcje API dla systemu autoryzacji
 */
import { Platform } from 'react-native';
import type { SignUpData, SignInData, ResetPasswordData } from '../types/auth';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

// Warunkowy import SecureStore - dla Expo Go użyjemy fallback
let SecureStore: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  SecureStore = require('expo-secure-store');
} catch {
  console.warn('SecureStore not available - using fallback. Sessions will not persist securely.');
  // Fallback dla Expo Go - wykorzysta localStorage/pamięć
  SecureStore = {
    setItemAsync: () => Promise.resolve(),
    getItemAsync: () => Promise.resolve(null),
    deleteItemAsync: () => Promise.resolve(),
  };
}

// Warunkowy import AuthSession - dla Expo Go użyjemy fallback
let AuthSession: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  AuthSession = require('expo-auth-session');
} catch {
  console.warn('AuthSession not available - using fallback');
  AuthSession = {
    makeRedirectUri: () => 'exp://localhost:8081',
  };
}

// Warunkowy import AppleAuthentication - dla Expo Go użyjemy fallback
let AppleAuthentication: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  AppleAuthentication = require('expo-apple-authentication');
} catch {
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
    console.log('signUpWithEmail: próba rejestracji dla', email);


    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${AuthSession.makeRedirectUri()}/auth/callback`,
      },
    });

    console.log('signUpWithEmail: odpowiedź Supabase - error:', error?.message);
    console.log('signUpWithEmail: data.user:', data?.user?.id, 'email_confirmed_at:', data?.user?.email_confirmed_at);
    console.log('signUpWithEmail: data.session:', data?.session ? 'ISTNIEJE' : 'NULL');

    if (error) {
      console.log('signUpWithEmail: błąd rejestracji:', error.message);
      console.log('signUpWithEmail: pełny błąd:', JSON.stringify(error, null, 2));

      // Sprawdź czy błąd dotyczy już istniejącego emaila
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes('user already registered') ||
          errorMsg.includes('already registered') ||
          errorMsg.includes('already exists') ||
          errorMsg.includes('email address is already in use') ||
          errorMsg.includes('email taken') ||
          errorMsg.includes('duplicate') ||
          errorMsg.includes('email_already_exists') ||
          errorMsg.includes('email rate limit exceeded')) {
        console.log('signUpWithEmail: email już istnieje - blokuję rejestrację');
        return { error: 'Konto z tym adresem email już istnieje. Przejdź do logowania.' };
      }

      // Zwróć oryginalny komunikat błędu
      return { error: error.message };
    }

    // Sprawdź czy email wymaga potwierdzenia
    // Supabase może tworzyć sesję nawet gdy email nie jest potwierdzony, sprawdź email_confirmed_at
    if (data.user) {
      const isEmailConfirmed = data.user.email_confirmed_at !== null && data.user.email_confirmed_at !== undefined;
      console.log('signUpWithEmail: email_confirmed_at:', data.user.email_confirmed_at);
      console.log('signUpWithEmail: isEmailConfirmed:', isEmailConfirmed);

      if (!isEmailConfirmed) {
        console.log('signUpWithEmail: rejestracja pomyślna, ale wymaga potwierdzenia emaila');
        return {
          data,
          requiresEmailConfirmation: true,
          email: email
        };
      }
    }

    // Zapisz sesję w bezpiecznym storage
    if (data.session) {
      await saveAuthSession(data.session);
    }

    console.log('signUpWithEmail: rejestracja pomyślna');
    return { data };
  } catch (unknownError) {
    console.error('signUpWithEmail: wyjątek:', unknownError);
    return { error: 'Wystąpił nieoczekiwany błąd podczas rejestracji' };
  }
};

/**
 * Logowanie użytkownika za pomocą e-mail i hasła
 */
export const signInWithEmail = async ({ email, password }: SignInData) => {
  try {
    console.log('signInWithEmail: próba logowania dla', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('signInWithEmail: błąd logowania:', error.message);

      // Sprawdź czy błąd dotyczy niepotwierdzoneog emaila
      if (error.message.includes('Email not confirmed')) {
        console.log('signInWithEmail: email niepotwierdzony, wysyłanie ponownie emaila potwierdzającego');

        // Spróbuj ponownie wysłać email potwierdzający
        const resendResult = await resendConfirmationEmail(email);

        if (resendResult.error) {
          return { error: `Email nie został potwierdzony. ${resendResult.error}` };
        }

        // Zwróć informację o konieczności potwierdzenia emaila
        return {
          requiresEmailConfirmation: true,
          email: email,
          message: 'Email nie został potwierdzony. Wysłaliśmy ponownie link potwierdzający.'
        };
      }

      return { error: error.message };
    }

    // Zapisz sesję w bezpiecznym storage
    if (data.session) {
      await saveAuthSession(data.session);
    }

    console.log('signInWithEmail: logowanie pomyślne');
    return { data };
  } catch (unknownError) {
    console.error('signInWithEmail: wyjątek:', unknownError);
    return { error: 'Wystąpił nieoczekiwany błąd podczas logowania' };
  }
};

/**
 * Logowanie przez Google z użyciem OAuth flow
 */
export const signInWithGoogle = async () => {
  try {
    // Import WebBrowser dla OAuth flow
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const WebBrowser = require('expo-web-browser');

    // Konfiguracja redirect URI
    // W produkcji używamy custom scheme z app.json - przekierowanie na profil
    const redirectUrl = AuthSession.makeRedirectUri({
      scheme: 'matchti', // Musi być zgodne z scheme w app.json
      path: '(tabs)/profile' // Przekieruj bezpośrednio na stronę profilu
    });

    console.log('OAuth Redirect URL:', redirectUrl);

    // Rozpocznij OAuth flow z Google przez Supabase
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
      console.error('Supabase OAuth error:', error);
      return { error: error.message };
    }

    // Jeśli mamy URL, otwórz go w przeglądarce
    if (data?.url) {
      console.log('Opening OAuth URL:', data.url);

      // Skonfiguruj WebBrowser dla lepszej kompatybilności
      WebBrowser.maybeCompleteAuthSession();

      // Otwórz URL autoryzacji w przeglądarce z odpowiednią konfiguracją
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
        {
          showInRecents: true,
          createTask: false,
        }
      );

      console.log('OAuth result:', result);

      if (result.type === 'success' && result.url) {
        // Przekaż URL callback do handlera OAuth
        try {
          const { OAuthHandler } = await import('../utils/oauthHandler');
          const handler = OAuthHandler.getInstance();

          if (handler.isOAuthCallback(result.url)) {
            // Przetwórz callback URL
            const urlParams = new URL(result.url.replace('#', '?'));
            const accessToken = urlParams.searchParams.get('access_token');
            const refreshToken = urlParams.searchParams.get('refresh_token');

            if (accessToken) {
              // Poczekaj na automatyczne procesowanie przez Supabase
              await new Promise(resolve => setTimeout(resolve, 1000));

              const { data: sessionData } = await supabase.auth.getSession();
              if (sessionData?.session) {
                console.log('OAuth session detected:', sessionData.session.user?.email);
                await saveAuthSession(sessionData.session);
                return { data: sessionData };
              }
            }
          }
        } catch (handlerError) {
          console.error('OAuth handler error:', handlerError);
        }

        // Fallback - poczekaj na sesję
        let attempts = 0;
        const maxAttempts = 15;
        while (attempts < maxAttempts) {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            console.log('OAuth session detected (fallback):', sessionData.session.user?.email);
            await saveAuthSession(sessionData.session);
            return { data: sessionData };
          }
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }

        return { error: 'Nie udało się ustanowić sesji po autoryzacji' };
      } else if (result.type === 'cancel') {
        return { error: 'Logowanie zostało anulowane' };
      } else {
        return { error: 'Logowanie nie powiodło się' };
      }
    }

    return { error: 'Nie udało się uzyskać URL autoryzacji' };
  } catch (unknownError) {
    console.error('Google OAuth error:', unknownError);
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
      redirectTo: `matchti://auth/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch {
    return { error: 'Wystąpił błąd podczas resetowania hasła' };
  }
};

/**
 * Ponowne wysłanie emaila potwierdzającego
 */
export const resendConfirmationEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${AuthSession.makeRedirectUri()}/auth/callback`,
      },
    });

    if (error) {
      console.error('resendConfirmationEmail: błąd:', error.message);
      return { error: error.message };
    }

    console.log('resendConfirmationEmail: email wysłany ponownie dla:', email);
    return { success: true };
  } catch (unknownError) {
    console.error('resendConfirmationEmail: wyjątek:', unknownError);
    return { error: 'Wystąpił błąd podczas wysyłania emaila potwierdzającego' };
  }
};

/**
 * Aktualizacja hasła użytkownika
 */
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch {
    return { error: 'Wystąpił błąd podczas aktualizacji hasła' };
  }
};


/**
 * Sprawdzenie czy email to Gmail
 */
export const isGmailAccount = (email: string): boolean => {
  return email.toLowerCase().endsWith('@gmail.com');
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
  } catch (unknownError) {
    console.error('Błąd podczas pobierania sesji:', unknownError);
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
  } catch (unknownError) {
    console.error('Błąd podczas odświeżania sesji:', unknownError);
    throw unknownError;
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
  } catch (unknownError) {
    console.error('Błąd podczas zapisywania sesji:', unknownError);
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
  } catch (unknownError) {
    console.error('Błąd podczas pobierania zapisanej sesji:', unknownError);
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
  } catch (unknownError) {
    console.error('Błąd podczas usuwania sesji:', unknownError);
  }
};