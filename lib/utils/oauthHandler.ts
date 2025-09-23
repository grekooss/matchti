/**
 * Obsługa OAuth callback i deep linking
 */
import { supabase } from '../supabase/client';
import * as Linking from 'expo-linking';

/**
 * Klasa do obsługi OAuth callback z deep linking
 */
export class OAuthHandler {
  private static instance: OAuthHandler;
  private isInitialized = false;

  public static getInstance(): OAuthHandler {
    if (!OAuthHandler.instance) {
      OAuthHandler.instance = new OAuthHandler();
    }
    return OAuthHandler.instance;
  }

  /**
   * Inicjalizuje handler OAuth - należy wywołać przy starcie aplikacji
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Obsługa initial URL (gdy aplikacja została otwarta przez deep link)
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log('Initial URL:', initialUrl);
        await this.handleOAuthCallback(initialUrl);
      }

      // Listener na zmiany URL (gdy aplikacja jest już otwarta)
      const subscription = Linking.addEventListener('url', async (event) => {
        console.log('URL event:', event.url);
        await this.handleOAuthCallback(event.url);
      });

      this.isInitialized = true;
      console.log('OAuth handler initialized');

      // Cleanup subscription when not needed
      return () => subscription?.remove();
    } catch (error) {
      console.error('Failed to initialize OAuth handler:', error);
    }
  }

  /**
   * Obsługuje OAuth callback URL
   */
  private async handleOAuthCallback(url: string): Promise<void> {
    try {
      // Sprawdź czy URL zawiera parametry OAuth
      if (url.includes('#access_token=') || url.includes('?code=') || url.includes('oauth') || url.includes('auth/callback')) {
        console.log('Processing OAuth callback:', url);

        // Dla URL-i z fragmentem (#) przekształć na query parametry
        let processUrl = url;
        if (url.includes('#')) {
          processUrl = url.replace('#', '?');
        }

        try {
          // Pierwsza próba - exchangeCodeForSession dla authorization code flow
          if (url.includes('?code=') || url.includes('#code=')) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(processUrl);
            if (!error && data?.session) {
              console.log('OAuth session established via code exchange:', data.session.user?.email);
              return;
            }
          }

          // Druga próba - dla implicit flow z access_token
          if (url.includes('access_token=')) {
            const urlParams = new URL(processUrl);
            const accessToken = urlParams.searchParams.get('access_token');
            const refreshToken = urlParams.searchParams.get('refresh_token');
            const tokenType = urlParams.searchParams.get('token_type') || 'bearer';

            if (accessToken) {
              // Ustaw sesję z otrzymanymi tokenami
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });

              if (!error && data?.session) {
                console.log('OAuth session established via access token:', data.session.user?.email);
                return;
              }
            }
          }

          // Trzecia próba - ogólne przetwarzanie przez Supabase
          const { data, error } = await supabase.auth.getSessionFromUrl(processUrl);
          if (!error && data?.session) {
            console.log('OAuth session established via getSessionFromUrl:', data.session.user?.email);
            return;
          }

          console.warn('Could not establish OAuth session from URL:', url);
        } catch (sessionError) {
          console.error('Error establishing OAuth session:', sessionError);
        }
      }
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
    }
  }

  /**
   * Sprawdza czy URL jest OAuth callback
   */
  public isOAuthCallback(url: string): boolean {
    return url.includes('#access_token=') ||
           url.includes('?code=') ||
           url.includes('oauth') ||
           url.includes('auth/callback') ||
           url.includes('(tabs)/profile') ||
           url.startsWith('matchti://oauth') ||
           url.startsWith('matchti://auth/callback') ||
           url.startsWith('matchti://(tabs)/profile');
  }

  /**
   * Czyści handler (cleanup)
   */
  public cleanup(): void {
    this.isInitialized = false;
  }
}

/**
 * Hook do łatwego użycia OAuth handler
 */
export const useOAuthHandler = () => {
  const handler = OAuthHandler.getInstance();

  const initializeOAuth = async () => {
    return await handler.initialize();
  };

  const isOAuthCallback = (url: string) => {
    return handler.isOAuthCallback(url);
  };

  const cleanup = () => {
    handler.cleanup();
  };

  return {
    initializeOAuth,
    isOAuthCallback,
    cleanup,
  };
};