**1. Frontend: Budowa Aplikacji Mobilnej (Expo / React Native)**

Interfejs użytkownika naszej aplikacji mobilnej powstanie przy użyciu React Native z wykorzystaniem frameworka Expo.

- Framework: Expo SDK

  - Expo znacznie ułatwia tworzenie aplikacji w React Native. Umożliwia szybki start, prostą konfigurację oraz efektywne budowanie i wdrażanie aktualizacji.
  - Zapewnia łatwy dostęp do natywnych funkcji telefonu, takich jak lokalizacja (kluczowa dla mapy boisk) czy aparat, poprzez spójny interfejs programistyczny.
  - Nawigacja w aplikacji będzie zarządzana przez Expo Router, nowoczesne rozwiązanie oparte na strukturze plików, co upraszcza tworzenie przejść między ekranami oraz obsługę deep linking (bezpośrednich linków do konkretnych miejsc w aplikacji, np. zaproszeń do rezerwacji).
  - Do budowania finalnych wersji aplikacji (pliki `.apk` na Androida i `.ipa` na iOS) oraz zarządzania aktualizacjami "Over-The-Air" (OTA), które pozwalają na szybkie wdrażanie zmian bez konieczności ponownego publikowania w sklepach, wykorzystamy Expo Application Services (EAS).

- Język: TypeScript

  - Cały kod frontendowy napiszemy w TypeScript. Jest to dla nas kluczowe, ponieważ zapewnia bezpieczeństwo typów, co minimalizuje błędy, ułatwia refaktoryzację kodu i jego utrzymanie w miarę rozwoju aplikacji. TypeScript oferuje również lepsze wsparcie w edytorach kodu.

- Interfejs Użytkownika (UI):

  - Podstawą będą standardowe komponenty React Native (`View`, `Text`, `Button` itp.).
  - Do stylizacji komponentów użyjemy NativeWind, które przenosi popularny system klas użytkowych Tailwind CSS do świata React Native, umożliwiając szybkie i spójne budowanie wyglądu.
  - Rozważamy użycie gotowej biblioteki komponentów UI, takiej jak nativecn/nativecn-ui, inspirowanej shadcn/ui i zintegrowanej z NativeWind, aby przyspieszyć tworzenie estetycznego i spójnego interfejsu.

- Zarządzanie Stanem Aplikacji:

  - Do globalnego zarządzania stanem aplikacji (np. informacji o zalogowanym użytkowniku, preferencjach) wykorzystamy Zustand. Jest to minimalistyczne i wydajne rozwiązanie, dobrze współpracujące z TypeScript.
  - Za zarządzanie danymi pobieranymi z serwera (np. listą boisk, ich dostępnością), buforowanie tych danych, obsługę stanu ładowania/błędów oraz optymistyczne aktualizacje (gdy interfejs reaguje natychmiast, a dane są synchronizowane w tle) odpowiadać będzie biblioteka TanStack Query (dawniej React Query).

- Formularze:

  - Do budowy formularzy (np. rejestracji, logowania) użyjemy React Hook Form. Jest to wydajne narzędzie, które ułatwia zarządzanie polami formularza i ich walidacją, w czym wspierać nas będzie biblioteka Zod.

- Komunikacja z Backendem (Supabase):

  - Oficjalna biblioteka `supabase-js` posłuży do wszelkiej interakcji z usługami Supabase (autentykacja, baza danych, funkcje serwerowe) bezpośrednio z poziomu aplikacji mobilnej. Biblioteka ta zapewnia również wsparcie dla TypeScript.

- Dodatkowe Narzędzia:
  - Do operacji na datach i ich formatowania (np. w kalendarzu rezerwacji) wykorzystamy `date-fns` lub `dayjs`.
  - Konfiguracja specyficzna dla środowisk (np. klucze API) będzie zarządzana przez `app.config.js` i `eas.json`.
  - Do szybkiego przechowywania niewielkich danych lokalnie na urządzeniu (np. preferencje użytkownika) użyjemy `react-native-mmkv`, wydajniejszej alternatywy dla AsyncStorage.
  - Walidację danych, zarówno w formularzach, jak i przychodzących z API, zapewni biblioteka `zod`.

**2. Backend: Logika Serwerowa i Baza Danych (Supabase)**

Jako platformę backendową wybraliśmy Supabase, które dostarcza kompleksowy zestaw narzędzi "Backend-as-a-Service".

- Główne Usługi: Supabase zapewni nam bazę danych (PostgreSQL), system autentykacji użytkowników (Auth), przechowywanie plików (Storage), funkcje serwerowe (Edge Functions) oraz komunikację w czasie rzeczywistym (Realtime, np. dla powiadomień).

