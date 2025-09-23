➡️ **[Zobacz interaktywne demo aplikacji](https://appetize.io/app/b_xassekhbfzawyoijmvxuz5lmoe)**

# Matchti

![Status Projektu: MVP](https://img.shields.io/badge/status-MVP-green)
![Licencja: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Znajdź boisko, zarezerwuj termin, zagraj w Matchti!**

Aplikacja mobilna ułatwiająca wyszukiwanie i rezerwowanie darmowych, publicznych boisk sportowych w Polsce.

➡️ **[Zobacz interaktywne demo aplikacji](https://appetize.io/app/b_xassekhbfzawyoijmvxuz5lmoe)**

---

### Spis treści

1.  [Opis projektu](#opis-projektu)
2.  [Stos technologiczny](#stos-technologiczny)
3.  [Uruchomienie lokalne](#uruchomienie-lokalne)
4.  [Dostępne skrypty](#dostępne-skrypty)
5.  [Zakres projektu (MVP)](#zakres-projektu-mvp)
6.  [Status projektu](#status-projektu)
7.  [Licencja](#licencja)

## Opis projektu

**Matchti** to mobilna platforma zaprojektowana w celu rozwiązania problemu braku scentralizowanego systemu do wyszukiwania i rezerwowania darmowych, publicznych boisk sportowych w Polsce (np. Orlików, boisk szkolnych). Obecnie proces ten jest czasochłonny i często prowadzi do konfliktów, gdy kilka grup chce korzystać z boiska w tym samym czasie.

Nasza aplikacja ma na celu usprawnienie tego procesu, eliminację nieporozumień oraz lepsze wykorzystanie istniejącej infrastruktury sportowej.

### Kluczowe funkcjonalności

*   🗺️ **Interaktywna mapa boisk:** Przeglądaj dostępne obiekty w Twojej okolicy na intuicyjnej mapie.
*   🔎 **Filtrowanie po dyscyplinach:** Szybko znajduj boiska do piłki nożnej, koszykówki, siatkówki i innych sportów.
*   📅 **Kalendarz dostępności:** Sprawdzaj wolne terminy dla każdego boiska w czasie rzeczywistym.
*   ✅ **Prosta rezerwacja:** Zarezerwuj wybrany termin kilkoma kliknięciami.
*   👥 **System zaproszeń:** Wygeneruj link do swojej rezerwacji i udostępnij go znajomym, aby dołączyli do gry.
*   🔔 **Powiadomienia Push:** Otrzymuj przypomnienia o nadchodzących meczach, informacje o dołączeniu nowych graczy oraz o odwołaniu rezerwacji.
*   🔐 **Bezpieczne logowanie:** Zarejestruj się i loguj za pomocą adresu e-mail, konta Google lub Apple ID.
*   ⚙️ **Zarządzanie rezerwacjami:** Przeglądaj i odwołuj swoje nadchodzące mecze w jednym miejscu.

## Stos technologiczny

Projekt został zbudowany z wykorzystaniem nowoczesnych i skalowalnych technologii, oddzielając logikę frontendu i backendu.

### Frontend (Aplikacja mobilna)

*   **Framework:** **React Native** z **Expo SDK** do szybkiego tworzenia i wdrażania aplikacji na iOS i Android.
*   **Język:** **TypeScript** dla bezpieczeństwa typów i lepszej jakości kodu.
*   **Nawigacja:** **Expo Router** do zarządzania nawigacją opartą na strukturze plików i obsługi deep linków.
*   **UI i Stylizacja:** Komponenty budowane przy użyciu standardowych komponentów **React Native** oraz stylizacji za pomocą **StyleSheet API**.
*   **Zarządzanie stanem:**
    *   **Zustand** do globalnego, prostego zarządzania stanem.
    *   **TanStack Query (React Query)** do zarządzania stanem serwera, buforowania danych i optymistycznych aktualizacji.
*   **Formularze:** **React Hook Form** z walidacją przy użyciu **Zod**.

### Backend (Backend-as-a-Service)

*   **Platforma:** **Supabase** - otwartoźródłowa alternatywa dla Firebase.
*   **Baza danych:** W pełni zarządzany **PostgreSQL** z zaimplementowanym Row Level Security (RLS) dla bezpieczeństwa danych.
*   **Autentykacja:** **Supabase Auth** do obsługi logowania przez e-mail, Google i Apple.
*   **Logika serwerowa:** **Supabase Edge Functions** (napisane w TypeScript/Deno) do obsługi logiki biznesowej, np. systemu zaproszeń.
*   **API:** Automatycznie generowane API REST i GraphQL przez Supabase.

### Narzędzia i DevOps

*   **Kontrola wersji:** Git i GitHub.
*   **CI/CD:** **GitHub Actions** do automatyzacji procesów testowania, budowania i wdrażania.
*   **Wdrożenia:** **Expo Application Services (EAS)** do budowania natywnych paczek, zarządzania sekretami i dostarczania aktualizacji OTA (Over-the-Air).
*   **Jakość kodu:** **ESLint** i **Prettier** do utrzymania spójności i czystości kodu.
*   **Manager pakietów:** **npm**.

## Uruchomienie lokalne

Aby uruchomić projekt lokalnie, postępuj zgodnie z poniższymi krokami.

### Wymagania wstępne

*   Node.js (wersja LTS)
*   npm lub yarn
*   Expo CLI: `npm install -g expo-cli`
*   Konto na platformie [Supabase](https://supabase.com/)

### Instalacja i konfiguracja

1.  **Sklonuj repozytorium:**
    ```bash
    git clone https://github.com/[your-username]/matchti.git
    cd matchti
    ```

2.  **Zainstaluj zależności:**
    ```bash
    npm install
    ```

3.  **Skonfiguruj zmienne środowiskowe:**
    Utwórz plik `.env` w głównym katalogu projektu, kopiując zawartość z `.env.example`:
    ```bash
    cp .env.example .env
    ```
    Następnie uzupełnij plik `.env` swoimi kluczami z projektu Supabase:
    ```
    # Zmienne środowiskowe dla Supabase
    EXPO_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    EXPO_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```
    Swoje klucze znajdziesz w panelu projektu Supabase w sekcji `Project Settings > API`.

4.  **(Opcjonalnie) Zastosuj migracje bazy danych:**
    Jeśli posiadasz Supabase CLI, możesz zastosować migracje, aby utworzyć niezbędne tabele w swojej lokalnej lub zdalnej bazie danych.
    ```bash
    npx supabase db push
    ```

5.  **Uruchom aplikację:**
    Uruchom aplikację na wybranym symulatorze/emulatorze lub na fizycznym urządzeniu za pomocą aplikacji Expo Go.
    ```bash
    # Uruchomienie na Android
    npm run android

    # Uruchomienie na iOS
    npm run ios
    ```

## Dostępne skrypty

W projekcie dostępne są następujące skrypty `npm`:

| Skrypt          | Opis                                                                 |
| --------------- | -------------------------------------------------------------------- |
| `npm start`     | Uruchamia serwer deweloperski Metro Bundler.                         |
| `npm run android` | Buduje i uruchamia aplikację na podłączonym urządzeniu/emulatorze Android. |
| `npm run ios`     | Buduje i uruchamia aplikację na podłączonym urządzeniu/symulatorze iOS. |
| `npm run web`     | Uruchamia aplikację w trybie deweloperskim w przeglądarce internetowej. |
| `npm test`        | Uruchamia testy jednostkowe w trybie watch przy użyciu Jest.       |
| `npm run lint`    | Sprawdza kod pod kątem błędów i standardów za pomocą ESLint.          |
| `npm run lint:fix`| Automatycznie naprawia problemy znalezione przez ESLint.           |
| `npm run reset-project` | Uruchamia skrypt czyszczący cache projektu. |

## Zakres projektu (MVP)

Aktualna wersja aplikacji to **Minimum Viable Product (MVP)**, co oznacza, że skupia się na dostarczeniu kluczowych funkcjonalności. Poniżej znajduje się lista funkcji zawartych w MVP oraz tych, które są planowane na przyszłość.

### Kluczowe funkcjonalności (MVP)

*   Wyświetlanie boisk na mapie.
*   Filtrowanie boisk po typach sportu.
*   Przeglądanie szczegółów i kalendarza dostępności boiska.
*   Rejestracja i logowanie użytkowników (e-mail, Google, Apple ID).
*   Możliwość rezerwacji i odwoływania terminów.
*   Generowanie linku zaproszenia do wspólnej gry.
*   Podstawowe powiadomienia push (przypomnienia, odwołania, nowi gracze).

### Poza zakresem MVP

Następujące funkcjonalności zostały świadomie pominięte w obecnej wersji, ale mogą zostać dodane w przyszłości:

*   Panel administratora dla właścicieli obiektów.
*   System płatności za rezerwacje.
*   Zaawansowane profile użytkowników i tworzenie drużyn.
*   System ocen i recenzji boisk.
*   Wewnętrzny komunikator (czat).
*   Możliwość dodawania nowych boisk przez użytkowników.
*   Organizowanie lig amatorskich i systemy rankingowe.
*   Dedykowana aplikacja webowa.
*   Tekstowa wyszukiwarka boisk po nazwie lub adresie.

## Status projektu

**Aktualny status: W fazie rozwoju (MVP)**

Projekt jest aktywnie rozwijany. Obecny cel to stabilizacja i wdrożenie wersji MVP, która realizuje podstawowe założenia opisane w dokumencie wymagań produktu. Po osiągnięciu tego celu, rozwój skupi się na zbieraniu opinii od użytkowników i stopniowym wdrażaniu funkcji z listy "Poza zakresem MVP".

## Licencja

Ten projekt jest udostępniany na licencji MIT. Zobacz plik `LICENSE.md` po więcej szczegółów.
```