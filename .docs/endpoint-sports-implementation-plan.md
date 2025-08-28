# API Endpoint Implementation Plan: Sports (`/sports`)

Ten plan obejmuje wdrożenie dwóch punktów końcowych REST API związanych z zasobem `sports`:
1.  `GET /sports` - Listowanie dyscyplin sportowych.
2.  `GET /sports/{sport_id}` - Pobieranie szczegółów konkretnej dyscypliny sportowej.

## 1. Przegląd punktów końcowych

### 1.1. `GET /sports`

*   **Opis:** Zwraca listę wszystkich dyscyplin sportowych. Umożliwia filtrowanie w celu uzyskania podkategorii sportowych (np. Halowa Piłka Nożna jako podkategoria Piłki Nożnej) poprzez podanie `parent_sport_id`. Jeśli `parent_sport_id` nie zostanie podany lub jego wartość to `null`, zwracane są sporty najwyższego poziomu (bez rodzica).
*   **Lokalizacja funkcji Edge:** `supabase/functions/sports/index.ts`

### 1.2. `GET /sports/{sport_id}`

*   **Opis:** Zwraca szczegółowe informacje o jednej, konkretnej dyscyplinie sportowej na podstawie jej unikalnego identyfikatora (`sport_id`).
*   **Lokalizacja funkcji Edge:** `supabase/functions/sports/[sport_id]/index.ts` (gdzie `[sport_id]` to nazwa folderu, a wartość będzie dostępna jako `req.params.sport_id`)

## 2. Szczegóły żądania

### 2.1. `GET /sports`

*   **Metoda HTTP:** `GET`
*   **Struktura URL:** `/sports`
*   **Parametry zapytania (Query Params):**
    *   **Opcjonalne:**
        *   `parent_sport_id` (integer | "null"): ID sportu nadrzędnego.
            *   Jeśli wartość to liczba całkowita dodatnia, filtruje wyniki do podkategorii tego sportu.
            *   Jeśli wartość to string `"null"` lub parametr nie jest podany, zwraca sporty najwyższego poziomu (`parent_sport_id IS NULL`).
            *   Inne wartości (np. nie-liczba, zero, ujemna liczba) powinny skutkować błędem `400 Bad Request`.
*   **Request Body:** Brak (dla żądania GET).

### 2.2. `GET /sports/{sport_id}`

*   **Metoda HTTP:** `GET`
*   **Struktura URL:** `/sports/{sport_id}`
*   **Parametry ścieżki (Path Params):**
    *   **Wymagane:**
        *   `sport_id` (integer): Unikalny identyfikator dyscypliny sportowej. Musi być liczbą całkowitą dodatnią.
*   **Request Body:** Brak (dla żądania GET).

## 3. Wykorzystywane typy

*   **`SportDto`**: Odpowiada strukturze obiektu sportu zwracanego przez oba endpointy. Jest to bezpośrednie mapowanie na typ `Tables<'sports'>` generowany przez Supabase.
    ```typescript
    // Zgodnie z dostarczonymi definicjami:
    // import type { Tables } from './supabase'; // lub odpowiednia ścieżka
    // export type SportDto = Tables<'sports'>;

    // Przykładowa struktura (zgodna ze specyfikacją API i DB):
    // {
    //   "id": 1,
    //   "parent_sport_id": null,
    //   "name": "Football",
    //   "min_duration_minutes": 60,
    //   "max_duration_minutes": 120,
    //   "duration_step_minutes": 15,
    //   "created_at": "timestampz",
    //   "updated_at": "timestampz"
    // }
    ```
*   **Schematy walidacji Zod:**
    *   Dla `GET /sports` (parametr `parent_sport_id`):
        ```typescript
        // supabase/functions/sports/schema.ts
        import { z } from 'zod';

        // Schemat dla pojedynczego identyfikatora, jeśli jest podany i nie jest "null"
        const PositiveIntegerStringSchema = z.string()
          .regex(/^[1-9]\d*$/, "parent_sport_id must be a positive integer string.")
          .transform(Number);

        export const GetSportsQuerySchema = z.object({
          parent_sport_id: z.string().optional(), // Surowy string z URL
        });
        // Logika przetwarzania parent_sport_id będzie w kodzie funkcji,
        // rozróżniając brak parametru, string "null" i string liczbowy.
        // PositiveIntegerStringSchema będzie użyty do walidacji, jeśli parametr nie jest "null" i istnieje.
        ```
    *   Dla `GET /sports/{sport_id}` (parametr `sport_id`):
        ```typescript
        // supabase/functions/sports/[sport_id]/schema.ts
        import { z } from 'zod';

        export const GetSportByIdParamsSchema = z.object({
          sport_id: z.coerce
            .number({ invalid_type_error: 'Sport ID must be a number.' })
            .int({ message: 'Sport ID must be an integer.' })
            .positive({ message: 'Sport ID must be a positive integer.' }),
        });
        ```

