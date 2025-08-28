<conversation_summary>
<decisions>

1.  **Zasięg geograficzny i typy obiektów:** MVP obejmie całą Polskę i różnorodne typy obiektów sportowych (Orliki, szkolne, osiedlowe, sale gimnastyczne itp.).
2.  **Mapa i wyszukiwanie:** Ekran startowy z mapą, domyślnie centrowaną na lokalizacji użytkownika lub predefiniowanym obszarze (bez możliwości manualnego wyszukiwania lokalizacji, tylko scrollowanie). Filtrowanie boisk wyłącznie przez klikanie ikon sportów (brak wyszukiwarki tekstowej boisk po nazwie/adresie).
3.  **Rejestracja i logowanie:** W MVP e-mail + hasło, z mechanizmem odzyskiwania hasła oraz logowanie przez Google/Apple ID.
4.  **Rezerwacje:** Długość slotów rezerwacyjnych będzie zmienna (30 min - 2h, co 15 min) w zależności od sportu. Brak limitu aktywnych rezerwacji na użytkownika. Możliwość rezerwacji na miesiąc wprzód. Możliwość odwołania rezerwacji aż do jej rozpoczęcia, co natychmiast zwalnia termin.
5.  **Zapraszanie innych:** Niezarejestrowani użytkownicy po kliknięciu linku zobaczą zachętę do pobrania aplikacji i zalogowania, a następnie informacje o rezerwacji. Wszyscy uczestnicy rezerwacji otrzymają powiadomienie o dołączeniu nowego gracza.
6.  **Zarządzanie danymi o boiskach i kalendarzach:** Zespół projektowy _nie będzie_ odpowiedzialny za wprowadzanie danych o boiskach i ich kalendarzach, a jedynie pomoże w zarządzaniu danymi. _Nie są planowane regularne aktualizacje danych o boiskach i ich dostępności._
7.  **Informacje o boisku:** Karta boiska (po kliknięciu pinezki) będzie zawierać zdjęcie, ikony typów sportów, typ nawierzchni (oprócz nazwy i adresu).
8.  **Potwierdzenie rezerwacji:** Potwierdzenie w formie informacji o "meczu" (gdzie, kiedy, kto dołączył) będzie dostępne tylko w aplikacji (bez e-mail).
9.  **Powiadomienia push:** Będą dotyczyć dołączenia nowego użytkownika do rezerwacji (dla wszystkich uczestników), przypomnienia o meczu 2h przed oraz informacji o odwołaniu rezerwacji przez założyciela (dla pozostałych uczestników).

</decisions>

<matched_recommendations>

1.  **Krytyczne dotyczące danych o boiskach:**
    - Rekomendacja dotycząca opracowania efektywnego systemu zarządzania danymi i ich aktualizacji staje się absolutnie krytyczna w świetle decyzji, że zespół projektowy nie odpowiada za dane i nie planuje się ich aktualizacji. Należy pilnie wyjaśnić, kto i jak będzie dbał o rzetelność tych informacji.
    - Rekomendacja wdrożenia mechanizmu zgłaszania przez użytkowników problemów z danymi boiska lub jego dostępnością (np. poprzez dedykowany adres e-mail lub formularz kontaktowy w aplikacji) jest niezwykle istotna, aby chociaż częściowo mitygować ryzyko nieaktualnych danych.
2.  **Doprecyzowanie problemu i grupy docelowej:**
    - Zalecenie przeprowadzenia badań lub ankiet wśród potencjalnych użytkowników w celu potwierdzenia priorytetowych typów boisk i zrozumienia obecnych zachowań ("pain points") jest nadal bardzo istotne, zwłaszcza że nie ma danych o skali problemu ani wiedzy o obecnych metodach rezerwacji.
3.  **Poprawa Doświadczenia Użytkownika (UX):**
    - Zalecenie zaprojektowania prostego procesu onboardingu dla nowych użytkowników.
    - Rekomendacja, aby potwierdzenie rezerwacji (w aplikacji) zawierało komplet kluczowych informacji i ewentualnie link do nawigacji/dodania do kalendarza systemowego.
4.  **Mierzenie sukcesu i iteracja:**
    - Sugestia zdefiniowania "North Star Metric" oraz wdrożenia narzędzi analitycznych od początku MVP do śledzenia kluczowych metryk.
    - Rekomendacja dodania prostej metody zbierania opinii od użytkowników w aplikacji.
5.  **Zarządzanie Ryzykami:**
    - W kontekście "rezerwacji-widmo" i braku limitu rezerwacji, warto rozważyć delikatne komunikaty zachęcające do odpowiedzialnego korzystania z systemu.
