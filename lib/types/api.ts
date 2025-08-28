// app/lib/types/api.ts

/**
 * Represents a GeoJSON Point.
 * Coordinates are [longitude, latitude].
 */
export interface GeoJsonPoint {
  type: "Point";
  coordinates: [number, number];
}

/**
 * Represents a GeoJSON Polygon.
 * Coordinates are an array of rings, where each ring is an array of [longitude, latitude] points.
 * The first ring is the exterior ring, subsequent rings are interior rings (holes).
 */
export interface GeoJsonPolygon {
  type: "Polygon";
  coordinates: number[][][][]; // Corrected for MultiPolygon-like structure
}

/**
 * DTO for a simplified sport representation linked to a facility.
 */
export interface SupportedSportShortDto {
  id: number;
  name: string;
  // Można dodać iconName, jeśli backend będzie to zwracał i chcemy użyć specyficznej ikony sportu na markerze
  // iconName?: string;
}

/**
 * DTO for a facility item as returned by the list endpoint.
 */
export interface FacilityListItemDto {
  id: string; // Changed to string to accommodate UUIDs or other string-based IDs from Supabase
  osm_id: string | null;
  name: string | null;
  place_name: string | null; // From facility_google table
  surface_type: string | null;
  addr_city: string | null;
  addr_street: string | null;
  addr_housenumber: string | null;
  location: GeoJsonPoint; // Center point of the facility
  way: GeoJsonPolygon | null; // Polygon representing the facility's footprint
  main_photo_url: string | null;
  supported_sports: SupportedSportShortDto[];
}

/**
 * DTO for the paginated response of the facilities list.
 */
export interface FacilitiesListResponseDto {
  items: FacilityListItemDto[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Parameters for querying the facilities list.
 * These will be used as query parameters in the API call.
 */
export interface FacilitiesQueryParams {
  sportId?: number; // ID of the sport to filter by
  limit?: number;
  offset?: number;
  // Można dodać inne parametry, np. searchQuery, etc.
}
