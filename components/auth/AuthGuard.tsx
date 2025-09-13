/**
 * Komponent chroniący ekrany przed nieautoryzowanym dostępem
 */
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../lib/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // Poczekaj na sprawdzenie statusu autoryzacji

    const inAuthGroup = segments.some(segment => segment === 'auth');

    // Jeśli użytkownik jest zalogowany i jest na ekranie autoryzacji, przekieruj do głównej strony
    if (isAuthenticated && inAuthGroup) {
      router.push('/(tabs)');
    }
    // Pozwól na dostęp do wszystkich innych stron bez autoryzacji
  }, [isAuthenticated, isLoading, segments, router]);

  // Minimalizuj czas loading screen - maksymalnie 1 sekunda
  const [showLoading, setShowLoading] = React.useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 1000); // Maksymalnie 1 sekunda loading

    return () => clearTimeout(timer);
  }, []);

  // Pokaż loading tylko przez krótki czas
  if (isLoading && showLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#069494" />
        <Text style={{ marginTop: 16, color: '#6B7280' }}>
          Sprawdzanie autoryzacji...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};