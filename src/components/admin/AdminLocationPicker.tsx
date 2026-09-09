'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Crosshair, Loader2, Navigation, CheckCircle2 } from 'lucide-react';

interface AdminLocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  spotTitle?: string;
}

const LoadingSkeleton: React.FC = () => (
  <div className="w-full h-[360px] sm:h-[420px] rounded-2xl bg-[#0B130E] animate-pulse flex flex-col items-center justify-center border border-emerald-500/20 text-slate-400 gap-3">
    <div className="p-3 bg-[#111E16] border border-emerald-500/30 rounded-full shadow-[0_0_15px_rgba(255,107,74,0.3)]">
      <MapPin className="h-6 w-6 text-[#FF6B4A] animate-bounce" />
    </div>
    <span className="text-xs font-semibold text-slate-400">Loading Interactive Location Map...</span>
  </div>
);

const AdminMapPickerWithNoSSR = dynamic(() => import('./AdminMapPicker'), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

// Quick district anchor presets for easy navigation
const PAKUR_BLOCK_PRESETS = [
  { name: 'Pakur Town', lat: 24.6344, lng: 87.8475 },
  { name: 'Hiranpur', lat: 24.6150, lng: 87.7200 },
  { name: 'Litipara', lat: 24.6920, lng: 87.6250 },
  { name: 'Amrapara', lat: 24.5120, lng: 87.5250 },
  { name: 'Maheshpur', lat: 24.4780, lng: 87.7650 },
  { name: 'Pakuria', lat: 24.4100, lng: 87.6800 },
];

export const AdminLocationPicker: React.FC<AdminLocationPickerProps> = ({
  latitude,
  longitude,
  onChange,
  spotTitle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState('');
  const [locating, setLocating] = useState(false);

  // Search location via OpenStreetMap Nominatim
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError('');
    setSearchResults([]);

    try {
      // Prioritize Pakur district bounding box and India
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery + ' Pakur Jharkhand'
      )}&limit=5&countrycodes=in`;

      let res = await fetch(url);
      let data = await res.json();

      // If no result with 'Pakur', search raw query
      if (!Array.isArray(data) || data.length === 0) {
        const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&countrycodes=in`;
        res = await fetch(fallbackUrl);
        data = await res.json();
      }

      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(data);
      } else {
        setSearchError('No places found. Try a nearby town or village name.');
      }
    } catch {
      setSearchError('Could not reach location search service.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = (item: any) => {
    const lat = Number(parseFloat(item.lat).toFixed(6));
    const lng = Number(parseFloat(item.lon).toFixed(6));
    onChange(lat, lng);
    setSearchResults([]);
    setSearchQuery(item.display_name.split(',')[0]);
  };

  // Browser Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        onChange(lat, lng);
      },
      () => {
        setLocating(false);
        alert('Could not retrieve GPS location. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3.5">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search place, town or village in Pakur (e.g. Hiranpur, Kanchangarh)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl pl-10 pr-24 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all"
          />
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#FF6B4A] hover:bg-[#ff5530] disabled:opacity-50 text-[#0B130E] font-bold px-3 py-1.5 rounded-lg text-xs transition-all active:scale-95 flex items-center gap-1"
          >
            {searching ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
            <span>Find</span>
          </button>
        </form>

        {/* GPS Locate Me Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          className="inline-flex items-center justify-center gap-1.5 bg-[#111E16] hover:bg-[#16281E] border border-emerald-500/30 text-[#00F5A0] font-bold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-95 shrink-0"
          title="Use my device's current GPS coordinates"
        >
          <Crosshair size={14} className={locating ? 'animate-spin' : ''} />
          <span>{locating ? 'Locating...' : 'Use Current GPS'}</span>
        </button>
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="bg-[#111E16] border border-emerald-500/30 rounded-xl p-2 shadow-2xl space-y-1">
          <p className="text-[11px] font-bold text-slate-400 px-2 py-1">Select location match:</p>
          {searchResults.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectResult(item)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-[#0B130E] hover:text-[#FF6B4A] transition-colors flex items-start gap-2"
            >
              <MapPin size={14} className="text-[#FF6B4A] shrink-0 mt-0.5" />
              <div className="flex-1 truncate">
                <span className="font-semibold block">{item.display_name.split(',')[0]}</span>
                <span className="text-[11px] text-slate-400 block truncate">{item.display_name}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {searchError && (
        <div className="text-xs text-amber-400 bg-amber-950/30 border border-amber-500/20 px-3 py-1.5 rounded-lg">
          {searchError}
        </div>
      )}

      {/* Quick Jump Area Presets */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mr-1">Quick Jump:</span>
        {PAKUR_BLOCK_PRESETS.map((p) => {
          const isSelected =
            Math.abs(latitude - p.lat) < 0.005 && Math.abs(longitude - p.lng) < 0.005;
          return (
            <button
              key={p.name}
              type="button"
              onClick={() => onChange(p.lat, p.lng)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-[#FF6B4A] text-[#0B130E] font-bold border-[#FF6B4A]'
                  : 'bg-[#0B130E] text-slate-300 border-emerald-500/20 hover:border-[#FF6B4A]/50'
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Leaflet Interactive Map */}
      <AdminMapPickerWithNoSSR
        latitude={latitude}
        longitude={longitude}
        onChange={onChange}
        spotTitle={spotTitle}
      />

      {/* Active Pin Info Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#0B130E] border border-emerald-500/20 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-[#00F5A0]" />
          <span className="text-slate-300">
            Selected Pin Coordinates:
          </span>
          <span className="font-mono text-[#00F5A0] font-bold">
            {latitude ? latitude.toFixed(6) : '0.000000'}, {longitude ? longitude.toFixed(6) : '0.000000'}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Syncs automatically with the Latitude & Longitude input fields below
        </span>
      </div>
    </div>
  );
};

export default AdminLocationPicker;