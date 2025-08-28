import React, { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Marker } from '../../lib/types/map';

interface PopupMapProps {
  marker: Marker;
  center: [number, number];
  zoom: number;
  mapType?: 'satellite' | 'carto' | 'standard';
}

export default function PopupMap({ marker, center, zoom, mapType = 'satellite' }: PopupMapProps) {
  const webViewRef = useRef<WebView>(null);

  const mapHTML = useMemo(() => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
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
          // Oblicz optymalny zoom dla widoku satelitarnego
          var optimalZoom = ${zoom};
          var mapCenter = [${center[0]}, ${center[1]}];
          
          ${marker.wayPoints && marker.wayPoints.length > 2 ? `
          // Oblicz optymalny zoom i centrum dla wszystkich typów map na podstawie polygonu
          var wayPoints = ${JSON.stringify(marker.wayPoints)};
          var minLat = Math.min(...wayPoints.map(p => p[0]));
          var maxLat = Math.max(...wayPoints.map(p => p[0]));
          var minLng = Math.min(...wayPoints.map(p => p[1]));
          var maxLng = Math.max(...wayPoints.map(p => p[1]));
          
          // Oblicz środek polygonu
          var polygonCenter = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
          mapCenter = polygonCenter;
          
          // Oblicz rozmiar polygonu
          var latRange = maxLat - minLat;
          var lngRange = maxLng - minLng;
          
          // Dodaj większy margines dla lepszego dopasowania (25%)
          var margin = 0.25;
          latRange *= (1 + margin);
          lngRange *= (1 + margin);
          
          // Poprawiony algorytm obliczania zoom
          // Uwzględnia proporcje popup (szerokość vs wysokość)
          var maxRange = Math.max(latRange, lngRange);
          
          // Różny zoom w zależności od typu mapy
          if ('${mapType}' === 'satellite') {
            // Większy zoom dla satelitarnego
            if (maxRange > 0.01) {
              optimalZoom = Math.max(15, Math.min(20, 17 - Math.log2(maxRange * 300)));
            } else if (maxRange > 0.001) {
              optimalZoom = Math.max(17, Math.min(20, 18 - Math.log2(maxRange * 800)));
            } else {
              optimalZoom = Math.max(18, Math.min(20, 19 - Math.log2(maxRange * 1500)));
            }
          } else {
            // Bardziej konserwatywny zoom dla pozostałych typów
            if (maxRange > 0.01) {
              optimalZoom = Math.max(13, Math.min(18, 16 - Math.log2(maxRange * 500)));
            } else if (maxRange > 0.001) {
              optimalZoom = Math.max(15, Math.min(19, 17 - Math.log2(maxRange * 1000)));
            } else {
              optimalZoom = Math.max(17, Math.min(20, 18 - Math.log2(maxRange * 2000)));
            }
          }
          ` : ''}
          
          var map = L.map('map', {
            center: mapCenter,
            zoom: optimalZoom,
            zoomControl: false,
            dragging: false,
            touchZoom: false,
            doubleClickZoom: false,
            scrollWheelZoom: false,
            boxZoom: false,
            keyboard: false,
          });
          
          let standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'OpenStreetMap contributors'
          });

          let satelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 19,
            attribution: 'Google'
          });

          let cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: 'CARTO'
          });

          let currentLayer;
          switch('${mapType}') {
            case 'satellite':
              currentLayer = satelliteLayer;
              break;
            case 'carto':
              currentLayer = cartoLayer;
              break;
            case 'standard':
              currentLayer = standardLayer;
              break;
            default:
              currentLayer = satelliteLayer;
          }
          currentLayer.addTo(map);

          // Dodaj polygon obiektu jeśli istnieje
          ${marker.wayPoints && marker.wayPoints.length > 2 ? `
          var wayPoints = ${JSON.stringify(marker.wayPoints)};
          
          // Dla widoku satelitarnego dodaj szarą nakładkę poza polygonem
          if (currentLayer === satelliteLayer) {
            // Oblicz granice polygonu dla nakładki
            var minLat = Math.min(...wayPoints.map(p => p[0]));
            var maxLat = Math.max(...wayPoints.map(p => p[0]));
            var minLng = Math.min(...wayPoints.map(p => p[1]));
            var maxLng = Math.max(...wayPoints.map(p => p[1]));
            
            // Uzyskaj obecne granice widoku mapy
            var bounds = map.getBounds();
            var mapMinLat = bounds.getSouth();
            var mapMaxLat = bounds.getNorth();
            var mapMinLng = bounds.getWest();
            var mapMaxLng = bounds.getEast();
            
            // Rozszerz maskę poza widoczny obszar mapy
            var outerRing = [
              [mapMinLat - 0.01, mapMinLng - 0.01],
              [mapMinLat - 0.01, mapMaxLng + 0.01],
              [mapMaxLat + 0.01, mapMaxLng + 0.01],
              [mapMaxLat + 0.01, mapMinLng - 0.01]
            ];
            
            // Odwróć kolejność punktów dla dziury (clockwise -> counterclockwise)
            var facilityHole = wayPoints.slice().reverse();
            
            var maskPolygon = L.polygon([outerRing, facilityHole], {
              color: 'transparent',
              weight: 0,
              fillColor: '#000000',
              fillOpacity: 0.4
            }).addTo(map);
          }
          
          // Główny polygon obiektu
          var polygon = L.polygon(wayPoints, {
            color: '#C474F6',
            weight: currentLayer === satelliteLayer ? 0 : 2,
            opacity: currentLayer === satelliteLayer ? 0 : 0.8,
            fillColor: '#C474F6',
            fillOpacity: currentLayer === satelliteLayer ? 0 : 0.35
          }).addTo(map);
          ` : ''}
        </script>
      </body>
    </html>
  `, [center, zoom, mapType, marker.wayPoints]);

  return (
    <View style={styles.container} pointerEvents="none">
      <WebView
        ref={webViewRef}
        style={styles.map}
        source={{ html: mapHTML }}
        scrollEnabled={false}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