## 4. Szczegóły odpowiedzi

### 4.1. `GET /sports`

*   **Sukces (`200 OK`):**
    *   Content-Type: `application/json`
    *   Body: Tablica obiektów `SportDto`. Może być pusta, jeśli żadne sporty nie pasują do kryteriów.
        ```json
        [
          {
            "id": 1,
            "parent_sport_id": null,
            "name": "Football",
            "min_duration_minutes": 60,
            "max_duration_minutes": 120,
            "duration_step_minutes": 15,
            "created_at": "2023-01-01T12:00:00Z",
            "updated_at": "2023-01-01T12:00:00Z"
          },
          // ... inne sporty
        ]
        ```
*   **Błąd (`400 Bad Request`):**
    *   Content-Type: `application/json`
    *   Body: Obiekt błędu wyjaśniający problem z parametrem `parent_sport_id`.
        ```json
        { "error": "Invalid parent_sport_id parameter. Must be a positive integer or \"null\"." }
        ```
*   **Błąd (`500 Internal Server Error`):**
    *   Content-Type: `application/json`
    *   Body: Ogólny komunikat błędu.
        ```json
        { "error": "Internal Server Error" }
        ```

### 4.2. `GET /sports/{sport_id}`

*   **Sukces (`200 OK`):**
    *   Content-Type: `application/json`
    *   Body: Pojedynczy obiekt `SportDto`.
        ```json
        {
          "id": 1,
          "parent_sport_id": null,
          "name": "Football",
          "min_duration_minutes": 60,
          "max_duration_minutes": 120,
          "duration_step_minutes": 15,
          "created_at": "2023-01-01T12:00:00Z",
          "updated_at": "2023-01-01T12:00:00Z"
        }
        ```
*   **Błąd (`400 Bad Request`):**
    *   Content-Type: `application/json`
    *   Body: Obiekt błędu wyjaśniający problem z parametrem `sport_id`.
        ```json
        { "error": "Invalid sport_id parameter. Must be a positive integer." }
        ```
*   **Błąd (`404 Not Found`):**
    *   Content-Type: `application/json`
    *   Body: Komunikat informujący o nieznalezieniu zasobu.
        ```json
        { "error": "Sport not found." }
        ```
*   **Błąd (`500 Internal Server Error`):**
    *   Content-Type: `application/json`
    *   Body: Ogólny komunikat błędu.
        ```json
        { "error": "Internal Server Error" }
        ```

## 5. Przepływ danych

### 5.1. Logika współdzielona (`supabase/functions/_shared/services/sportService.ts`)

Zostanie stworzony serwis `SportService` zawierający logikę interakcji z bazą danych dla operacji na sportach.

*   `createSupabaseClient(req: Request)`: Funkcja pomocnicza (może być w `_shared/supabaseClient.ts`) do tworzenia klienta Supabase na podstawie tokenu autoryzacji z żądania lub klienta anonimowego, jeśli endpoint jest publiczny. Zakładamy, że sporty są publiczne, więc użyty zostanie anonimowy klucz API Supabase.
*   `SportService`:
    *   `async listSports(supabase: SupabaseClient, { parentSportId }: { parentSportId?: number | null }): Promise<SportDto[]>`:
        1.  Buduje zapytanie do tabeli `sports` używając `supabase.from('sports').select('*')`.
        2.  Jeśli `parentSportId` jest `null` lub `undefined`, dodaje warunek `.is('parent_sport_id', null)`.
        3.  Jeśli `parentSportId` jest liczbą, dodaje warunek `.eq('parent_sport_id', parentSportId)`.
        4.  Dodaje sortowanie np. `.order('name', { ascending: true })`.
        5.  Wykonuje zapytanie.
        6.  W przypadku błędu zapytania, loguje go i rzuca dalej lub zwraca odpowiedni błąd.
        7.  Zwraca listę sportów.
    *   `async getSportById(supabase: SupabaseClient, sportId: number): Promise<SportDto | null>`:
        1.  Buduje zapytanie do tabeli `sports` używając `supabase.from('sports').select('*').eq('id', sportId).single()`.
        2.  Wykonuje zapytanie.
        3.  Jeśli sport nie zostanie znaleziony (`data` jest `null` i `error` jest np. PగRST116 - no rows returned), zwraca `null`.
        4.  W przypadku innego błędu zapytania, loguje go i rzuca dalej.
        5.  Zwraca znaleziony sport.

