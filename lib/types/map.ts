export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Marker {
  id: number | string; // Powiązane z id z ListingModel (oryginalnie osm_id)
  position: [number, number]; // [latitude, longitude]
  title?: string;
  wayPoints?: [number, number][]; // Sparsowane z ListingModel.way
  icon?: string; // Nazwa ikony (np. z Ionicons lub własnego zestawu)
}