6.  **Dokumentacja i Proces:**
    - Zalecenie, aby PRD zawierało wyraźnie zdefiniowane "Założenia" oraz sekcję "Co nie jest celem tej wersji produktu".
    - Rekomendacja stworzenia podstawowych makiet (wireframes) lub prototypów kluczowych ekranów.

</matched_recommendations>

<prd_planning_summary>
**Główne wymagania funkcjonalne produktu (MVP):**

1.  **Mapa Boisk jako Ekran Startowy:**
    - Wyświetlanie mapy (Google Maps/OpenStreetMap) z pinezkami boisk.
    - Centrowanie na lokalizacji użytkownika (za zgodą GPS) lub predefiniowanym obszarze (bez wyszukiwarki lokalizacji, tylko scroll).
    - Filtrowanie boisk przez klikanie ikon dostępnych typów sportów (główne sporty i podkategorie).
2.  **Przeglądanie Boisk:**
    - Kliknięcie pinezki wyświetla kartę z informacjami: nazwa, typ sportu (ikony), adres, zdjęcie, typ nawierzchni.
    - Przejście z karty boiska do widoku jego kalendarza dostępności.
    - Opcjonalnie: widok listy boisk.
3.  **Rejestracja i Logowanie:**
    - Rejestracja przez e-mail + hasło.
    - Logowanie przez e-mail + hasło.
    - Mechanizm odzyskiwania hasła.
4.  **Sprawdzanie Dostępności:**
    - Widok kalendarza dla boiska z zajętymi/wolnymi terminami (podział na sloty). Dane o dostępności _zarządzane w sposób, który wymaga pilnego wyjaśnienia_.
5.  **Dokonywanie Rezerwacji:**
    - Wybór wolnego terminu i rezerwacja na określony czas (zależny od sportu, np. 30min-2h, co 15min).
    - Otrzymanie potwierdzenia rezerwacji w aplikacji (informacje o "meczu": gdzie, kiedy, kto dołączył).
6.  **Zarządzanie Własnymi Rezerwacjami:**
    - Podgląd aktywnych/przyszłych rezerwacji.
    - Możliwość odwołania rezerwacji aż do jej rozpoczęcia.
7.  **Zapraszanie Innych do Rezerwacji ("Meczu"):**
    - Możliwość zaproszenia innych (linkiem).
    - Niezarejestrowani: zachęta do pobrania aplikacji i logowania, potem info o rezerwacji.
    - Udostępnianie rezerwacji przez natywne opcje systemowe.
    - Powiadomienie push dla wszystkich uczestników o dołączeniu nowego gracza.
8.  **Powiadomienia Push:**
    - O dołączeniu gracza do rezerwacji.
    - Przypomnienie o meczu 2h przed.
    - O odwołaniu rezerwacji przez założyciela (dla pozostałych uczestników).

**Kluczowe historie użytkownika i ścieżki korzystania:**

- Jako nowy użytkownik, chcę łatwo zarejestrować się w aplikacji używając mojego adresu e-mail i hasła, aby móc rezerwować boiska.
- Jako użytkownik, chcę po otwarciu aplikacji zobaczyć na mapie boiska sportowe dostępne w mojej okolicy, abym mógł szybko zorientować się, gdzie mogę zagrać.
- Jako użytkownik, chcę móc wybrać interesujący mnie typ sportu (np. piłka nożna, koszykówka) i zobaczyć tylko te boiska, które są do niego przystosowane.
- Jako użytkownik, po wybraniu boiska na mapie, chcę zobaczyć jego szczegóły (zdjęcie, adres, dostępne sporty, nawierzchnia) oraz przejść do kalendarza dostępności, aby sprawdzić wolne terminy.
- Jako użytkownik, chcę wybrać w kalendarzu wolny slot czasowy i zarezerwować go na określoną długość (np. 1 godzinę), aby mieć pewność, że boisko będzie dla mnie dostępne.
- Jako użytkownik, po dokonaniu rezerwacji, chcę otrzymać jej potwierdzenie w aplikacji z informacją gdzie, kiedy gram i kto jest zaproszony.
- Jako użytkownik, chcę mieć możliwość podejrzenia listy moich nadchodzących rezerwacji oraz odwołania którejś z nich, jeśli moje plany się zmienią, nawet tuż przed jej rozpoczęciem.
- Jako organizator meczu, chcę po dokonaniu rezerwacji móc łatwo udostępnić informację o niej moim znajomym poprzez link (np. przez Messengera, WhatsApp), aby zaprosić ich do wspólnej gry.
- Jako uczestnik meczu, chcę otrzymać powiadomienie push, gdy ktoś nowy dołączy do naszej rezerwacji.
- Jako użytkownik, chcę otrzymać powiadomienie push przypominające mi o nadchodzącej rezerwacji na 2 godziny przed jej rozpoczęciem.

