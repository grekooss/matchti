# Dokument wymagań produktu (PRD) - Mecz

## 1. Przegląd produktu

Aplikacja "Mecz" to mobilna platforma zaprojektowana w celu rozwiązania problemu braku scentralizowanego systemu do wyszukiwania i rezerwowania darmowych, publicznych boisk sportowych w Polsce. Umożliwia użytkownikom łatwe lokalizowanie dostępnych obiektów (np. Orlików, boisk szkolnych, osiedlowych, sal gimnastycznych) za pomocą intuicyjnej mapy, sprawdzanie ich dostępności w kalendarzu oraz dokonywanie rezerwacji. MVP (Minimum Viable Product) skupia się na dostarczeniu kluczowych funkcjonalności dla użytkownika końcowego, pozwalając na szybkie znalezienie boiska i zarezerwowanie terminu. Aplikacja ma na celu usprawnienie procesu, eliminację konfliktów o boiska oraz lepsze wykorzystanie istniejącej infrastruktury sportowej.

## 2. Problem użytkownika

Obecnie brakuje scentralizowanego, prostego i powszechnie dostępnego systemu (zwłaszcza w formie aplikacji mobilnej z intuicyjną mapą) do sprawdzania dostępności oraz rezerwowania darmowych, publicznych boisk sportowych. Prowadzi to do następujących problemów:

1.  Trudność w znalezieniu wolnego boiska: Użytkownicy muszą fizycznie sprawdzać dostępność boisk lub polegać na nieformalnych ustaleniach, co jest czasochłonne i nieefektywne.
2.  Konflikty i nieporozumienia: Brak jasnego systemu rezerwacji prowadzi do sytuacji, gdy kilka grup chce korzystać z boiska w tym samym czasie.
3.  Niewykorzystany potencjał obiektów: Niektóre boiska mogą stać puste z powodu braku informacji o ich dostępności, podczas gdy inne są oblegane.

## 3. Wymagania funkcjonalne

### 3.1. Mapa Boisk jako Ekran Startowy

    - FR-001: Aplikacja po uruchomieniu wyświetla mapę (np. Google Maps, OpenStreetMap) z zaznaczonymi lokalizacjami dostępnych boisk (pinezki) na terenie Polski.
    - FR-002: Mapa domyślnie centruje się na aktualnej lokalizacji użytkownika (po uzyskaniu zgody na dostęp do GPS).
    - FR-003: W przypadku braku zgody na GPS lub niemożności ustalenia lokalizacji, mapa centruje się na predefiniowanym obszarze (np. centralny punkt Polski lub duże miasto). Użytkownik może manualnie przewijać mapę w celu zmiany widocznego obszaru.
    - FR-004: Możliwość filtrowania boisk widocznych na mapie poprzez klikanie ikon reprezentujących typy sportów (główne sporty i ich podkategorie). Nie będzie dostępnej tekstowej wyszukiwarki boisk po nazwie lub adresie.

### 3.2. Przeglądanie Boisk

    - FR-005: Kliknięcie pinezki boiska na mapie wyświetla dymek/kartę z podstawowymi informacjami: nazwa, typy sportów (ikony), adres, zdjęcie obiektu, typ nawierzchni.
    - FR-006: Z karty informacyjnej boiska użytkownik może przejść do widoku kalendarza dostępności tego boiska.
    - FR-007: Dostępny jest alternatywny widok listy boisk dla użytkowników preferujących tę formę przeglądania.

### 3.3. Rejestracja i Logowanie

    - FR-008: Użytkownik może utworzyć konto za pomocą adresu e-mail i hasła.
    - FR-009: Użytkownik może utworzyć konto lub zalogować się za pomocą konta Google.
    - FR-010: Użytkownik może utworzyć konto lub zalogować się za pomocą konta Apple ID.
    - FR-011: Zarejestrowany użytkownik może zalogować się do aplikacji przy użyciu swoich danych uwierzytelniających (e-mail+hasło, Google, Apple ID).
    - FR-012: Dostępny jest mechanizm odzyskiwania hasła dla kont założonych przez e-mail.

