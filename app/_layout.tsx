import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
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
  };
}
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthModal } from '@/components/auth';
import { useOAuthHandler } from '@/lib/utils/oauthHandler';

// Utwórz QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minut
    },
  },
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require('../assets/fonts/Inter-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Konfiguracja dolnego paska nawigacyjnego na Android
  useEffect(() => {
    const setNavigationBar = async () => {
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
      } catch (error) {
        console.log('Navigation Bar configuration skipped - not available');
      }
    };
    
    setNavigationBar();
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { initializeOAuth } = useOAuthHandler();

  // Inicjalizuj OAuth handler przy starcie aplikacji
  useEffect(() => {
    initializeOAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="facility/[id]" options={{ headerShown: false }} />
            </Stack>
            {/* Modal autoryzacji - renderuje się globalnie */}
            <AuthModal />
          </ThemeProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
