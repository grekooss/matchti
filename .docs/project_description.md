# Aplikacja - Mecz

### Główny problem

Obecnie brakuje scentralizowanego, prostego i powszechnie dostępnego systemu (zwłaszcza w formie aplikacji mobilnej z intuicyjną mapą) do sprawdzania dostępności oraz rezerwowania darmowych, publicznych boisk sportowych (np. Orlików, boisk szkolnych udostępnianych po godzinach, boisk osiedlowych). Prowadzi to do następujących problemów:

1.  **Trudność w znalezieniu wolnego boiska:** Użytkownicy muszą fizycznie sprawdzać dostępność boisk lub polegać na nieformalnych ustaleniach, co jest czasochłonne i nieefektywne.
2.  **Konflikty i nieporozumienia:** Brak jasnego systemu rezerwacji prowadzi do sytuacji, gdy kilka grup chce korzystać z boiska w tym samym czasie.
3.  **Niewykorzystany potencjał obiektów:** Niektóre boiska mogą stać puste z powodu braku informacji o ich dostępności, podczas gdy inne są oblegane.

### Najmniejszy zestaw funkcjonalności (MVP - Minimum Viable Product)

MVP skupi się na rozwiązaniu kluczowego problemu dla użytkownika końcowego, czyli umożliwieniu łatwego znalezienia i rezerwacji boisk poprzez \*\*aplikację mobilną.

**Dane o boiskach i ich kalendarzach w MVP będą wprowadzane i zarządzane centralnie przez zespół projektowy.**

**Dla Użytkownika (aplikacja mobilna):**

1.  **Mapa Boisk jako Ekran Startowy:**
    - Aplikacja po uruchomieniu wyświetla mapę (np. Google Maps, OpenStreetMap) z zaznaczonymi lokalizacjami dostępnych boisk (pinezki).
    - Mapa domyślnie centruje się na lokalizacji użytkownika (po uzyskaniu zgody na dostęp do GPS) lub na predefiniowanym obszarze (np. konkretne miasto).
    - Możliwość filtrowania boisk widocznych na mapie (np. po typie sportu).
2.  **Przeglądanie Boisk (szczegóły po kliknięciu na mapie):**
    - Kliknięcie pinezki na mapie wyświetla dymek/kartę z podstawowymi informacjami o boisku (nazwa, typ, adres).
    - Możliwość przejścia z informacji o boisku do widoku jego kalendarza dostępności.
    - Opcjonalnie: Alternatywny widok listy boisk, jeśli użytkownik preferuje taką formę przeglądania.
3.  **Rejestracja i Logowanie:** Prosty system tworzenia konta (np. e-mail + hasło, opcjonalnie logowanie przez Google/Apple ID/Facebook) i logowania.
4.  **Sprawdzanie Dostępności:**
    - Widok kalendarza dla wybranego boiska pokazujący zajęte i wolne terminy (np. podział na godzinowe sloty). Dostępność zarządzana centralnie.
5.  **Dokonywanie Rezerwacji:**
    - Możliwość wybrania wolnego terminu i dokonania rezerwacji na określony czas (np. 1h, 1.5h – zdefiniowane w systemie).
    - Otrzymanie potwierdzenia rezerwacji (w aplikacji, powiadomienie push, ewentualnie e-mail).
6.  **Zarządzanie Własnymi Rezerwacjami:**
    - Podgląd swoich aktywnych i przyszłych rezerwacji.
    - Możliwość odwołania rezerwacji (np. do X godzin przed terminem, aby zwolnić slot).
7.  **Zapraszanie Innych do Rezerwacji:**
    - Po dokonaniu rezerwacji, możliwość zaproszenia innych osób (np. współgraczy).
    - Opcja wysłania zaproszenia e-mailem (do zarejestrowanych i niezarejestrowanych użytkowników, z linkiem do aplikacji/rezerwacji).
    - Funkcja "Udostępnij rezerwację" wykorzystująca natywne opcje udostępniania systemu operacyjnego telefonu (np. do Messengera, WhatsApp, SMS), przekazująca link lub podstawowe informacje o rezerwacji.

### Co NIE wchodzi w zakres MVP

Aby szybko dostarczyć wartość i przetestować pomysł, następujące funkcjonalności zostaną pominięte w pierwszej wersji:

1.  **Panel Administratora Obiektu.**
2.  **System płatności.**
3.  **Zaawansowane profile użytkowników.**
4.  **Tworzenie drużyn i zarządzanie nimi wewnątrz aplikacji.**
5.  **System oceniania i recenzowania boisk/użytkowników.**
6.  **Komunikator wewnętrzny.**
7.  **Rozbudowane powiadomienia push o charakterze marketingowym czy społecznosciowym.**
8.  **Możliwość dodawania boisk przez samych użytkowników bez weryfikacji.**
9.  **Programy lojalnościowe, rankingi, organizacja lig amatorskich w aplikacji.**
10. **Dedykowana aplikacja webowa dla użytkowników końcowych.**
11. **Zaawansowane raporty i analityka.**
12. **Możliwość rezerwacji cyklicznych bezpośrednio przez użytkownika.**
13. **Listy oczekujących na zwolnienie terminu.**