### 3.4. Sprawdzanie Dostępności

    - FR-013: Dla wybranego boiska wyświetlany jest widok kalendarza pokazujący zajęte i wolne terminy.
    - FR-014: Terminy w kalendarzu są podzielone na sloty czasowe (np. co 15 minut).
    - FR-015: Dane o boiskach (w tym ich opisy, zdjęcia) i ich kalendarzach dostępności są dostarczane i utrzymywane przez zewnętrzny proces/podmiot. Zespół projektowy "Mecz" wspiera jedynie w zarządzaniu tymi danymi w systemie aplikacji. Aplikacja wyświetla dane w takim stanie, w jakim zostały dostarczone, bez aktywnej weryfikacji czy regularnych aktualizacji ze strony zespołu projektowego.

### 3.5. Dokonywanie Rezerwacji

    - FR-016: Użytkownik może wybrać wolny termin w kalendarzu boiska i dokonać rezerwacji.
    - FR-017: Długość rezerwacji jest zależna od typu sportu i może wynosić od 30 minut do 2 godzin, z możliwością wyboru co 15 minut.
    - FR-018: Po dokonaniu rezerwacji użytkownik otrzymuje potwierdzenie w aplikacji, zawierające informacje o "meczu": gdzie (nazwa, adres boiska), kiedy (data, godzina, czas trwania) oraz kto dołączył. Potwierdzenie nie będzie wysyłane e-mailem.

### 3.6. Zarządzanie Własnymi Rezerwacjami

    - FR-019: Użytkownik ma dostęp do podglądu swoich aktywnych i przyszłych rezerwacji.
    - FR-020: Użytkownik może odwołać swoją rezerwację w dowolnym momencie przed jej rozpoczęciem.
    - FR-021: Odwołana rezerwacja natychmiast zwalnia termin w kalendarzu boiska, czyniąc go dostępnym dla innych użytkowników.
    - FR-022: Nie ma limitu maksymalnej liczby aktywnych/przyszłych rezerwacji na jednego użytkownika.
    - FR-023: Użytkownik może dokonywać rezerwacji na maksymalnie jeden miesiąc wprzód.

### 3.7. Zapraszanie Innych do Rezerwacji

    - FR-024: Po dokonaniu rezerwacji, użytkownik (organizator) może zaprosić inne osoby (współgraczy).
    - FR-025: Zaproszenie odbywa się poprzez wygenerowanie linku do rezerwacji, który można udostępnić za pomocą natywnych opcji udostępniania systemu operacyjnego telefonu (np. do Messengera, WhatsApp, SMS).
    - FR-026: Niezarejestrowany użytkownik, który kliknie w link zaproszenia, zostanie najpierw przekierowany do strony/ekranu z zachętą do pobrania aplikacji i założenia konta/zalogowania się. Po pomyślnym zalogowaniu/rejestracji zobaczy informacje o rezerwacji i kto go zaprasza.
    - FR-027: Zarejestrowany użytkownik, który kliknie w link zaproszenia, zostanie przekierowany do szczegółów rezerwacji w aplikacji.

### 3.8. Powiadomienia Push

    - FR-028: Wszyscy uczestnicy danej rezerwacji (w tym organizator) otrzymają powiadomienie push, gdy nowy użytkownik dołączy do tej rezerwacji.
    - FR-029: Użytkownik, który dokonał rezerwacji lub do niej dołączył, otrzyma powiadomienie push przypominające o meczu na 2 godziny przed jego rozpoczęciem.
    - FR-030: Jeśli organizator odwoła rezerwację, wszyscy pozostali zaproszeni/dołączeni użytkownicy otrzymają powiadomienie push o tym fakcie.

## 4. Granice produktu

Następujące funkcjonalności i aspekty NIE wchodzą w zakres MVP aplikacji "Mecz":

1.  Panel Administratora Obiektu: Brak dedykowanego interfejsu dla właścicieli/zarządców boisk do samodzielnego zarządzania obiektami i kalendarzami.
2.  System płatności: Rezerwacje są darmowe; aplikacja nie obsługuje żadnych transakcji finansowych.
3.  Zaawansowane profile użytkowników: Profile będą zawierać tylko podstawowe informacje niezbędne do funkcjonowania systemu.
4.  Tworzenie drużyn i zarządzanie nimi wewnątrz aplikacji.
5.  System oceniania i recenzowania boisk/użytkowników.
6.  Komunikator wewnętrzny między użytkownikami.
7.  Rozbudowane powiadomienia push o charakterze marketingowym czy społecznościowym (poza wymienionymi w sekcji 3.8).
8.  Możliwość dodawania nowych boisk przez samych użytkowników bez weryfikacji centralnej.
9.  Programy lojalnościowe, systemy rankingowe, organizacja lig amatorskich w aplikacji.
10. Dedykowana aplikacja webowa dla użytkowników końcowych.
11. Zaawansowane raporty i analityka (poza podstawowymi metrykami sukcesu).
12. Możliwość rezerwacji cyklicznych bezpośrednio przez użytkownika.
13. Listy oczekujących na zwolnienie terminu.
14. Aktywne wprowadzanie, weryfikacja i regularna aktualizacja danych o boiskach i ich kalendarzach przez zespół projektowy "Mecz". Zespół jedynie wspiera zarządzanie danymi dostarczonymi z zewnątrz. (Kluczowe założenie i ryzyko projektowe).
15. Wyszukiwarka tekstowa boisk po nazwie lub adresie.
16. Wyszukiwarka lokalizacji/miast na mapie (tylko przewijanie mapy).

