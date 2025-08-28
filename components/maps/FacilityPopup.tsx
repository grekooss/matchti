import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import type { FacilityListItemDto, GeoJsonPolygon } from '../../lib/types/api';
import type { Marker } from '../../lib/types/map';
import { useBottomSheetStore } from '../../lib/zustand/bottomSheetStore';
import PopupMap from './PopupMap';

// Sport icons imports
import BadmintonIcon from '../../assets/icons/categories/badminton.svg';
import BasketballIcon from '../../assets/icons/categories/basketball.svg';
import BeachVolleyballIcon from '../../assets/icons/categories/beach_volleyball.svg';
import BeachSoccerIcon from '../../assets/icons/categories/beachsoccer.svg';
import FutsalIcon from '../../assets/icons/categories/futsal.svg';
import HandballIcon from '../../assets/icons/categories/handball.svg';
import PadelIcon from '../../assets/icons/categories/padel.svg';
import PannaIcon from '../../assets/icons/categories/panna.svg';
import SimpleSquareIcon from '../../assets/icons/categories/simple_square.svg';
import SoccerIcon from '../../assets/icons/categories/soccer.svg';
import SquashIcon from '../../assets/icons/categories/squash.svg';
import StreetballIcon from '../../assets/icons/categories/streetball.svg';
import TableTennisIcon from '../../assets/icons/categories/table_tennis.svg';
import TennisIcon from '../../assets/icons/categories/tennis.svg';
import TeqballIcon from '../../assets/icons/categories/teqball.svg';
import VolleyballIcon from '../../assets/icons/categories/volleyball.svg';

interface FacilityPopupProps {
  facility: FacilityListItemDto;
  onClose: () => void;
}

// Constants
const POPUP_CLOSE_DELAY = 300; // Delay before expanding bottom sheet after popup closes
const MAP_ZOOM_LEVEL = 18;
const MAX_SPORT_ICONS = 8; // Maximum number of sport icons to show

// Sport icons map - mapping sport names to their icons
const sportIconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  basketball: BasketballIcon,
  soccer: SoccerIcon,
  'football': SoccerIcon, // Alternative name for soccer
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

const FacilityPopup = ({ facility, onClose }: FacilityPopupProps) => {
  // Get expandSheet and collapseSheet functions to manage BottomSheet
  const { expandSheet, collapseSheet } = useBottomSheetStore();
  
  // State for map type pager (0: satellite, 1: carto, 2: standard)
  const [currentPage, setCurrentPage] = useState(0);
  
  // Map type options - satelita jako pierwsza
  const mapTypes: ('satellite' | 'carto' | 'standard')[] = ['satellite', 'carto', 'standard'];

  // Effect to collapse BottomSheet when popup appears
  useEffect(() => {
    // Single collapse call with minimal delay to ensure UI state is ready
    const timer = setTimeout(() => {
      try {
        collapseSheet();
      } catch (error) {
        __DEV__ && console.warn('FacilityPopup: Failed to collapse bottom sheet:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [collapseSheet]);
  // Helper to format facility address
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

  // Helper to convert GeoJSON polygon to [lat,lng][]
  const parsePolygonPoints = (
    polygon: GeoJsonPolygon | null,
  ): [number, number][] => {
    if (
      !polygon ||
      !polygon.coordinates ||
      !polygon.coordinates[0] ||
      !polygon.coordinates[0][0]
    ) {
      return [];
    }
    const ring = polygon.coordinates[0][0];
    return ring.map((pt) => [pt[1], pt[0]] as [number, number]);
  };

  const wayPoints = parsePolygonPoints(facility.way);
  const latitude = facility.location.coordinates[1];
  const longitude = facility.location.coordinates[0];
  const formattedAddress = formatAddress(facility.addr_street, facility.addr_city);
  
  // Use place_name from facility_google if name is null or empty
  // TODO: Add place_name to database and API when facility_google table is created
  const displayName = facility.name || facility.place_name || 'Obiekt sportowy';

  // Get sport icons for this facility
  const getSportIcons = () => {
    const sports = facility.supported_sports || [];
    return sports
      .slice(0, MAX_SPORT_ICONS) // Limit to MAX_SPORT_ICONS
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

  const sportIcons = getSportIcons();

  // Memoize marker object to prevent unnecessary re-renders
  const marker: Marker = useMemo(() => ({
    id: facility.id,
    position: [latitude, longitude],
    title: displayName,
    wayPoints: wayPoints,
    icon: 'location-outline',
  }), [facility.id, latitude, longitude, displayName, wayPoints]);

  const handlePress = () => {
    router.push({
      pathname: `/facility/${facility.id}` as any,
      params: { facilityData: JSON.stringify(facility) }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.touchable}>
        <View style={styles.card}>
          <View style={styles.mapContainer}>
            <PagerView 
              style={styles.pagerView}
              initialPage={0}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
              {mapTypes.map((mapType, index) => (
                <View key={index} style={styles.page} pointerEvents="none">
                  <PopupMap 
                    marker={marker} 
                    center={[latitude, longitude]} 
                    zoom={MAP_ZOOM_LEVEL} 
                    mapType={mapType}
                  />
                </View>
              ))}
            </PagerView>
            
            {/* Dot indicators - centered */}
            <View style={styles.dotContainer}>
              {mapTypes.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentPage === index && styles.activeDot
                  ]}
                />
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.closeButton}
              pointerEvents="auto"
              onPress={(e) => {
                e.stopPropagation();
                // Close popup and re-expand BottomSheet after delay
                onClose();
                
                // Use setTimeout to allow popup to close before expanding BottomSheet
                // This prevents UI state conflicts between popup and bottom sheet
                setTimeout(() => {
                  try {
                    expandSheet();
                  } catch (error) {
                    // Fallback: If expandSheet fails, continue without expanding
                    // This ensures the popup still closes properly
                    __DEV__ && console.warn('Failed to expand bottom sheet after popup close:', error);
                  }
                }, POPUP_CLOSE_DELAY);
              }}
            >
              <View style={styles.closeButtonInner}>
                <MaterialCommunityIcons name="close" size={20} color="black" />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.infoContainer}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.title}>{displayName}</Text>
              <Text style={styles.address}>{formattedAddress}</Text>
              {facility.surface_type && (
                <View style={styles.surfaceContainer}>
                  <Text style={styles.surfaceTitle}>{facility.surface_type}</Text>
                </View>
              )}
              
              {/* Sport icons */}
              {sportIcons.length > 0 && (
                <View style={styles.sportsSection}>
                  <View style={styles.sportIconsRow}>
                    {sportIcons.map((sport) => (
                      <View key={sport.id} style={styles.sportIconItem}>
                        <sport.IconComponent width={20} height={20} fill="#374151" />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  touchable: {
    width: '90%',
    maxWidth: 400,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 12,
    left: '50%',
    transform: [{ translateX: -24 }], // Half of container width to center
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#C474F6',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sportsSection: {
    marginTop: 8,
    paddingTop: 8,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sportIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sportIconItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  closeButtonInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
  },
  infoContainer: {
    padding: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#6b7280',
  },
  surfaceContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  surfaceTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
});

export default FacilityPopup;
