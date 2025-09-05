import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { Marker, MapBounds } from '../../lib/types/map';
import { useExploreHeaderHeight } from '../../hooks/useExploreHeaderHeight';

interface MapProps {
  markers: Marker[];
  onBoundsChange?: (bounds: MapBounds) => void;
  onMapStateChange?: (state: any) => void;
  onMarkerPress?: (marker: Marker) => void;
  initialState: {
    center: [number, number];
    zoom: number;
  };
  isPopupOpen?: boolean;
  restoreMapState?: {
    center: [number, number];
    zoom: number;
  } | null;
}

export default function Map({
  markers,
  onBoundsChange,
  onMapStateChange,
  onMarkerPress,
  initialState,
  isPopupOpen = false,
  restoreMapState,
}: MapProps) {
  const webViewRef = useRef<WebView>(null);
  const [mapType, setMapType] = useState<'carto' | 'standard' | 'satellite'>(
    'carto'
  );
  const [locationPermission, setLocationPermission] = useState(false);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const { exploreHeaderHeight } = useExploreHeaderHeight();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  // Effect to restore map state when popup closes
  useEffect(() => {
    if (restoreMapState && !isPopupOpen && webViewRef.current) {
      const { center, zoom } = restoreMapState;
      
      // Send message to WebView to restore map state with smooth animation
      const restoreMessage = {
        type: 'restoreMapState',
        center: center,
        zoom: zoom
      };
      
      webViewRef.current.postMessage(JSON.stringify(restoreMessage));
    }
  }, [restoreMapState, isPopupOpen]);

  // Effect to control map interactions based on popup state
  useEffect(() => {
    console.log('🔄 Effect triggered - isPopupOpen:', isPopupOpen, 'webViewLoaded:', webViewLoaded);
    if (webViewRef.current && webViewLoaded) {
      const interactionMessage = {
        type: 'setMapInteractions',
        enabled: !isPopupOpen
      };
      
      console.log('📤 Sending setMapInteractions message to WebView:', interactionMessage);
      webViewRef.current.postMessage(JSON.stringify(interactionMessage));
    } else {
      console.log('❌ Cannot send message - webViewRef:', !!webViewRef.current, 'webViewLoaded:', webViewLoaded);
    }
  }, [isPopupOpen, webViewLoaded]);

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  const updateLocation = async () => {
    if (!locationPermission) {
      await checkLocationPermission();
      if (!locationPermission) return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      webViewRef.current?.injectJavaScript(`
        updateCurrentLocation({
          coords: {
            latitude: ${location.coords.latitude},
            longitude: ${location.coords.longitude}
          }
        });
        map.setView([${location.coords.latitude}, ${location.coords.longitude}], map.getZoom());
        true;
      `);
    } catch (error) {
      console.error('Błąd podczas pobierania lokalizacji:', error);
    }
  };

  const mapHTML = useMemo(() => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
        <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
        <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
        <link href="https://unpkg.com/ionicons@5.5.2/dist/ionicons/css/ionicons.min.css" rel="stylesheet">
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
          .custom-marker {
            background-color: white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .custom-marker ion-icon {
            font-size: 18px;
            color: #71717a; /* Default normal color */
          }
          .custom-marker.grayed-out {
            background-color: #ccc !important;
          }
          .custom-marker.grayed-out ion-icon {
            color: #888 !important;
          }
          .current-location {
            width: 20px;
            height: 20px;
            background-color: #4a90e2;
            border: 2px solid white;
            border-radius: 50%;
          }
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(3);
              opacity: 0;
            }
          }
          .pulse {
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: rgba(74, 144, 226, 0.3);
            animation: pulse 2s ease-out infinite;
          }
          .marker-cluster {
            background-clip: padding-box;
            border-radius: 50%;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .marker-cluster div {
            width: 32px;
            height: 32px;
            margin: 0;
            text-align: center;
            border-radius: 50%;
            font-size: 14px;
            color: #1e1e1e;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: transparent;
          }
          .marker-cluster.grayed-out {
            background-color: #ccc !important;
          }
          .marker-cluster.grayed-out div {
            color: #888 !important;
          }
          .leaflet-control-attribution {
            /* Override Leaflet's default positioning */
            position: absolute !important;
            top: 5px !important;
            left: 50% !important;
            bottom: auto !important;
            right: auto !important;
            transform: translateX(-50%);
            
            /* Custom styles */
            background-color: rgba(255, 255, 255, 0.7) !important;
            padding: 2px 5px !important;
            border-radius: 3px !important;
            font-size: 10px !important;
            z-index: 1000 !important;
            white-space: nowrap;
            margin: 0 !important;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {
            center: [${initialState.center[0]}, ${initialState.center[1]}],
            zoom: ${initialState.zoom},
            zoomControl: false,
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true,
            scrollWheelZoom: true,
            boxZoom: true,
            keyboard: true,
          });
          
          let standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'OpenStreetMap contributors'
          });

          let satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Esri'
          });

          let cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: 'CARTO'
          });

          let currentLayer = cartoLayer;
          currentLayer.addTo(map);

          let currentLocationMarker = null;

          function updateCurrentLocation(position) {
            const { latitude, longitude } = position.coords;
            
            if (currentLocationMarker) {
              map.removeLayer(currentLocationMarker);
            }

            const pulseIcon = L.divIcon({
              className: '',
              html: '<div class="pulse"></div><div class="current-location"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            currentLocationMarker = L.marker([latitude, longitude], {
              icon: pulseIcon,
              zIndexOffset: 1000
            }).addTo(map);
          }

          function handleLocationError(error) {
            console.error('Błąd podczas pobierania lokalizacji:', error);
          }

          // Inicjalizacja klastra markerów
          var markers = L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            iconCreateFunction: function(cluster) {
              return L.divIcon({
                html: '<div><span>' + cluster.getChildCount() + '</span></div>',
                className: 'marker-cluster',
                iconSize: L.point(32, 32)
              });
            }
          });

          // Add marker cluster to map
          map.addLayer(markers);

          // Słownik do śledzenia, które polygony są już narysowane
          window.drawnPolygons = window.drawnPolygons || {};
          
          // Funkcja do aktualizacji markerów
          function updateMarkers(markersData) {
            // Czyścimy markery (punkty), ale nie polygony
            markers.clearLayers();
            
            const currentZoom = map.getZoom();
            const MAX_ZOOM = 19;
            const MIN_ZOOM_FOR_POLYGONS = MAX_ZOOM - 2; // Rysuj polygony od poziomu 17 (19-2)
            
            // Zbieramy ID markerów, które są w nowym zestawie danych
            const markerIds = markersData.map(m => m.id);
            
            // Usuwamy polygony, których nie ma w nowym zestawie danych
            Object.keys(window.drawnPolygons).forEach(markerId => {
              if (!markerIds.includes(markerId)) {
                // Jeśli polygon nie jest już potrzebny, usuwamy go z mapy i ze słownika
                if (window.drawnPolygons[markerId]) {
                  map.removeLayer(window.drawnPolygons[markerId]);
                  delete window.drawnPolygons[markerId];
                }
              }
            });
            
            // Dodajemy nowe markery i obrysy
            markersData.forEach(marker => {
              // Jeśli mamy punkty way i odpowiednie przybliżenie, dodajemy obrys budynku
              // Obrys dodajemy bezpośrednio do mapy, a nie do klastra
              if (marker.wayPoints && marker.wayPoints.length > 2 && currentZoom >= MIN_ZOOM_FOR_POLYGONS) {
                // Sprawdzamy, czy ten polygon już istnieje
                if (!window.drawnPolygons[marker.id]) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'debug_wayPoints', id: marker.id }));
                  // Sprawdzamy typ mapy, aby dostosowaæ styl polygonu
                  const mapTypeStyle = {
                    // Używamy koloru primary dla obrysu
                    color: '#069494',
                    weight: 2,
                    opacity: 0.8,
                    // Dla widoku satelitarnego wyłączamy wypełnienie
                    fillColor: '#069494',
                    fillOpacity: currentLayer === satelliteLayer ? 0 : 0.35
                  };
                  
                  // Tworzymy nowy polygon i zapisujemy go w słowniku
                  window.drawnPolygons[marker.id] = L.polygon(marker.wayPoints, mapTypeStyle).addTo(map);
                }
              } else if (window.drawnPolygons[marker.id] && currentZoom < MIN_ZOOM_FOR_POLYGONS) {
                // Jeśli zoom jest za mały, usuwamy polygon
                map.removeLayer(window.drawnPolygons[marker.id]);
                delete window.drawnPolygons[marker.id];
              }

              // Tworzymy marker i dodajemy go do klastra
              const markerInstance = createMarker(marker);
              markers.addLayer(markerInstance);
            });

            // Dodajemy klaster markerów do mapy
            map.addLayer(markers);
          }

          // Funkcja do tworzenia markerów
          function createMarker(marker) {
            const markerInstance = L.marker(marker.position, {
              markerId: marker.id, // Add markerId for later reference
              icon: L.divIcon({
                html: \`
                  <div class="custom-marker">
                    <ion-icon name="\${marker.icon}" style="font-size: 18px;"></ion-icon>
                  </div>
                \`,
                className: '',
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              })
            });

            markerInstance.on('click', () => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'markerClick',
                marker: marker // Przesyłamy cały obiekt markera
              }));
            });
            
            return markerInstance;
          }

          // Nasłuchiwanie zmian granic mapy
          map.on('moveend', function() {
            const bounds = map.getBounds();
            const mapBounds = {
              north: bounds.getNorth(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              west: bounds.getWest()
            };
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'boundsChanged',
              bounds: mapBounds
            }));
          });

          // Nasłuchiwanie zmian stanu mapy
          map.on('zoomend', function() {
            const state = {
              zoom: map.getZoom(),
              center: map.getCenter()
            };
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapStateChanged',
              state: state
            }));
            
            // Aktualizujemy markery przy zmianie poziomu przybliżenia, aby pokazać/ukryć polygony
            if (window.lastMarkersData) {
              updateMarkers(window.lastMarkersData);
            }
          });

          // Funkcja do zmiany typu mapy
          function changeMapType(type) {
            map.removeLayer(currentLayer);
            
            switch(type) {
              case 'standard':
                currentLayer = standardLayer;
                break;
              case 'satellite':
                currentLayer = satelliteLayer;
                break;
              default:
                currentLayer = cartoLayer;
            }
            
            currentLayer.addTo(map);
            
            // Aktualizujemy styl polygonów przy zmianie typu mapy
            if (window.lastMarkersData) {
              // Dla każdego istniejącego polygonu aktualizujemy styl
              Object.keys(window.drawnPolygons).forEach(markerId => {
                const polygon = window.drawnPolygons[markerId];
                if (polygon) {
                  // Dla satelitarnego wyłączamy wypełnienie
                  polygon.setStyle({
                    fillOpacity: currentLayer === satelliteLayer ? 0 : 0.35
                  });
                }
              });
            }
          }
          
          // Zmienne globalne przechowujące stan
          window.lastMarkersData = null;
          window.drawnPolygons = {}; // Słownik do śledzenia, które polygony są już narysowane
          
          // Listen for messages from React Native
          window.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              
              if (data.type === 'restoreMapState') {
                // Restore map view with smooth animation
                map.setView([data.center[0], data.center[1]], data.zoom, {
                  animate: true,
                  duration: 0.5
                });
              } else if (data.type === 'setMapInteractions') {
                console.log('📥 WebView received setMapInteractions message:', data);
                // Enable/disable map interactions
                if (data.enabled) {
                  console.log('✅ Enabling map interactions');
                  map.dragging.enable();
                  map.touchZoom.enable();
                  map.doubleClickZoom.enable();
                  map.scrollWheelZoom.enable();
                  map.boxZoom.enable();
                  map.keyboard.enable();
                  // Re-enable marker clicks and restore normal appearance
                  markers.eachLayer(function(marker) {
                    marker.off('click');
                    marker.on('click', function(e) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'markerPress',
                        markerId: marker.options.markerId
                      }));
                    });
                    // Restore normal marker appearance
                    const markerElement = marker.getElement();
                    if (markerElement) {
                      const customMarker = markerElement.querySelector('.custom-marker');
                      if (customMarker) {
                        customMarker.classList.remove('grayed-out');
                      }
                    }
                  });
                  
                  // Restore normal cluster appearance
                  const clusterElements = document.querySelectorAll('.marker-cluster');
                  clusterElements.forEach(function(cluster) {
                    cluster.classList.remove('grayed-out');
                  });
                } else {
                  console.log('🚫 Disabling map interactions');
                  map.dragging.disable();
                  map.touchZoom.disable();
                  map.doubleClickZoom.disable();
                  map.scrollWheelZoom.disable();
                  map.boxZoom.disable();
                  map.keyboard.disable();
                  // Disable marker clicks and gray out markers
                  markers.eachLayer(function(marker) {
                    marker.off('click');
                    // Gray out marker
                    const markerElement = marker.getElement();
                    if (markerElement) {
                      const customMarker = markerElement.querySelector('.custom-marker');
                      if (customMarker) {
                        customMarker.classList.add('grayed-out');
                      }
                    }
                  });
                  
                  // Gray out clusters
                  const clusterElements = document.querySelectorAll('.marker-cluster');
                  clusterElements.forEach(function(cluster) {
                    cluster.classList.add('grayed-out');
                  });
                }
              }
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          });
        </script>
      </body>
    </html>
  `, [initialState]);

  // Reset webViewLoaded when mapHTML changes
  useEffect(() => {
    setWebViewLoaded(false);
  }, [mapHTML]);

  const injectMarkersJS = (markers: Marker[]) => {
    const js = `window.lastMarkersData = ${JSON.stringify(markers)}; updateMarkers(window.lastMarkersData)`;
    webViewRef.current?.injectJavaScript(js);
    return true;
  };

  useEffect(() => {
    if (markers && webViewLoaded) {
      __DEV__ && console.log('Injecting markers:', markers.length);
      injectMarkersJS(markers);
    }
  }, [markers, webViewLoaded]);

  const changeMapType = (type: 'carto' | 'standard' | 'satellite') => {
    setMapType(type);
    webViewRef.current?.injectJavaScript(`changeMapType('${type}')`);
  };

  const handleMessage = (event: any) => {
    try {
      const eventData = event.nativeEvent.data;
      console.log('--- Received from WebView ---', eventData); // Log the raw data
      const data = JSON.parse(eventData);

      if (data.type === 'debug_wayPoints') {
        console.log(
          `--- WebView DEBUG: Attempting to draw polygon for marker ${data.id} ---`
        );
        return;
      }

      if (data.type === 'boundsChanged' && onBoundsChange) {
        onBoundsChange(data.bounds);
      } else if (data.type === 'mapStateChanged' && onMapStateChange) {
        onMapStateChange(data.state);
      } else if (data.type === 'markerClick' && onMarkerPress) {
        if (data.marker) {
          onMarkerPress(data.marker);
        } else {
          console.error(
            'Marker click event received, but marker data is missing from payload.'
          );
          // Don't call onMarkerPress when marker data is missing
        }
      }
    } catch (e) {
      console.error('Błąd podczas parsowania wiadomości z WebView:', e);
    }
  };

  console.log('🗺️ Map render - isPopupOpen:', isPopupOpen);
  
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webView}
        source={{ html: mapHTML }}
        scrollEnabled={!isPopupOpen}
        onMessage={handleMessage}
        pointerEvents={isPopupOpen ? 'none' : 'auto'}
        onLoadEnd={() => {
          console.log('🌐 WebView loaded, setting webViewLoaded to true');
          setWebViewLoaded(true);
        }}
      />
      
      {/* Transparent overlay to block all interactions when popup is open */}
      {isPopupOpen && (
        <>
          {console.log('🛡️ Rendering blocking overlay')}
          <View 
            style={styles.overlay}
            pointerEvents="auto"
            onTouchStart={() => console.log('🤚 Overlay touched!')}
          />
        </>
      )}
      
      <TouchableOpacity 
        style={[styles.leftButton, { top: exploreHeaderHeight + 10 }]}
        onPress={updateLocation}
        disabled={isPopupOpen}
        activeOpacity={0.7}
      >
        <Ionicons name="locate" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.rightButton, { top: exploreHeaderHeight + 10 }]}
        disabled={isPopupOpen}
        activeOpacity={0.7}
        onPress={() => {
          const types: ('carto' | 'standard' | 'satellite')[] = [
            'carto',
            'standard',
            'satellite',
          ];
          const currentIndex = types.indexOf(mapType);
          const nextType = types[(currentIndex + 1) % types.length];
          changeMapType(nextType);
        }}
      >
        <Ionicons name="map-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  leftButton: {
    position: 'absolute',
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rightButton: {
    position: 'absolute',
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
