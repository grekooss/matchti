import React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import type { Marker, MapBounds } from '../../lib/types/map';

interface FallbackMapProps {
  markers: Marker[];
  onBoundsChange?: (bounds: MapBounds) => void;
  onMapStateChange?: (state: any) => void;
  onMarkerPress?: (marker: Marker) => void;
  initialState: {
    center: [number, number];
    zoom: number;
  };
}


const iconMap: { [key: string]: string } = {
  'tennisball-outline': 'tennis',
  'fitness-outline': 'fitness',
  'basketball-outline': 'basketball',
  'football-outline': 'american-football',
  'location-outline': 'location',
};

export default function FallbackMap({
  markers,
  onMarkerPress,
  initialState,
}: FallbackMapProps) {
  const handleMarkerPress = (marker: Marker) => {
    console.log('Marker pressed:', marker);
    onMarkerPress?.(marker);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="map-outline" size={24} color="white" />
        <Text style={styles.headerTitle}>Obiekty sportowe</Text>
        <Text style={styles.headerSubtitle}>Kraków · {markers.length} obiektów</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Dostępne obiekty</Text>
        
        {markers.length > 0 ? (
          markers.map((marker) => (
            <TouchableOpacity
              key={marker.id}
              style={styles.markerItem}
              onPress={() => handleMarkerPress(marker)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={iconMap[marker.icon] as any || 'location'} 
                  size={20} 
                  color="#069494" 
                />
              </View>
              <View style={styles.markerInfo}>
                <Text style={styles.markerTitle}>{marker.title}</Text>
                <Text style={styles.markerCoordinates}>
                  {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e0" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={48} color="#cbd5e0" />
            <Text style={styles.emptyStateText}>
              Brak dostępnych obiektów sportowych w okolicy
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#0D9488',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  markerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  markerInfo: {
    flex: 1,
  },
  markerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  markerCoordinates: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
});