## 5. Historyjki użytkowników

### 5.1. Onboarding i Uprawnienia

ID: US-001
Tytuł: Zgoda na dostęp do lokalizacji
Opis: Jako nowy użytkownik, chcę móc udzielić aplikacji zgody na dostęp do mojej lokalizacji GPS, aby mapa mogła automatycznie wyświetlić boiska w mojej okolicy.
Kryteria akceptacji: 1. Przy pierwszym uruchomieniu aplikacji (lub pierwszej próbie użycia funkcji lokalizacji) użytkownik jest proszony o zgodę na dostęp do lokalizacji. 2. Jeśli użytkownik udzieli zgody, mapa centruje się na jego aktualnej lokalizacji. 3. Jeśli użytkownik nie udzieli zgody, aplikacja przechodzi do widoku mapy z predefiniowanym obszarem.

ID: US-002
Tytuł: Brak zgody na dostęp do lokalizacji
Opis: Jako użytkownik, który nie chce udostępniać swojej lokalizacji, chcę, aby aplikacja nadal była funkcjonalna i wyświetlała mapę na predefiniowanym obszarze.
Kryteria akceptacji: 1. Jeśli użytkownik nie udzieli zgody na dostęp do lokalizacji (lub ją wycofa), mapa wyświetla predefiniowany obszar (np. centrum Polski). 2. Użytkownik może manualnie przewijać mapę, aby znaleźć interesujący go region. 3. Brak dostępu do lokalizacji nie blokuje innych funkcji aplikacji.

### 5.2. Rejestracja

ID: US-003
Tytuł: Rejestracja za pomocą adresu e-mail i hasła
Opis: Jako nowy użytkownik, chcę móc zarejestrować się w aplikacji używając mojego adresu e-mail i tworząc hasło, aby uzyskać dostęp do funkcji rezerwacji.
Kryteria akceptacji: 1. Użytkownik może wprowadzić adres e-mail i hasło (z potwierdzeniem hasła). 2. System waliduje format adresu e-mail. 3. System sprawdza, czy adres e-mail nie jest już zarejestrowany. 4. Hasło musi spełniać minimalne wymogi bezpieczeństwa (np. długość). 5. Po pomyślnej walidacji konto jest tworzone, a użytkownik jest zalogowany.

ID: US-004
Tytuł: Rejestracja za pomocą konta Google
Opis: Jako nowy użytkownik, chcę móc zarejestrować się w aplikacji używając mojego istniejącego konta Google, aby przyspieszyć proces tworzenia konta.
Kryteria akceptacji: 1. Użytkownik może wybrać opcję "Zarejestruj przez Google". 2. Aplikacja inicjuje proces autoryzacji Google. 3. Po pomyślnej autoryzacji przez Google, konto w aplikacji "Mecz" jest tworzone (lub łączone, jeśli e-mail już istnieje i nie jest powiązany z innym typem logowania), a użytkownik jest zalogowany. 4. Aplikacja pobiera niezbędne dane (np. e-mail, imię) z profilu Google.

ID: US-005
Tytuł: Rejestracja za pomocą konta Apple ID
Opis: Jako nowy użytkownik (korzystający z urządzenia iOS), chcę móc zarejestrować się w aplikacji używając mojego istniejącego konta Apple ID, aby zapewnić sobie wygodny i bezpieczny sposób tworzenia konta.
Kryteria akceptacji: 1. Użytkownik (na urządzeniu iOS) może wybrać opcję "Zarejestruj przez Apple". 2. Aplikacja inicjuje proces autoryzacji Apple ID. 3. Użytkownik ma możliwość ukrycia swojego adresu e-mail (opcja "Ukryj mój e-mail"). 4. Po pomyślnej autoryzacji przez Apple, konto w aplikacji "Mecz" jest tworzone (lub łączone), a użytkownik jest zalogowany. 5. Aplikacja pobiera niezbędne dane z profilu Apple.

