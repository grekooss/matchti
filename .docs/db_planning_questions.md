<database_planning_output>
<pytania>

1.  **Dane o Boiskach i Dostępności (FR-015):** W jaki dokładnie sposób dane o boiskach i ich kalendarzach dostępności będą dostarczane i synchronizowane? Czy będzie to jednorazowy import, regularne pliki, dostęp przez API zewnętrzne? Czy "kalendarz dostępności" oznacza z góry zdefiniowane, dostępne sloty czasowe, czy tylko ogólne godziny otwarcia i listę wyjątków/blokad, a aplikacja sama wylicza wolne sloty na podstawie istniejących rezerwacji? Jak często te dane będą aktualizowane i jak zarządzać potencjalnymi konfliktami między zewnętrznymi danymi a rezerwacjami użytkowników?

- Doastarczane beda od uzytkownikow, osoby projektowe moga dodawac tak samo jak uzytkownicy, nie bedzie z gory narzuconych godzin/slotow w MVP

2.  **Hierarchia Typów Sportów (FR-004):** Jak złożona jest hierarchia "głównych sportów i ich podkategorii"? Czy jest to tylko jeden poziom zagłębienia, czy więcej? Czy potrzebny jest prosty model (np. tabela `sports` z opcjonalnym `parent_sport_id`), czy bardziej złożony?

- tylko jeden poziom zaglebienia, model prosty

3.  **Mapowanie Długości Rezerwacji do Sportu (FR-017):** Gdzie dokładnie zdefiniowana jest zależność między typem sportu a dopuszczalną długością rezerwacji (min/max, krok co 15 min)? Czy te reguły powinny być przechowywane w tabeli `sports`, czy może w tabeli łączącej `fields` i `sports` (jeśli reguły różnią się per boisko dla tego samego sportu)?

- tylko w sports

4.  **Powiązanie Rezerwacji ze Sportem:** Czy encja `reservations` powinna zawierać bezpośrednie odwołanie (klucz obcy) do typu sportu, dla którego została dokonana rezerwacja? Jest to potrzebne do walidacji czasu trwania (FR-017) oraz potencjalnie do wyświetlania informacji o rezerwacji.

- tak powinna miec

5.  **Granulacja Slotów Czasowych (FR-014):** Czy _wszystkie_ boiska będą operować na sztywno zdefiniowanych slotach 15-minutowych, czy ta granulacja może się różnić w zależności od boiska lub typu sportu? Jak ta informacja (jeśli zmienna) będzie przechowywana?

- wszystkie w 15min

6.  **Identyfikatory Zewnętrzne Boisk:** Jeśli dane o boiskach pochodzą z zewnętrznego systemu, czy powinniśmy przechowywać oryginalny identyfikator boiska z tego systemu w naszej tabeli `fields`, aby ułatwić przyszłe aktualizacje i synchronizację danych?

- nie bedzie innych boisk jak tylko nasze

7.  **Zdjęcia Boisk (FR-005):** Czy dla każdego boiska przewidziane jest tylko jedno zdjęcie, czy potencjalnie więcej? Czy linki do zdjęć będą przechowywane bezpośrednio jako URL w tabeli `fields`, czy będziemy wykorzystywać Supabase Storage (wtedy przechowujemy ścieżkę do obiektu)?

- kilka zdjec i bedziemy wykorzystywac Supabase Storage

8.  **Dane Użytkownika:** Jakie dokładnie dane użytkownika (poza `email` i mechanizmami autentykacji) są niezbędne dla MVP? Czy wymagane jest `display_name` (imię/nazwisko/pseudonim) do wyświetlania na listach uczestników lub w zaproszeniach? Czy użytkownik może edytować swoje dane profilowe?

- display_name i avatar - bedzie edytowalne

9.  **Dostępność Danych Boisk (RLS):** Czy wszystkie dane boisk (`fields`) mają być publicznie dostępne do odczytu dla każdego (nawet niezalogowanego) użytkownika przeglądającego mapę? Czy istnieją jakieś scenariusze, gdzie dostęp do pewnych informacji o boiskach powinien być ograniczony?

- bedzie publicznie dostepne

