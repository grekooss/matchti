# Schemat Bazy Danych PostgreSQL dla Aplikacji "Mecz" (MVP)

## 1. Lista Tabel

### Extensions

Wymagane jest włączenie następujących rozszerzeń PostgreSQL:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS btree_gist;
```

### ENUM Types

Zaktualizowany `surface_type_enum` na podstawie listy distinct wartości OSM.

```sql
-- Typy nawierzchni obiektów - Zaktualizowany na podstawie distinct values z OSM
CREATE TYPE surface_type_enum AS ENUM (
  -- Trawy
  'GRASS_NATURAL',       -- grass, naturalna, murawa, trawa_syntetyczna (błędny tag?), grass_field
  'GRASS_ARTIFICIAL',    -- artificial_turf, sztuczna_trawa*, imitation_grass, artificial, artificial_surface, syntetyczna
  'GRASS_HYBRID',        -- hybryda
  -- Nawierzchnie ziemne/mineralne
  'CLAY',                -- clay, ceglana, Ziegelmehl, kreda?, gruntowy? (specyficzny dla kortów)
  'SAND',                -- sand, piasek, dirt/sand, grass_and_sand, paving_stones;sand
  'GRAVEL',              -- gravel, fine_gravel, slag, pebblestone
  'DIRT_EARTH',          -- dirt, earth, ground, compacted, unpaved, gruntowy?
  -- Nawierzchnie twarde / utwardzone
  'ASPHALT',             -- asphalt
  'CONCRETE',            -- concrete, concrete:*
  'PAVING_STONES',       -- paving_stones, sett, soft_cobble?
  -- Nawierzchnie syntetyczne/sztuczne (inne niż trawa)
  'SYNTHETIC_RUBBER',    -- tartan, polyurethane, rubber, epdm, conipur*, GUMOWA_NAWIERZCHNIA*, synthetic
  'ACRYLIC_PLASTIC',     -- acrylic, plastic*, hardcourt, decoturf, polipropylen
  -- Nawierzchnie wewnętrzne / specjalne
  'HARDWOOD',            -- wood, parkiet
  'CARPET',              -- carpet, needle
  'ICE',                 -- ice
  'WATER',               -- water
  'METAL',               -- metal
  'WOODCHIPS',           -- woodchips
  -- Inne / Nieznane
  'OTHER'                -- Fallback dla: nieznanych, mieszanych (np. 'grass;dirt'), opisowych (np. 'Boisko...'), błędów ('t'), 'specjalna', 'paved' (zbyt ogólne) itp.
);

-- Statusy rezerwacji (Bez zmian)
CREATE TYPE reservation_status_enum AS ENUM (
  'CONFIRMED', 'CANCELLED'
);
```

### Trigger Functions

```sql
-- Trigger do automatycznej aktualizacji kolumny updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger do obliczania środka (location) z geometrii WKB Hex w kolumnie 'way'
CREATE OR REPLACE FUNCTION trigger_facilities_calculate_location_from_way()
RETURNS TRIGGER AS $$
DECLARE
    geom geometry; -- Zmienna do przechowywania skonwertowanej geometrii
BEGIN
    -- Oblicz location (punkt środkowy) tylko jeśli 'way' zawiera tekst (hex WKB) i nie jest NULL
    IF NEW.way_geometry IS NOT NULL AND NEW.way_geometry <> '' THEN
        BEGIN
            -- Spróbuj skonwertować Hex WKB z kolumny 'way' na typ geometry (zakładamy SRID 4326)
            -- decode() konwertuje hex string na bytea, ST_GeomFromWKB() oczekuje bytea
            geom := ST_SetSRID(ST_GeomFromWKB(decode(NEW.way_geometry, 'hex')), 4326);

            -- Sprawdź, czy konwersja się udała i czy geometria jest prawidłowa
            IF geom IS NOT NULL AND ST_IsValid(geom) THEN
                -- Oblicz location jako centroid i skonwertuj na geography
                 NEW.location = ST_Centroid(geom)::geography;
            END IF;
        EXCEPTION
            -- Obsługa błędów konwersji WKB lub obliczeń PostGIS
            WHEN others THEN
                RAISE WARNING 'Could not process WKB geometry to calculate location for facility ID %: %', NEW.id, SQLERRM;
                -- Jeśli location jest NOT NULL, brak jego ustawienia spowoduje błąd INSERT/UPDATE
        END;
    END IF;
    -- Jeśli 'way' jest NULL lub pusty, zakładamy, że 'location' zostało podane bezpośrednio.
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

