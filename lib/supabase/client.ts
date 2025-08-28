import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // Potrzebne dla Supabase w React Native
import { Database } from '../../supabase/database.types'; // Poprawiona ścieżka

// Odczytaj zmienne środowiskowe - upewnij się, że są poprawnie skonfigurowane w Twoim projekcie Expo
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Supabase URL is not defined. Please set EXPO_PUBLIC_SUPABASE_URL in your environment variables.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Supabase Anon Key is not defined. Please set EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

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