### 5.2. `GET /sports` (Funkcja Edge: `supabase/functions/sports/index.ts`)

1.  Obsługa żądania `OPTIONS` dla CORS (użycie współdzielonych `corsHeaders` z `_shared/cors.ts`).
2.  Pobranie parametru `parent_sport_id` z `req.url` (np. `new URL(req.url).searchParams.get('parent_sport_id')`).
3.  Przetworzenie `parent_sport_id_param`:
    *   `let queryParentSportId: number | null | undefined = undefined;` (Domyślnie, jeśli parametr nie jest podany, oznacza to `parent_sport_id IS NULL`).
    *   Jeśli `parent_sport_id_param` (string z URL) jest `"null"`, `queryParentSportId` staje się `null`.
    *   Jeśli `parent_sport_id_param` istnieje i nie jest `"null"`, walidacja przy użyciu `PositiveIntegerStringSchema.safeParse(parent_sport_id_param)`:
        *   Jeśli walidacja nie przejdzie, zwróć `400 Bad Request` z odpowiednim komunikatem.
        *   Jeśli przejdzie, `queryParentSportId` staje się sparsowaną liczbą.
4.  Utworzenie instancji klienta Supabase (`supabaseClient` z `_shared/supabaseClient.ts` lub `_shared/supabaseAdmin.ts` - dla publicznego odczytu preferowany jest klient anonimowy).
5.  Wywołanie `sportService.listSports(supabase, { parentSportId: queryParentSportId })`.
6.  Obsługa błędów z serwisu:
    *   W przypadku błędów (np. problem z bazą danych), zaloguj błąd i zwróć `500 Internal Server Error`.
7.  Jeśli wszystko OK, zwróć `200 OK` z listą sportów w formacie JSON.

### 5.3. `GET /sports/{sport_id}` (Funkcja Edge: `supabase/functions/sports/[sport_id]/index.ts`)

1.  Obsługa żądania `OPTIONS` dla CORS.
2.  Pobranie `sport_id` z `req.params.sport_id` (Supabase Edge Functions udostępniają parametry ścieżki w ten sposób, jeśli nazwa folderu to `[sport_id]`).
3.  Walidacja `sport_id` przy użyciu `GetSportByIdParamsSchema.safeParse({ sport_id: req.params.sport_id })`:
    *   Jeśli walidacja nie przejdzie, zwróć `400 Bad Request` z komunikatem błędu z Zod.
    *   Pobierz sparsowany `validatedSportId` z wyniku walidacji.
4.  Utworzenie instancji klienta Supabase.
5.  Wywołanie `sportService.getSportById(supabase, validatedSportId)`.
6.  Obsługa wyniku z serwisu:
    *   Jeśli sport nie zostanie znaleziony (serwis zwraca `null`), zwróć `404 Not Found`.
    *   W przypadku innych błędów (np. problem z bazą danych), zaloguj błąd i zwróć `500 Internal Server Error`.
7.  Jeśli wszystko OK, zwróć `200 OK` ze znalezionym obiektem sportu w formacie JSON.

## 6. Względy bezpieczeństwa

*   **Walidacja danych wejściowych:** Wszystkie parametry (`parent_sport_id`, `sport_id`) będą rygorystycznie walidowane przy użyciu Zod, aby zapobiec nieoczekiwanym wartościom i potencjalnym atakom (np. próby wstrzyknięcia SQL, chociaż `supabase-js` w dużym stopniu przed tym chroni).
*   **Uwierzytelnianie i Autoryzacja:** Zakłada się, że dane o sportach są publicznie dostępne. Endpointy nie będą wymagały uwierzytelnienia użytkownika. Klient Supabase będzie używał anonimowego klucza API.
    *   Polityki RLS (Row Level Security) na tabeli `sports` muszą zezwalać na operacje `SELECT` dla roli `anon` (lub `authenticated`, jeśli tylko zalogowani użytkownicy mieliby mieć dostęp). Należy to zweryfikować/ustawić.
