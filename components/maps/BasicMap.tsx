import React, { useMemo, useRef, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import type { Marker, MapBounds } from '../../lib/types/map';

interface BasicMapProps {
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
  },
  map: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapTypeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default function BasicMap({
  markers,
  onBoundsChange,
  onMapStateChange,
  onMarkerPress,
  initialState,
}: BasicMapProps) {
  const webViewRef = useRef<WebView>(null);
  const [mapType, setMapType] = useState<'carto' | 'standard' | 'satellite'>('carto');
  const [webViewLoaded, setWebViewLoaded] = useState(false);

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
            color: #71717a;
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
          .leaflet-control-attribution {
            position: absolute !important;
            top: 5px !important;
            left: 50% !important;
            bottom: auto !important;
            right: auto !important;
            transform: translateX(-50%);
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

          map.addLayer(markers);
          
          function updateMarkers(markersData) {
            markers.clearLayers();
            
            markersData.forEach(marker => {
              const markerInstance = L.marker(marker.position, {
                markerId: marker.id,
                icon: L.divIcon({
                  html: '<div class="custom-marker">' +
                    '<ion-icon name="' + marker.icon + '" style="font-size: 18px;"></ion-icon>' +
                    '</div>',
                  className: '',
                  iconSize: [32, 32],
                  iconAnchor: [16, 16]
                })
              });

              markerInstance.on('click', () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'markerClick',
                  marker: marker
                }));
              });
              
              markers.addLayer(markerInstance);
            });

            map.addLayer(markers);
          }

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

          map.on('zoomend', function() {
            const state = {
              zoom: map.getZoom(),
              center: map.getCenter()
            };
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapStateChanged',
              state: state
            }));
          });

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
          }
          
          window.lastMarkersData = null;
        </script>
      </body>
    </html>
  `, [initialState]);

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
      console.log('Injecting markers:', markers.length);
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
      console.log('Received from WebView:', eventData);
      const data = JSON.parse(eventData);

      if (data.type === 'boundsChanged' && onBoundsChange) {
        onBoundsChange(data.bounds);
      } else if (data.type === 'mapStateChanged' && onMapStateChange) {
        onMapStateChange(data.state);
      } else if (data.type === 'markerClick' && onMarkerPress) {
        if (data.marker) {
          onMarkerPress(data.marker);
        }
      }
    } catch (e) {
      console.error('Błąd podczas parsowania wiadomości z WebView:', e);
    }
  };
  
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.map}
        source={{ html: mapHTML }}
        onMessage={handleMessage}
        onLoadEnd={() => {
          console.log('WebView loaded, setting webViewLoaded to true');
          setWebViewLoaded(true);
        }}
      />
      
      <TouchableOpacity
        style={styles.mapTypeButton}
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