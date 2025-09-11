import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import type { FacilityListItemDto, GeoJsonPolygon } from '../../lib/types/api';
import type { Marker } from '../../lib/types/map';
import { useBottomSheetStore } from '../../lib/zustand/bottomSheetStore';
import { useExploreHeaderHeight } from '../../hooks/useExploreHeaderHeight';
import PopupMap from './PopupMap';

// Import centralnego systemu zarządzania ikonami sportów
import { getSportIcons } from '../../lib/constants/sportIcons';

interface FacilityPopupProps {
  facility: FacilityListItemDto;
  onClose: () => void;
}

// Constants
const POPUP_CLOSE_DELAY = 300; // Delay before expanding bottom sheet after popup closes
const MAP_ZOOM_LEVEL = 18;
const MAX_SPORT_ICONS = 8; // Maximum number of sport icons to show


const FacilityPopup = ({ facility, onClose }: FacilityPopupProps) => {
  // Get expandSheet and collapseSheet functions to manage BottomSheet
  const { expandSheet, collapseSheet } = useBottomSheetStore();
  
  // Get dynamic popup position
  const { getPopupBottomPosition } = useExploreHeaderHeight();
  
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

  // Pobierz ikony sportów dla tego obiektu
  const sportIcons = getSportIcons(facility.supported_sports || [], MAX_SPORT_ICONS);

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

  // Dynamic bottom position
  const dynamicBottomPosition = getPopupBottomPosition(); // Używa domyślnej wartości (0px) z hooka
  
  return (
    <View style={[styles.container, { bottom: dynamicBottomPosition }]}>
      <View style={styles.popup}>
        <View style={styles.card}>
          <View style={styles.mapContainer}>
            <PagerView 
              style={styles.pager}
              initialPage={0}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
              {mapTypes.map((mapType, index) => (
                <View key={index} style={styles.mapPage} pointerEvents="none">
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
            <View style={styles.indicators}>
              {mapTypes.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentPage === index ? styles.activeDot : styles.inactiveDot
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
            style={styles.content}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <View style={styles.contentInner}>
              <Text style={styles.title}>{displayName}</Text>
              <Text style={styles.address}>{formattedAddress}</Text>
              {facility.surface_type && (
                <View style={styles.surfaceContainer}>
                  <Text style={styles.surfaceText}>{facility.surface_type}</Text>
                </View>
              )}
              
              {/* Sport icons */}
              {sportIcons.length > 0 && (
                <View style={styles.sportsContainer}>
                  <View style={styles.sportsIcons}>
                    {sportIcons.map((sport) => (
                      <View key={sport.id} style={styles.sportIcon}>
                        <sport.IconComponent 
                          width={20} 
                          height={20} 
                          stroke="#374151" 
                          color="#374151"
                        />
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
    // bottom pozycja jest teraz dynamiczna - ustawiona inline w komponencie
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popup: {
    width: '90%',
    maxWidth: 400,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  pager: {
    flex: 1,
  },
  mapPage: {
    flex: 1,
  },
  indicators: {
    position: 'absolute',
    bottom: 12,
    left: '50%',
    transform: [{ translateX: -24 }],
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#0F766E',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inactiveDot: {
    backgroundColor: '#D1D5DB',
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
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    padding: 12,
    paddingBottom: 8,
  },
  contentInner: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
  },
  surfaceContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  surfaceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  sportsContainer: {
    marginTop: 8,
    paddingTop: 8,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sportsIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sportIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FacilityPopup;
