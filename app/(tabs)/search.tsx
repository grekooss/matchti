import BottomSheet from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ExploreHeader from '../../components/ExploreHeader';
import FacilityBottomSheet from '../../components/FacilityBottomSheet';
import MapController from '../../components/maps/MapController';
// Dane będą dostarczane przez MapController
import type { FacilityListItemDto } from '../../lib/types/api';
import type { Marker } from '../../lib/types/map';
import { useCategoryStore } from '../../lib/zustand/categoryStore';

// Centrum mapy jest ustawiane w komponencie MapController

const IndexScreen = () => {
  const { activeCategory } = useCategoryStore();
  // Granice mapy są zarządzane przez MapController
  const mapControllerRef = useRef<{ loadMoreFacilities?: () => void }>({});
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Cache stanu mapy przeniesiony do komponentu MapController

  // Dane będą dostarczane przez MapController

  // Łączenie wszystkich stron danych w jedną tablicę obiektów
  // Stan do przechowywania obiektów, aby nie znikały podczas odświeżania
  const [persistentFacilities, setPersistentFacilities] = useState<
    FacilityListItemDto[]
  >([]);
  // Poprzednia kategoria nie jest już potrzebna

  // Efekt nie jest już potrzebny, dane będą aktualizowane przez callback

  const allFacilities = persistentFacilities;

  // Obliczanie całkowitej liczby obiektów
  const [totalCount, setTotalCount] = useState(0);

  // Mapowanie FacilityListItemDto na Marker
  // Gdy activeCategory jest undefined, nie pokazujemy żadnych markerów
  const markers: Marker[] =
    activeCategory === undefined
      ? [] // Pusta tablica gdy nie wybrano kategorii
      : allFacilities.map((facility: FacilityListItemDto) => ({
          id: facility.id,
          position: [facility.location.coordinates[1], facility.location.coordinates[0]], // [lat, lng]
          title: facility.name,
          icon: 'location-outline', // Dodanie domyślnej ikony
        }));

  // Logowanie przetworzonych markerów
  console.log('--- Processed Markers ---');
  console.log('markers count:', markers.length);
  console.log('allFacilities count:', allFacilities.length);
  console.log('totalCount:', totalCount);

  // Przywracanie stanu mapy z cache zostało przeniesione do komponentu MapController

  // Obsługa zmiany granic mapy przeniesiona do MapController

  // Obsługa zmiany stanu mapy przeniesiona do MapController

  // Obsługa błędów przeniesiona do MapController

  // Sprawdzamy, czy mamy markery do wyświetlenia i czy kategoria jest zdefiniowana
  const hasMarkers = markers.length > 0;
  const shouldShowBottomSheet = hasMarkers && !!activeCategory;
  console.log('🔍 Search screen state:', { hasMarkers, activeCategory, shouldShowBottomSheet, facilitiesCount: allFacilities.length });

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <View style={styles.mapContainer}>
          <MapController
            ref={(ref) => {
              if (ref) {
                // Zapisujemy referencję do metod MapController
                mapControllerRef.current = ref;
              }
            }}
            onFacilitiesChange={(facilities, total) => {
              // Aktualizujemy listę obiektów w state
              setPersistentFacilities(facilities);
              // Aktualizujemy całkowitą liczbę obiektów
              if (total !== undefined) {
                setTotalCount(total);
              }
            }}
          />
        </View>

        {/* Header z kategoriami nałożony na mapę */}
        <ExploreHeader />

        {/* Bottom sheet z obiektami - wysuwa się, gdy są markery */}
        <FacilityBottomSheet
          ref={bottomSheetRef}
          facilities={allFacilities}
          visible={shouldShowBottomSheet}
          totalCount={totalCount}
          onEndReached={() => {
            // Wywołujemy ładowanie kolejnej strony z MapController
            if (mapControllerRef.current.loadMoreFacilities) {
              console.log('Wczytywanie kolejnej strony...');
              mapControllerRef.current.loadMoreFacilities();
            }
          }}
          isFetchingMore={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // Padding dla reklamy Google jest już uwzględniony w _layout.tsx
  },
  mapWrapper: {
    position: 'relative',
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default IndexScreen;