10. **Dostępność Danych Rezerwacji (RLS):** Jakie dokładnie informacje o rezerwacji powinny być widoczne dla zaproszonego uczestnika (który nie jest organizatorem)? Czy widzi on tylko podstawowe dane (kto, co, gdzie, kiedy), czy również pełną listę innych uczestników?

- bedzie widoczne takze kto jest uczestnikiem oraz organizatorem

11. **Typ Nawierzchni Boiska (FR-005):** Czy pole `surface_type` powinno być polem tekstowym (free text), czy lepiej użyć predefiniowanego typu wyliczeniowego (ENUM) lub tabeli słownikowej (`surface_types`) dla zapewnienia spójności danych i ułatwienia potencjalnego filtrowania w przyszłości?

- bedzie enum

12. **Widok Listy Boisk (FR-007/US-018):** Jakie kryteria sortowania będą dostępne w widoku listy boisk (alfabetycznie, wg odległości - jeśli GPS jest dostępny)? Czy lista powinna obsługiwać paginację, biorąc pod uwagę potencjalnie dużą liczbę obiektów w widocznym obszarze mapy?

- bedzie sortowane po odleglosci i bierzmy pod uwage paginacje
  </pytania>

<rekomendacje>
1.  **Typy Danych Geograficznych (PostGIS):** Zdecydowanie używaj rozszerzenia PostGIS.
    *   **Lokalizacja punktowa:** Do przechowywania centralnego punktu boiska (np. dla znaczników na mapie i prostych obliczeń odległości) użyj typu `geometry(Point, 4326)`. Można to wypełniać na podstawie `latitude` i `longitude`. SRID 4326 (WGS84) jest standardem dla danych GPS/web map.
    *   **Obszar/Kształt:** Jeśli dostępne są dane o dokładnym kształcie boiska (np. poligony z OSM jak w przykładzie `way`), przechowuj je w osobnej kolumnie typu `geometry(Geometry, 4326)`. Typ `Geometry` pozwoli na przechowywanie różnych typów geometrii (Point, LineString, Polygon, etc.), a SRID 4326 zapewni spójność.
    Użycie tych typów umożliwi efektywne zapytania przestrzenne (np. `ST_DWithin`, `ST_Contains`, `ST_Area`) i indeksowanie przestrzenne (GiST).
2.  **Tokeny Zaproszeń:** Wygeneruj unikalny, trudny do odgadnięcia token dla każdej rezerwacji (np. UUID lub losowy ciąg znaków) i przechowuj go w tabeli `reservations`. Utwórz indeks na tej kolumnie, aby przyspieszyć wyszukiwanie rezerwacji po tokenie z linku. Token powinien być generowany w momencie tworzenia rezerwacji lub przy pierwszym udostępnieniu.
3.  **Integralność Czasu Rezerwacji:** Zaimplementuj mechanizmy zapewniające, że nowe rezerwacje nie nakładają się czasowo na istniejące, aktywne rezerwacje dla tego samego boiska. Można to osiągnąć za pomocą ograniczeń wykluczenia (EXCLUDE USING gist (field_id WITH =, tsrange(start_time, end_time) WITH &&)) w PostgreSQL, które zapobiegają wstawianiu wierszy z nachodzącymi na siebie zakresami czasowymi dla tego samego `field_id`. Należy również uwzględnić status rezerwacji (np. ignorować odwołane).
4.  **Logika Biznesowa (Anulowanie, Horyzont Rezerwacji):** Wiele reguł biznesowych (np. możliwość anulowania tylko przed rozpoczęciem, limit rezerwacji na miesiąc wprzód, walidacja długości rezerwacji zależna od sportu) można zaimplementować:
    *   W logice aplikacji frontendowej (dla szybkiej informacji zwrotnej dla użytkownika).
    *   *Dodatkowo i obowiązkowo* w logice backendowej (Supabase Edge Functions) lub jako ograniczenia/triggery w bazie danych (CHECK constraints, BEFORE INSERT/UPDATE triggers), aby zapewnić spójność danych niezależnie od klienta. Użycie Edge Functions jest często preferowane dla bardziej złożonej logiki.
