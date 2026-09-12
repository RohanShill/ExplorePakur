'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, MapPin } from 'lucide-react';
import { PAKUR_DISTRICT_BOUNDS } from '../map/MapComponent';

interface AdminMapPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  spotTitle?: string;
}

// Controller component to smoothly fly the map when coordinates change externally
const MapUpdater: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      map.flyTo([lat, lng], Math.max(map.getZoom(), 13), {
        duration: 0.8,
      });
    }
  }, [lat, lng, map]);
  return null;
};

// Map click listener component
const MapClickHandler: React.FC<{ onPick: (lat: number, lng: number) => void }> = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    },
  });
  return null;
};

export const AdminMapPicker: React.FC<AdminMapPickerProps> = ({
  latitude,
  longitude,
  onChange,
  spotTitle,
}) => {
  const markerRef = useRef<L.Marker>(null);

  const validLat = !isNaN(latitude) && latitude !== 0 ? latitude : 24.6300;
  const validLng = !isNaN(longitude) && longitude !== 0 ? longitude : 87.8400;

  // Custom high-visibility pin for Admin Location editing
  const adminPinIcon = useMemo(() => {
    return L.divIcon({
      className: 'admin-marker-pin',
      html: `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #111E16;
          border: 2.5px solid #FF6B4A;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 0 20px rgba(255, 107, 74, 0.6), 0 0 6px #FF6B4A;
          cursor: grab;
          transition: transform 0.15s ease;
        ">
          <span style="
            transform: rotate(45deg);
            font-size: 18px;
            filter: drop-shadow(0 0 4px rgba(0,0,0,0.8));
          ">
            📍
          </span>
          <span style="
            position: absolute;
            bottom: -3px;
            right: -3px;
            width: 8px;
            height: 8px;
            background: #FF6B4A;
            border-radius: 50%;
            box-shadow: 0 0 8px #FF6B4A;
          "></span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -36],
    });
  }, []);

  const handleDragEnd = () => {
    const marker = markerRef.current;
    if (marker) {
      const pos = marker.getLatLng();
      onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${validLat},${validLng}`;

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-emerald-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Top Banner Guide */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-[#0B130E]/90 backdrop-blur-md border border-emerald-500/30 text-slate-200 text-xs px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 pointer-events-auto">
          <MapPin size={14} className="text-[#FF6B4A] animate-pulse" />
          <span>Click anywhere or drag the pin to set location</span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#111E16]/90 hover:bg-[#16281E] backdrop-blur-md border border-emerald-500/30 text-[#00F5A0] text-xs px-3 py-1.5 rounded-xl shadow-lg transition-colors flex items-center gap-1 pointer-events-auto"
          title="Preview in Google Maps"
        >
          <span>Preview</span>
          <ExternalLink size={12} />
        </a>
      </div>

      <MapContainer
        center={[validLat, validLng]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full bg-[#0B130E]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_2yp1_1_92c5408a11b6f7dbef9c7c7d"
          subdomains="abcd"
          maxZoom={19}
        />

        <MapUpdater lat={validLat} lng={validLng} />
        <MapClickHandler onPick={onChange} />

        <Marker
          position={[validLat, validLng]}
          icon={adminPinIcon}
          draggable={true}
          eventHandlers={{ dragend: handleDragEnd }}
          ref={markerRef}
        >
          <Popup className="custom-dark-popup">
            <div className="p-2 space-y-1 bg-[#111E16] text-slate-100 rounded-xl font-sans">
              <p className="text-xs font-bold text-[#FF6B4A] flex items-center gap-1">
                📍 {spotTitle || 'Target Location'}
              </p>
              <p className="text-[11px] font-mono text-slate-300">
                Lat: {validLat.toFixed(6)}
              </p>
              <p className="text-[11px] font-mono text-slate-300">
                Lng: {validLng.toFixed(6)}
              </p>
              <p className="text-[10px] text-slate-400 italic mt-1">
                Drag this pin or click on map to reposition
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default AdminMapPicker;