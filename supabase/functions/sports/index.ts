// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Schemat dla pojedynczego identyfikatora, jeśli jest podany i nie jest "null"
const PositiveIntegerStringSchema = z.string()
  .regex(/^[1-9]\d*$/, "parent_sport_id must be a positive integer string.")
  .transform(Number);

const GetSportsQuerySchema = z.object({
  parent_sport_id: z.string().optional(), // Surowy string z URL
});

// --- SportService ---
interface SportDto {
  id: number;
  name: string;
  parent_sport_id: number | null;
  iconName: string; // Oczekiwane przez klienta
}

class SportService {
  constructor(private readonly supabase: ReturnType<typeof createClient>) {}

  private mapRawSportToDto(rawSport: any): SportDto {
    return {
      id: rawSport.id,
      name: rawSport.name,
      parent_sport_id: rawSport.parent_sport_id,
      iconName: rawSport.icon_name, // Mapowanie z icon_name
    };
  }

  async getSports(parentSportId: number | null | undefined): Promise<SportDto[]> {
    let query = this.supabase
      .from('sports')
      .select('id, name, parent_sport_id, icon_name'); // Jawny select

    if (parentSportId === null) {
      query = query.is('parent_sport_id', null);
    } else if (typeof parentSportId === 'number') {
      query = query.eq('parent_sport_id', parentSportId);
    }
    // jeśli parentSportId === undefined, nie filtruj wcale – pobierz wszystkie

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch sports: ${error.message}`);
    }

    return data ? data.map(this.mapRawSportToDto) : [];
  }

  async getSportById(sportId: number): Promise<SportDto | null> {
    const { data, error } = await this.supabase
      .from('sports')
      .select('id, name, parent_sport_id, icon_name') // Jawny select
      .eq('id', sportId)
      .single();
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw new Error(`Failed to fetch sport: ${error.message}`);
    }
    return data ? this.mapRawSportToDto(data) : null;
  }
}

// --- Typ DTO dla sportu ---
// Komentarz: SportDto zdefiniowano wyżej wewnątrz bloku SportService dla jasności.
// Jeśli masz globalny plik types.ts, upewnij się, że tamta definicja jest zgodna.

// Nagłówki CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Funkcja pomocnicza do tworzenia odpowiedzi z błędem
const createErrorResponse = (status: number, message: string, details?: unknown) => {
  console.error(`Creating error response: ${status} - ${message}`, details); // Dodatkowy log
  return new Response(
    JSON.stringify({ error: message, details }),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

Deno.serve(async (req: Request) => {
  console.log(`[SPORTS FUNCTION LOG] Received request: ${req.method} ${req.url}`); // <--- NOWY LOG

  // Obsługa CORS dla OPTIONS
  if (req.method === 'OPTIONS') {
    console.log('[SPORTS FUNCTION LOG] Handling OPTIONS request'); // <--- NOWY LOG
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('[SPORTS FUNCTION LOG] Entered TRY block'); // <--- NOWY LOG

    // Sprawdzenie metody HTTP
    if (req.method !== 'GET') {
      console.warn(`[SPORTS FUNCTION LOG] Invalid method: ${req.method}`); // <--- NOWY LOG
      return createErrorResponse(405, 'Metoda nie jest dozwolona');
    }

    // Inicjalizacja klienta Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    console.log(`[SPORTS FUNCTION LOG] SUPABASE_URL: ${supabaseUrl ? 'SET' : 'NOT SET'}`); // <--- NOWY LOG
    console.log(`[SPORTS FUNCTION LOG] SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'SET' : 'NOT SET'}`); // <--- NOWY LOG

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[SPORTS FUNCTION LOG] Błąd konfiguracji: Brakujące zmienne środowiskowe SUPABASE_URL lub SUPABASE_ANON_KEY');
      return createErrorResponse(500, 'Błąd konfiguracji serwera: brakujące klucze API.');
    }

    // Inicjalizacja serwisu
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      db: { schema: 'public' }
    });
    const sportService = new SportService(supabaseClient);

    // Analiza ścieżki: obsłuż /sports oraz /sports/{id}
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const przedostatni = pathParts[pathParts.length - 2];

    // Obsługa szczegółu sportu: /sports/{id}
    if (
      pathParts.length >= 2 &&
      (przedostatni === "sports" || przedostatni?.endsWith("sports"))
    ) {
      if (/^[0-9]+$/.test(lastPart)) {
        const sportId = Number(lastPart);
        if (!Number.isSafeInteger(sportId) || sportId <= 0) {
          return createErrorResponse(400, "Nieprawidłowy parametr sport_id");
        }
        const sport = await sportService.getSportById(sportId);
        if (!sport) {
          return createErrorResponse(404, "Sport nie znaleziony");
        }
        return new Response(JSON.stringify(sport), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // Odpowiedź na nieprawidłowy ID (np. /sports/asd)
        return createErrorResponse(400, "Nieprawidłowy parametr sport_id");
      }
    }

    // Domyślnie: lista sportów
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const validatedParams = GetSportsQuerySchema.safeParse(queryParams);

    if (!validatedParams.success) {
      return createErrorResponse(400, 'Nieprawidłowe parametry zapytania', validatedParams.error.errors);
    }

    // Przetwarzanie parent_sport_id
    let parentSportId: number | null | undefined = undefined;
    const parentSportIdParam = validatedParams.data.parent_sport_id;

    if (parentSportIdParam === 'null') {
      parentSportId = null;
    } else if (parentSportIdParam) {
      const result = PositiveIntegerStringSchema.safeParse(parentSportIdParam);
      if (!result.success) {
        return createErrorResponse(400, 'Nieprawidłowy format parent_sport_id', result.error.errors);
      }
      parentSportId = result.data;
    }

    // Pobranie danych
    const sports = await sportService.getSports(parentSportId);

    // Zwrócenie odpowiedzi
    return new Response(
      JSON.stringify(sports),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[SPORTS FUNCTION LOG] Unhandled error in TRY-CATCH:', error); // <--- NOWY LOG
    return createErrorResponse(500, error.message || 'Wystąpił wewnętrzny błąd serwera', error.stack);
  }
});
