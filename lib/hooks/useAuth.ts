/**
 * Hook dla zarządzania autoryzacją
 */
import { useEffect } from 'react';
import { useAuthStore, useIsAuthenticated, useAuthUser, useAuthLoading } from '../zustand/authStore';

/**
 * Hook do zarządzania autoryzacją
 * Zapewnia dostęp do stanu autoryzacji i automatyczne sprawdzanie sesji
 */
export const useAuth = () => {
  const {
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
    clearError,
    checkAuthStatus,
  } = useAuthStore();

  const user = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const error = useAuthStore((state) => state.error);

  // Sprawdź status autoryzacji przy montowaniu komponentu
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    // Stan
    user,
    isAuthenticated,
    isLoading,
    error,

    // Akcje
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
    clearError,
    checkAuthStatus,
  };
};

/**
 * Hook do wymuszania autoryzacji
 * Przydatny dla chrononych ekranów
 */
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    requiresAuth: !isAuthenticated && !isLoading,
  };
};

/**
 * Hook dla nawigacji opartej na autoryzacji
 */
export const useAuthNavigation = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  const getInitialRoute = () => {
    if (isLoading) {
      return 'loading';
    }
    
    return isAuthenticated ? 'authenticated' : 'unauthenticated';
  };

  return {
    isAuthenticated,
    isLoading,
    initialRoute: getInitialRoute(),
  };
};