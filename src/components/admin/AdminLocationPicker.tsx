'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Search,
  MapPin,
  Crosshair,
  Loader2,
  CheckCircle2,
  ClipboardPaste,
  Globe,
  Compass,
  AlertCircle,
} from 'lucide-react';

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
    <span className="text-xs font-semibold">Loading Map Engine...</span>
  </div>
);

const AdminMapPickerWithNoSSR = dynamic(() => import('./AdminMapPicker'), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

// Quick district anchor presets for easy navigation
const PAKUR_BLOCK_PRESETS = [
  { name: 'Pakur Town', lat: 24.6344, lng: 87.8475 },
  { name: 'Pakur Park', lat: 24.6365, lng: 87.8337 },
  { name: 'Hiranpur', lat: 24.6150, lng: 87.7200 },
  { name: 'Litipara', lat: 24.6920, lng: 87.6250 },
  { name: 'Amrapara', lat: 24.5120, lng: 87.5250 },
  { name: 'Maheshpur', lat: 24.4780, lng: 87.7650 },
  { name: 'Pakuria', lat: 24.4100, lng: 87.6800 },
];

/**
 * Smartly parse coordinates in various Google Maps formats:
 * - "24.63650450665047, 87.83374995905538"
 * - "24.6365045, 87.8337499"
 * - "24.6365045 87.8337499"
 * - "(24.6365045, 87.8337499)"
 */
function parseCoordinates(input: string): { lat: number; lng: number } | null {
  if (!input) return null;
  const cleaned = input.trim().replace(/[()°]/g, '');
  const match = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*[, 	;/]+\s*(-?\d+(?:\.\d+)?)$/);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
    }
  }
  return null;
}

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

  // Dedicated Google Maps paste input
  const [coordsInput, setCoordsInput] = useState('');
  const [coordsError, setCoordsError] = useState('');

  // Reverse geocoded real address
  const [realAddress, setRealAddress] = useState<string>('');
  const [fetchingAddress, setFetchingAddress] = useState(false);

  // Sync coordsInput with incoming latitude & longitude
  useEffect(() => {
    if (latitude && longitude) {
      setCoordsInput(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    }
  }, [latitude, longitude]);

  // Automatic reverse geocoding whenever coordinates change
  useEffect(() => {
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) return;

    let isMounted = true;
    const controller = new AbortController();

    async function fetchReverseGeocode() {
      setFetchingAddress(true);
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept-Language': 'en,hi',
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.display_name) {
          // Format compact readable address
          const addr = data.address || {};
          const parts = [
            addr.amenity || addr.tourism || addr.leisure || addr.building,
            addr.road || addr.neighbourhood || addr.suburb,
            addr.village || addr.town || addr.city || 'Pakur',
            addr.state || 'Jharkhand',
            addr.postcode,
          ].filter(Boolean);

          const compactName = parts.length > 0 ? parts.join(', ') : data.display_name;
          setRealAddress(compactName);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Keep prior address or leave blank
        }
      } finally {
        if (isMounted) setFetchingAddress(false);
      }
    }

    const timer = setTimeout(fetchReverseGeocode, 400);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [latitude, longitude]);

  // Handle Google Maps Coordinates Apply
  const handleApplyCoordinates = (inputToParse?: string) => {
    const raw = inputToParse !== undefined ? inputToParse : coordsInput;
    const parsed = parseCoordinates(raw);
    if (parsed) {
      setCoordsError('');
      onChange(parsed.lat, parsed.lng);
      setSearchError('');
    } else {
      setCoordsError('Invalid coordinates format. Example: 24.636505, 87.833750');
    }
  };

  // Search location or coordinates via text input
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Check if user pasted coordinates into the search box!
    const parsedCoords = parseCoordinates(query);
    if (parsedCoords) {
      onChange(parsedCoords.lat, parsedCoords.lng);
      setSearchQuery('');
      setSearchError('');
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setSearchError('');
    setSearchResults([]);

    try {
      // Prioritize Pakur district bounding box and India
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query + ' Pakur Jharkhand'
      )}&limit=5&countrycodes=in`;

      let res = await fetch(url);
      let data = await res.json();

      // If no result with 'Pakur', search raw query
      if (!Array.isArray(data) || data.length === 0) {
        const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=in`;
        res = await fetch(fallbackUrl);
        data = await res.json();
      }

      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(data);
      } else {
        setSearchError('No places found. Try entering place name or paste Google Maps coordinates directly.');
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
    <div className="space-y-4">
      {/* 1. Google Maps Direct Coordinates Paste Section */}
      <div className="p-3.5 rounded-xl bg-[#0B130E] border border-amber-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <ClipboardPaste size={14} className="text-[#FF6B4A]" />
            Paste Google Maps Coordinates
          </label>
          <span className="text-[10px] text-slate-400">
            Right-click in Google Maps &gt; copy coordinates
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. 24.63650450665047, 87.83374995905538"
              value={coordsInput}
              onChange={(e) => {
                const val = e.target.value;
                setCoordsInput(val);
                // Auto-apply if valid coordinates are detected on paste
                const parsed = parseCoordinates(val);
                if (parsed) {
                  setCoordsError('');
                  onChange(parsed.lat, parsed.lng);
                }
              }}
              className="w-full bg-[#111E16] border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00F5A0]"
            />
          </div>

          <button
            type="button"
            onClick={() => handleApplyCoordinates()}
            className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#00F5A0] to-[#00C785] text-[#030806] font-extrabold px-4 py-2 rounded-xl text-xs shadow-[0_0_15px_rgba(0,245,160,0.25)] hover:opacity-95 transition-all active:scale-95 shrink-0"
          >
            <CheckCircle2 size={13} />
            <span>Apply Coordinates</span>
          </button>
        </div>

        {coordsError && (
          <p className="text-[11px] text-red-400 flex items-center gap-1">
            <AlertCircle size={12} />
            {coordsError}
          </p>
        )}
      </div>

      {/* 2. Manual Lat & Lng Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-[#0B130E] border border-emerald-500/20 space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Latitude (N)
          </label>
          <input
            type="number"
            step="0.000001"
            value={latitude || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onChange(val, longitude);
            }}
            placeholder="24.636505"
            className="w-full bg-transparent font-mono text-sm font-bold text-[#00F5A0] focus:outline-none"
          />
        </div>

        <div className="p-3 rounded-xl bg-[#0B130E] border border-emerald-500/20 space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Longitude (E)
          </label>
          <input
            type="number"
            step="0.000001"
            value={longitude || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onChange(latitude, val);
            }}
            placeholder="87.833750"
            className="w-full bg-transparent font-mono text-sm font-bold text-[#00F5A0] focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Search Bar & Browser GPS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search place name or paste coordinates here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all"
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

        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          className="inline-flex items-center justify-center gap-1.5 bg-[#111E16] hover:bg-[#16281E] border border-emerald-500/30 text-[#00F5A0] font-bold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-95 shrink-0"
          title="Use my device's current GPS coordinates"
        >
          <Crosshair size={14} className={locating ? 'animate-spin' : ''} />
          <span>{locating ? 'Locating...' : 'Use Device GPS'}</span>
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
            Math.abs(latitude - p.lat) < 0.003 && Math.abs(longitude - p.lng) < 0.003;
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

      {/* Real Location Address Display & Status */}
      <div className="p-3.5 rounded-xl bg-[#0B130E] border border-emerald-500/30 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[#00F5A0] shrink-0" />
            <span className="text-xs text-slate-300 font-semibold">Active Coordinates:</span>
            <span className="font-mono text-xs sm:text-sm text-[#00F5A0] font-bold">
              {latitude ? latitude.toFixed(6) : '0.000000'}, {longitude ? longitude.toFixed(6) : '0.000000'}
            </span>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-[#FF6B4A] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <Globe size={12} />
            <span>Open in Google Maps</span>
          </a>
        </div>

        {/* Real Location Name Badge */}
        <div className="flex items-start gap-2 pt-1 border-t border-emerald-500/10 text-xs text-slate-300">
          <Compass size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[11px] text-slate-400 font-medium block">
              Real Location Address:
            </span>
            {fetchingAddress ? (
              <span className="text-xs text-slate-400 italic flex items-center gap-1.5 mt-0.5">
                <Loader2 size={12} className="animate-spin text-amber-400" />
                Fetching real location name...
              </span>
            ) : realAddress ? (
              <span className="text-xs sm:text-sm text-[#F5F0E8] font-semibold block mt-0.5">
                {realAddress}
              </span>
            ) : (
              <span className="text-xs text-slate-500 italic block mt-0.5">
                Pakur District, Jharkhand
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLocationPicker;
