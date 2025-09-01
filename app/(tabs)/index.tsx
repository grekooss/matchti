import "../../global.css";
import React, { useState } from "react";
import { View } from "react-native";
import FallbackMap from "@/components/maps/FallbackMap";
import type { Marker, MapBounds } from "@/lib/types/map";
 
// Przykładowe markery kortów tenisowych w Krakowie
const sampleMarkers: Marker[] = [
  {
    id: "1",
    position: [50.0647, 19.9450], // Kraków centrum
    title: "Kort tenisowy Rynek",
    icon: "tennisball-outline"
  },
  {
    id: "2", 
    position: [50.0755, 19.9171], // Błonia
    title: "Korty Błonia",
    icon: "tennisball-outline"
  },
  {
    id: "3",
    position: [50.0495, 19.9441], // Kazimierz
    title: "Klub tenisowy Kazimierz",
    icon: "tennisball-outline"
  }
];

export default function HomeScreen() {
  const [mapState, setMapState] = useState({
    center: [50.0647, 19.9450] as [number, number],
    zoom: 12
  });

  const handleBoundsChange = (bounds: MapBounds) => {
    console.log('Map bounds changed:', bounds);
    // Tu można dodać logikę ładowania markerów w nowych granicach
  };

  const handleMapStateChange = (state: any) => {
    setMapState(state);
    console.log('Map state changed:', state);
  };

  const handleMarkerPress = (marker: Marker) => {
    console.log('Marker pressed:', marker);
    // Tu można dodać logikę pokazywania szczegółów kortu
  };

  return (
    <View className="flex-1 bg-background">
      <FallbackMap
        markers={sampleMarkers}
        onBoundsChange={handleBoundsChange}
        onMapStateChange={handleMapStateChange}
        onMarkerPress={handleMarkerPress}
        initialState={mapState}
      />
    </View>
  );
}