**Ważne kryteria sukcesu i sposoby ich mierzenia (propozycje):**

- **Zaangażowanie użytkowników:**
  - Liczba aktywnych użytkowników dziennie/miesięcznie (DAU/MAU).
  - Liczba rezerwacji na aktywnego użytkownika.
  - Średni czas spędzony w aplikacji.
  - Wskaźnik retencji użytkowników (np. po 1, 7, 30 dniach).
- **Wzrost i adopcja:**
  - Liczba pobrań aplikacji.
  - Liczba nowo zarejestrowanych użytkowników.
  - Tempo wzrostu bazy użytkowników.
- **Skuteczność podstawowej funkcji:**
  - Liczba pomyślnie dokonanych rezerwacji.
  - Odsetek rezerwacji odwołanych (może wskazywać na problemy z planowaniem użytkowników lub jakością obiektów).
- **Jakość i satysfakcja (pośrednio, przy braku systemu ocen):**
  - Oceny aplikacji w sklepach (App Store, Google Play).
  - Liczba zgłoszeń problemów/błędów (zwłaszcza dotyczących danych o boiskach).
  - Feedback zbierany poprzez opcjonalne ankiety w aplikacji.
- **(Krytyczny wskaźnik ryzyka) Jakość danych:**
  - Liczba zgłoszeń od użytkowników dotyczących nieaktualnych/błędnych informacji o boiskach lub ich dostępności. Wysoka liczba będzie sygnałem alarmowym.

</prd_planning_summary>

<unresolved_issues>

1.  **KRYTYCZNE: Zarządzanie danymi o boiskach i ich kalendarzach:** Pierwotny opis projektu zakładał centralne zarządzanie danymi przez zespół projektowy. Obecna decyzja, że zespół "jedynie pomaga w zarządzaniu danymi", "nie odpowiada za boiska i ich kalendarz dostępności" oraz że "nie będzie aktualizacji danych" jest fundamentalnie sprzeczna z podstawowym założeniem aplikacji i stanowi ogromne ryzyko dla jej użyteczności i sukcesu. **Należy pilnie wyjaśnić:**
    - Kto jest odpowiedzialny za wprowadzanie i utrzymywanie aktualności danych o boiskach (nazwy, adresy, typy, zdjęcia, nawierzchnie)?
    - Kto jest odpowiedzialny za wprowadzanie i utrzymywanie aktualności kalendarzy dostępności poszczególnych boisk?
    - Jak często i w jaki sposób te dane będą aktualizowane, aby zapewnić ich rzetelność?
    - Jak system ma odzwierciedlać tymczasową niedostępność boiska (np. remont, wydarzenie specjalne, złe warunki pogodowe)?
    - Bez wiarygodnych i aktualnych danych, główna propozycja wartości aplikacji (znalezienie i rezerwacja _dostępnego_ boiska) jest zagrożona.
2.  **Badania użytkowników i rynku:** Brak danych dotyczących skali problemu, liczby potencjalnych użytkowników oraz obecnych, nieformalnych sposobów rezerwacji boisk. Te informacje są kluczowe dla oceny potencjału rynkowego i dopracowania propozycji wartości.
3.  **UX Mapy i Wyszukiwania:** Decyzja o braku wyszukiwarki lokalizacji (tylko scroll) i wyszukiwarki boisk po nazwie/adresie (tylko filtr ikonami sportu) może znacząco utrudnić korzystanie z aplikacji, zwłaszcza przy ogólnopolskim zasięgu i dużej liczbie obiektów. Należy rozważyć wpływ tych ograniczeń na doświadczenie użytkownika.
4.  **Ryzyko "rezerwacji-widmo":** Brak limitu rezerwacji na użytkownika oraz możliwość odwołania rezerwacji do samego jej rozpoczęcia, przy jednoczesnym braku systemu kar/ocen, może prowadzić do blokowania terminów przez osoby, które się nie pojawią. Należy rozważyć mechanizmy mitygujące to ryzyko.
5.  **Domyślny obszar mapy:** Nie sprecyzowano, jaki będzie "predefiniowany obszar" mapy, jeśli użytkownik nie udostępni lokalizacji.

</unresolved_issues>
</conversation_summary>
