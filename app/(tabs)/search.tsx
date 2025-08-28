import "../../global.css";
import React, { useState } from "react";
import { View } from "react-native";
import FallbackMap from "@/components/maps/FallbackMap";
import type { Marker, MapBounds } from "@/lib/types/map";

// Przykładowe markery obiektów sportowych w Krakowie
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
  },
  {
    id: "4",
    position: [50.0619, 19.9368], // Nowa Huta
    title: "Basen Kryty",
    icon: "fitness-outline"
  },
  {
    id: "5",
    position: [50.0501, 19.9441], // Podgórze
    title: "Hala Sportowa",
    icon: "basketball-outline"
  }
];

export default function SearchScreen() {
  const [mapState, setMapState] = useState({
    center: [50.0647, 19.9450] as [number, number],
    zoom: 12
  });

  const handleBoundsChange = (bounds: MapBounds) => {
    console.log('Map bounds changed:', bounds);
    // Tu można dodać logikę ładowania obiektów w nowych granicach
  };

  const handleMapStateChange = (state: any) => {
    setMapState(state);
    console.log('Map state changed:', state);
  };

  const handleMarkerPress = (marker: Marker) => {
    console.log('Marker pressed:', marker);
    // Tu można dodać logikę pokazywania szczegółów obiektu sportowego
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