# API Endpoint Implementation Plan: `GET /facilities`

## 1. Przegląd punktu końcowego

Punkt końcowy `GET /facilities` służy do listowania obiektów sportowych. Umożliwia dynamiczne filtrowanie wyników na podstawie różnych kryteriów, w tym obsługiwanych dyscyplin sportowych, lokalizacji geograficznej użytkownika (wyszukiwanie w promieniu), widocznego obszaru mapy (granice), oraz wspiera paginację wyników. Odpowiedź zawiera listę obiektów wraz z podstawowymi informacjami, zdjęciem głównym i listą obsługiwanych sportów, a także metadane dotyczące paginacji.

## 2. Szczegóły żądania

*   **Metoda HTTP:** `GET`
*   **Struktura URL:** `/facilities`
*   **Parametry zapytania (Query Params):**
    *   **Opcjonalne:**
        *   `sport_ids` (string, np. `"1,2"`): Przecinkami oddzielona lista identyfikatorów sportów. Filtruje obiekty, które obsługują przynajmniej jeden z podanych sportów.
        *   `latitude` (float): Szerokość geograficzna użytkownika (np. `50.064651`). Wymagany, jeśli podano `radius_km`.
        *   `longitude` (float): Długość geograficzna użytkownika (np. `19.944981`). Wymagany, jeśli podano `radius_km`.
        *   `radius_km` (float): Promień wyszukiwania w kilometrach (np. `5.0`). Wymaga jednoczesnego podania `latitude` i `longitude`.
        *   `bounds` (string, np. `"50.1,20.0,50.0,19.9"`): Przecinkami oddzielona lista czterech wartości float: `north,east,south,west`, definiująca prostokątny obszar mapy.
        *   `limit` (integer, domyślnie: `20`): Liczba obiektów do zwrócenia na stronę.
        *   `offset` (integer, domyślnie: `0`): Numer rekordu, od którego rozpocząć zwracanie wyników (dla paginacji).
*   **Request Body:** Brak.

## 3. Wykorzystywane typy

*   **DTO (Data Transfer Objects):**
    *   `FacilityListItemDto`: Reprezentuje pojedynczy obiekt sportowy w liście.
        ```typescript
        export type FacilityListItemDto = Pick<
          Tables<'facilities'>,
          | 'id'
          | 'osm_id'
          | 'name'
          | 'surface_type'
          | 'addr_city'
          | 'addr_street'
          | 'addr_housenumber'
        > & {
          location: GeoJsonPoint; // { type: 'Point', coordinates: [longitude, latitude] }
          main_photo_url: string | null; // Pochodne z facility_photos
          supported_sports: SupportedSportShortDto[]; // Pochodne z facility_sports
        };
        ```
    *   `SupportedSportShortDto`: Uproszczone informacje o sporcie.
        ```typescript
        export type SupportedSportShortDto = Pick<Tables<'sports'>, 'id' | 'name'>;
        ```
    *   `GeoJsonPoint`: Struktura dla lokalizacji.
        ```typescript
        export type GeoJsonPoint = {
          type: 'Point';
          coordinates: [number, number]; // [longitude, latitude]
        };
        ```
    *   `FacilitiesListResponseDto`: Kompletna odpowiedź endpointu.
        ```typescript
        export type FacilitiesListResponseDto = {
          items: FacilityListItemDto[];
          total: number;
          limit: number;
          offset: number;
        };
        ```