### 5.3. Logowanie

ID: US-006
Tytuł: Logowanie za pomocą adresu e-mail i hasła
Opis: Jako zarejestrowany użytkownik, chcę móc zalogować się do aplikacji używając mojego adresu e-mail i hasła, aby uzyskać dostęp do moich rezerwacji i innych funkcji.
Kryteria akceptacji: 1. Użytkownik może wprowadzić zarejestrowany adres e-mail i hasło. 2. Po pomyślnej weryfikacji danych, użytkownik jest zalogowany i ma dostęp do swojego konta. 3. W przypadku błędnych danych, użytkownik otrzymuje stosowny komunikat.

ID: US-007
Tytuł: Logowanie za pomocą konta Google
Opis: Jako zarejestrowany użytkownik, który powiązał konto z Google, chcę móc zalogować się do aplikacji używając mojego konta Google, dla wygody.
Kryteria akceptacji: 1. Użytkownik może wybrać opcję "Zaloguj przez Google". 2. Aplikacja inicjuje proces autoryzacji Google. 3. Po pomyślnej autoryzacji przez Google, użytkownik jest zalogowany do swojego konta w aplikacji "Mecz".

ID: US-008
Tytuł: Logowanie za pomocą konta Apple ID
Opis: Jako zarejestrowany użytkownik (korzystający z urządzenia iOS), który powiązał konto z Apple ID, chcę móc zalogować się do aplikacji używając mojego konta Apple ID.
Kryteria akceptacji: 1. Użytkownik (na urządzeniu iOS) może wybrać opcję "Zaloguj przez Apple". 2. Aplikacja inicjuje proces autoryzacji Apple ID. 3. Po pomyślnej autoryzacji przez Apple, użytkownik jest zalogowany do swojego konta w aplikacji "Mecz".

ID: US-009
Tytuł: Nieudana próba logowania
Opis: Jako użytkownik, próbując zalogować się z nieprawidłowymi danymi, chcę otrzymać jasny komunikat o błędzie.
Kryteria akceptacji: 1. Jeśli użytkownik wprowadzi nieprawidłowy e-mail lub hasło, wyświetlany jest komunikat "Nieprawidłowy e-mail lub hasło". 2. Jeśli wystąpi problem z logowaniem przez Google/Apple, wyświetlany jest odpowiedni komunikat o błędzie. 3. Pola do logowania nie są czyszczone automatycznie po błędnej próbie (opcjonalnie, do decyzji UX).

### 5.4. Odzyskiwanie Hasła

ID: US-010
Tytuł: Inicjowanie procesu odzyskiwania hasła
Opis: Jako użytkownik, który zapomniał hasła do konta zarejestrowanego przez e-mail, chcę móc zainicjować proces jego odzyskania.
Kryteria akceptacji: 1. Na ekranie logowania dostępna jest opcja "Zapomniałem hasła". 2. Po kliknięciu, użytkownik jest proszony o podanie adresu e-mail powiązanego z kontem. 3. Jeśli e-mail istnieje w systemie i jest zarejestrowany tradycyjnie (nie przez Google/Apple), na ten adres wysyłana jest wiadomość z linkiem do resetowania hasła. 4. Użytkownik otrzymuje komunikat potwierdzający wysłanie instrukcji lub informujący, jeśli e-mail nie został znaleziony lub jest powiązany z logowaniem społecznościowym.

ID: US-011
Tytuł: Resetowanie hasła za pomocą linku
Opis: Jako użytkownik, po otrzymaniu linku do resetowania hasła, chcę móc ustawić nowe hasło dla mojego konta.
Kryteria akceptacji: 1. Link w e-mailu prowadzi do bezpiecznej strony/ekranu w aplikacji do resetowania hasła. 2. Użytkownik jest proszony o wprowadzenie nowego hasła i jego potwierdzenie. 3. Nowe hasło musi spełniać minimalne wymogi bezpieczeństwa. 4. Po pomyślnym ustawieniu nowego hasła, użytkownik otrzymuje potwierdzenie i może zalogować się przy użyciu nowego hasła. 5. Link do resetowania hasła ma ograniczony czas ważności.

