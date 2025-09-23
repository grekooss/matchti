/**
 * Store Zustand dla zarządzania stanem autoryzacji
 */
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '../supabase/client';
import * as authApi from '../api/auth';
import type { AuthStore, AuthUser, SignUpData, SignInData, ResetPasswordData } from '../types/auth';

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set, get) => ({
    // Stan początkowy
    user: null,
    profile: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,

    // Akcje autoryzacji
    signUp: async (data: SignUpData) => {
      set({ isLoading: true, error: null });
      
      try {
        const result = await authApi.signUpWithEmail({
          email: data.email,
          password: data.password,
        });

        if (result.error) {
          set({ error: result.error, isLoading: false });
          return { error: result.error };
        }

        // Sprawdź czy wymaga potwierdzenia emaila
        if (result.requiresEmailConfirmation) {
          set({ isLoading: false });
          return {
            requiresEmailConfirmation: true,
            email: result.email
          };
        }

        // Jeśli rejestracja się powiodła, zaktualizuj stan
        if (result.data?.user) {
          set({
            user: result.data.user as AuthUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }

        return {};
      } catch {
        const errorMessage = 'Wystąpił nieoczekiwany błąd podczas rejestracji';
        set({ error: errorMessage, isLoading: false });
        return { error: errorMessage };
      }
    },

    signIn: async (data: SignInData) => {
      set({ isLoading: true, error: null });

      try {
        const result = await authApi.signInWithEmail(data);

        if (result.error) {
          set({ error: result.error, isLoading: false });
          return { error: result.error };
        }

        // Sprawdź czy wymaga potwierdzenia emaila (podczas logowania)
        if (result.requiresEmailConfirmation) {
          set({ isLoading: false });
          return {
            requiresEmailConfirmation: true,
            email: result.email,
            message: result.message
          };
        }

        // Jeśli logowanie się powiodło, zaktualizuj stan
        if (result.data?.user) {
          set({
            user: result.data.user as AuthUser,
            isAuthenticated: true,
            isLoading: false,
          });
        }

        return {};
      } catch {
        const errorMessage = 'Wystąpił nieoczekiwany błąd podczas logowania';
        set({ error: errorMessage, isLoading: false });
        return { error: errorMessage };
      }
    },

    signInWithGoogle: async () => {
      set({ isLoading: true, error: null });
      
      try {
        const result = await authApi.signInWithGoogle();

        if (result.error) {
          set({ error: result.error, isLoading: false });
          return { error: result.error };
        }

        // Stan zostanie zaktualizowany przez listener auth state
        set({ isLoading: false });
        return {};
      } catch {
        const errorMessage = 'Wystąpił błąd podczas logowania przez Google';
        set({ error: errorMessage, isLoading: false });
        return { error: errorMessage };
      }
    },

    signInWithApple: async () => {
      set({ isLoading: true, error: null });
      
      try {
        const result = await authApi.signInWithApple();

        if (result.error) {
          set({ error: result.error, isLoading: false });
          return { error: result.error };
        }

        // Jeśli logowanie się powiodło, zaktualizuj stan
        if (result.data?.user) {
          set({
            user: result.data.user as AuthUser,
            isAuthenticated: true,
            isLoading: false,
          });
        }

        return {};
      } catch {
        const errorMessage = 'Wystąpił błąd podczas logowania przez Apple';
        set({ error: errorMessage, isLoading: false });
        return { error: errorMessage };
      }
    },

    signOut: async () => {
      set({ isLoading: true, error: null });
      
      try {
        await authApi.signOut();
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } catch {
        set({
          error: 'Wystąpił błąd podczas wylogowywania',
          isLoading: false
        });
      }
    },

    resetPassword: async (data: ResetPasswordData) => {
      set({ isLoading: true, error: null });

      try {
        const result = await authApi.resetPassword(data);

        if (result.error) {
          set({ error: result.error, isLoading: false });
          return { error: result.error };
        }

        set({ isLoading: false });
        return {};
      } catch {
        const errorMessage = 'Wystąpił błąd podczas resetowania hasła';
        set({ error: errorMessage, isLoading: false });
        return { error: errorMessage };
      }
    },


    clearError: () => {
      set({ error: null });
    },

    checkAuthStatus: async () => {
      set({ isLoading: true });
      
      // Timeout fallback - jeśli sprawdzenie trwa dłużej niż 2 sekundy, ustaw jako niezalogowany
      const timeoutId = setTimeout(() => {
        console.warn('Auth check timeout - setting as unauthenticated');
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }, 2000);
      
      try {
        // Sprawdź czy Supabase jest skonfigurowany
        if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
          console.warn('Supabase not configured, running in demo mode');
          clearTimeout(timeoutId);
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        const session = await authApi.getCurrentSession();
        clearTimeout(timeoutId);
        
        if (session?.user) {
          set({
            user: session.user as AuthUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Błąd podczas sprawdzania statusu autoryzacji:', error);
        // Nie blokuj interfejsu - ustaw jako niezalogowany
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    },
  }))
);

// Listener dla zmian stanu autoryzacji w Supabase
supabase.auth.onAuthStateChange(async (event: string, session: any) => {
  const { checkAuthStatus } = useAuthStore.getState();
  
  console.log('Auth state changed:', event, session?.user?.id);
  
  switch (event) {
    case 'SIGNED_IN':
      if (session?.user) {
        useAuthStore.setState({
          user: session.user as AuthUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
      break;
      
    case 'SIGNED_OUT':
      useAuthStore.setState({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      break;
      
    case 'TOKEN_REFRESHED':
      // Sesja została odświeżona, zaktualizuj stan jeśli potrzeba
      if (session?.user) {
        useAuthStore.setState({
          user: session.user as AuthUser,
          isAuthenticated: true,
        });
      }
      break;
      
    default:
      await checkAuthStatus();
      break;
  }
});

// Hook dla selektorów
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);