*   **Schematy walidacji Zod:**
    *   Dla parametrów zapytania `GET /facilities`:
        ```typescript
        // supabase/functions/list-facilities/schema.ts
        import { z } from 'zod';

        const CommaSeparatedIntsSchema = z.string()
          .regex(/^[1-9]\d*(,[1-9]\d*)*$/, "sport_ids must be a comma-separated string of positive integers.")
          .transform(val => val.split(',').map(Number));

        const BoundsSchema = z.string()
          .regex(/^(\-?\d+(\.\d+)?),(\-?\d+(\.\d+)?),(\-?\d+(\.\d+)?),(\-?\d+(\.\d+)?)$/, "bounds must be a comma-separated string of four decimal numbers: north,east,south,west.")
          .transform(val => {
            const parts = val.split(',').map(Number);
            return { north: parts[0], east: parts[1], south: parts[2], west: parts[3] };
          })
          .refine(b => b.north >= -90 && b.north <= 90 &&
                       b.east >= -180 && b.east <= 180 &&
                       b.south >= -90 && b.south <= 90 &&
                       b.west >= -180 && b.west <= 180,
                       "Invalid latitude/longitude values in bounds.")
          .refine(b => b.north > b.south, "North bound must be greater than south bound.");
          // Uwaga: walidacja E > W jest skomplikowana przez linię zmiany daty; dla uproszczenia pominięta.

        export const ListFacilitiesQuerySchema = z.object({
          sport_ids: CommaSeparatedIntsSchema.optional(),
          latitude: z.coerce.number().min(-90).max(90).optional(),
          longitude: z.coerce.number().min(-180).max(180).optional(),
          radius_km: z.coerce.number().positive("Search radius must be positive.").optional(),
          bounds: BoundsSchema.optional(),
          limit: z.coerce.number().int().min(1).max(100).default(20), // Max limit 100
          offset: z.coerce.number().int().min(0).default(0),
        }).refine(data => {
            // Jeśli radius_km jest podany, latitude i longitude muszą być również podane.
            if (data.radius_km !== undefined && (data.latitude === undefined || data.longitude === undefined)) {
                return false;
            }
            return true;
        }, {
            message: "latitude and longitude are required when radius_km is provided.",
            path: ["latitude", "longitude", "radius_km"], // Ścieżka do błędu
        }).refine(data => {
            // Nie można używać jednocześnie radius_km i bounds
            if (data.radius_km !== undefined && data.bounds !== undefined) {
                return false;
            }
            return true;
        }, {
            message: "Cannot use radius_km and bounds simultaneously. Choose one geo-query method.",
            path: ["radius_km", "bounds"],
        });

        export type ValidatedListFacilitiesParams = z.infer<typeof ListFacilitiesQuerySchema>;
        ```

## 4. Szczegóły odpowiedzi

*   **Sukces (`200 OK`):**
    *   Content-Type: `application/json`
    *   Body: Obiekt `FacilitiesListResponseDto`.
        ```json
        // Przykładowa odpowiedź (skrócona)
        {
          "items": [
            {
              "id": "uuid-facility-1",
              "osm_id": 12345,
              "name": "Orlik przy Szkole Podstawowej nr 5",
              "location": { "type": "Point", "coordinates": [19.944981, 50.064651] },
              "surface_type": "GRASS_ARTIFICIAL",
              "addr_city": "Kraków",
              "addr_street": "Ulica Testowa",
              "addr_housenumber": "10",
              "main_photo_url": "https://example.com/photo.jpg",
              "supported_sports": [
                { "id": 1, "name": "Football" },
                { "id": 2, "name": "Basketball" }
              ]
            }
            // ... więcej obiektów
          ],
          "total": 100, // Całkowita liczba pasujących obiektów (przed paginacją)
          "limit": 20,
          "offset": 0
        }
        ```
*   **Błąd (`400 Bad Request`):**
    *   Content-Type: `application/json`
    *   Body: Obiekt błędu wyjaśniający problem z parametrami zapytania.
        ```json
        {
          "error": "Invalid query parameters.",
          "details": [ // Opcjonalne, szczegóły z Zod
            { "path": ["sport_ids"], "message": "sport_ids must be a comma-separated string of positive integers." }
          ]
        }
        ```
*   **Błąd (`500 Internal Server Error`):**
    *   Content-Type: `application/json`
    *   Body: Ogólny komunikat błędu.
        ```json
        { "error": "Internal Server Error" }
        ```

## 5. Przepływ danych

1.  **Funkcja Edge (`supabase/functions/list-facilities/index.ts`):**
    a.  Obsługa żądania `OPTIONS` dla CORS (użycie współdzielonych `corsHeaders`).
    b.  Pobranie parametrów zapytania z `req.url`.
    c.  Walidacja i transformacja parametrów przy użyciu `ListFacilitiesQuerySchema` (Zod). W przypadku błędu walidacji, zwróć `400 Bad Request` z odpowiednim komunikatem.
    d.  Utworzenie instancji klienta Supabase (anonimowy, ponieważ endpoint jest publiczny).
    e.  Utworzenie instancji `FacilityService` przekazując klienta Supabase.
    f.  Wywołanie metody `facilityService.listFacilities(validatedParams)`.
    g.  Obsługa błędów z serwisu:
        *   W przypadku błędów (np. problem z bazą danych), zaloguj błąd i zwróć `500 Internal Server Error`.
    h.  Jeśli wszystko OK, zwróć `200 OK` z danymi (`FacilitiesListResponseDto`) w formacie JSON.