### 5.5. Mapa i Wyszukiwanie Boisk

ID: US-012
Tytuł: Wyświetlanie boisk na mapie w oparciu o lokalizację użytkownika
Opis: Jako użytkownik, po uruchomieniu aplikacji i udzieleniu zgody na lokalizację, chcę zobaczyć na mapie pinezki reprezentujące boiska sportowe w mojej aktualnej okolicy.
Kryteria akceptacji: 1. Mapa jest wycentrowana na lokalizacji GPS użytkownika. 2. Na mapie widoczne są pinezki dla boisk znajdujących się w zasięgu widoku. 3. Pinezki są wyraźnie widoczne i klikalne.

ID: US-013
Tytuł: Wyświetlanie boisk na mapie na predefiniowanym obszarze
Opis: Jako użytkownik, który nie udzielił zgody na lokalizację lub gdy lokalizacja jest niedostępna, chcę zobaczyć mapę wycentrowaną na predefiniowanym obszarze, abym mógł rozpocząć eksplorację.
Kryteria akceptacji: 1. Mapa jest wycentrowana na predefiniowanym obszarze (np. centralny punkt Polski). 2. Na mapie widoczne są pinezki dla boisk znajdujących się w zasięgu widoku.

ID: US-014
Tytuł: Manualne przewijanie i zoomowanie mapy
Opis: Jako użytkownik, chcę móc swobodnie przewijać i zmieniać poziom przybliżenia mapy, aby eksplorować różne obszary i zagęszczenie boisk.
Kryteria akceptacji: 1. Użytkownik może przesuwać mapę palcem w dowolnym kierunku. 2. Użytkownik może przybliżać i oddalać widok mapy (np. gestem pinch-to-zoom). 3. Podczas przewijania/zoomowania, pinezki boisk na mapie są dynamicznie aktualizowane dla nowego widoku.

ID: US-015
Tytuł: Filtrowanie boisk po typie sportu za pomocą ikon
Opis: Jako użytkownik, chcę móc filtrować boiska widoczne na mapie, klikając ikony reprezentujące różne typy sportów (np. piłka nożna, koszykówka, siatkówka), aby wyświetlić tylko te obiekty, które mnie interesują.
Kryteria akceptacji: 1. Dostępny jest zestaw klikalnych ikon reprezentujących główne typy sportów oraz ich podkategorie. 2. Kliknięcie ikony sportu powoduje wyświetlenie na mapie tylko tych boisk, które obsługują wybrany typ sportu. 3. Możliwe jest wybranie jednej lub wielu ikon sportów (do ustalenia: czy wybór jest pojedynczy czy wielokrotny). 4. Aktywny filtr jest wizualnie wskazany (np. podświetlona ikona). 5. Dostępna jest opcja usunięcia filtra / pokazania wszystkich boisk.

ID: US-016
Tytuł: Wyświetlanie podstawowych informacji o boisku po kliknięciu pinezki
Opis: Jako użytkownik, po kliknięciu pinezki boiska na mapie, chcę zobaczyć dymek/kartę z podstawowymi informacjami o tym boisku, aby szybko ocenić, czy jest ono dla mnie odpowiednie.
Kryteria akceptacji: 1. Kliknięcie pinezki na mapie powoduje wyświetlenie dymka/karty informacyjnej. 2. Dymek/karta zawiera co najmniej: nazwę boiska, adres, ikony dostępnych typów sportów, zdjęcie obiektu, typ nawierzchni. 3. Dymek/karta zawiera przycisk/link do przejścia do szczegółów boiska i kalendarza dostępności.

ID: US-017
Tytuł: Przechodzenie do szczegółów boiska i kalendarza
Opis: Jako użytkownik, z dymka/karty informacyjnej boiska, chcę móc przejść do pełnego widoku szczegółów boiska oraz jego kalendarza dostępności.
Kryteria akceptacji: 1. Z dymka/karty boiska istnieje wyraźny element (np. przycisk "Zobacz dostępność") umożliwiający przejście dalej. 2. Po kliknięciu, użytkownik jest przenoszony do ekranu szczegółów boiska, który zawiera kalendarz dostępności.

