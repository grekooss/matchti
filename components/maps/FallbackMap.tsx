import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#069494',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f7fafc',
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
    color: '#2d3748',
  },
  markerCoords: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginTop: 16,
  },
});

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
        <Text style={styles.headerText}>Obiekty sportowe</Text>
        <Text style={styles.subtitle}>Kraków · {markers.length} obiektów</Text>
      </View>
      
      <ScrollView style={styles.listContainer}>
        <Text style={styles.listTitle}>Dostępne obiekty</Text>
        
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
                <Text style={styles.markerCoords}>
                  {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e0" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={48} color="#cbd5e0" />
            <Text style={styles.emptyText}>
              Brak dostępnych obiektów sportowych w okolicy
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}