2.  **Serwis (`supabase/functions/_shared/services/facilityService.ts`):**
    *   Metoda `async listFacilities(supabase: SupabaseClient, params: ValidatedListFacilitiesParams): Promise<{ items: FacilityListItemDto[], total: number, limit: number, offset: number }>`:
        a.  Inicjalizacja zapytania do Supabase: `supabase.from('facilities').select('...', { count: 'exact' })`.
            *   Pola do wybrania: `id`, `osm_id`, `name`, `location` (GeoJSON), `surface_type`, `addr_city`, `addr_street`, `addr_housenumber`.
            *   Pola pochodne (przez zagnieżdżone selecty Supabase):
                *   `main_photo_url`: `facility_photos(storage_path, sort_order)`. Należy wybrać jedno zdjęcie (np. o najniższym `sort_order` lub najstarsze). Wymaga dodatkowej logiki do zbudowania pełnego publicznego URL ze `storage_path` (używając `supabase.storage.from('bucket').getPublicUrl()`).
                *   `supported_sports`: `facility_sports(sports(id, name))`.
        b.  **Filtrowanie:**
            *   `sport_ids`: Jeśli podane, dodaj warunek do zapytania. Można to zrealizować przez subquery `facility_id IN (SELECT facility_id FROM facility_sports WHERE sport_id = ANY(?))` lub przez funkcję RPC.
                ```sql
                -- Funkcja RPC dla filtrowania po sport_ids (opcjonalnie, jeśli subquery w Supabase JS jest trudne)
                -- CREATE OR REPLACE FUNCTION filter_facilities_by_sports(p_sport_ids int[])
                -- RETURNS SETOF facilities AS $$
                -- BEGIN
                --   RETURN QUERY SELECT f.* FROM facilities f
                --   WHERE EXISTS (SELECT 1 FROM facility_sports fs WHERE fs.facility_id = f.id AND fs.sport_id = ANY(p_sport_ids));
                -- END;
                -- $$ LANGUAGE plpgsql;
                ```
                W `supabase-js` można użyć:
                `query = query.filter('id', 'in', supabase.from('facility_sports').select('facility_id').in('sport_id', params.sport_ids))`
            *   Geo-zapytania (użycie funkcji RPC PostGIS dla czytelności i wydajności):
                *   `radius_km`: Jeśli `latitude`, `longitude`, `radius_km` są podane, wywołaj funkcję RPC `facilities_in_radius(lat, lon, radius_meters)`.
                    ```sql
                    -- Funkcja RPC dla wyszukiwania w promieniu
                    CREATE OR REPLACE FUNCTION facilities_in_radius(p_lat float, p_lon float, p_radius_meters float)
                    RETURNS SETOF facilities AS $$
                    BEGIN
                      RETURN QUERY SELECT * FROM facilities
                      WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography, p_radius_meters);
                    END;
                    $$ LANGUAGE plpgsql;
                    ```
                    `query = query.rpc('facilities_in_radius', { p_lat: params.latitude, p_lon: params.longitude, p_radius_meters: params.radius_km * 1000 })`
                *   `bounds`: Jeśli podane, wywołaj funkcję RPC `facilities_in_bounds(north, east, south, west)`.
                    ```sql
                    -- Funkcja RPC dla wyszukiwania w granicach
                    CREATE OR REPLACE FUNCTION facilities_in_bounds(p_north float, p_east float, p_south float, p_west float)
                    RETURNS SETOF facilities AS $$
                    BEGIN
                      RETURN QUERY SELECT * FROM facilities
                      WHERE location && ST_MakeEnvelope(p_west, p_south, p_east, p_north, 4326); -- minX, minY, maxX, maxY (lon, lat)
                    END;
                    $$ LANGUAGE plpgsql;
                    ```
                    `query = query.rpc('facilities_in_bounds', { p_north: params.bounds.north, ... })`
        c.  **Sortowanie:** Domyślnie np. po nazwie (`.order('name')`). Można rozważyć sortowanie po odległości, jeśli przeprowadzane jest wyszukiwanie w promieniu (wymaga obliczenia odległości w zapytaniu).
        d.  **Paginacja:** Zastosuj `.range(params.offset, params.offset + params.limit - 1)`.
        e.  Wykonaj zapytanie (`await query`).
        f.  Pobierz `data` (wyniki) i `count` (całkowita liczba pasujących rekordów) z odpowiedzi Supabase.
        g.  Mapuj surowe dane z bazy na tablicę `FacilityListItemDto[]`.
            *   Przekształć `location` (jeśli nie jest już GeoJSON) na `GeoJsonPoint`.
            *   Ustal `main_photo_url` (pierwsze zdjęcie z `facility_photos`, następnie `getPublicUrl`).
            *   Zmapuj `facility_sports` na `SupportedSportShortDto[]`.
        h.  Zwróć `{ items, total: count, limit: params.limit, offset: params.offset }`.

