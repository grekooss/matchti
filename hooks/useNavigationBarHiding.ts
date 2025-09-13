import { useEffect, useCallback } from 'react';
import { Platform, AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Warunkowy import NavigationBar - dla Expo Go użyjemy fallback
let NavigationBar: any = null;
try {
  NavigationBar = require('expo-navigation-bar');
} catch (error) {
  console.warn('NavigationBar not available - using fallback');
  // Fallback dla Expo Go
  NavigationBar = {
    setVisibilityAsync: () => Promise.resolve(),
    setBehaviorAsync: () => Promise.resolve(),
    setBackgroundColorAsync: () => Promise.resolve(),
    setPositionAsync: () => Promise.resolve(),
  };
}

/**
 * Hook do zarządzania ukrywaniem paska nawigacyjnego na Android
 * Automatycznie ukrywa pasek przy każdym renderze komponentu i focus ekranu
 */
export const useNavigationBarHiding = () => {
  const hideNavigationBar = useCallback(async () => {
    // Tylko na Android
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      // Ukryj dolny pasek z możliwością przywrócenia gestem
      await NavigationBar.setVisibilityAsync('hidden');
      
      // Auto-ukrywanie z lepszym zachowaniem: 
      // 'overlay-swipe' - pasek pojawi się jako overlay przy gestach i automatycznie zniknie
      await NavigationBar.setBehaviorAsync('overlay-swipe');
      
      // Ustaw przezroczyste tło dla lepszego efektu
      await NavigationBar.setBackgroundColorAsync('transparent');
      
      // Dodatkowa konfiguracja dla lepszego UX
      await NavigationBar.setPositionAsync('absolute');
      
      console.log('Navigation bar hidden successfully');
    } catch (error) {
      console.log('Navigation Bar hiding skipped - not available:', error);
    }
  }, []);

  // Ukryj pasek przy mount komponentu
  useEffect(() => {
    hideNavigationBar();
  }, [hideNavigationBar]);

  // Ukryj pasek przy każdym focus ekranu (przejścia między tabami)
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        hideNavigationBar();
      }, 100); // Małe opóźnienie dla pewności

      return () => clearTimeout(timer);
    }, [hideNavigationBar])
  );

  // Ukryj pasek gdy aplikacja wraca do foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        setTimeout(() => {
          hideNavigationBar();
        }, 200);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [hideNavigationBar]);
};