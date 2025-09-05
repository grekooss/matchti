import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { useFacilitiesQuery } from '../react-query/useFacilitiesQuery';
import { useBottomSheetStore } from '../zustand/bottomSheetStore';
import type { FacilityListItemDto } from '../types/api';
import type { Marker, MapBounds } from '../types/map';

export interface UseMapFacilitiesOptions {
  /** Domyślny limit obiektów na zapytanie */
  limit?: number;
  /** ID sportu do filtrowania */
  sportId?: number;
  /** Czy zapytanie jest włączone */
  enabled?: boolean;
}

/**
 * Hook do zarządzania pobieraniem i konwersją obiektów sportowych na markery mapy
 * Zaimplementowany dokładnie tak jak w OLD - bez loading spinnerów i z debouncing
 */
export const useMapFacilities = (options: UseMapFacilitiesOptions = {}) => {
  const { limit = 20, sportId, enabled = true } = options;
  
  // Globalny stan popup z bottomSheetStore
  const { isPopupOpen, setPopupOpen } = useBottomSheetStore();
  
  // Stan aktualnych granic mapy
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  
  // Stan wybranego obiektu (dla popup)
  const [selectedFacility, setSelectedFacility] = useState<FacilityListItemDto | null>(null);
  
  // Stan mapy zapisany przed otwarciem popup
  const [savedMapState, setSavedMapState] = useState<{
    center: [number, number];
    zoom: number;
  } | null>(null);

  // Cache aktualnego stanu mapy
  const currentMapState = useRef<{
    center: [number, number];
    zoom: number;
  }>({
    center: [51.0926374, 17.031611], // Domyślny Wrocław
    zoom: 14
  });
  
  // Debounce timeout ref
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Cache dla facilities - utrzymuj dane między odświeżeniami
  const [facilities, setFacilities] = useState<FacilityListItemDto[]>([]);
  const prevSportId = useRef(sportId);
  
  // Hook do pobierania danych z API - dokładnie jak w OLD
  const facilitiesQuery = useFacilitiesQuery(
    { 
      limit,
      offset: 0,
      ...(sportId && { sportId })
    },
    mapBounds ? {
      north: mapBounds.north,
      south: mapBounds.south,
      east: mapBounds.east,
      west: mapBounds.west
    } : undefined,
    { enabled: enabled && mapBounds !== null && !!sportId } // PRZYWRÓCONE Z OLD: zapytanie aktywne tylko gdy wybrano kategorię!
  );

  // Efekt do obsługi zmiany sportId - resetuj facilities przy zmianie kategorii
  useEffect(() => {
    if (prevSportId.current !== sportId) {
      console.log('Zmiana kategorii sportowej:', prevSportId.current, '->', sportId);
      setFacilities([]);
      prevSportId.current = sportId;
    }
  }, [sportId]);

  // Aktualizuj facilities gdy przychodzą nowe dane - ale nie resetuj przy każdym fetch
  useEffect(() => {
    console.log('🔍 useEffect triggered for facilitiesQuery.data:', {
      hasData: !!facilitiesQuery.data,
      isLoading: facilitiesQuery.isLoading,
      isFetching: facilitiesQuery.isFetching,
      isError: facilitiesQuery.isError,
      error: facilitiesQuery.error?.message
    });

    if (facilitiesQuery.data) {
      const newFacilities = facilitiesQuery.data.pages.flatMap(page => page.items);
      
      // Sprawdź czy faktycznie się zmieniły - porównaj ID i liczby
      const oldIds = facilities.map(f => f.id).sort().join(',');
      const newIds = newFacilities.map(f => f.id).sort().join(',');
      const hasChanged = facilities.length !== newFacilities.length || oldIds !== newIds;

      if (hasChanged) {
        console.log('✅ Facilities have changed. Old:', facilities.length, 'New:', newFacilities.length);
        console.log('📊 Old IDs:', oldIds.substring(0, 100) + (oldIds.length > 100 ? '...' : ''));
        console.log('📊 New IDs:', newIds.substring(0, 100) + (newIds.length > 100 ? '...' : ''));
        setFacilities(newFacilities);
      } else {
        console.log('❌ Facilities data unchanged - same IDs and count');
      }
    } else if (facilitiesQuery.isError) {
      console.error('🚨 facilitiesQuery error:', facilitiesQuery.error?.message);
    } else if (!facilitiesQuery.isLoading && !facilitiesQuery.isFetching) {
      console.log('⚠️ No data but not loading - might be disabled query');
    }
  }, [facilitiesQuery.data, facilities, facilitiesQuery.isLoading, facilitiesQuery.isFetching, facilitiesQuery.isError, facilitiesQuery.error]);

  /**
   * Konwertuje obiekt sportowy z API na marker mapy
   */
  const facilityToMarker = useCallback((facility: FacilityListItemDto): Marker => {
    console.log('Converting facility to marker:', {
      id: facility.id,
      name: facility.name,
      location: facility.location,
      coordinates: facility.location?.coordinates
    });
    
    // Walidacja i ekstrakcja współrzędnych
    if (!facility.location || !facility.location.coordinates || !Array.isArray(facility.location.coordinates) || facility.location.coordinates.length !== 2) {
      console.error('Invalid location data for facility:', facility.id, facility.location);
      // Fallback do współrzędnych Wrocławia
      const [longitude, latitude] = [17.031611, 51.0926374];
      return {
        id: facility.id,
        position: [latitude, longitude],
        title: facility.name || facility.place_name || 'Obiekt sportowy',
        icon: 'fitness-outline',
        wayPoints: undefined
      };
    }
    
    const [longitude, latitude] = facility.location.coordinates;
    
    // Dodatkowa walidacja współrzędnych
    if (typeof longitude !== 'number' || typeof latitude !== 'number' || 
        isNaN(longitude) || isNaN(latitude) ||
        longitude < -180 || longitude > 180 || 
        latitude < -90 || latitude > 90) {
      console.error('Invalid coordinates for facility:', facility.id, { longitude, latitude });
      // Fallback do współrzędnych Wrocławia
      const fallbackLon = 17.031611;
      const fallbackLat = 51.0926374;
      return {
        id: facility.id,
        position: [fallbackLat, fallbackLon],
        title: facility.name || facility.place_name || 'Obiekt sportowy',
        icon: 'fitness-outline',
        wayPoints: undefined
      };
    }
    
    console.log('Valid coordinates found:', { longitude, latitude, position: [latitude, longitude] });
    
    // Konwersja polygon z GeoJSON na format dla mapy (jeśli istnieje)
    let wayPoints: [number, number][] | undefined;
    if (facility.way && facility.way.coordinates && facility.way.coordinates[0] && facility.way.coordinates[0][0]) {
      // GeoJSON używa [longitude, latitude], mapa używa [latitude, longitude]
      wayPoints = facility.way.coordinates[0][0].map(coord => [coord[1], coord[0]] as [number, number]);
    }

    // Określenie ikony na podstawie dostępnych sportów
    const getIconName = (): string => {
      if (!facility.supported_sports || facility.supported_sports.length === 0) {
        return 'fitness-outline';
      }
      
      const sport = facility.supported_sports[0];
      const sportName = sport.name.toLowerCase();
      
      // Mapowanie nazw sportów na ikony Ionicons
      const iconMap: Record<string, string> = {
        'basketball': 'basketball-outline',
        'soccer': 'football-outline',
        'football': 'football-outline',
        'tennis': 'tennisball-outline',
        'volleyball': 'fitness-outline',
        'futsal': 'football-outline',
        'handball': 'hand-right-outline',
        'table tennis': 'tennisball-outline',
        'table_tennis': 'tennisball-outline',
        'badminton': 'tennisball-outline',
        'swimming': 'water-outline',
        'gym': 'barbell-outline',
        'fitness': 'barbell-outline',
      };
      
      return iconMap[sportName] || 'fitness-outline';
    };

    return {
      id: facility.id,
      position: [latitude, longitude],
      title: facility.name || facility.place_name || 'Obiekt sportowy',
      icon: getIconName(),
      wayPoints
    };
  }, []);

  // Konwersja wszystkich obiektów na markery - PRZYWRÓCONE Z OLD: tylko gdy wybrano kategorię
  const markers = useMemo(() => {
    // Gdy sportId jest undefined/null, nie pokazujemy żadnych markerów - jak w OLD
    if (!sportId) {
      return []; // Pusta tablica gdy nie wybrano kategorii
    }
    
    return facilities.map(facilityToMarker);
  }, [facilities, facilityToMarker, sportId]);

  // Callback dla zmiany granic mapy z debouncing - dokładnie jak w OLD
  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    console.log('🔄 handleBoundsChange called with bounds:', bounds);
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
      console.log('⏰ Clearing previous debounce timeout');
    }

    debounceTimeout.current = setTimeout(() => {
      console.log('--- New Map Bounds (debounced) ---', JSON.stringify(bounds, null, 2));

      // Aktualizuj granice tylko jeśli faktycznie się zmieniły
      if (
        !mapBounds ||
        bounds.north !== mapBounds.north ||
        bounds.south !== mapBounds.south ||
        bounds.east !== mapBounds.east ||
        bounds.west !== mapBounds.west
      ) {
        console.log('✅ Aktualizacja granic mapy - pobieranie nowych danych');
        console.log('📊 Previous bounds:', mapBounds);
        console.log('📊 New bounds:', bounds);
        setMapBounds(bounds);
      } else {
        console.log('❌ Granice się nie zmieniły, pomijam aktualizację');
      }
    }, 500); // 500ms opóźnienia jak w OLD
  }, [mapBounds]);

  // Callback dla kliknięcia w marker
  const handleMarkerPress = useCallback((marker: Marker) => {
    // Znajdź obiekt odpowiadający markerowi w cache facilities
    const facility = facilities.find(f => f.id === marker.id);
    
    if (facility) {
      console.log('🎯 Kliknięto w marker obiektu:', facility.name);
      
      // Zapisz aktualny stan mapy przed otwarciem popup
      setSavedMapState({
        center: currentMapState.current.center,
        zoom: currentMapState.current.zoom,
      });
      
      console.log('🔄 Setting popup open to TRUE');
      // Ustaw globalny stan popup
      setPopupOpen(true);
      setSelectedFacility(facility);
    }
  }, [facilities, setPopupOpen]);

  // Callback dla zamknięcia popup
  const handleClosePopup = useCallback(() => {
    console.log('❌ Closing popup - setting popup open to FALSE');
    setSelectedFacility(null);
    // Wyczyść zapisany stan - przywracanie zostanie obsłużone przez komponent Map
    setSavedMapState(null);
    // Ustaw globalny stan popup
    setPopupOpen(false);
  }, [setPopupOpen]);

  // Callback dla zmiany stanu mapy (zoom, center)
  const handleMapStateChange = useCallback((state: {
    zoom: number;
    center: { lat: number; lng: number };
  }) => {
    // Aktualizuj cache stanu mapy
    currentMapState.current = {
      center: [state.center.lat, state.center.lng],
      zoom: state.zoom,
    };
  }, []);

  return {
    // Dane - ukryj stan loading/fetching żeby nie pokazywać spinnerów
    markers,
    selectedFacility,
    mapBounds,
    facilities,
    savedMapState,
    isPopupOpen, // Globalny stan popup
    
    // Stan zapytania - tylko błędy, bez loading states
    isError: facilitiesQuery.isError,
    error: facilitiesQuery.error,
    
    // Funkcje
    handleBoundsChange,
    handleMarkerPress,
    handleClosePopup,
    handleMapStateChange,
    
    // Funkcje do zarządzania danymi
    refetch: facilitiesQuery.refetch,
    fetchNextPage: facilitiesQuery.fetchNextPage,
    hasNextPage: facilitiesQuery.hasNextPage,
    
    // Expose query state for debugging if needed
    _queryState: {
      isLoading: facilitiesQuery.isLoading,
      isFetching: facilitiesQuery.isFetching,
      isFetchingNextPage: facilitiesQuery.isFetchingNextPage,
    }
  };
};