## 6. Względy bezpieczeństwa

*   **Walidacja danych wejściowych:** Wszystkie parametry zapytania są rygorystycznie walidowane przez Zod (`ListFacilitiesQuerySchema`) po stronie serwera, aby zapobiec błędom i potencjalnym atakom.
*   **Uwierzytelnianie i Autoryzacja:** Endpoint jest publicznie dostępny. Klient Supabase będzie używał anonimowego klucza API. Polityki RLS (Row Level Security) na tabelach `facilities`, `facility_photos`, `facility_sports`, `sports` muszą zezwalać na operacje `SELECT` dla roli `anon`.
    *   Istniejąca polityka `CREATE POLICY "Facilities - Allow public read access" ON facilities FOR SELECT USING (true);` jest odpowiednia. Podobne polityki powinny istnieć dla powiązanych tabel.
*   **SQL Injection:** Użycie `supabase-js` i jego query buildera oraz parametryzowanych funkcji RPC minimalizuje ryzyko SQL injection. Należy unikać bezpośredniego wstawiania danych wejściowych do surowych zapytań SQL.
*   **Ochrona przed nadużyciami (DoS/DDoS):**
    *   Limit wyników (`limit`) jest ograniczony do maksymalnie 100, aby zapobiec żądaniom o zbyt duże ilości danych.
    *   Geo-zapytania, zwłaszcza na dużych zbiorach danych, mogą być kosztowne. Indeksy przestrzenne (GIST index `idx_facilities_location` na `facilities.location`) są kluczowe i muszą być wykorzystywane. Funkcje RPC powinny być zoptymalizowane.
    *   Standardowe mechanizmy ochrony Supabase (np. limity wywołań funkcji) będą działać. W razie potrzeby można zaimplementować dodatkowy rate limiting na poziomie funkcji Edge.
*   **CORS:** Skonfigurowane zostaną odpowiednie nagłówki CORS (`Access-Control-Allow-Origin` ograniczony do domeny produkcyjnej frontendu, `Access-Control-Allow-Methods` tylko `GET`, `OPTIONS`).

## 7. Obsługa błędów

*   **Standardowe odpowiedzi HTTP:** Błędy będą komunikowane za pomocą odpowiednich kodów statusu HTTP (`400`, `500`) oraz ciała odpowiedzi w formacie JSON z polem `error` i opcjonalnie `details`.
*   **Logowanie:**
    *   Błędy walidacji (400) skutkują odpowiedzią do klienta; szczegółowe logowanie po stronie serwera nie jest konieczne, chyba że dla celów monitorowania wzorców błędnych żądań.
    *   Wszelkie nieoczekiwane błędy serwera (skutkujące statusem 500) będą logowane za pomocą `console.error` wraz z kontekstem i stack trace. Supabase automatycznie zbiera logi z funkcji Edge.
*   **Early Returns:** Funkcje będą stosować wzorzec "early return" do obsługi błędów walidacji i innych warunków brzegowych na początku funkcji.
*   **Obsługa błędów z `supabase-js`:** Błędy zwracane przez `supabase-js` lub funkcje RPC (np. problemy z połączeniem, błędy zapytań) będą przechwytywane, logowane, a następnie mapowane na odpowiedź `500 Internal Server Error`.