### `sports`

```sql
CREATE TABLE sports (
  id SERIAL PRIMARY KEY,
  -- Klucz obcy wskazujący na sport nadrzędny (dla podkategorii)
  parent_sport_id INTEGER NULL REFERENCES sports(id) ON DELETE SET NULL, -- Ustawiamy NULL jeśli rodzic zostanie usunięty
  name TEXT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Unikalność nazwy w ramach tej samej kategorii nadrzędnej (lub globalnie dla kategorii głównych)
  UNIQUE (parent_sport_id, name)
);

-- Opcjonalny indeks dla szybszego wyszukiwania sportów podrzędnych
CREATE INDEX idx_sports_parent_sport_id ON sports (parent_sport_id);

COMMENT ON COLUMN sports.parent_sport_id IS 'Reference to the parent sport category, NULL for top-level sports.';

CREATE TRIGGER set_sports_updated_at BEFORE UPDATE ON sports FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

### `facilities`

```sql
CREATE TABLE facilities (
  -- Nasz wewnętrzny identyfikator
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Identyfikator z OpenStreetMap
  osm_id BIGINT UNIQUE NULL,
  -- Podstawowe informacje
  name TEXT NULL, -- Zezwalamy na NULL, choć niezalecane
  -- Lokalizacja jako punkt środkowy (obliczany lub podawany)
  location geometry(Point, 4326) NOT NULL,
  -- Opcjonalna, dokładna geometria obiektu (np. poligon z OSM)
  way_geometry geometry(Geometry, 4326) NULL,
  -- Nawierzchnia (mapowana z OSM 'surface' na nasz ENUM)
  surface_type surface_type_enum NOT NULL, -- Zakładamy, że zawsze można określić lub ustawić 'OTHER'
  -- Przydatne tagi adresowe
  addr_city TEXT NULL,
  addr_housenumber TEXT NULL,


  addr_street TEXT NULL,
  -- Kluczowe tagi klasyfikacyjne OSM
  amenity TEXT NULL, -- np. 'school', 'community_centre' (czasem obok boiska)
  building TEXT NULL, -- np. 'sports_hall', 'school'
  landuse TEXT NULL, -- np. 'recreation_ground'
  leisure TEXT NULL, -- np. 'pitch', 'sports_centre', 'stadium', 'playground'
  sport TEXT NULL, -- Ważne! Lista sportów z OSM (np. 'soccer;basketball')
  -- Inne przydatne tagi
  operator TEXT NULL,
  website TEXT NULL,
  phone TEXT NULL,
  opening_hours TEXT NULL,
  fee TEXT NULL, -- np. 'yes'/'no'/'interval'
  lit TEXT NULL, -- np. 'yes'/'no'
  access TEXT NULL, -- np. 'private'/'permissive'/'yes'
  description TEXT NULL,
  source TEXT NULL, -- Źródło danych OSM
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger dla updated_at
CREATE TRIGGER set_facilities_updated_at
BEFORE UPDATE ON facilities
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Trigger do obliczania location z kolumny 'way' (WKB Hex)
CREATE TRIGGER trigger_facilities_calculate_location
BEFORE INSERT OR UPDATE ON facilities
FOR EACH ROW
EXECUTE FUNCTION trigger_facilities_calculate_location_from_way();

-- Komentarze do kolumn
COMMENT ON COLUMN facilities.osm_id IS 'OpenStreetMap ID, if available and applicable.';
COMMENT ON COLUMN facilities.name IS 'Name of the facility, if available in OSM.';
COMMENT ON COLUMN facilities.location IS 'Center point location (Point Geometry, SRID 4326). Automatically calculated from WKB Hex in "way" column if possible, otherwise must be specified directly.';
COMMENT ON COLUMN facilities.way_geometry IS 'Original geometry representation from source (expected as WKB Hex string, SRID 4326).';
COMMENT ON COLUMN facilities.surface_type IS 'Mapped surface type based on OSM surface tag or other sources. Defaults to OTHER if mapping fails.';
COMMENT ON COLUMN facilities.sport IS 'Raw sport tag value(s) from OSM (e.g., "soccer;basketball"), used for mapping to facility_sports.';
COMMENT ON COLUMN facilities.opening_hours IS 'Raw opening hours tag value from OSM.';
COMMENT ON COLUMN facilities.fee IS 'Fee information tag value from OSM (e.g., yes/no).';
COMMENT ON COLUMN facilities.lit IS 'Lighting information tag value from OSM (e.g., yes/no).';
COMMENT ON COLUMN facilities.access IS 'Access restriction tag value from OSM.';
```

### `facility_sports`

Tabela łącząca obiekty z _naszymi_ zdefiniowanymi typami sportów.

```sql
CREATE TABLE facility_sports (
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  sport_id INTEGER NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  PRIMARY KEY (facility_id, sport_id)
);
COMMENT ON TABLE facility_sports IS 'Associates specific sport types defined in the "sports" table with facilities. Populated based on mapping the "facilities.sport" tag.';
```

### `facility_photos`

Przechowuje informacje o zdjęciach powiązanych z obiektami.

```sql
CREATE TABLE facility_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `reservations`

Zaktualizowany klucz obcy do `facilities`.

```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT, -- Zmieniono z field_id
  sport_id INTEGER NOT NULL REFERENCES sports(id) ON DELETE RESTRICT,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status reservation_status_enum NOT NULL DEFAULT 'CONFIRMED',
  invitation_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_time_order CHECK (end_time > start_time),
  CONSTRAINT check_booking_horizon CHECK (start_time <= (now() + interval '1 month')),
  CONSTRAINT prevent_overlapping_reservations EXCLUDE USING gist (facility_id WITH =, tsrange(start_time, end_time) WITH &&) WHERE (status = 'CONFIRMED') -- Zmieniono z field_id
);
CREATE TRIGGER set_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

### `reservation_participants`

(Bez zmian strukturalnych, ale powiązane z rezerwacjami dla `facilities`)

```sql
CREATE TABLE reservation_participants (
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (reservation_id, user_id)
);
```

### `push_tokens`

(Bez zmian)

```sql
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  device_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER set_push_tokens_updated_at BEFORE UPDATE ON push_tokens FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

## 2. Relacje Między Tabelami

- `profiles` (1) -- (1) `auth.users`
- `facilities` (1) -- (M) `facility_sports` (M) -- (1) `sports`
- `facilities` (1) -- (M) `facility_photos`
- `facilities` (1) -- (M) `reservations`
- `sports` (1) -- (M) `reservations`
- `auth.users` (organizer) (1) -- (M) `reservations`
- `reservations` (1) -- (M) `reservation_participants` (M) -- (1) `auth.users` (participants)
- `auth.users` (1) -- (M) `push_tokens`

## 3. Indeksy

Zaktualizowano nazwy indeksów dla tabeli `facilities`.

```sql
-- Klucze obce
CREATE INDEX IF NOT EXISTS idx_facility_sports_facility_id ON facility_sports(facility_id); -- Zmieniono nazwę
CREATE INDEX IF NOT EXISTS idx_facility_sports_sport_id ON facility_sports(sport_id); -- Zmieniono nazwę
CREATE INDEX IF NOT EXISTS idx_facility_photos_facility_id ON facility_photos(facility_id); -- Zmieniono nazwę
CREATE INDEX IF NOT EXISTS idx_reservations_facility_id ON reservations(facility_id); -- Zmieniono nazwę
CREATE INDEX IF NOT EXISTS idx_reservations_sport_id ON reservations(sport_id);
CREATE INDEX IF NOT EXISTS idx_reservations_organizer_id ON reservations(organizer_id);
CREATE INDEX IF NOT EXISTS idx_reservation_participants_reservation_id ON reservation_participants(reservation_id);
CREATE INDEX IF NOT EXISTS idx_reservation_participants_user_id ON reservation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_tokens(user_id);

-- Indeks dla OSM ID
-- UNIQUE constraint na osm_id tworzy indeks automatycznie

-- Indeks przestrzenny dla punktu środkowego (kluczowy)
CREATE INDEX IF NOT EXISTS idx_facilities_location ON facilities USING GIST (location); -- Zmieniono nazwę

-- Indeks dla kolumny 'way' (WKB Hex) - zwykły B-tree.
CREATE INDEX IF NOT EXISTS idx_facilities_way_geometry ON facilities (way_geometry); -- Zmieniono nazwę

-- Indeks dla rezerwacji (czas + obiekt)
CREATE INDEX IF NOT EXISTS idx_reservations_facility_time ON reservations (facility_id, start_time, end_time); -- Zmieniono nazwę

-- Indeks dla sortowania zdjęć
CREATE INDEX IF NOT EXISTS idx_facility_photos_sort_order ON facility_photos (facility_id, sort_order); -- Zmieniono nazwę

-- Indeks dla tokenu zaproszenia (tworzony przez UNIQUE)
-- Indeksy dla często filtrowanych kolumn tekstowych w facilities (jeśli potrzebne)
CREATE INDEX IF NOT EXISTS idx_facilities_leisure ON facilities (leisure);
CREATE INDEX IF NOT EXISTS idx_facilities_sport ON facilities (sport); -- Mimo że mapujemy, może być przydatny do inspekcji
CREATE INDEX IF NOT EXISTS idx_facilities_addr_city ON facilities (addr_city);

```

## 4. Zasady PostgreSQL (Row Level Security - RLS)

Zaktualizowano nazwy polityk i tabel.

```sql
-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles - Allow individual read access" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles - Allow individual update access" ON profiles FOR UPDATE USING (auth.uid() = id);

-- sports
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sports - Allow public read access" ON sports FOR SELECT USING (true);

-- facilities
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Facilities - Allow public read access" ON facilities FOR SELECT USING (true);
CREATE POLICY "Facilities - Allow admin modification" ON facilities FOR ALL USING (false) WITH CHECK (false); -- Do dostosowania!

-- facility_sports
ALTER TABLE facility_sports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FacilitySports - Allow public read access" ON facility_sports FOR SELECT USING (true);
CREATE POLICY "FacilitySports - Allow admin modification" ON facility_sports FOR ALL USING (false) WITH CHECK (false); -- Do dostosowania!

-- facility_photos
ALTER TABLE facility_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FacilityPhotos - Allow public read access" ON facility_photos FOR SELECT USING (true);
CREATE POLICY "FacilityPhotos - Allow admin modification" ON facility_photos FOR ALL USING (false) WITH CHECK (false); -- Do dostosowania!

-- reservations
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reservations - Allow organizer and participants read access" ON reservations FOR SELECT USING (auth.uid() = organizer_id OR EXISTS (SELECT 1 FROM reservation_participants rp WHERE rp.reservation_id = reservations.id AND rp.user_id = auth.uid()));
CREATE POLICY "Reservations - Allow organizer insert access" ON reservations FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = organizer_id);
CREATE POLICY "Reservations - Allow organizer update access (cancel)" ON reservations FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Reservations - Disallow direct delete" ON reservations FOR DELETE USING (false);

-- reservation_participants
ALTER TABLE reservation_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ReservationParticipants - Allow participants view" ON reservation_participants FOR SELECT USING (EXISTS (SELECT 1 FROM reservation_participants rp_inner WHERE rp_inner.reservation_id = reservation_participants.reservation_id AND rp_inner.user_id = auth.uid()));
CREATE POLICY "ReservationParticipants - Allow self join" ON reservation_participants FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "ReservationParticipants - Allow self leave or organizer remove" ON reservation_participants FOR DELETE USING ((auth.uid() = user_id) OR (EXISTS (SELECT 1 FROM reservations r WHERE r.id = reservation_participants.reservation_id AND r.organizer_id = auth.uid())));

-- push_tokens
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "PushTokens - Allow individual access" ON push_tokens FOR ALL USING (auth.uid() = user_id);
```

## 5. Dodatkowe Uwagi

- **Tabela `facilities`:** Główna tabela została przemianowana i dostosowana do wybranych, relewantnych kolumn z danych OSM pokazanych na screenach.
- **Geometria WKB Hex:** Trigger `trigger_facilities_calculate_location_from_way` został poprawiony, aby obsługiwać format WKB Hex z kolumny `way` (wymaga funkcji `decode` i `ST_GeomFromWKB`).
- **Mapowanie Danych:** Kluczowe będzie mapowanie wartości z kolumn OSM (np. `surface`, `sport`) na nasze wewnętrzne struktury (`surface_type` ENUM, relacja `facility_sports`) podczas procesu importu danych do tabeli `facilities`. Trigger oblicza tylko `location`.
- **Nazewnictwo:** Wszystkie powiązane obiekty (tabele, indeksy, triggery, polityki) zostały zaktualizowane, aby używać nazwy `facilities`.
- **RLS dla Zarządzania:** Polityki RLS dla `facilities`, `facility_sports`, `facility_photos` zakładają obecnie, że modyfikacje są wykonywane przez rolę administracyjną. Jeśli użytkownicy mają dodawać/edytować obiekty, te polityki będą wymagały znaczącej zmiany.
- **Nadal Nierozwiązane:** Szczegóły implementacji RLS dla zarządzania obiektami przez użytkowników, widoczność profili między użytkownikami, pełna walidacja logiki biznesowej rezerwacji.
