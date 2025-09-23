Oczywiście. To są fantastyczne, bardzo konkretne i profesjonalne uwagi. Uzupełnienie dokumentu o te sekcje przekształci go z dobrych wytycznych w kompleksowy podręcznik dla każdego dewelopera w projekcie.

Przygotowałem nową, znacznie rozbudowaną wersję `CLAUDE.md`, która zawiera wszystkie Twoje sugestie.

---

# CLAUDE.md - Wytyczne dla AI Asystenta Projektu "Mecz" (Wersja 4.0)

**Claude, od teraz komunikuj się ze mną wyłącznie w języku polskim. Używaj profesjonalnego, technicznego języka, ale upewnij się, że Twoje odpowiedzi są jasne i zgodne z poniższymi wytycznymi.**

Jesteś ClaudeCode, ekspertem i asystentem AI dla projektu "Mecz". Twoim zadaniem jest generowanie, refaktoryzacja i analiza kodu zgodnie z poniższymi zasadami. Musisz ściśle przestrzegać wszystkich wytycznych dotyczących stosu technologicznego, struktury projektu, konwencji kodowania, bezpieczeństwa i testowania. Ten dokument jest jedynym źródłem prawdy.

---

## 1. Stos Technologiczny i Narzędzia

-   **Frontend:** Expo SDK (React Native)
-   **Język:** TypeScript 5+
-   **Backend:** Supabase (Auth, DB, Storage, Edge Functions)
-   **Stan Globalny:** Zustand
-   **Stan Serwera:** TanStack Query
-   **Formularze:** React Hook Form + Zod
-   **Stylowanie:** React Native StyleSheet (natywne style)
-   **Nawigacja:** Expo Router (file-based routing)
-   **Mapy:** React Native Maps + Leaflet WebView (Google Maps + OpenStreetMap)
-   **UI Components:**
    -   `@expo/vector-icons` (ikony)
    -   `@gorhom/bottom-sheet` (bottom sheet)
    -   `react-native-pager-view` (paginacja)
    -   `react-native-gesture-handler` (gesty)
    -   `react-native-reanimated` (animacje)
    -   `expo-blur` (efekty blur)
    -   `expo-linear-gradient` (gradienty)
-   **Pamięć Lokalna:** `@react-native-async-storage/async-storage`, `expo-secure-store` (dane wrażliwe)
-   **Autentykacja:** Expo Auth Session + Apple Authentication
-   **Testowanie:** Jest, React Native Testing Library, Detox (E2E)
-   **Jakość Kodu:** ESLint, Prettier (konfiguracja w repozytorium jest obowiązkowa)
-   **Logowanie Błędów:** Sentry

---

## 2. Workflow Deweloperski

1.  **Setup Lokalny:** Po sklonowaniu repozytorium, utwórz plik `.env` na podstawie `.env.example` i uzupełnij go swoimi kluczami deweloperskimi. Następnie uruchom `npm install`.
2.  **Uruchomienie Aplikacji:** Użyj `npm start` lub `npx expo start`, aby uruchomić serwer deweloperski Metro.
3.  **Uruchamianie Testów:** Użyj `npm test`, aby uruchomić testy jednostkowe w trybie watch.
4.  **Debugowanie:** Używaj Flipper lub wbudowanych narzędzi deweloperskich React Native do debugowania.

---

## 3. Zmienne Środowiskowe

-   Wszystkie klucze API, URL-e i inne dane konfiguracyjne muszą być przechowywane w pliku `.env` i nigdy nie mogą być commitowane do repozytorium.
-   Plik `.env.example` musi być utrzymywany i zawierać listę wszystkich wymaganych zmiennych.
-   Do dostępu do zmiennych w aplikacji używaj `expo-constants` lub dedykowanej konfiguracji. Rozróżniaj środowiska `development` i `production`.

---

## 4. Struktura Projektu

Zawsze przestrzegaj poniższej, kanonicznej struktury katalogów.

```
matchti/
├── app/                  # Ekrany i routing (Expo Router)
├── assets/               # Obrazy, fonty, itp.
├── components/           # Komponenty UI (szczegóły poniżej)
├── constants/            # Stałe wartości (np. klucze, kolory)
├── hooks/                # Niestandardowe hooki React
├── lib/                  # Biblioteki pomocnicze
│   ├── api/              # Funkcje do komunikacji z API
│   ├── supabase/         # Konfiguracja klienta Supabase
│   ├── react-query/      # Konfiguracja TanStack Query
│   ├── zustand/          # Definicje store'ów Zustand
│   ├── validation/       # Schematy Zod
│   ├── storage/          # Konfiguracja AsyncStorage
│   └── utils/            # Funkcje pomocnicze
├── services/             # Logika biznesowa niezwiązana z UI
└── types/                # Globalne definicje typów TypeScript
```

---

## 5. Frontend (Expo / React Native)

### Zarządzanie Stanem i Danymi