ID: US-018
Tytuł: Przeglądanie boisk w formie listy
Opis: Jako użytkownik, który preferuje widok listy zamiast mapy, chcę mieć możliwość przełączenia się na listę boisk znajdujących się w aktualnie widocznym obszarze mapy lub spełniających kryteria filtrowania.
Kryteria akceptacji: 1. Dostępna jest opcja przełączenia widoku z mapy na listę boisk. 2. Lista boisk wyświetla kluczowe informacje (np. nazwa, adres, typ sportu, zdjęcie) dla każdego obiektu. 3. Lista jest sortowana (np. alfabetycznie, wg odległości - jeśli GPS dostępny). 4. Z elementu listy można przejść do szczegółów boiska i kalendarza dostępności. 5. Filtry zastosowane na mapie (np. typ sportu) są również aktywne w widoku listy.

### 5.6. Sprawdzanie Dostępności i Dokonywanie Rezerwacji

ID: US-019
Tytuł: Wyświetlanie kalendarza dostępności boiska
Opis: Jako użytkownik, po wybraniu boiska, chcę zobaczyć przejrzysty kalendarz pokazujący wolne i zajęte terminy (sloty czasowe), abym mógł znaleźć dogodny czas na grę.
Kryteria akceptacji: 1. Kalendarz wyświetla dni (np. na najbliższy miesiąc). 2. Dla wybranego dnia, kalendarz pokazuje podział na sloty godzinowe (np. co 15 minut). 3. Wolne sloty są wyraźnie odróżnione od zajętych. 4. Użytkownik może nawigować między dniami/tygodniami w kalendarzu.

ID: US-020
Tytuł: Wybór wolnego terminu i długości rezerwacji
Opis: Jako użytkownik, chcę móc wybrać wolny slot czasowy w kalendarzu oraz określić długość rezerwacji (zgodnie z dostępnymi opcjami dla danego sportu), aby zarezerwować boisko.
Kryteria akceptacji: 1. Użytkownik może kliknąć na wolny slot czasowy w kalendarzu. 2. Po wybraniu slotu startowego, użytkownik może wybrać długość rezerwacji (np. 30min, 45min, 1h, 1h15m, 1h30m, 1h45m, 2h), o ile kolejne sloty są wolne i mieszczą się w dopuszczalnym zakresie dla danego sportu. 3. Wybrany zakres czasu jest wizualnie zaznaczony.

ID: US-021
Tytuł: Dokonywanie rezerwacji
Opis: Jako zalogowany użytkownik, po wybraniu terminu i długości, chcę potwierdzić rezerwację, aby zarezerwować boisko na wybrany czas.
Kryteria akceptacji: 1. Dostępny jest przycisk "Zarezerwuj". 2. Przed ostatecznym potwierdzeniem, użytkownik widzi podsumowanie rezerwacji (boisko, data, czas, długość). 3. Po kliknięciu "Zarezerwuj", system sprawdza, czy termin jest nadal dostępny. 4. Jeśli termin jest dostępny, rezerwacja jest zapisywana w systemie, a kalendarz jest aktualizowany. 5. Użytkownik otrzymuje potwierdzenie rezerwacji w aplikacji. 6. Jeśli termin w międzyczasie został zajęty, użytkownik otrzymuje stosowny komunikat i musi wybrać inny termin.

ID: US-022
Tytuł: Otrzymanie potwierdzenia rezerwacji w aplikacji
Opis: Jako użytkownik, po pomyślnym dokonaniu rezerwacji, chcę otrzymać jej potwierdzenie bezpośrednio w aplikacji, zawierające wszystkie kluczowe szczegóły.
Kryteria akceptacji: 1. Po dokonaniu rezerwacji, wyświetlany jest ekran/komunikat potwierdzający. 2. Potwierdzenie zawiera: nazwę i adres boiska, datę i godzinę rezerwacji, czas trwania, informację kto zarezerwował. 3. Z poziomu potwierdzenia użytkownik ma dostęp do opcji zaproszenia innych.

### 5.7. Zarządzanie Własnymi Rezerwacjami

ID: US-023
Tytuł: Przeglądanie listy własnych rezerwacji
Opis: Jako zalogowany użytkownik, chcę mieć dostęp do listy moich aktywnych i przyszłych rezerwacji, aby móc nimi zarządzać.
Kryteria akceptacji: 1. W aplikacji dostępna jest sekcja "Moje Rezerwacje". 2. Lista wyświetla rezerwacje chronologicznie (najbliższe najpierw). 3. Każdy element listy zawiera kluczowe informacje: nazwa boiska, data, godzina, czas trwania. 4. Z listy można przejść do szczegółów danej rezerwacji.

