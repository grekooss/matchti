export interface FacilityModel {
  id: string | number; // Supabase zazwyczaj używa 'id' typu liczbowego (serial) lub tekstowego (UUID)
  osm_id: number;
  name?: string;
  building: string; // To było używane jako kategoria, w Supabase może to być 'type' lub 'category'
  addr_housenumber?: string;
  latitude: number;
  longitude: number;
  way: string; // Łańcuch JSON [number, number][] reprezentujący współrzędne dla wielokąta Leaflet
  // Dodaj inne istotne pola, które może mieć Twoja tabela w Supabase
  created_at?: string;
  // Przykład: jeśli masz bezpośrednie odwołanie do tabeli kategorii
  // category_id?: number;
}
