// Edge Function: GET /facilities
// Listowanie obiektów sportowych z dynamicznym filtrowaniem i paginacją

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// @ts-ignore
import {
  createClient,
  SupabaseClient,
// eslint-disable-next-line import/no-unresolved
} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- TYPY I INTERFEJSY ---

interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number];
}

interface GeoJsonPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

interface SupportedSportShortDto {
  id: number;
  name: string;
}

interface FacilityListItemDto {
  id: number;
  osm_id: string | null;
  name: string | null;
  place_name: string | null;
  surface_type: string | null;
  addr_city: string | null;
  addr_street: string | null;
  addr_housenumber: string | null;
  location: GeoJsonPoint;
  way: GeoJsonPolygon | null;
  main_photo_url: string | null;
  supported_sports: SupportedSportShortDto[];
}

interface FacilitiesListResponseDto {
  items: FacilityListItemDto[];
  total: number;
  limit: number;
  offset: number;
}

// Definicja schematu Zod dla parametrów zapytania (przeniesiona wyżej dla czytelności)
const ListFacilitiesQuerySchema = z.object({
  sportId: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const num = parseInt(val, 10);
        return isNaN(num) ? undefined : num;
      }
      // Jeśli val nie jest stringiem (np. undefined, bo parametr nie został podany), 
      // również traktujemy jako undefined, co obsłuży .optional()
      return undefined; 
    },
    z.number().int('sportId must be an integer').positive('sportId must be a positive integer').optional()
  ),
  north: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  south: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  east: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  west: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  limit: z.string().optional().default('20').transform(val => parseInt(val, 10)).refine(val => !isNaN(val) && val > 0, { message: "limit must be a positive integer" }),
  offset: z.string().optional().default('0').transform(val => parseInt(val, 10)).refine(val => !isNaN(val) && val >= 0, { message: "offset must be a non-negative integer" }),
});

// Typy dla parametrów po walidacji Zod
type ValidatedListFacilitiesParams = z.infer<typeof ListFacilitiesQuerySchema>;

// --- FUNKCJE POMOCNICZE ---

/**
 * Konwertuje string w formacie heksadecymalnym na Uint8Array.
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Parsuje string EWKB (hex) dla punktu (SRID 4326) na współrzędne [lon, lat].
 */
function parseEwkbPointString(ewkbHexString: string): [number, number] | null {
  const prefix = '0101000020E6100000';
  if (ewkbHexString && ewkbHexString.toUpperCase().startsWith(prefix)) {
    const coordString = ewkbHexString.substring(prefix.length);
    if (coordString.length === 32) {
      try {
        const lonHex = coordString.substring(0, 16);
        const latHex = coordString.substring(16, 32);
        const lonBytes = hexToBytes(lonHex);
        const latBytes = hexToBytes(latHex);
        const lonDataView = new DataView(lonBytes.buffer);
        const latDataView = new DataView(latBytes.buffer);
        const longitude = lonDataView.getFloat64(0, true);
        const latitude = latDataView.getFloat64(0, true);
        return [longitude, latitude];
      } catch (e) {
        console.error('Błąd podczas konwersji hex na double w EWKB:', e);
        return null;
      }
    }
  }
  return null;
}

/**
 * Parsuje dane geometryczne (np. z PostGIS) na format GeoJSON Polygon.
 */
function parseGeometryToPolygon(geometryData: any): number[][][] {
  if (!geometryData) return [];
  if (typeof geometryData === 'object' && geometryData.coordinates) {
    return geometryData.coordinates;
  }
  return [];
}

// --- GŁÓWNA LOGIKA ---

/**
 * Pobiera listę obiektów sportowych zgodnie z parametrami.
 */