## 8. Rozważania dotyczące wydajności

*   **Zapytania do bazy danych:**
    *   Kluczowe jest efektywne wykorzystanie indeksów, zwłaszcza indeksu przestrzennego `idx_facilities_location` (GIST) dla geo-zapytań oraz indeksów na kluczach obcych dla JOINów (np. `idx_facility_sports_facility_id`, `idx_facility_sports_sport_id`).
    *   Zapytania do pobierania `main_photo_url` i `supported_sports` powinny być zoptymalizowane. Zagnieżdżone selecty Supabase są generalnie wydajne, ale dla bardzo skomplikowanych przypadków można rozważyć widoki bazodanowe lub funkcje RPC.
    *   Użycie `{ count: 'exact' }` do zliczania całkowitej liczby wyników może wpłynąć na wydajność przy bardzo dużych tabelach i złożonych filtrach. Należy monitorować.
*   **Rozmiar odpowiedzi:** `limit` jest ograniczony, co kontroluje rozmiar tablicy `items`. Pozostałe pola są stałe.
*   **Funkcje RPC PostGIS:** `ST_DWithin` i `ST_MakeEnvelope` z operatorem `&&` są wydajne, jeśli używane z indeksami GIST. Rzutowanie na `geography` dla `ST_DWithin` jest poprawne dla odległości w metrach, ale może być nieco wolniejsze niż operacje na `geometry` (jednak `geometry` wymagałoby przeliczania `radius_km` na stopnie, co jest zależne od szerokości geograficznej).
*   **Cold Starts funkcji Edge:** Utrzymanie minimalnego rozmiaru paczki funkcji Edge przez unikanie niepotrzebnych zależności.
*   **Caching:**
    *   **Po stronie klienta (aplikacja mobilna):** TanStack Query (React Query) będzie buforować odpowiedzi, co zmniejszy liczbę żądań.
    *   **Po stronie serwera/CDN:** Można rozważyć dodanie nagłówków `Cache-Control` do odpowiedzi, jeśli dane nie zmieniają się bardzo często, aby umożliwić cachowanie przez pośredników lub przeglądarkę (mniej istotne dla API aplikacji mobilnej).

## 9. Etapy wdrożenia

1.  **Przygotowanie bazy danych (jeśli konieczne):**
    *   Upewnij się, że wszystkie wymagane indeksy (zwłaszcza GIST dla `location` i B-tree dla kluczy obcych i często filtrowanych kolumn) są na miejscu.
    *   Stwórz (jeśli wybrano to podejście) funkcje RPC w PostgreSQL: `facilities_in_radius`, `facilities_in_bounds`. Dodaj migracje Supabase dla tych funkcji.
        ```sql
        -- Migracja dla funkcji RPC (przykłady)
        -- supabase/migrations/YYYYMMDDHHMMSS_create_geo_search_functions.sql
        CREATE OR REPLACE FUNCTION facilities_in_radius(p_lat float, p_lon float, p_radius_meters float)
        RETURNS SETOF facilities AS $$ -- Zwraca pełne wiersze z tabeli facilities
        BEGIN
          RETURN QUERY SELECT * FROM public.facilities -- Użyj public.facilities dla jawności
          WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography, p_radius_meters);
        END;
        $$ LANGUAGE plpgsql STABLE; -- STABLE, bo nie modyfikuje danych i zwraca te same wyniki dla tych samych argumentów w ramach jednego skanu

        CREATE OR REPLACE FUNCTION facilities_in_bounds(p_north float, p_east float, p_south float, p_west float)
        RETURNS SETOF facilities AS $$
        BEGIN
          RETURN QUERY SELECT * FROM public.facilities
          WHERE location && ST_MakeEnvelope(p_west, p_south, p_east, p_north, 4326);
        END;
        $$ LANGUAGE plpgsql STABLE;
        ```
    *   Sprawdź i ewentualnie dostosuj polityki RLS dla tabel `facilities`, `facility_photos`, `facility_sports`, `sports` aby zezwalały na odczyt dla roli `anon`.