*   **Minimalne uprawnienia:** Funkcje Edge będą działać z minimalnymi wymaganymi uprawnieniami. Użycie `service_role_key` jest unikane na rzecz klucza anonimowego, jeśli RLS na to pozwala.
*   **Ochrona przed nadużyciami:** Standardowe mechanizmy Supabase (np. limity wywołań funkcji) będą działać. W przypadku potrzeby, można rozważyć dodatkowe rate limiting.
*   **CORS:** Odpowiednie nagłówki CORS (`Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`) zostaną skonfigurowane w `_shared/cors.ts` i używane we wszystkich odpowiedziach, w tym dla żądań `OPTIONS`. Należy ograniczyć `Access-Control-Allow-Origin` do domeny frontendu produkcyjnego.

## 7. Obsługa błędów

*   **Standardowe odpowiedzi HTTP:** Błędy będą komunikowane za pomocą odpowiednich kodów statusu HTTP (`400`, `404`, `500`) oraz ciała odpowiedzi w formacie JSON z polem `error`.
*   **Logowanie:**
    *   Błędy walidacji (400) i nieznalezione zasoby (404) będą skutkować odpowiedzią do klienta bez szczegółowego logowania po stronie serwera, chyba że do celów diagnostycznych.
    *   Wszelkie nieoczekiwane błędy (skutkujące statusem 500) będą logowane na serwerze (za pomocą `console.error`) wraz ze stack trace i kontekstem, aby ułatwić diagnozę. Supabase automatycznie zbiera logi z funkcji Edge.
*   **Early Returns:** Funkcje będą stosować wzorzec "early return" do obsługi błędów walidacji i innych warunków brzegowych na początku funkcji.
*   **Obsługa błędów z `supabase-js`:** Błędy zwracane przez `supabase-js` (np. problemy z połączeniem, błędy zapytań) będą przechwytywane, logowane, a następnie mapowane na odpowiednie odpowiedzi HTTP (zazwyczaj 500).

## 8. Rozważania dotyczące wydajności

*   **Zapytania do bazy danych:** Zapytania SQL generowane przez `supabase-js` będą proste i efektywne (`SELECT` z filtrowaniem po indeksowanych kolumnach `id` i `parent_sport_id`). Indeks `idx_sports_parent_sport_id` na kolumnie `parent_sport_id` powinien zapewnić szybkie filtrowanie podkategorii.
*   **Rozmiar odpowiedzi:**
    *   Dla `GET /sports/{sport_id}` odpowiedź jest mała (jeden obiekt).
    *   Dla `GET /sports` lista może potencjalnie urosnąć. Specyfikacja nie wymaga paginacji, ale jeśli liczba sportów stanie się bardzo duża (> kilkaset), należy rozważyć jej dodanie w przyszłości (np. parametry `limit` i `offset`). Na ten moment nie jest to implementowane.
*   **Czas startu funkcji Edge (Cold Starts):** Supabase Edge Functions są zoptymalizowane pod kątem szybkich startów. Rozmiar paczki funkcji powinien być utrzymywany na minimalnym poziomie poprzez unikanie niepotrzebnych zależności.
*   **Caching:**
    *   **Po stronie klienta:** Odpowiednie nagłówki cache (np. `Cache-Control`) mogą być dodane do odpowiedzi, jeśli dane o sportach zmieniają się rzadko.
    *   **Po stronie serwera/CDN:** Supabase może oferować pewne mechanizmy cachowania na poziomie CDN. Dla często odpytywanych, statycznych list, to może być korzystne. Na razie brak specyficznych działań w tym zakresie.

## 9. Etapy wdrożenia

1.  **Przygotowanie środowiska i struktury projektu:**
    *   Upewnij się, że Supabase CLI jest skonfigurowane.
    *   Stwórz strukturę folderów dla funkcji Edge:
        *   `supabase/functions/sports/index.ts`
        *   `supabase/functions/sports/[sport_id]/index.ts`
        *   `supabase/functions/_shared/services/sportService.ts`
        *   `supabase/functions/_shared/supabaseClient.ts` (lub `supabaseAdmin.ts` jeśli potrzebne, oraz konfiguracja klienta)
        *   `supabase/functions/_shared/cors.ts`
        *   `supabase/functions/sports/schema.ts` (dla Zod schema `GetSportsQuerySchema`)
        *   `supabase/functions/sports/[sport_id]/schema.ts` (dla Zod schema `GetSportByIdParamsSchema`)
    *   Dodaj wymagane zależności (np. `zod`, `supabase-js` są zazwyczaj dostępne w środowisku Deno Supabase Functions).