- Funkcje Serwerowe (Edge Functions):

  - Logika biznesowa, która powinna działać po stronie serwera (np. obsługa zaproszeń, wysyłanie niektórych powiadomień), zostanie zaimplementowana jako Funkcje Krawędziowe Supabase.
  - Będą one pisane w TypeScript i uruchamiane w środowisku Deno, które jest domyślnie bezpieczne.
  - Do tworzenia, testowania lokalnego i wdrażania tych funkcji użyjemy Supabase CLI. Wewnątrz funkcji, do interakcji z bazą danych czy systemem autentykacji, również wykorzystamy bibliotekę `supabase-js`, odpowiednio skonfigurowaną do operacji serwerowych (np. z użyciem klucza `service_role_key` do zadań administracyjnych).
  - Wrażliwe dane, jak klucze API, będą bezpiecznie przechowywane jako sekrety w Supabase i dostępne dla funkcji jako zmienne środowiskowe.
  - Routing, czyli sposób wywoływania konkretnych funkcji, opiera się na strukturze folderów. Zapewnimy również odpowiednią konfigurację CORS, aby umożliwić bezpieczną komunikację między naszą aplikacją mobilną a funkcjami serwerowymi.

- Baza Danych (PostgreSQL):

  - Supabase dostarcza w pełni zarządzaną bazę danych PostgreSQL. Do zarządzania nią, przeglądania tabel czy pisania zapytań SQL posłuży nam Supabase Studio – interfejs webowy.
  - Kluczowym elementem bezpieczeństwa będzie Row Level Security (RLS), czyli polityki definiujące na poziomie wierszy, który użytkownik ma dostęp do jakich danych. Jest to niezbędne w aplikacji z wieloma użytkownikami.
  - Wszelkie zmiany w strukturze bazy danych (np. tworzenie nowych tabel, dodawanie kolumn) będą zarządzane przez system migracji Supabase CLI. Pozwala to na kontrolowane i wersjonowane wprowadzanie zmian.

- Autentykacja (Auth):
  - System autentykacji Supabase, zintegrowany z `supabase-js` na frontendzie, obsłuży procesy rejestracji, logowania (w tym przez e-mail/hasło oraz dostawców OAuth jak Google/Apple) i zarządzania sesjami użytkowników. Funkcje serwerowe będą wykorzystywać tokeny JWT do identyfikacji i autoryzacji użytkowników.

**3. Ogólne Narzędzia i Dobre Praktyki**

Poza specyficznymi technologiami frontendowymi i backendowymi, stosujemy standardowe narzędzia i praktyki wspierające rozwój oprogramowania.

- Kontrola Wersji: Kod projektu będzie przechowywany i wersjonowany przy użyciu systemu Git, z repozytorium na platformie GitHub.
- Menadżer Pakietów: Do zarządzania zależnościami projektu użyjemy npm.
- Jakość Kodu: ESLint posłuży do statycznej analizy kodu i wymuszania standardów kodowania, a Prettier do automatycznego formatowania, co zapewni spójność stylistyczną w całym projekcie.
- Środowiska: Będziemy zarządzać konfiguracją dla różnych środowisk (np. deweloperskiego, testowego, produkcyjnego) poprzez zmienne środowiskowe, przechowywane lokalnie w plikach `.env` oraz jako sekrety w usługach Supabase i EAS.
- Testowanie: Planujemy wprowadzenie testów jednostkowych i integracyjnych dla komponentów i logiki aplikacji przy użyciu Jest oraz React Native Testing Library. W przyszłości rozważymy również testy End-to-End (E2E) za pomocą narzędzi takich jak Detox lub Maestro, aby automatyzować testowanie interfejsu użytkownika.

**4. Hosting i Dystrybucja**

Sposób "hostingu" naszej aplikacji różni się dla frontendu i backendu.

- Frontend (Aplikacja Mobilna):

  - Aplikacje mobilne nie są hostowane w tradycyjnym sensie, lecz instalowane na urządzeniach użytkowników.
  - Głównym kanałem dystrybucji będą oficjalne sklepy: Google Play Store dla Androida oraz Apple App Store dla iOS.
  - Usługa EAS Build będzie używana do kompilowania kodu aplikacji w natywne paczki instalacyjne (`.apk`/`.aab`, `.ipa`) w chmurze Expo. Te paczki następnie trafią do sklepów.
  - Kluczową rolę odgrywa EAS Update, które pozwala na dostarczanie aktualizacji kodu JavaScript i zasobów (np. obrazów, fontów) bezpośrednio do aplikacji zainstalowanych u użytkowników (tzw. aktualizacje OTA). Dzięki temu większość zmian możemy wdrażać szybko, bez konieczności ponownego przesyłania aplikacji do recenzji w sklepach (o ile zmiany nie dotyczą kodu natywnego).

