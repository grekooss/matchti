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
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FacilityListItemDto } from '../lib/types/api';
import { Marker } from '../lib/types/map';
import PopupMap from './maps/PopupMap';

// Sport icons imports (reuse from FacilityPopup)
import BasketballIcon from '../assets/icons/categories/basketball.svg';
import SoccerIcon from '../assets/icons/categories/soccer.svg';
import TennisIcon from '../assets/icons/categories/tennis.svg';
import VolleyballIcon from '../assets/icons/categories/volleyball.svg';
import FutsalIcon from '../assets/icons/categories/futsal.svg';
import HandballIcon from '../assets/icons/categories/handball.svg';
import PadelIcon from '../assets/icons/categories/padel.svg';
import TableTennisIcon from '../assets/icons/categories/table_tennis.svg';
import BadmintonIcon from '../assets/icons/categories/badminton.svg';
import SquashIcon from '../assets/icons/categories/squash.svg';
import BeachVolleyballIcon from '../assets/icons/categories/beach_volleyball.svg';
import BeachSoccerIcon from '../assets/icons/categories/beachsoccer.svg';
import StreetballIcon from '../assets/icons/categories/streetball.svg';
import PannaIcon from '../assets/icons/categories/panna.svg';
import TeqballIcon from '../assets/icons/categories/teqball.svg';
import SimpleSquareIcon from '../assets/icons/categories/simple_square.svg';

// Wyłączenie ostrzeżeń Reanimated dla tego komponentu
console.disableYellowBox = true;

// Constants
const MAP_ZOOM_LEVEL = 17;
const MAX_SPORT_ICONS = 4;

// Sport icons map - mapping sport names to their icons
const sportIconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  basketball: BasketballIcon,
  soccer: SoccerIcon,
  'football': SoccerIcon,
  tennis: TennisIcon,
  volleyball: VolleyballIcon,
  futsal: FutsalIcon,
  handball: HandballIcon,
  padel: PadelIcon,
  'table tennis': TableTennisIcon,
  'table_tennis': TableTennisIcon,
  badminton: BadmintonIcon,
  squash: SquashIcon,
  'beach volleyball': BeachVolleyballIcon,
  'beach_volleyball': BeachVolleyballIcon,
  'beach soccer': BeachSoccerIcon,
  'beach_soccer': BeachSoccerIcon,
  beachsoccer: BeachSoccerIcon,
  streetball: StreetballIcon,
  panna: PannaIcon,
  teqball: TeqballIcon,
};

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
  const [headerHeight, setHeaderHeight] = useState(65); // Domyślna wysokość, można dostosować

  // Definiujemy punkty zatrzymania: pierwszy na wysokość nagłówka, drugi na 100%
  const snapPoints = useMemo(() => [headerHeight, '100%'], [headerHeight]);

  // Callback do mierzenia wysokości nagłówka i ustawiania punktu zatrzymania
  const handleHeaderLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      const measuredHeight = event.nativeEvent.layout.height;
      const handleAreaHeight = 22;
      // Ustawiamy punkt zatrzymania na wysokość nagłówka + wysokość uchwytu
      setHeaderHeight(measuredHeight + handleAreaHeight);
    },
    []
  );

  // Używamy -1 jako indeks początkowy zamiast warunku w JSX
  const [sheetIndex, setSheetIndex] = useState(-1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { setSheetRef, setPopupOpen } = useBottomSheetStore();

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

    // Używamy setTimeout, aby uniknąć konfliktów renderowania w bibliotece bottom-sheet
    const timer = setTimeout(() => {
      if (shouldShow) {
        // Jeśli markery są widoczne i mamy obiekty, wysuń bottom sheet na pozycję początkową.
        // To się uruchomi tylko przy pierwszym pokazaniu, a nie przy paginacji.
        setSheetIndex(0);
        bottomSheetRef.current?.snapToIndex(0);
      } else {
        // Całkowicie ukryj arkusz, jeśli nie ma obiektów lub markery są niewidoczne
        setSheetIndex(-1);
        bottomSheetRef.current?.close();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [visible, hasFacilities]); // Reagujemy tylko na zmianę widoczności i faktu posiadania obiektów

  // Bezpieczna funkcja do zmiany indeksu arkusza - nie używa wartości Reanimated w fazie renderowania
  const handleSheetChanges = useCallback((index: number) => {
    console.log('FacilityBottomSheet: handleSheetChanges', index);
    setSheetIndex(index);
    
    // Update popup state - when bottom sheet is expanded (index > 0), block category selection
    const isExpanded = index > 0;
    setPopupOpen(isExpanded);
    console.log('🏪 BottomSheet: Setting popup state to:', isExpanded);
  }, [setPopupOpen]);

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

  const getSportIcons = (sports: any[]) => {
    return sports
      .slice(0, MAX_SPORT_ICONS)
      .map(sport => {
        const sportKey = sport.name.toLowerCase().replace(/\s+/g, '_');
        const IconComponent = sportIconMap[sportKey] || sportIconMap[sport.name.toLowerCase()] || SimpleSquareIcon;
        return {
          id: sport.id,
          name: sport.name,
          IconComponent
        };
      });
  };

  // Create mixed data with ads every third item
  const mixedData = useMemo(() => {
    const result: Array<FacilityListItemDto | { type: 'ad'; id: string }> = [];
    
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
    const sportIcons = getSportIcons(facility.supported_sports || []);

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
        style={styles.itemContainer} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Map on the left */}
        <View style={styles.mapSection}>
          <PopupMap marker={marker} center={[latitude, longitude]} zoom={MAP_ZOOM_LEVEL} />
        </View>
        
        {/* Info on the right */}
        <View style={styles.infoSection}>
          <Text style={styles.itemTitle}>{displayName}</Text>
          <Text style={styles.itemAddress}>{formattedAddress}</Text>
          
          {facility.surface_type && (
            <Text style={styles.surfaceType}>{facility.surface_type}</Text>
          )}
          
          {/* Sport icons */}
          {sportIcons.length > 0 && (
            <View style={styles.sportIconsContainer}>
              {sportIcons.map((sport) => (
                <View key={sport.id} style={styles.sportIconWrapper}>
                  <sport.IconComponent width={16} height={16} fill="#374151" />
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
      index={sheetIndex} // -1 oznacza ukryty, 0 to pierwszy punkt (25%)
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      // Jeśli są markery, nie pozwalamy na zamknięcie bottom sheet
      enablePanDownToClose={!visible || facilities.length === 0}
      handleStyle={{
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}
      style={{
        zIndex: 1,
      }}
      backgroundStyle={{
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}
    >
      <View
        onLayout={handleHeaderLayout}
        className="border-b border-gray-200 bg-white px-4 pb-4"
      >
        <Text className="text-center text-lg font-semibold">
          Found objects:{' '}
          {totalCount !== undefined ? totalCount : facilities.length}
        </Text>
      </View>
      <BottomSheetFlatList
        data={mixedData}
        renderItem={renderItem}
        keyExtractor={(item) => 'type' in item ? item.id : item.id}
        showsVerticalScrollIndicator
        contentContainerStyle={{ backgroundColor: 'white', paddingBottom: 20 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <View className="items-center py-4">
              <Text className="mb-2 text-gray-500">
                Loading more objects...
              </Text>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          ) : facilities.length < (totalCount || 0) ? (
            <View className="items-center py-4">
              <Text className="text-gray-500">Scroll down to load more</Text>
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
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 12,
    gap: 12,
  },
  mapSection: {
    width: 120,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  infoSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  surfaceType: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 6,
  },
  sportIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  sportIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  adContainer: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  adText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default FacilityBottomSheet;
