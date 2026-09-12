'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TouristSpot } from '@/types';
import Link from 'next/link';
import { ExternalLink, Navigation, Maximize2, Minimize2, Crosshair, Lock, Unlock } from 'lucide-react';
import { getOsmDirectionsUrl } from '@/lib/utils';

// Accurate geographical perimeter boundary polygon for Pakur District, Jharkhand
export const PAKUR_DISTRICT_BOUNDS: [number, number][] = [
  [24.7800, 87.6200], // North-West (Borio/Sahibganj border)
  [24.7650, 87.7350],
  [24.7400, 87.8200], // North border
  [24.7000, 87.8800],
  [24.6650, 87.9400], // North-East (towards Farakka / West Bengal)
  [24.6100, 87.9350], // East border (Pakur Block East)
  [24.5200, 87.8900], // East (bordering Murshidabad)
  [24.4400, 87.8500], // South-East (Maheshpur East)
  [24.3800, 87.7800], // Southern tip (bordering Birbhum, WB)
  [24.4100, 87.6800], // South-West (Pakuria border)
  [24.4900, 87.5700], // West (bordering Dumka)
  [24.6000, 87.5200], // North-West (Amrapara / Litipara)
  [24.7100, 87.5600],
  [24.7800, 87.6200]
];

// No hardcoded phantom landmarks; map uses exclusively database-driven spots
export const ADDITIONAL_MAJOR_LANDMARKS: Partial<TouristSpot>[] = [];

interface MapComponentProps {
  spots: TouristSpot[];
  center?: [number, number];
  zoom?: number;
  selectedSpotId?: string;
  autoFitDistrict?: boolean;
  className?: string;
}