2.  **Implementacja logiki współdzielonej:**
    *   Zaimplementuj `corsHeaders` w `_shared/cors.ts`.
    *   Zaimplementuj inicjalizację klienta Supabase (np. `createSupabaseClient`) w `_shared/supabaseClient.ts`.
    *   Zaimplementuj `SportService` w `_shared/services/sportService.ts` z metodami `listSports` i `getSportById`, włączając logikę interakcji z bazą danych.

3.  **Implementacja endpointu `GET /sports` (`supabase/functions/sports/index.ts`):**
    *   Zaimplementuj obsługę żądania `OPTIONS`.
    *   Pobierz i przetwórz parametr `parent_sport_id` z URL.
    *   Zaimplementuj walidację parametru `parent_sport_id` (używając `PositiveIntegerStringSchema` warunkowo).
    *   Wywołaj `sportService.listSports` z odpowiednio przetworzonym `parentSportId`.
    *   Obsłuż błędy i zwróć odpowiednie odpowiedzi HTTP (200, 400, 500).
    *   Dodaj logowanie błędów serwera.

4.  **Implementacja endpointu `GET /sports/{sport_id}` (`supabase/functions/sports/[sport_id]/index.ts`):**
    *   Zaimplementuj obsługę żądania `OPTIONS`.
    *   Pobierz parametr `sport_id` z `req.params`.
    *   Zaimplementuj walidację `sport_id` przy użyciu `GetSportByIdParamsSchema`.
    *   Wywołaj `sportService.getSportById`.
    *   Obsłuż przypadki: sport znaleziony (200), sport nieznaleziony (404), błąd walidacji (400), błąd serwera (500).
    *   Dodaj logowanie błędów serwera.

5.  **Konfiguracja RLS (Row Level Security):**
    *   Sprawdź/dodaj polityki RLS dla tabeli `sports` w Supabase, aby umożliwić publiczny odczyt (dla roli `anon` lub `authenticated` w zależności od wymagań).
    *   Przykład polityki dla publicznego odczytu:
        ```sql
        CREATE POLICY "Allow public read access to sports"
        ON sports FOR SELECT
        USING (true);
        ```

6.  **Testowanie lokalne:**
    *   Użyj Supabase CLI (`supabase functions serve`) do lokalnego uruchomienia funkcji Edge.
    *   Przetestuj oba endpointy używając narzędzia takiego jak `curl`, Postman lub klienta HTTP w testach:
        *   `GET /sports` (bez parametrów, z `parent_sport_id=<liczba>`, z `parent_sport_id=null`, z niepoprawnym `parent_sport_id`).
        *   `GET /sports/{sport_id}` (z poprawnym ID, z nieistniejącym ID, z niepoprawnym formatem ID).
    *   Sprawdź poprawność odpowiedzi (kody statusu, format JSON, treść).
    *   Sprawdź logi funkcji dla błędów 500.

7.  **Testy jednostkowe/integracyjne (opcjonalne, ale zalecane):**
    *   Napisz testy dla `SportService` (mockując klienta Supabase).
    *   Napisz testy dla logiki walidacji i obsługi żądań w samych funkcjach Edge (można mockować `req` i `sportService`).

8.  **Dokumentacja:**
    *   Upewnij się, że kod jest dobrze skomentowany, zwłaszcza logika w funkcjach Edge i serwisie.
    *   Zaktualizuj dokumentację API (np. OpenAPI/Swagger), jeśli jest używana.

9.  **Wdrożenie (Deployment):**
    *   Wdróż funkcje Edge do Supabase używając Supabase CLI (`supabase functions deploy sports --project-ref <YOUR_PROJECT_REF>`, `supabase functions deploy sports-id-handler --no-verify-jwt` -- nazwa funkcji zależy od tego, jak nazwiemy folder funkcji np. `sports-sport_id`).
        *   Jeśli folder nazywa się `sports/[sport_id]`, nazwa funkcji w Supabase będzie prawdopodobnie inna, np. `sports-sport_id`. Polecenie `supabase deploy` wdroży wszystkie funkcje.
    *   Przetestuj wdrożone endpointy na środowisku deweloperskim/stagingowym.

10. **Monitoring i Iteracja:**
    *   Monitoruj logi funkcji w panelu Supabase pod kątem błędów lub problemów z wydajnością po wdrożeniu.
    *   Zbieraj feedback i iteruj nad implementacją w razie potrzeby.