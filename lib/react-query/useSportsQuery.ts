import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase/client'; // Import klienta Supabase

// Definicja typu dla pojedynczego sportu, który otrzymamy z funkcji Edge
// Powinien być zgodny z SportDto zwracanym przez funkcję Edge
export interface Sport {
  id: number;
  name: string;
  iconName: string; // Funkcja Edge powinna zwracać to pole
  parent_sport_id?: number | null; // Opcjonalne, jeśli funkcja Edge to zwraca
}

// Klucz dla zapytania w TanStack Query - musi być tablicą w v4+
const SPORTS_QUERY_KEY = ['sportsFromEdge'];

// Funkcja pobierająca dane sportów z funkcji Edge Supabase
const fetchSportsFromEdge = async (): Promise<Sport[]> => {
  try {
    console.log('Wywołuję funkcję Edge "sports"...');
    // Nazwa Twojej funkcji Edge to 'sports'
    const { data, error } = await supabase.functions.invoke('sports', {
      method: 'GET', 
      // Aby pobrać wszystkie sporty (bez filtrowania po parent_sport_id),
      // nie przekazujemy parametru parent_sport_id, wtedy funkcja Edge
      // powinna zwrócić wszystkie sporty (parentSportId będzie undefined w funkcji Edge).
      // Jeśli chcesz tylko sporty główne (parent_sport_id IS NULL), przekaż:
      // body: { parent_sport_id: 'null' } // Zgodnie ze schematem Zod w funkcji Edge
    });

    if (error) {
      console.error('Error fetching sports from Edge function:', error);
      throw new Error(`Błąd podczas pobierania sportów: ${error.message}`);
    }

    console.log('Otrzymano dane z funkcji Edge:', data);
    // Zakładamy, że funkcja Edge zwraca dane już w odpowiednim formacie (z iconName)
    // i jest to tablica obiektów Sport.
    return data as Sport[]; // Rzutowanie, jeśli jesteśmy pewni struktury
  } catch (error) {
    console.error('Nieoczekiwany błąd podczas pobierania sportów:', error);
    throw error;
  }
};

// Custom hook do pobierania sportów z funkcji Edge
export const useSportsQuery = () => {
  return useQuery<Sport[], Error>({
    queryKey: SPORTS_QUERY_KEY, // Teraz to jest tablica
    queryFn: fetchSportsFromEdge,
    retry: 2, // Spróbuj ponownie 2 razy w przypadku błędu
    staleTime: 1000 * 60 * 10, // Dane pozostaną aktualne przez 10 minut
  });
};