ID: US-024
Tytuł: Odwoływanie własnej rezerwacji
Opis: Jako użytkownik, chcę móc odwołać swoją rezerwację w dowolnym momencie przed jej rozpoczęciem, jeśli moje plany ulegną zmianie, aby zwolnić termin dla innych.
Kryteria akceptacji: 1. W szczegółach rezerwacji lub na liście rezerwacji dostępna jest opcja "Odwołaj rezerwację". 2. Użytkownik jest proszony o potwierdzenie chęci odwołania rezerwacji. 3. Po potwierdzeniu, rezerwacja jest usuwana z listy rezerwacji użytkownika. 4. Termin w kalendarzu boiska staje się natychmiast dostępny dla innych. 5. Jeśli do rezerwacji byli zaproszeni inni gracze, otrzymują oni powiadomienie push o odwołaniu meczu przez organizatora.

### 5.8. Zapraszanie Innych do Rezerwacji

ID: US-025
Tytuł: Generowanie i udostępnianie linku zaproszenia do rezerwacji
Opis: Jako użytkownik, który dokonał rezerwacji, chcę móc wygenerować unikalny link do tej rezerwacji i udostępnić go znajomym za pomocą natywnych funkcji telefonu, aby zaprosić ich do wspólnej gry.
Kryteria akceptacji: 1. W szczegółach rezerwacji dostępna jest opcja "Zaproś znajomych" / "Udostępnij rezerwację". 2. Kliknięcie tej opcji generuje unikalny link do danej rezerwacji. 3. Aktywowana jest natywna funkcja udostępniania systemu operacyjnego (share sheet), pozwalająca wysłać link np. przez SMS, Messenger, WhatsApp itp. 4. Link zawiera informacje identyfikujące rezerwację.

ID: US-026
Tytuł: Obsługa linku zaproszenia przez zarejestrowanego użytkownika
Opis: Jako zarejestrowany użytkownik aplikacji "Mecz", po kliknięciu w link zaproszenia otrzymany od znajomego, chcę zostać przekierowany do szczegółów tej rezerwacji w aplikacji i mieć możliwość dołączenia.
Kryteria akceptacji: 1. Po kliknięciu linku (deep link), aplikacja "Mecz" otwiera się (jeśli jest zainstalowana). 2. Użytkownik jest przenoszony do ekranu szczegółów danej rezerwacji. 3. Na ekranie rezerwacji widoczna jest opcja "Dołącz do meczu" (jeśli użytkownik jeszcze nie dołączył). 4. Po dołączeniu, użytkownik jest dodawany do listy uczestników, a organizator i inni uczestnicy otrzymują powiadomienie push.

ID: US-027
Tytuł: Obsługa linku zaproszenia przez niezarejestrowanego użytkownika
Opis: Jako osoba, która nie ma jeszcze konta w aplikacji "Mecz", po kliknięciu w link zaproszenia, chcę zostać poinformowana o konieczności pobrania aplikacji i rejestracji/logowania, a następnie zobaczyć szczegóły rezerwacji.
Kryteria akceptacji: 1. Kliknięcie linku przez osobę bez zainstalowanej aplikacji prowadzi do strony z informacją o aplikacji i linkami do sklepów (App Store, Google Play) lub bezpośrednio do sklepu. 2. Jeśli aplikacja jest zainstalowana, ale użytkownik nie jest zalogowany, po kliknięciu linku jest proszony o zalogowanie/rejestrację. 3. Po pomyślnym zalogowaniu/rejestracji, użytkownik jest przekierowywany do szczegółów rezerwacji, do której został zaproszony. 4. Na ekranie rezerwacji widoczna jest opcja "Dołącz do meczu".

### 5.9. Powiadomienia Push

ID: US-028
Tytuł: Otrzymywanie powiadomienia o dołączeniu nowego gracza do rezerwacji
Opis: Jako organizator lub uczestnik rezerwacji, chcę otrzymać powiadomienie push, gdy nowa osoba dołączy do naszej wspólnej rezerwacji/meczu.
Kryteria akceptacji: 1. Gdy użytkownik pomyślnie dołączy do rezerwacji, do której został zaproszony. 2. Organizator oraz wszyscy dotychczasowi uczestnicy tej rezerwacji otrzymują powiadomienie push. 3. Powiadomienie zawiera informację, kto dołączył i do jakiego meczu (np. "Jan Kowalski dołączył do Twojego meczu na Orliku XYZ o 18:00").