// Custom glowing marker pin generator for CartoDB Dark Matter
const createDarkMatterPin = (category: string, isSelected: boolean) => {
  let symbol = '📍';
  let categoryColor = '#00F5A0'; // Neon mint accent

  if (category === 'Waterfall') {
    symbol = '🌊';
    categoryColor = '#00E5FF'; // Electric cyan
  } else if (category === 'Thermal Spring' || category === 'Hot Springs') {
    symbol = '♨️';
    categoryColor = '#FFB300'; // Warm amber
  } else if (category === 'Park & Heritage' || category === 'Heritage') {
    symbol = '🏛️';
    categoryColor = '#A78BFA'; // Purple
  } else if (category === 'Cave & Hill' || category === 'Caves & Hills') {
    symbol = '⛰️';
    categoryColor = '#10B981'; // Emerald
  }

  const pinSize = isSelected ? 44 : 36;

  const html = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${pinSize}px;
      height: ${pinSize}px;
      background: #111E16;
      border: 2px solid ${categoryColor};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 0 16px ${categoryColor}, 0 0 4px #00F5A0;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    ">
      <span style="
        transform: rotate(45deg); 
        font-size: ${isSelected ? '18px' : '15px'};
        filter: drop-shadow(0 0 4px rgba(0,0,0,0.8));
      ">
        ${symbol}
      </span>
      <span style="
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
        background: #00F5A0;
        border-radius: 50%;
        box-shadow: 0 0 8px #00F5A0;
      "></span>
    </div>
  `;

  return L.divIcon({
    className: 'custom-dark-leaflet-marker',
    html: html,
    iconSize: [pinSize, pinSize],
    iconAnchor: [pinSize / 2, pinSize],
    popupAnchor: [0, -pinSize],
  });
};

// Controller component to handle Geolocation, explicit centering & district auto-fit
function MapViewController({
  center,
  zoom,
  shouldFitDistrict,
  targetPos,
}: {
  center?: [number, number];
  zoom?: number;
  shouldFitDistrict?: boolean;
  targetPos?: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (targetPos) {
      map.flyTo(targetPos, 15, { duration: 1.5 });
      return;
    }

    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom || 15, { animate: true });
    } else if (shouldFitDistrict) {
      const bounds = L.latLngBounds(PAKUR_DISTRICT_BOUNDS);
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 11 });
    }
  }, [center, zoom, shouldFitDistrict, targetPos, map]);

  return null;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  spots,
  center,
  zoom = 15,
  selectedSpotId,
  autoFitDistrict,
  className = 'h-full w-full rounded-2xl overflow-hidden',
}) => {
  const shouldFitDistrict = autoFitDistrict !== undefined ? autoFitDistrict : !center;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [isMapInteracting, setIsMapInteracting] = useState(false);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        setLocating(false);
        alert('Could not retrieve your location. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Only display actual database spots, no ghost or duplicate phantom markers
  const allDisplaySpots = React.useMemo(() => {
    return (spots || []).filter(
      (s) => s && !isNaN(s.latitude) && !isNaN(s.longitude) && s.latitude !== 0 && s.longitude !== 0
    );
  }, [spots]);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#0B130E] p-2 sm:p-4'
          : className
      }`}
    >
      {/* Mobile-Friendly Control Action Floating Bar */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        {/* Locate Me Button */}
        <button
          onClick={handleLocateMe}
          title="Find my location"
          disabled={locating}
          className="p-2.5 rounded-xl bg-[#111E16]/90 border border-emerald-500/30 text-[#00F5A0] shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md active:scale-95 transition-all flex items-center gap-1 text-xs font-bold"
        >
          <Crosshair size={16} className={locating ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">{locating ? 'Locating...' : 'My Location'}</span>
        </button>

        {/* Expand / Fullscreen Toggle Button (Crucial for mobile) */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen Map'}
          className="p-2.5 rounded-xl bg-[#111E16]/90 border border-emerald-500/30 text-[#00F5A0] shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md active:scale-95 transition-all flex items-center gap-1 text-xs font-bold"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          <span className="hidden sm:inline">{isFullscreen ? 'Close' : 'Expand'}</span>
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full z-0 bg-[#0B130E] rounded-xl overflow-hidden"
        style={{ minHeight: isFullscreen ? '100%' : '440px', width: '100%' }}
      >
        {/* CARTO Dark Matter Tile Layer with User API Key */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_2yp1_1_92c5408a11b6f7dbef9c7c7d"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* 1. Pakur District Area Polygon Highlight */}
        <Polygon
          positions={PAKUR_DISTRICT_BOUNDS}
          pathOptions={{
            color: '#00F5A0',
            weight: 3,
            opacity: 0.85,
            fillColor: '#00F5A0',
            fillOpacity: 0.12,
            dashArray: '6, 6',
          }}
        >
          <Popup>
            <div className="p-1 text-slate-900 font-sans">
              <h4 className="font-bold text-sm text-emerald-800">Pakur District Area</h4>
              <p className="text-xs text-slate-600">Santhal Pargana Division, Jharkhand</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                Area: ~1,805 km²
              </span>
            </div>
          </Popup>
        </Polygon>

        {/* User GPS Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `
                <div style="
                  position: relative;
                  width: 20px;
                  height: 20px;
                  background: #38bdf8;
                  border: 3px solid #ffffff;
                  border-radius: 50%;
                  box-shadow: 0 0 15px #38bdf8;
                ">
                  <span style="
                    position: absolute;
                    inset: -8px;
                    border: 2px solid #38bdf8;
                    border-radius: 50%;
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                    opacity: 0.75;
                  "></span>
                </div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>
              <div className="p-1 text-slate-900 font-sans font-bold text-xs">
                📍 You are here
              </div>
            </Popup>
          </Marker>
        )}

        <MapViewController
          center={center}
          zoom={zoom}
          shouldFitDistrict={shouldFitDistrict}
          targetPos={userLocation}
        />

        {/* 2. Top Major Locations Pointed by Pins */}
        {allDisplaySpots.map((spot) => {
          const isSelected = spot.id === selectedSpotId;
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;

          return (
            <Marker
              key={spot.id}
              position={[spot.latitude, spot.longitude]}
              icon={createDarkMatterPin(spot.category, isSelected)}
            >
              <Popup className="custom-dark-popup" minWidth={250} maxWidth={290}>
                <div className="p-1 space-y-2 bg-[#111E16] text-slate-100 rounded-xl">
                  {spot.coverImage && (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-900">
                      <img
                        src={spot.coverImage}
                        alt={spot.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-[#0B130E]/90 text-[#00F5A0] border border-emerald-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-md">
                        {spot.category}
                      </span>
                    </div>
                  )}
                  <h4 className="font-bold text-slate-100 text-sm">{spot.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>

                  {/* 1-Tap Direct Travel Navigation Links (Mobile Optimized) */}
                  <div className="pt-1 flex items-center gap-2">
                    {spot.slug && (
                      <Link
                        href={`/spots/${spot.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 text-[11px] font-bold bg-[#00F5A0] text-[#0B130E] hover:bg-[#00e092] py-2 px-2.5 rounded-lg transition-colors shadow-[0_0_12px_rgba(0,245,160,0.25)]"
                      >
                        <span>Details</span>
                        <ExternalLink size={11} />
                      </Link>
                    )}

                    {/* Google Maps 1-Tap Navigation (Instant native app launch on mobile) */}
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg bg-[#FF6B4A] hover:bg-[#ff5530] text-[#0B130E] font-bold text-[11px] transition-colors shadow-[0_0_12px_rgba(255,107,74,0.3)]"
                      title="Open Google Maps Driving Directions"
                    >
                      <Navigation size={12} />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
