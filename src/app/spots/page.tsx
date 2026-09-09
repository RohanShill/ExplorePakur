'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { TOURIST_SPOTS, CATEGORY_OPTIONS } from '@/lib/mockData';
import { SpotCategory, TouristSpot } from '@/types';
import SpotCard from '@/components/ui/SpotCard';
import DynamicMap from '@/components/map/DynamicMap';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Search, MapPin, Map, Grid, Crosshair } from 'lucide-react';
import { calculateDistanceKm } from '@/lib/utils';

export default function SpotsDirectoryPage() {
  const [spots, setSpots] = useState<TouristSpot[]>(TOURIST_SPOTS);
  const [selectedCategory, setSelectedCategory] = useState<SpotCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Real-time user GPS state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [sortByNearest, setSortByNearest] = useState(false);

  useEffect(() => {
    async function loadSpots() {
      try {
        const res = await fetch('/api/admin/spots', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.spots && data.spots.length > 0) {
            setSpots(data.spots);
          }
        }
      } catch (err) {
        console.error('Failed to load spots from API:', err);
      }
    }
    loadSpots();
  }, []);

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    if (sortByNearest) {
      setSortByNearest(false);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortByNearest(true);
      },
      (err) => {
        setLocating(false);
        alert('Please allow location permissions to see spots closest to you.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const filteredSpots = useMemo(() => {
    let result = spots.map((spot) => {
      let distanceKm: number | null = null;
      if (userCoords) {
        distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, spot.latitude, spot.longitude);
      }
      return { ...spot, distanceKm };
    });

    result = result.filter((spot) => {
      const matchesCategory = selectedCategory === 'All' || spot.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        spot.title.toLowerCase().includes(q) ||
        spot.description.toLowerCase().includes(q) ||
        spot.category.toLowerCase().includes(q) ||
        (spot.distanceFromPakurStation && spot.distanceFromPakurStation.toLowerCase().includes(q)) ||
        (spot.highlights && spot.highlights.some((h) => h.toLowerCase().includes(q))) ||
        (spot.culturalNote && spot.culturalNote.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });

    if (sortByNearest && userCoords) {
      result.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    }

    return result;
  }, [spots, selectedCategory, searchQuery, userCoords, sortByNearest]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-[#0B130E] text-slate-100">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[#00F5A0] text-xs font-bold uppercase tracking-widest">
          <MapPin size={14} />
          <span>Pakur District Eco-Tourism Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
          All Destinations & Attractions ({filteredSpots.length})
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Browse verified waterfalls, cave trails, thermal springs, and historical monuments across Pakur district with interactive CartoDB Dark Matter geolocation.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#111E16] rounded-2xl border border-emerald-500/15 p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box & Near Me */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search Hiranpur, river, temple..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00F5A0] focus:border-transparent transition-all"
              />
            </div>

            {/* Near Me GPS Button */}
            <button
              onClick={handleNearMe}
              title="Sort by nearest to your live location"
              disabled={locating}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap ${
                sortByNearest
                  ? 'bg-[#00F5A0] text-[#0B130E] shadow-[0_0_15px_rgba(0,245,160,0.35)]'
                  : 'bg-[#0B130E] text-slate-300 hover:text-white border border-emerald-500/20'
              }`}
            >
              <Crosshair size={15} className={locating ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">
                {locating ? 'Locating...' : sortByNearest ? 'Nearest (Active)' : 'Near Me'}
              </span>
              <span className="sm:hidden">Near Me</span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-[#0B130E] p-1 rounded-xl self-end md:self-auto border border-emerald-500/15">
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#00F5A0] text-[#0B130E] shadow-[0_0_12px_rgba(0,245,160,0.3)]'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Grid size={14} />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-[#00F5A0] text-[#0B130E] shadow-[0_0_12px_rgba(0,245,160,0.3)]'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Map size={14} />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-emerald-500/10 scrollbar-none">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value as SpotCategory | 'All')}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#00F5A0] text-[#0B130E] shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                    : 'bg-[#0B130E] text-slate-400 hover:text-slate-200 border border-emerald-500/15'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
        <>
          {filteredSpots.length > 0 ? (
            <ScrollReveal
              key={`${selectedCategory}-${searchQuery}-${sortByNearest}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              stagger={0.08}
            >
              {filteredSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </ScrollReveal>
          ) : (
            <div className="text-center py-16 bg-[#111E16] rounded-2xl border border-emerald-500/15 p-8 space-y-3">
              <p className="text-slate-400 text-base">No destinations match your search criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setSortByNearest(false);
                }}
                className="text-sm font-bold text-[#00F5A0] hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-[#111E16] rounded-2xl border border-emerald-500/20 p-4 shadow-2xl space-y-4">
          <div className="h-[550px] w-full rounded-xl overflow-hidden">
            <DynamicMap spots={filteredSpots} height="550px" zoom={10} />
          </div>
        </div>
      )}
    </div>
  );
}
