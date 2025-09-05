import BottomSheet from '@gorhom/bottom-sheet';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Text, View } from 'react-native';
import { useFacilitiesQuery } from '../../lib/react-query/useFacilitiesQuery';
import type { FacilityListItemDto, GeoJsonPolygon } from '../../lib/types/api';
import type { MapBounds, Marker } from '../../lib/types/map';
import { useCategoryStore } from '../../lib/zustand/categoryStore';
import { useBottomSheetStore } from '../../lib/zustand/bottomSheetStore';
import Map from './Map';
import FacilityPopup from './FacilityPopup';

const INITIAL_CENTER: [number, number] = [51.0926374, 17.031611]; // Wrocław

interface MapControllerProps {
  onFacilitiesChange?: (
    facilities: FacilityListItemDto[],
    totalCount?: number
  ) => void;
}

// Interfejs dla metod eksportowanych przez referencję
interface MapControllerHandle {
  loadMoreFacilities: () => void;
}

const MapController = forwardRef<MapControllerHandle, MapControllerProps>(
  ({ onFacilitiesChange }, ref) => {
    const { activeCategory } = useCategoryStore();
    const { setSheetRef, setPopupOpen, isBottomSheetExpanded } = useBottomSheetStore();
    const [currentMapBounds, setCurrentMapBounds] = useState<
      MapBounds | undefined
    >(undefined);
    // Przechowujemy referencję do funkcji fetchNextPage, aby można było ją wywołać z zewnątrz
    const fetchNextPageRef = useRef<(() => void) | null>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    useEffect(() => {
      console.log('MapController: ustawiam referencję BottomSheet w store', !!bottomSheetRef);
      setSheetRef(bottomSheetRef);
    }, [setSheetRef]);

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // Ten useEffect został usunięty, ponieważ powyżej jest już identyczny

    // Stan wybranego obiektu do popupu
    const [selectedFacility, setSelectedFacility] = useState<FacilityListItemDto | null>(null);
    
    // Stan mapy zapisany przed otwarciem popup
    const [savedMapState, setSavedMapState] = useState<{
      center: [number, number];
      zoom: number;
    } | null>(null);

    // Mechanizm cache'owania danych mapy
    const mapStateCache = useRef<{
      bounds: MapBounds | null;
      markers: Marker[];
      zoom: number;
      center: [number, number];
      category: string | undefined;
    }>({
      bounds: null,
      markers: [],
      zoom: 13,
      center: INITIAL_CENTER,
      category: undefined,
    });

    // Pobieranie danych obiektów sportowych
    const {
      data,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      status,
      isFetching,
    } = useFacilitiesQuery(
      activeCategory ? { sportId: activeCategory, limit: 20 } : { limit: 20 },
      currentMapBounds,
      // Zapytanie jest aktywne tylko, gdy mamy granice mapy i wybraną (truthy) kategorię
      { enabled: !!currentMapBounds && !!activeCategory }
    );

    console.log('--- useFacilitiesQuery State ---');
    console.log('Status:', status); // Teraz status będzie zdefiniowany
    console.log('IsFetching:', isFetching); // Teraz isFetching będzie zdefiniowane
    console.log('IsFetchingNextPage:', isFetchingNextPage);
    console.log('HasNextPage:', hasNextPage);
    console.log('Error:', error);
    // console.log('IsPreviousData:', isPreviousData); // isPreviousData jest częścią wyniku, a nie destrukturyzowane bezpośrednio

    // Łączenie wszystkich stron danych w jedną tablicę obiektów
    const [facilities, setFacilities] = useState<FacilityListItemDto[]>([]);
    const prevActiveCategory = useRef(activeCategory);

    // Zapisujemy referencję do fetchNextPage, aby można było ją wywołać z zewnątrz
    useEffect(() => {
      fetchNextPageRef.current = hasNextPage ? fetchNextPage : null;
    }, [fetchNextPage, hasNextPage]);

    // Efekt do obsługi zmiany kategorii - uruchamiany tylko gdy zmienia się activeCategory
    useEffect(() => {
      if (prevActiveCategory.current !== activeCategory) {
        console.log(
          'Zmiana kategorii:',
          prevActiveCategory.current,
          '->',
          activeCategory
        );
        setFacilities([]);
        prevActiveCategory.current = activeCategory;
      }
    }, [activeCategory]);

    // Oddzielny efekt do aktualizacji danych - uruchamiany tylko gdy zmieniają się dane
    useEffect(() => {
      console.log('--- Effect: Processing data from useFacilitiesQuery ---');
      console.log(
        'Data object from query:',
        data ? 'Exists' : 'null/undefined'
      );
      // Sprawdzenie isPreviousData - jest to część obiektu zwracanego przez useInfiniteQuery, nie destrukturyzowane
      // const queryResult = useFacilitiesQuery(...); // aby uzyskać dostęp do isPreviousData, musielibyśmy nie destrukturyzować wyniku od razu
      // console.log('IsPreviousData (in effect):', queryResult.isPreviousData);

      // Aktualizujemy dane tylko jeśli faktycznie przyszły z zapytania
      if (data) {
        const newFacilities = data.pages.flatMap((page) => page.items);
        console.log(
          'Data pages:',
          JSON.stringify(
            data.pages.map((p) => ({
              itemsCount: p.items.length,
              totalCount: p.totalCount,
              offset: p.offset,
            })),
            null,
            2
          )
        );
        console.log('New facilities count:', newFacilities.length);

        // Unikamy niepotrzebnych aktualizacji stanu
        // Porównanie głębsze może być potrzebne, jeśli kolejność lub zawartość może się nie zmieniać, a tylko referencja
        const hasChanged =
          facilities.length !== newFacilities.length ||
          JSON.stringify(facilities.map((f) => f.id).sort()) !==
            JSON.stringify(newFacilities.map((f) => f.id).sort());

        if (hasChanged) {
          console.log(
            'Facilities have changed. Old count:',
            facilities.length,
            'New count:',
            newFacilities.length
          );
          console.log(
            'Aktualizacja danych - nowa liczba obiektów:',
            newFacilities.length
          );
          setFacilities(newFacilities);

          if (onFacilitiesChange) {
            // Przekazujemy również całkowitą liczbę obiektów
            const totalCount = data.pages[0]?.total || 0;
            onFacilitiesChange(newFacilities, totalCount);

            // Logowanie informacji o paginacji
            console.log('--- Pagination Info ---');
            console.log('Total pages:', data.pages.length);
          }
        }
      }
    }, [data, onFacilitiesChange, facilities]); // Naprawiono lint warning - facilities zamiast facilities.length

    // Przywracanie stanu mapy z cache przy pierwszym renderowaniu
    // Używamy useRef do śledzenia, czy efekt został już wykonany dla danej kategorii
    const initialMapStateRestored = useRef<{ [key: string]: boolean }>({});

    useEffect(() => {
      // Sprawdzamy, czy już przywracaliśmy stan dla tej kategorii
      const categoryKey = activeCategory || 'default';

      // Jeśli już przywracaliśmy stan dla tej kategorii, nie rób tego ponownie
      if (initialMapStateRestored.current[categoryKey]) {
        return;
      }

      // Jeśli mamy zapisane granice mapy w cache, użyjmy ich
      if (
        mapStateCache.current.bounds &&
        mapStateCache.current.category === activeCategory
      ) {
        console.log(
          'Przywracanie granic mapy z cache dla kategorii:',
          categoryKey
        );
        setCurrentMapBounds(mapStateCache.current.bounds);
      } else if (!currentMapBounds) {
        // Jeśli nie mamy granic w cache ani ustawionych granic, ustawmy domyślne
        console.log(
          'Ustawianie domyślnych granic mapy dla kategorii:',
          categoryKey
        );
        // Tutaj można ustawić domyślne granice mapy, jeśli potrzeba
      }

      // Oznaczamy, że przywracanie stanu dla tej kategorii zostało wykonane
      initialMapStateRestored.current[categoryKey] = true;
    }, [activeCategory, currentMapBounds]);

    // Obsługa zmiany granic mapy z debouncingiem
    const handleBoundsChange = (bounds: MapBounds) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        console.log(
          '--- New Map Bounds (debounced) ---',
          JSON.stringify(bounds, null, 2)
        );

        // Zapisujemy granice mapy do cache
        mapStateCache.current.bounds = bounds;

        // Aktualizujemy stan granic mapy tylko jeśli faktycznie się zmieniły
        if (
          !currentMapBounds ||
          bounds.north !== currentMapBounds.north ||
          bounds.south !== currentMapBounds.south ||
          bounds.east !== currentMapBounds.east ||
          bounds.west !== currentMapBounds.west
        ) {
          console.log('Aktualizacja granic mapy - pobieranie nowych danych');
          setCurrentMapBounds(bounds);
        }
      }, 500); // 500ms opóźnienia
    };

    const handleMarkerPress = (marker: Marker) => {
      const facility = facilities.find((f) => f.id === marker.id);
      if (facility) {
        console.log('🎯 Kliknięto w marker obiektu:', facility.name);
        
        // Save current map state before opening popup
        setSavedMapState({
          center: mapStateCache.current.center,
          zoom: mapStateCache.current.zoom,
        });
        
        console.log('🔄 Setting popup open to TRUE');
        // Update global popup state
        setPopupOpen(true);
        setSelectedFacility(facility);
        if (bottomSheetRef.current) {
          bottomSheetRef.current.close();
        }
      }
    };

    // Function to handle popup close and restore map state
    const handlePopupClose = () => {
      console.log('❌ Closing popup - setting popup open to FALSE');
      setSelectedFacility(null);
      // Clear saved state - restoration will be handled by Map component
      setSavedMapState(null);
      // Update global popup state
      setPopupOpen(false);
    };

    // Funkcja do konwersji GeoJsonPolygon na tablicę punktów [number, number][]
    const parsePolygonPoints = (
      polygon: GeoJsonPolygon | null
    ): [number, number][] => {
      // The data comes in a MultiPolygon-like format, so we need to access the first polygon's first ring.
      if (
        !polygon ||
        !polygon.coordinates ||
        !polygon.coordinates[0] ||
        !polygon.coordinates[0][0]
      ) {
        return [];
      }

      // Get the exterior ring from the first polygon in the set.
      const ring = polygon.coordinates[0][0];

      // In GeoJSON, points are [longitude, latitude]. Leaflet needs [latitude, longitude].
      return ring.map((point) => [point[1], point[0]] as [number, number]);
    };

    // Mapowanie FacilityListItemDto na Marker
    // Gdy activeCategory jest undefined, nie pokazujemy żadnych markerów
    const markers: Marker[] =
      activeCategory === undefined
        ? [] // Pusta tablica gdy nie wybrano kategorii
        : facilities.map((facility: FacilityListItemDto) => {
            console.log(
              `[Controller DEBUG] Facility ${facility.id} has way data:`,
              JSON.stringify(facility.way)
            );
            const wayPoints = parsePolygonPoints(facility.way);
            if (wayPoints.length > 0) {
              console.log(
                `[Controller DEBUG] Parsed wayPoints for ${facility.id}:`,
                wayPoints
              );
            }

            const marker: Marker = {
              id: facility.id,
              position: [
                facility.location.coordinates[1],
                facility.location.coordinates[0],
              ] as [number, number],
              title: facility.name,
              icon: 'location-outline',
              wayPoints: wayPoints,
            };
            return marker;
          });

    // Obsługa zmiany stanu mapy (zoom, center)
    const handleMapStateChange = (state: {
      zoom: number;
      center: { lat: number; lng: number };
    }) => {
      console.log('--- Map State Changed ---', state);

      // Zapisujemy nowy stan mapy w cache
      mapStateCache.current = {
        ...mapStateCache.current,
        zoom: state.zoom,
        center: [state.center.lat, state.center.lng] as [number, number],
      };
    };

    // Eksportujemy metody przez referencję - musi być przed warunkami
    // Funkcja do ładowania kolejnej strony danych
    function loadMoreFacilities() {
      if (hasNextPage && !isFetchingNextPage && fetchNextPageRef.current) {
        console.log('Wczytywanie kolejnej strony danych...');
        fetchNextPageRef.current();
      }
    }

    useImperativeHandle(ref, () => ({
      loadMoreFacilities,
    }));

    if (error) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>
            Wystąpił błąd podczas ładowania obiektów: {error.message}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Map
          markers={markers}
          onBoundsChange={handleBoundsChange}
          onMapStateChange={handleMapStateChange}
          onMarkerPress={handleMarkerPress}
          initialState={{
            center: INITIAL_CENTER,
            zoom: 14,
          }}
          isPopupOpen={!!selectedFacility || isBottomSheetExpanded}
          restoreMapState={savedMapState}
        />

        {selectedFacility && (
          <FacilityPopup
            facility={selectedFacility}
            onClose={handlePopupClose}
          />
        )}
      </View>
    );

  }

);

// Dodajemy displayName dla komponentu
MapController.displayName = 'MapController';

export default MapController;
