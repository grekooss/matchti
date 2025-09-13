/**
 * Typy dla systemu autoryzacji aplikacji Mecz
 */
import { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthActions {
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signIn: (data: SignInData) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithApple: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<{ error?: string }>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

export interface AuthStore extends AuthState, AuthActions {}

export type AuthProvider = 'email' | 'google' | 'apple';

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}