import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';
import type { FacilityListItemDto, GeoJsonPolygon } from '../../lib/types/api';
import type { Marker } from '../../lib/types/map';
import PopupMap from '../../components/maps/PopupMap';

// Import centralnego systemu zarządzania ikonami sportów
import { getSportIcons } from '../../lib/constants/sportIcons';

// Constants
const MAP_ZOOM_LEVEL = 17;
const MAX_SPORT_ICONS = 4;


// Parse facility data from navigation params
const parseFacilityData = (facilityDataString: string): FacilityListItemDto | null => {
  try {
    return JSON.parse(facilityDataString) as FacilityListItemDto;
  } catch (error) {
    console.error('Error parsing facility data:', error);
    return null;
  }
};

// Map types for slider (same as FacilityPopup)
const mapTypes: ('satellite' | 'carto' | 'standard')[] = ['satellite', 'carto', 'standard'];

const FacilityDetailPage = () => {
  const { facilityData } = useLocalSearchParams<{ id: string; facilityData: string }>();
  const [facility, setFacility] = useState<FacilityListItemDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const loadFacility = () => {
      if (facilityData) {
        try {
          const parsedFacility = parseFacilityData(facilityData);
          setFacility(parsedFacility);
        } catch (error) {
          console.error('Error parsing facility data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error('No facility data provided');
        setLoading(false);
      }
    };

    loadFacility();
  }, [facilityData]);

  // Helper functions (same as FacilityPopup)
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

  const parsePolygonPoints = (polygon: GeoJsonPolygon | null): [number, number][] => {
    if (!polygon || !polygon.coordinates || !polygon.coordinates[0] || !polygon.coordinates[0][0]) {
      return [];
    }
    const ring = polygon.coordinates[0][0];
    return ring.map((pt) => [pt[1], pt[0]] as [number, number]);
  };

  // Funkcja pomocnicza do pobierania ikon sportów (wykorzystuje centralny system)
  const getFacilitySportIcons = (sports: any[]) => {
    return getSportIcons(sports, MAX_SPORT_ICONS);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#069494" />
        <Text style={styles.loadingText}>Ładowanie obiektu...</Text>
      </View>
    );
  }

  if (!facility) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Błąd podczas ładowania danych obiektu</Text>
        <TouchableOpacity style={styles.errorBackButton} onPress={() => router.back()}>
          <Text style={styles.errorBackButtonText}>Powrót</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const latitude = facility.location.coordinates[1];
  const longitude = facility.location.coordinates[0];
  const formattedAddress = formatAddress(facility.addr_street, facility.addr_city);
  const displayName = facility.name || facility.place_name || 'Obiekt sportowy';
  const wayPoints = parsePolygonPoints(facility.way);
  const sportIcons = getFacilitySportIcons(facility.supported_sports || []);

  const marker: Marker = {
    id: facility.id,
    position: [latitude, longitude],
    title: displayName,
    wayPoints: wayPoints,
    icon: 'location-outline',
  };


  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Slider */}
        <View style={styles.mapSliderContainer}>
          {/* Back Button - Left Top */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <View style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </View>
          </TouchableOpacity>
          
          {/* Action Buttons - Right Top */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // TODO: Implement share functionality
                console.log('Share pressed');
              }}
              activeOpacity={0.7}
            >
              <View style={styles.iconButton}>
                <Ionicons name="share-outline" size={22} color="black" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // TODO: Implement favorite functionality
                console.log('Favorite pressed');
              }}
              activeOpacity={0.7}
            >
              <View style={styles.iconButton}>
                <Ionicons name="heart-outline" size={22} color="black" />
              </View>
            </TouchableOpacity>
          </View>
          
          <PagerView 
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
          >
            {mapTypes.map((mapType, index) => (
              <View key={index} style={styles.page}>
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
        </View>

        {/* Facility Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{displayName}</Text>
          <Text style={styles.address}>{formattedAddress}</Text>

          {facility.surface_type && (
            <View style={styles.surfaceContainer}>
              <Text style={styles.surfaceLabel}>Powierzchnia:</Text>
              <Text style={styles.surfaceValue}>{facility.surface_type}</Text>
            </View>
          )}

          {/* Sport icons */}
          {sportIcons.length > 0 && (
            <View style={styles.sportsSection}>
              <Text style={styles.sportsTitle}>Dostępne sporty:</Text>
              <View style={styles.sportIconsRow}>
                {sportIcons.map((sport) => (
                  <View key={sport.id} style={styles.sportIconItem}>
                    <sport.IconComponent 
                      width={24} 
                      height={24} 
                      stroke="#374151" 
                      color="#374151"
                    />
                    <Text style={styles.sportName}>{sport.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorBackButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorBackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  mapSliderContainer: {
    height: 400,
    position: 'relative',
    marginTop: 0,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 12,
    zIndex: 10,
  },
  actionButtons: {
    position: 'absolute',
    top: 60,
    right: 12,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  actionButton: {
    // No specific styles needed, inherits from iconButton
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    transform: [{ translateX: -24 }],
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
    backgroundColor: '#069494',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  surfaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  surfaceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  surfaceValue: {
    fontSize: 14,
    color: '#374151',
  },
  sportsSection: {
    marginBottom: 24,
  },
  sportsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sportIconsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  sportIconItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  sportName: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default FacilityDetailPage;