2.  **Struktura projektu funkcji Edge:**
    *   Stwórz folder `supabase/functions/list-facilities/`.
    *   W nim plik `index.ts` (główna logika funkcji) i `schema.ts` (definicje Zod).
    *   Upewnij się, że współdzielony `FacilityService` istnieje w `supabase/functions/_shared/services/facilityService.ts` (lub stwórz go).
    *   Zapewnij dostęp do współdzielonych `corsHeaders` i funkcji tworzenia klienta Supabase.

3.  **Implementacja schematów walidacji Zod:**
    *   Zaimplementuj `ListFacilitiesQuerySchema` w `supabase/functions/list-facilities/schema.ts`.

4.  **Implementacja `FacilityService`:**
    *   Dodaj lub zaktualizuj metodę `listFacilities` w `FacilityService` zgodnie z sekcją "Przepływ danych".
    *   Implementuj logikę budowania zapytań, włączając filtry, geo-zapytania (przez RPC lub bezpośrednio z `supabase-js` i PostGIS), paginację.
    *   Implementuj mapowanie wyników na `FacilityListItemDto`, w tym obsługę `main_photo_url` (z `supabase.storage.from('...').getPublicUrl()`) i `supported_sports`.

5.  **Implementacja funkcji Edge (`list-facilities/index.ts`):**
    *   Dodaj obsługę `OPTIONS` i CORS.
    *   Pobierz i zwaliduj parametry zapytania.
    *   Wywołaj `facilityService.listFacilities`.
    *   Obsłuż błędy i formatuj odpowiedzi (200, 400, 500).
    *   Dodaj logowanie błędów serwera.

6.  **Testowanie lokalne:**
    *   Użyj Supabase CLI (`supabase functions serve list-facilities --no-verify-jwt`) do lokalnego uruchomienia funkcji.
    *   Przetestuj endpoint z różnymi kombinacjami parametrów (w tym przypadki brzegowe i błędne) używając np. `curl` lub Postman.
        *   Brak parametrów (domyślne `limit`/`offset`).
        *   Filtrowanie po `sport_ids`.
        *   Geo-zapytanie z `latitude`, `longitude`, `radius_km`.
        *   Geo-zapytanie z `bounds`.
        *   Kombinacja filtrów (np. `sport_ids` i `radius_km`).
        *   Paginacja (`limit`, `offset`).
        *   Nieprawidłowe formaty parametrów (np. litery w `sport_ids`, `radius_km` ujemny, `bounds` z 3 wartościami).
        *   `radius_km` bez `latitude`/`longitude`.
        *   Jednocześnie `radius_km` i `bounds`.
    *   Sprawdź poprawność odpowiedzi (kody statusu, struktura JSON, wartości danych, `total`, `limit`, `offset`).
    *   Sprawdź logi funkcji dla błędów 500.

7.  **Testy jednostkowe/integracyjne (zalecane):**
    *   Napisz testy dla `ListFacilitiesQuerySchema` (Zod).
    *   Napisz testy dla `FacilityService` (mockując klienta Supabase i funkcje RPC).
    *   Napisz testy dla głównej logiki funkcji Edge (mockując `req` i `FacilityService`).

8.  **Dokumentacja:**
    *   Upewnij się, że kod jest dobrze skomentowany.
    *   Zaktualizuj wszelką zewnętrzną dokumentację API (np. OpenAPI/Swagger), jeśli jest używana.

9.  **Wdrożenie (Deployment):**
    *   Najpierw wdróż migracje bazy danych (dla funkcji RPC), jeśli były dodawane: `supabase db push` (jeśli zarządzasz schematem lokalnie) lub przez panel Supabase.
    *   Wdróż funkcję Edge do Supabase: `supabase functions deploy list-facilities --no-verify-jwt`.
    *   Przetestuj wdrożony endpoint na środowisku deweloperskim/stagingowym Supabase.

10. **Monitoring i Iteracja:**
    *   Monitoruj logi funkcji w panelu Supabase pod kątem błędów lub problemów z wydajnością.
    *   Analizuj wydajność zapytań (np. używając `EXPLAIN ANALYZE` w SQL Editorze Supabase dla typowych zapytań generowanych przez serwis).
    *   Zbieraj feedback i iteruj nad implementacją w razie potrzeby.