-   **TanStack Query + Supabase (Przykład):**
    ```typescript
    // Przykład: lib/react-query/useUserQuery.ts
    import { useQuery } from '@tanstack/react-query';
    import { supabase } from '@/lib/supabase/client';

    const fetchUser = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    };

    export const useUserQuery = (userId: string) => {
      return useQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId),
        enabled: !!userId, // Zapytanie uruchomi się tylko, gdy userId istnieje
      });
    };
    ```

### Nawigacja
-   Używaj hooków z `expo-router` (np. `useRouter`, `useLocalSearchParams`) do zarządzania nawigacją i parametrami.

### Pamięć Lokalna (AsyncStorage)
-   Używaj `@react-native-async-storage/async-storage` do przechowywania danych niewrażliwych (ustawienia, cache).
    ```typescript
    // Przykład: lib/storage/asyncStorage.ts
    import AsyncStorage from '@react-native-async-storage/async-storage';

    // Użycie w komponencie
    const storeData = async (key: string, value: string) => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (e) {
        console.error('Error storing data:', e);
      }
    };

    const getData = async (key: string) => {
      try {
        const value = await AsyncStorage.getItem(key);
        return value;
      } catch (e) {
        console.error('Error reading data:', e);
      }
    };
    ```

---

## 6. Bezpieczeństwo

-   **Przechowywanie Wrażliwych Danych:** Tokeny autoryzacyjne, klucze sesji i inne wrażliwe dane **muszą** być przechowywane za pomocą `expo-secure-store`, które wykorzystuje natywne mechanizmy Keychain (iOS) i Keystore (Android). **Nigdy** nie przechowuj ich w AsyncStorage.
-   **Klucze API:** Klucze API muszą być ładowane ze zmiennych środowiskowych i nie mogą być publicznie dostępne w kodzie frontendu, jeśli nie są to klucze typu `public`.
-   **Deep Linking:** Zawsze waliduj i sanityzuj parametry otrzymane z deep linków przed ich użyciem w aplikacji, aby zapobiec atakom.

---

## 7. Obsługa Błędów

-   **Crash Reporting:** Skonfiguruj Sentry (`@sentry/react-native`) do automatycznego raportowania awarii aplikacji i nieprzechwyconych błędów.
-   **Błędy Sieciowe:** Implementuj strategie obsługi błędów sieciowych:
    -   Używaj mechanizmów `retry` w TanStack Query dla tymczasowych problemów z siecią.
    -   Informuj użytkownika o problemach z połączeniem w sposób nieinwazyjny (np. toast/snackbar).
-   **Stan Offline:** Rozważ strategie obsługi trybu offline dla kluczowych funkcjonalności, np. poprzez cache'owanie danych z TanStack Query.

---

## 8. Testowanie i CI/CD

-   **Pokrycie Kodu:** Dąż do pokrycia kodu testami jednostkowymi na poziomie >80% dla nowej logiki biznesowej (`hooks/`, `lib/`, `services/`).
-   **Mockowanie:** Używaj `jest.mock()` do mockowania natywnych modułów React Native (np. `@react-native-async-storage/async-storage`, `expo-location`) oraz zewnętrznych API.
-   **Testy E2E:** Używaj Detox do testów end-to-end symulujących rzeczywiste interakcje użytkownika z aplikacją.
-   **Pipeline CI/CD:** Workflow na GitHub Actions musi zawierać następujące kroki dla każdego Pull Requesta:
    1.  Instalacja zależności (`npm install`).
    2.  Lintowanie i formatowanie (`npm run lint`).
    3.  Uruchomienie testów jednostkowych (`npm test`).
    4.  Uruchomienie testów E2E (Detox) - opcjonalnie na wybranych PR-ach.
    5.  Budowanie aplikacji (`npx eas build`).

---

## 9. Wydajność

-   **Monitoring Rozmiaru Paczki:** Używaj `expo-bundle-analyzer`, aby regularnie analizować i optymalizować rozmiar wynikowej paczki aplikacji.
-   **Memory Leaks:** Używaj Flipper do profilowania i wykrywania wycieków pamięci, szczególnie w przypadku długo działających ekranów lub list.
-   **Optymalizacja Modułów Natywnych:** Ogranicz niepotrzebne wywołania do mostu (bridge) React Native, grupując operacje, gdy jest to możliwe.

---

## 10. Internationalization (i18n)

-   W przypadku planów wdrożenia wielojęzyczności, użyj biblioteki `i18next` z `react-i18next`.
-   Pliki z tłumaczeniami umieść w katalogu `locales/` (`locales/en.json`, `locales/pl.json`).

---

## 11. Kontrola Wersji (Git)

-   **Zawsze** stosuj format **Conventional Commits**: `<typ>[zakres]: <opis>`.
-   **Opis:** W trybie rozkazującym (np. `feat: add user login form`).

---

## 12. Zadanie Specjalne: Tworzenie Migracji Bazy Danych

-   **Nazwa pliku:** `supabase/migrations/YYYYMMDDHHmmss_krotki_opis.sql`.
-   **Wytyczne SQL:** Pisz kod małymi literami. **Zawsze włączaj RLS** i twórz **granularne polityki** dla ról `anon` i `authenticated`.