ID: US-029
Tytuł: Otrzymywanie powiadomienia przypominającego o nadchodzącej rezerwacji
Opis: Jako użytkownik, który ma zaplanowaną rezerwację, chcę otrzymać powiadomienie push na 2 godziny przed jej rozpoczęciem, aby o niej nie zapomnieć.
Kryteria akceptacji: 1. System automatycznie wysyła powiadomienie push na 2 godziny przed zaplanowanym czasem rozpoczęcia rezerwacji. 2. Powiadomienie jest wysyłane do organizatora i wszystkich dołączonych uczestników. 3. Powiadomienie zawiera kluczowe informacje: co (np. "Twój mecz"), gdzie (nazwa boiska) i kiedy (godzina).

ID: US-030
Tytuł: Otrzymywanie powiadomienia o odwołaniu rezerwacji przez organizatora
Opis: Jako uczestnik zaproszony do rezerwacji, chcę otrzymać powiadomienie push, jeśli organizator odwoła tę rezerwację.
Kryteria akceptacji: 1. Gdy organizator pomyślnie odwoła swoją rezerwację. 2. Wszyscy użytkownicy, którzy wcześniej dołączyli do tej rezerwacji, otrzymują powiadomienie push. 3. Powiadomienie informuje o odwołaniu meczu i podaje jego szczegóły (np. "Mecz na Orliku XYZ o 18:00 został odwołany przez organizatora").

## 6. Metryki sukcesu

Sukces aplikacji "Mecz" (MVP) będzie mierzony za pomocą następujących kluczowych wskaźników (KPIs):

1.  Zaangażowanie użytkowników:

    - Liczba aktywnych użytkowników dziennie/miesięcznie (DAU/MAU): Wskazuje na ogólną popularność i regularność korzystania z aplikacji.
    - Liczba rezerwacji na aktywnego użytkownika: Mierzy, jak często użytkownicy faktycznie korzystają z głównej funkcji aplikacji.
    - Średni czas spędzony w aplikacji na sesję/użytkownika: Pokazuje, na ile aplikacja jest angażująca lub łatwa w obsłudze.
    - Wskaźnik retencji użytkowników (np. D1, D7, D30): Mierzy, ilu użytkowników wraca do aplikacji po pierwszym użyciu/rejestracji.

2.  Wzrost i adopcja:

    - Liczba pobrań aplikacji: Podstawowy wskaźnik zasięgu.
    - Liczba nowo zarejestrowanych użytkowników: Wskazuje na tempo pozyskiwania użytkowników.
    - Tempo wzrostu bazy użytkowników: Procentowy wzrost liczby użytkowników w czasie.

3.  Skuteczność podstawowej funkcji:

    - Liczba pomyślnie dokonanych rezerwacji: Kluczowy wskaźnik realizacji głównego celu aplikacji.
    - Odsetek rezerwacji odwołanych: Może wskazywać na problemy z planowaniem po stronie użytkowników, ale także na potencjalne problemy z jakością danych o obiektach lub ich rzeczywistą dostępnością.

4.  Jakość i satysfakcja (pośrednio):

    - Oceny i recenzje aplikacji w sklepach (App Store, Google Play): Ogólny sentyment użytkowników.
    - Liczba zgłoszeń problemów/błędów przez użytkowników: Wskaźnik stabilności i jakości aplikacji.
    - Feedback zbierany poprzez opcjonalne ankiety w aplikacji lub inne kanały kontaktu: Bezpośrednie opinie użytkowników na temat ich doświadczeń.

5.  Jakość danych (krytyczny wskaźnik ryzyka):
    - Liczba zgłoszeń od użytkowników dotyczących nieaktualnych/błędnych informacji o boiskach lub ich dostępności: Wysoka liczba tych zgłoszeń będzie sygnałem alarmowym wskazującym na fundamentalne problemy z wiarygodnością danych, co bezpośrednio wpływa na użyteczność aplikacji.

Cele liczbowe dla tych wskaźników zostaną zdefiniowane w późniejszym etapie, po ustaleniu strategii wdrożenia i dostępnych zasobów. Regularne monitorowanie tych metryk pozwoli na ocenę działania MVP i podejmowanie decyzji dotyczących dalszego rozwoju produktu.
