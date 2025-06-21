'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
// import L from "leaflet";
interface SuspiciousCall {
  caller: string;
  country: string;
  frequency: number;
  lat: number;
  lon: number;
  timestamp: string;
  duration: number;
}

interface CallsMapProps {
  calls: SuspiciousCall[];
}


export default function CallsMap({ calls }: CallsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Corriger les icônes Leaflet pour Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Initialiser la carte centrée sur Djibouti
    const map = L.map(mapRef.current).setView([11.8251, 42.5903], 3);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || calls.length === 0) return;

    const map = mapInstanceRef.current;

    // Supprimer les marqueurs existants
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Ajouter les marqueurs pour chaque appel suspect
    calls.forEach((call) => {
      const markerColor = call.frequency > 50 ? 'red' : call.frequency > 25 ? 'orange' : 'yellow';
      
      // Créer une icône personnalisée basée sur la fréquence
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${markerColor === 'red' ? '#ef4444' : markerColor === 'orange' ? '#f97316' : '#eab308'};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: bold;
        ">${call.frequency}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([call.lat, call.lon], { icon: customIcon }).addTo(map);

      // Popup avec les détails de l'appel
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold text-sm mb-2">Appel Suspect</h3>
          <p class="text-xs"><strong>Numéro:</strong> ${call.caller}</p>
          <p class="text-xs"><strong>Pays:</strong> ${call.country}</p>
          <p class="text-xs"><strong>Fréquence:</strong> ${call.frequency} appels</p>
          <p class="text-xs"><strong>Niveau:</strong> ${
            call.frequency > 50 ? 'CRITIQUE' : call.frequency > 25 ? 'ÉLEVÉ' : 'MODÉRÉ'
          }</p>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

  }, [calls]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Localisation Géographique
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Origine des appels suspects dans le monde
        </p>
      </div>
      <div 
        ref={mapRef} 
        className="leaflet-container"
        style={{ height: '400px', width: '100%' }}
      />
    </div>
  );
}