5.  **Ograniczenie Horyzontu Czasowego:** Ograniczenie dotyczące rezerwacji na maksymalnie jeden miesiąc wprzód (FR-023) powinno być zaimplementowane jako CHECK constraint na tabeli `reservations` (np. `start_time <= now() + interval '1 month'`) lub walidowane w funkcji serwerowej przed zapisem.
6.  **Polityki Bezpieczeństwa na Poziomie Wierszy (RLS):** Zdefiniuj szczegółowe polityki RLS dla kluczowych tabel:
    *   `users`: Użytkownicy mogą odczytywać/modyfikować tylko własne dane (`auth.uid() = id`). Publiczny odczyt niektórych danych (np. `display_name` dla uczestników) może wymagać osobnej polityki lub funkcji.
    *   `reservations`: Organizator (`auth.uid() = organizer_id`) ma pełny dostęp (CRUD, z ograniczeniami np. na edycję przeszłych rezerwacji). Uczestnicy (istniejący w `reservation_participants` dla danej rezerwacji) mają dostęp do odczytu (SELECT). Publiczny dostęp do slotów (czy jest zajęty/wolny) powinien być realizowany pośrednio, np. przez widok lub funkcję, a nie bezpośredni dostęp do tabeli `reservations`.
    *   `reservation_participants`: Użytkownik może dodawać siebie (INSERT, po walidacji tokenu zaproszenia). Użytkownik może odczytywać (SELECT) wpisy dla rezerwacji, w których uczestniczy (jako organizator lub uczestnik). Organizator może mieć prawo do usuwania uczestników (DELETE)? (Nieokreślone w wymaganiach). Użytkownik może usunąć siebie (DELETE `user_id = auth.uid()`).
    *   `fields`, `sports`: Prawdopodobnie wymagają polityk `SELECT USING (true)` dla publicznego dostępu. Wszelkie modyfikacje powinny być ograniczone do ról administracyjnych lub procesów importu danych.
    *   `push_tokens`: Użytkownik może zarządzać (CRUD) tylko własnymi tokenami (`auth.uid() = user_id`).
7.  **Strategia Indeksowania:** Utwórz indeksy na kolumnach często używanych w klauzulach WHERE, JOIN i ORDER BY:
    *   `fields`: Indeks GiST na kolumnie geometrycznej (jeśli używana), indeks na `name` (jeśli będzie wyszukiwanie tekstowe w przyszłości).
    *   `field_sports`: Indeksy na `field_id` i `sport_id`.
    *   `reservations`: Indeks złożony na (`field_id`, `start_time`, `end_time`) dla sprawdzania dostępności, indeks na `organizer_id`, indeks na `invitation_token`, indeks na `start_time` (dla widoku "Moje Rezerwacje").
    *   `reservation_participants`: Indeks złożony na (`reservation_id`, `user_id`), osobny indeks na `user_id` (dla wyszukiwania rezerwacji użytkownika).
    *   `push_tokens`: Indeks na `user_id`, indeks UNIQUE na `token`.
8.  **Timestampy:** Używaj typu `TIMESTAMPTZ` (timestamp with time zone) dla wszystkich kolumn przechowujących datę i czas (`created_at`, `updated_at`, `start_time`, `end_time`, `joined_at`). Ustaw `DEFAULT now()` dla `created_at` i automatyczną aktualizację `updated_at` za pomocą triggera.
9.  **Klucze Główne i Obce:** Konsekwentnie używaj UUID jako kluczy głównych dla tabel, do których odwołuje się Supabase Auth (`users`) oraz potencjalnie dla innych głównych encji (`fields`, `reservations`), aby uniknąć problemów przy replikacji lub scalaniu danych. Dla tabel słownikowych (`sports`, `surface_types`) lub łączących (`field_sports`, `reservation_participants`) można rozważyć `SERIAL` lub złożone klucze główne. Zawsze definiuj ograniczenia kluczy obcych (FOREIGN KEY) z odpowiednimi akcjami (np. ON DELETE CASCADE lub ON DELETE SET NULL/RESTRICT), aby zapewnić integralność referencyjną.
10. **Role i Uprawnienia:** Rozważ zdefiniowanie specyficznych ról w PostgreSQL (poza domyślnymi `anon`, `authenticated`), jeśli potrzebna jest bardziej granularna kontrola dostępu, np. rola `admin` lub `data_importer` do zarządzania danymi boisk. Polityki RLS mogą następnie odwoływać się do tych ról.
</rekomendacje>
</database_planning_output>
