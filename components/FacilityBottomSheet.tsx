import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useBottomSheetStore } from '../lib/zustand/bottomSheetStore';
import { useExploreHeaderHeight } from '../hooks/useExploreHeaderHeight';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FacilityListItemDto } from '../lib/types/api';
import { Marker } from '../lib/types/map';
import PopupMap from './maps/PopupMap';

// Import centralnego systemu zarządzania ikonami sportów
import { getSportIcons } from '../lib/constants/sportIcons';

// Wyłączenie ostrzeżeń Reanimated dla tego komponentu
console.disableYellowBox = true;

// Constants
const MAP_ZOOM_LEVEL = 17;
const MAX_SPORT_ICONS = 4;


interface FacilityBottomSheetProps {
  facilities: FacilityListItemDto[];
  visible: boolean; // Czy markery są widoczne
  totalCount?: number; // Całkowita liczba znalezionych obiektów
  onEndReached?: () => void; // Funkcja wywoływana przy przewinięciu do końca listy
  isFetchingMore?: boolean; // Czy trwa ładowanie kolejnych obiektów
}

const FacilityBottomSheetComponent: ForwardRefRenderFunction<
  BottomSheet,
  FacilityBottomSheetProps
> = (
  { facilities, visible, totalCount, onEndReached, isFetchingMore = false },
  ref
) => {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const { getExploreHeaderHeightWithBuffer } = useExploreHeaderHeight();
  
  // Oblicz wysokość navigation bar (tak samo jak w _layout.tsx)
  const navigationBarHeight = Platform.OS === 'ios' ? 60 + insets.bottom : 70;
  
  // Stała wysokość nad navigation bar (np. 65px)
  const heightAboveNavBar = 118;
  const firstSnapPoint = navigationBarHeight + heightAboveNavBar;

  // Dynamiczne wyliczenie miejsca dla ExploreHeader za pomocą dedykowanego hooka
  const headerSpaceAtTop = getExploreHeaderHeightWithBuffer(); // Używa domyślnej wartości (50px) z hooka
  const secondSnapPoint = screenHeight - headerSpaceAtTop;

  // Definiujemy punkty zatrzymania: pierwszy na stałą wysokość nad navigation bar, drugi zostawia miejsce dla header
  const snapPoints = useMemo(() => [firstSnapPoint, secondSnapPoint], [firstSnapPoint, secondSnapPoint]);
  
  console.log('📏 BottomSheet dimensions:', {
    screenHeight,
    navigationBarHeight,
    heightAboveNavBar,
    firstSnapPoint,
    headerSpaceAtTop,
    secondSnapPoint,
    snapPoints
  });

  // Już nie używamy dynamicznego mierzenia wysokości nagłówka

  // Używamy -1 jako indeks początkowy zamiast warunku w JSX
  const [sheetIndex, setSheetIndex] = useState(-1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { setSheetRef, setBottomSheetExpanded, setBottomSheetIndex } = useBottomSheetStore();

  // Zapisujemy referencję do globalnego store, aby można było sterować BottomSheet z innych komponentów
  useEffect(() => {
    console.log('FacilityBottomSheet: Zapisuję referencję do globalnego store');
    setSheetRef(bottomSheetRef);
  }, [setSheetRef]);

  // Efekt do zarządzania widocznością arkusza. Uruchamia się, gdy markery
  // stają się widoczne/niewidoczne lub gdy pojawią się pierwsze obiekty.
  const hasFacilities = facilities.length > 0;
  useEffect(() => {
    const shouldShow = visible && hasFacilities;
    console.log('🔄 FacilityBottomSheet useEffect:', { visible, hasFacilities, shouldShow, facilitiesLength: facilities.length });

    // Używamy setTimeout, aby uniknąć konfliktów renderowania w bibliotece bottom-sheet
    const timer = setTimeout(() => {
      if (shouldShow) {
        // Jeśli markery są widoczne i mamy obiekty, wysuń bottom sheet na pozycję początkową.
        // To się uruchomi tylko przy pierwszym pokazaniu, a nie przy paginacji.
        console.log('📤 FacilityBottomSheet: Wysuwam na index 0');
        setSheetIndex(0);
        bottomSheetRef.current?.snapToIndex(0);
      } else {
        // Całkowicie ukryj arkusz, jeśli nie ma obiektów lub markery są niewidoczne
        console.log('📥 FacilityBottomSheet: Ukrywam bottom sheet');
        setSheetIndex(-1);
        bottomSheetRef.current?.close();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [visible, hasFacilities]); // Reagujemy tylko na zmianę widoczności i faktu posiadania obiektów

  // Bezpieczna funkcja do zmiany indeksu arkusza - nie używa wartości Reanimated w fazie renderowania
  const handleSheetChanges = useCallback((index: number) => {
    console.log('🚀 FacilityBottomSheet: handleSheetChanges called with index:', index);
    setSheetIndex(index);
    setBottomSheetIndex(index); // Zapisz do globalnego store
    
    // Ustaw stan rozwinięcia - gdy index > 0, bottomsheet jest rozwinięty
    const isExpanded = index > 0;
    setBottomSheetExpanded(isExpanded);
    console.log('🚀 BottomSheet: Setting bottomSheetExpanded to:', isExpanded, 'index:', index);
  }, [setBottomSheetExpanded, setBottomSheetIndex]);

  // Helper functions (reused from FacilityPopup)
  const formatAddress = (street: string | null, city: string | null): string => {
    if (street && city) {
      return `${street}, ${city}`;
    } else if (street) {
      return street;
    } else if (city) {
      return city;
    }
    return 'Brak adresu';
  };

  // Funkcja pomocnicza do pobierania ikon sportów (wykorzystuje centralny system)
  const getFacilitySportIcons = (sports: any[]) => {
    return getSportIcons(sports, MAX_SPORT_ICONS);
  };

  // Create mixed data with ads every third item
  const mixedData = useMemo(() => {
    const result: (FacilityListItemDto | { type: 'ad'; id: string })[] = [];
    
    facilities.forEach((facility, index) => {
      result.push(facility);
      
      // Add ad after every third facility (indices 2, 5, 8, etc.)
      if ((index + 1) % 3 === 0) {
        result.push({
          type: 'ad',
          id: `ad-${index}`,
        });
      }
    });
    
    // If we have facilities but no ads were added (less than 3 facilities),
    // add an ad at the end
    if (facilities.length > 0 && facilities.length < 3) {
      result.push({
        type: 'ad',
        id: `ad-end`,
      });
    }
    
    return result;
  }, [facilities]);

  const renderItem = ({ item }: { item: FacilityListItemDto | { type: 'ad'; id: string } }) => {
    // Check if this is an ad item
    if ('type' in item && item.type === 'ad') {
      return (
        <View style={styles.adContainer}>
          <Text style={styles.adText}>📱 Tutaj będzie reklama Google</Text>
        </View>
      );
    }

    // Regular facility item
    const facility = item as FacilityListItemDto;
    const latitude = facility.location.coordinates[1];
    const longitude = facility.location.coordinates[0];
    const formattedAddress = formatAddress(facility.addr_street, facility.addr_city);
    const displayName = facility.name || facility.place_name || 'Obiekt sportowy';
    const sportIcons = getFacilitySportIcons(facility.supported_sports || []);

    const marker: Marker = {
      id: facility.id,
      position: [latitude, longitude],
      title: displayName,
      wayPoints: [], // No polygon for bottom sheet
      icon: 'location-outline',
    };

    const handlePress = () => {
      router.push({
        pathname: `/facility/${facility.id}` as any,
        params: { facilityData: JSON.stringify(facility) }
      });
    };

    return (
      <TouchableOpacity 
        style={styles.facilityItem}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Map on the left */}
        <View style={styles.mapContainer}>
          <PopupMap marker={marker} center={[latitude, longitude]} zoom={MAP_ZOOM_LEVEL} />
        </View>
        
        {/* Info on the right */}
        <View style={styles.infoContainer}>
          <Text style={styles.facilityName}>{displayName}</Text>
          <Text style={styles.facilityAddress}>{formattedAddress}</Text>
          
          {facility.surface_type && (
            <Text style={styles.surfaceType}>{facility.surface_type}</Text>
          )}
          
          {/* Sport icons */}
          {sportIcons.length > 0 && (
            <View style={styles.sportsContainer}>
              {sportIcons.map((sport) => (
                <View key={sport.id} style={styles.sportIconContainer}>
                  <sport.IconComponent 
                    width={16} 
                    height={16} 
                    stroke="#374151" 
                    color="#374151"
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  console.log('🎭 FacilityBottomSheet render:', { visible, hasFacilities, facilitiesLength: facilities.length, snapPoints });

  return (
    <BottomSheet
      ref={(sheet) => {
        // Przypisanie referencji zarówno do forwardRef, jak i do lokalnej referencji
        if (ref) {
          if (typeof ref === 'function') {
            ref(sheet);
          } else {
            ref.current = sheet;
          }
        }
        bottomSheetRef.current = sheet;
      }}
      // Używamy wartości ze stanu zamiast warunku w JSX
      index={visible && hasFacilities ? 0 : -1} // -1 oznacza ukryty, 0 to pierwszy punkt
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      // Jeśli są markery, nie pozwalamy na zamknięcie bottom sheet
      enablePanDownToClose={!visible || facilities.length === 0}
      keyboardBehavior="extend"
      android_keyboardInputMode="adjustResize"
      topInset={insets.top}
      handleStyle={{
        backgroundColor: '#069494', // primary color
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}
      handleIndicatorStyle={{
        backgroundColor: 'white',
        width: 60,
        height: 6,
      }}
      style={{
        zIndex: 1000, // Znacznie wyższy zIndex niż ExploreHeader (50), aby go zasłaniał
        elevation: 1000, // Na Android - wyższa niż ExploreHeader (8)
      }}
      backgroundStyle={{
        backgroundColor: '#069494', // primary color
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}
    >
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#069494',
          backgroundColor: '#069494',
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        <Text style={{
          textAlign: 'center',
          fontSize: 18,
          fontWeight: '600',
          color: '#ffffff',
        }}>
          Found objects:{' '}
          {totalCount !== undefined ? totalCount : facilities.length}
        </Text>
      </View>
      <BottomSheetFlatList
        data={mixedData}
        renderItem={renderItem}
        keyExtractor={(item) => 'type' in item ? item.id : item.id}
        showsVerticalScrollIndicator
        contentContainerStyle={{ backgroundColor: '#069494', paddingBottom: 20 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
              <Text style={{ 
                marginBottom: 8, 
                color: '#ffffff',
                fontSize: 14,
              }}>
                Loading more objects...
              </Text>
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
          ) : facilities.length < (totalCount || 0) ? (
            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
              <Text style={{ color: '#ffffff', fontSize: 14 }}>Scroll down to load more</Text>
            </View>
          ) : null
        }
      />
    </BottomSheet>
  );
};

FacilityBottomSheetComponent.displayName = 'FacilityBottomSheet';

const FacilityBottomSheet = forwardRef(FacilityBottomSheetComponent);

const styles = StyleSheet.create({
  adContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#069494',
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  adText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  facilityItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#069494',
    padding: 12,
    gap: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  mapContainer: {
    width: 120,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  facilityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  facilityAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  surfaceType: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 6,
  },
  sportsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  sportIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FacilityBottomSheet;
