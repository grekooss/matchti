// app/lib/react-query/useFacilitiesQuery.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../supabase/client'; // Upewnij się, że ścieżka do klienta Supabase jest poprawna
import { FacilitiesListResponseDto, FacilitiesQueryParams } from '../types/api';

const FACILITIES_QUERY_KEY = 'facilities';

/**
 * Fetches a list of facilities from the Supabase Edge Function.
 * @param queryParams Parameters for filtering and pagination.
 * @param bounds Map bounds to filter facilities by location.
 * @returns A promise resolving to the list of facilities.
 */
const fetchFacilities = async (
  queryParams: FacilitiesQueryParams,
  bounds?: { north: number; south: number; east: number; west: number }
): Promise<FacilitiesListResponseDto> => {
  console.log('--- fetchFacilities ---');
  console.log('Query Params:', JSON.stringify(queryParams, null, 2));
  console.log('Bounds:', JSON.stringify(bounds, null, 2));

  if (!bounds) {
    console.warn('fetchFacilities called without bounds - this might be an issue depending on backend logic');
  }

  // Budowanie parametrów URL
  const params = new URLSearchParams();
  if (queryParams.sportId !== undefined) { // Zmieniono z sportName na sportId
    params.append('sportId', queryParams.sportId.toString()); // Nazwa parametru to sportId
  }
  // Usunięto queryParams.bounds, ponieważ nie jest zdefiniowane w FacilitiesQueryParams
  // Jeśli filtrowanie po 'bounds' jako string jest potrzebne, należy dodać 'bounds?: string;' do FacilitiesQueryParams
  // Obecnie filtrowanie po współrzędnych geograficznych jest obsługiwane przez indywidualne parametry: north, south, east, west
  if (queryParams.limit !== undefined) {
    params.append('limit', queryParams.limit.toString());
  }
  if (queryParams.offset !== undefined) {
    params.append('offset', queryParams.offset.toString());
  }
  if (bounds) {
    if (typeof bounds.north === 'number') {
      params.append('north', bounds.north.toString());
    }
    if (typeof bounds.south === 'number') {
      params.append('south', bounds.south.toString());
    }
    if (typeof bounds.east === 'number') {
      params.append('east', bounds.east.toString());
    }
    if (typeof bounds.west === 'number') {
      params.append('west', bounds.west.toString());
    }
  }

  const queryString = params.toString();

  // Wywołanie funkcji z parametrami w URL
  const { data, error } = await supabase.functions.invoke(`facilities?${queryString}`, {
    method: 'GET',
  });

  console.log('--- fetchFacilities Response ---');
  if (error) {
    console.error('Error fetching facilities:', JSON.stringify(error, null, 2));
    throw new Error(error.message || 'Failed to fetch facilities');
  }

  // Zakładamy, że funkcja zwraca obiekt zgodny z FacilitiesListResponseDto
  // Jeśli funkcja zwraca bezpośrednio tablicę FacilityListItemDto, trzeba to dostosować.
  if (data) {
    console.log('Data received (items count):', data.items.length);
    console.log('Data received (total count):', data.totalCount);
    console.log('Data received (offset):', data.offset);
  } else {
    console.warn('No data object received from fetchFacilities, though no explicit error was thrown.');
  }

  // Ensure a valid structure is always returned, even if data is unexpectedly null/undefined
  if (!data) {
    return { 
      items: [], 
      totalCount: 0, 
      offset: queryParams.offset || 0, 
      limit: queryParams.limit || 0 
    };
  }

  return data as FacilitiesListResponseDto;
};

/**
 * Custom hook to fetch facilities with TanStack Query using infinite scrolling.
 * @param queryParams Parameters for filtering and pagination.
 * @param bounds Map bounds to filter facilities by location.
 * @param options Optional query options.
 */
export const useFacilitiesQuery = (
  queryParams: FacilitiesQueryParams,
  bounds?: { north: number; south: number; east: number; west: number },
  options?: {
    enabled?: boolean;
    // Można dodać inne opcje z TanStack Query, np. staleTime, cacheTime, onSuccess, onError
  }
) => {
  // Domyślny limit na stronę, jeśli nie podano
  const limit = queryParams.limit || 20;

  return useInfiniteQuery<FacilitiesListResponseDto, Error>({
    queryKey: [FACILITIES_QUERY_KEY, queryParams, bounds], // Query key includes params and bounds to refetch when they change
    queryFn: ({ pageParam = 0 }) => {
      // Tworzymy nowy obiekt z parametrami zapytania, dodając offset na podstawie pageParam
      const paginatedParams: FacilitiesQueryParams = {
        ...queryParams,
        offset: pageParam,
        limit,
      };
      return fetchFacilities(paginatedParams, bounds);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // Jeśli liczba zwracanych elementów jest mniejsza niż limit, to znaczy, że nie ma więcej stron
      if (lastPage.items.length < limit) {
        return undefined; // Brak więcej stron
      }
      // Zwracamy nowy offset dla następnej strony
      return lastPage.offset + lastPage.items.length;
    },
    keepPreviousData: true, // Keep previous data while fetching new data for a smoother UX
    enabled: options?.enabled !== undefined ? options.enabled : true, // Domyślnie włączone
  });
};
