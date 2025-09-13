import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // Potrzebne dla Supabase w React Native
import { Database } from '../../supabase/database.types'; // Poprawiona ścieżka

// Warunkowy import AsyncStorage - dla Expo Go użyjemy fallback
let AsyncStorage: any = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  console.warn('AsyncStorage not available - running in Expo Go. Sessions will not persist.');
  // Fallback storage dla Expo Go
  AsyncStorage = {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
}

// Odczytaj zmienne środowiskowe - upewnij się, że są poprawnie skonfigurowane w Twoim projekcie Expo
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.warn('Supabase URL is not defined. Running in demo mode.');
}

if (!supabaseAnonKey) {
  console.warn('Supabase Anon Key is not defined. Running in demo mode.');
}

// Jeśli brak konfiguracji Supabase, stwórz mock client
export const supabase = supabaseUrl && supabaseAnonKey ? 
  createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }) : 
  // Mock client dla trybu demo
  {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    }),
    storage: {
      from: () => ({
        list: () => Promise.resolve({ data: [], error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as any;

/**
 * Pobiera publiczne URL-e zdjęć dla danego znacznika (markera) z Supabase Storage.
 * @param bucketId - ID "kubełka" (bucket) w Supabase Storage, np. 'photos'.
 * @param markerId - ID znacznika, które odpowiada nazwie folderu w kubełku.
 * @returns Tablica publicznych URL-i do zdjęć lub pusta tablica w przypadku błędu lub braku zdjęć.
 */
export const getPhotosForMarker = async (bucketId: string, markerId: string) => {
  try {
    // 1. Wylistuj pliki w folderze odpowiadającym markerId
    const { data: files, error: listError } = await supabase.storage
      .from(bucketId)
      .list(markerId, {
        limit: 10, // Można dostosować limit
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (listError) {
      throw listError;
    }

    if (!files || files.length === 0) {
      console.log(`No photos found for marker ${markerId} in bucket ${bucketId}.`);
      return [];
    }

    // 2. Pobierz publiczne URL-e dla każdego pliku
    const photoUrls = files.map((file) => {
      const { data } = supabase.storage
        .from(bucketId)
        .getPublicUrl(`${markerId}/${file.name}`); // Tworzymy pełną ścieżkę do pliku
      return data.publicUrl;
    });

    console.log(`Found ${photoUrls.length} photos for marker ${markerId}.`);
    return photoUrls;
  } catch (error) {
    console.error('Error getting photos from Supabase Storage:', error);
    return [];
  }
};