async function listFacilities(
  supabase: SupabaseClient,
  params: ValidatedListFacilitiesParams
): Promise<FacilitiesListResponseDto> {
  console.log(
    'listFacilities - params received:',
    JSON.stringify(params, null, 2)
  );

  let query = supabase
    .from('facilities_with_sports') // Upewnij się, że to jest poprawna nazwa widoku/tabeli
    .select('*', { count: 'exact' });

  // Logika filtrowania sportów na podstawie sportId
  if (params.sportId) {
    console.log(`[FACILITIES_LOG] Processing validated sportId: ${params.sportId}`);
    console.log(`Attempting to filter by sportId: ${params.sportId}`);
    try {
      // Tabela 'sports' ma kolumny: id (INT, PK), name (TEXT), parent_sport_id (INT, FK do sports.id, NULLABLE).
      const { data: sportData, error: sportError } = await supabase
        .from('sports') 
        .select('id, parent_sport_id') // Używamy parent_sport_id
        .eq('id', params.sportId) // Szukamy po ID
        .single();

      if (sportError || !sportData) {
        console.warn(`Sport with ID "${params.sportId}" not found or error fetching it:`, sportError?.message || 'Not found');
        return { items: [], total: 0, limit: params.limit, offset: params.offset };
      }

      console.log(`Found sport data for ID "${params.sportId}": id=${sportData.id}, parent_sport_id=${sportData.parent_sport_id}`);

      console.log('[FACILITIES_LOG] Fetched sportData details for ID lookup:', JSON.stringify(sportData));
    let targetSportIds: number[] = [];

      if (sportData.parent_sport_id === null) { // Kategoria główna
        console.log(`Sport ID: ${sportData.id} is a main category. Fetching subcategories...`);
        const { data: subCategories, error: subCategoriesError } = await supabase
          .from('sports') 
          .select('id')
          .eq('parent_sport_id', sportData.id); // Używamy parent_sport_id do znalezienia dzieci

        if (subCategoriesError) {
          console.error(`Error fetching subcategories for main category ID ${sportData.id}:`, subCategoriesError.message);
          return { items: [], total: 0, limit: params.limit, offset: params.offset };
        }
        targetSportIds = subCategories ? subCategories.map(sc => sc.id) : [];
        console.log(`Subcategory IDs for main category ID ${sportData.id}: [${targetSportIds.join(', ')}]`);
      } else { // Podkategoria
        targetSportIds = [sportData.id];
        console.log(`Sport ID: ${sportData.id} is a subcategory. Target ID: [${targetSportIds.join(', ')}]`);
      }

      if (targetSportIds.length > 0) {
        // Używamy operatora 'ov' (overlaps) do sprawdzenia, czy tablica sport_ids
        // zawiera którykolwiek z docelowych ID sportów.
        query = query.filter('sport_ids', 'ov', `{${targetSportIds.join(',')}}`);
        console.log(`[FACILITIES_LOG] Applying 'ov' filter with targetSportIds: {${targetSportIds.join(',')}}`);
      } else {
        console.log(`[FACILITIES_LOG] No targetSportIds derived for validated sportId: ${params.sportId}. No facilities will be returned for this sportId filter, as per logic.`);
        return { items: [], total: 0, limit: params.limit, offset: params.offset };
      }
    } catch (e: any) {
      console.error('Error during sport filtering logic:', e.message);
      return { items: [], total: 0, limit: params.limit, offset: params.offset };
    }
  }

  // Filtrowanie po granicach mapy
  if (
    params.north !== undefined &&
    params.south !== undefined &&
    params.east !== undefined &&
    params.west !== undefined
  ) {
    const wktEnvelope = `POLYGON((${params.west} ${params.south}, ${params.east} ${params.south}, ${params.east} ${params.north}, ${params.west} ${params.north}, ${params.west} ${params.south}))`;
    query = query.filter('location::geometry', 'ov', wktEnvelope); // Używam 'ov' (overlaps) jak w oryginalnym kodzie
    console.log(
      `Applying bounds filter with WKT: West=${params.west}, South=${params.south}, East=${params.east}, North=${params.north}`
    );
  }

  // Paginacja
  const limit = params.limit;
  const offset = params.offset;
  query = query.limit(limit).range(offset, offset + limit - 1);
  console.log(`Applying pagination: limit=${limit}, offset=${offset}`);

  const { data, error, count } = await query;

  if (error) {
    console.error('Supabase query error:', JSON.stringify(error, null, 2));
    throw new Error(error.message || 'Nie udało się pobrać obiektów z bazy danych.');
  }

  console.log(`Query successful. Fetched ${data?.length} items. Total count: ${count}`);

  const items: FacilityListItemDto[] = (data ?? []).map((row: any) => {
    let parsedLocation: GeoJsonPoint = { type: 'Point', coordinates: [0, 0] };
    if (row.location && typeof row.location === 'object' && row.location.coordinates) {
      parsedLocation = row.location;
    } else if (typeof row.location === 'string') {
      const pointCoords = parseEwkbPointString(row.location);
      if (pointCoords) parsedLocation.coordinates = pointCoords;
    }

    // Poprawione mapowanie: dane sportów pochodzą z kolumny `sports` (JSONB)
    // Zakładamy, że `row.sports` to tablica obiektów typu {id: number, name: string}
    const supportedSports: SupportedSportShortDto[] = Array.isArray(row.sports)
      ? row.sports.map((s: any) => ({ id: s.id, name: s.name })).filter(s => typeof s.id === 'number' && typeof s.name === 'string') // Dodatkowe zabezpieczenie typów
      : [];

    return {
      id: row.id,
      osm_id: row.osm_id ? String(row.osm_id) : null,
      name: row.name || null,
      place_name: row.place_name || null,
      surface_type: row.surface_type ? String(row.surface_type) : null,
      addr_city: row.addr_city,
      addr_street: row.addr_street,
      addr_housenumber: row.addr_housenumber,
      location: parsedLocation,
      way: row.way ? { type: 'Polygon', coordinates: parseGeometryToPolygon(row.way) } : null,
      main_photo_url: row.main_photo_url || null,
      supported_sports: supportedSports,
    };
  });

  return { items, total: count || 0, limit, offset };
}

// --- SERWER I WALIDACJA ---

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const queryParamsFromUrl: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      queryParamsFromUrl[key] = value;
    });

    // Walidacja parametrów zapytania
    const validatedParams = ListFacilitiesQuerySchema.parse(queryParamsFromUrl);
    console.log('[FACILITIES_LOG] Received validated params:', JSON.stringify(validatedParams));

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const result = await listFacilities(supabaseClient, validatedParams);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    let errorMessage = 'Wystąpił nieoczekiwany błąd.';
    let errorDetails = {};
    let status = 500;

    if (error instanceof z.ZodError) {
      errorMessage = 'Błąd walidacji parametrów.';
      errorDetails = error.issues;
      status = 400;
      console.error('Zod validation error:', error.issues);
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error('General error:', error.message, error.stack);
    } else {
      console.error('Unknown error type:', error);
    }

    return new Response(
      JSON.stringify({
        message: errorMessage,
        details: errorDetails,
        error: error.message, // Dodatkowe pole dla ogólnego błędu
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status,
      }
    );
  }
});