- Backend (Supabase):
  - Supabase działa w modelu Platform-as-a-Service (PaaS). Oznacza to, że Supabase zarządza całą infrastrukturą serwerową (bazą danych, serwerami dla funkcji, systemem autentykacji). My nie musimy martwić się o utrzymanie serwerów.
  - Naszym zadaniem jest wdrażanie kodu naszych Funkcji Krawędziowych, schematu bazy danych (poprzez migracje) oraz konfiguracji projektu (np. ustawień autentykacji, polityk RLS) na platformę Supabase. Sekrety, takie jak klucze API, są bezpiecznie przechowywane w Supabase i dostępne tylko dla naszych funkcji serwerowych.

**5. CI/CD: Automatyzacja Procesu Wdrożenia**

Aby zapewnić sprawny i niezawodny proces dostarczania nowych wersji aplikacji, wdrożymy CI/CD (Continuous Integration / Continuous Deployment).

- Platforma: Wykorzystamy GitHub Actions do automatyzacji naszych przepływów pracy.

- Przykładowy Przepływ Pracy:

  - Trigger: Procesy CI/CD będą uruchamiane automatycznie, np. po wysłaniu zmian do głównej gałęzi kodu, utworzeniu Pull Requesta lub ręcznie.
  - Etap Integracji (CI):
    1.  Pobranie najnowszego kodu.
    2.  Przygotowanie środowiska (instalacja narzędzi i zależności).
    3.  Sprawdzenie jakości kodu (linting, formatowanie).
    4.  Uruchomienie testów jednostkowych i integracyjnych.
    5.  (Opcjonalnie) Sprawdzenie poprawności typów TypeScript w całym projekcie.
  - Etap Wdrożenia Backendu (CD - Supabase): (np. po zmergowaniu zmian do głównej gałęzi)
    1.  Konfiguracja i logowanie do Supabase CLI.
    2.  Wdrożenie zaktualizowanych Funkcji Krawędziowych.
    3.  Zastosowanie nowych migracji bazy danych (z ostrożnością, szczególnie na produkcji, preferując zarządzanie plikami migracji).
    4.  (Opcjonalnie, z dużą ostrożnością) Automatyczne zarządzanie sekretami Supabase.
  - Etap Wdrożenia Frontendu (CD - Expo):
    1.  Konfiguracja i logowanie do EAS CLI.
    2.  Publikowanie aktualizacji OTA (EAS Update): Najczęstsza forma wdrożenia, dostarczająca zmiany w kodzie JavaScript i zasobach do aplikacji użytkowników.
    3.  Budowanie Natywnej Aplikacji (EAS Build): Rzadziej, przy zmianach w kodzie natywnym lub przed nowym wydaniem do sklepów. Ten proces zleca budowanie aplikacji w chmurze Expo.
    4.  Wysyłanie do Sklepów (EAS Submit): Zwykle krok półautomatyczny lub ręczny, polegający na przesłaniu zbudowanej aplikacji do Google Play i App Store Connect.

- Zarządzanie Sekretami:

  - Wszystkie wrażliwe dane, takie jak tokeny dostępu do Supabase (`SUPABASE_ACCESS_TOKEN`), hasła do bazy danych (`SUPABASE_DB_PASSWORD`), tokeny Expo (`EXPO_TOKEN`) oraz klucze do sklepów aplikacji, będą bezpiecznie przechowywane jako sekrety w GitHub Actions i EAS Secrets. Nigdy nie będą one umieszczane bezpośrednio w kodzie źródłowym.

- Środowiska:
  - Będziemy utrzymywać oddzielne środowiska (np. deweloperskie, testowe/staging, produkcyjne), każde z własnym projektem Supabase i konfiguracją. Proces CI/CD będzie dostosowany do wdrażania na odpowiednie środowisko w zależności od gałęzi kodu lub triggera.

Podsumowując, nasz zautomatyzowany proces CI/CD obejmie testowanie, wdrażanie zmian w backendzie oraz publikowanie aktualizacji frontendu, co znacząco przyspieszy rozwój i podniesie jakość aplikacji "Mecz". Kluczowe będzie przy tym bezpieczne zarządzanie sekretami i konfiguracją dla poszczególnych środowisk.
