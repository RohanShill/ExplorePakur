'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { TOURIST_SPOTS, CATEGORY_OPTIONS } from '@/lib/mockData';
import { SpotCategory, TouristSpot } from '@/types';
import SpotCard from '@/components/ui/SpotCard';
import DynamicMap from '@/components/map/DynamicMap';
import ScrollReveal from '@/components/animations/ScrollReveal';
import RoadTripJourney from '@/components/journey/RoadTripJourney';
import {
  MapPin,
  Trees,
  ArrowRight,
  Shield,
  Search,
  CheckCircle2,
  Crosshair,
  Sparkles,
  Navigation,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { calculateDistanceKm } from '@/lib/utils';

export default function HomePage() {
  const [spots, setSpots] = useState<TouristSpot[]>(TOURIST_SPOTS);
  const [selectedCategory, setSelectedCategory] = useState<SpotCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSpots, setShowAllSpots] = useState(false);

  // Real-time user GPS state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [sortByNearest, setSortByNearest] = useState(false);

  useEffect(() => {
    async function loadSpots() {
      try {
        const res = await fetch('/api/admin/spots');
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
        alert('Please enable GPS location permissions in your browser to see destinations nearest to you.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Filter & calculate real-time distance for spots
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

  // Display top 6 curated highlights by default (or all if toggled / searching)
  const displayedSpots = useMemo(() => {
    if (showAllSpots || searchQuery.trim() || sortByNearest) {
      return filteredSpots;
    }
    return filteredSpots.slice(0, 6);
  }, [filteredSpots, showAllSpots, searchQuery, sortByNearest]);

  const hasRemainingSpots = filteredSpots.length > 6 && !searchQuery.trim() && !sortByNearest;

  return (
    <div className="flex flex-col min-h-screen text-slate-100 selection:bg-[#00F5A0] selection:text-black">
      {/* STICKY SEARCH & REAL-TIME CATEGORY FILTER BAR */}
      <section className="sticky top-16 z-40 backdrop-blur-xl bg-[#0B130E]/92 border-b border-emerald-500/15 py-3.5 shadow-xl shadow-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3.5">
            {/* Search Input & Real-Time "Near Me" GPS Button */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search Hiranpur, waterfall, cave, temple..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111E16] border border-amber-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Real-time GPS "Near Me" Toggle Button */}
              <button
                onClick={handleNearMe}
                title="Sort by nearest to your live location"
                disabled={locating}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap ${
                  sortByNearest
                    ? 'bg-[#00F5A0] text-[#0B130E] shadow-[0_0_15px_rgba(0,245,160,0.35)]'
                    : 'bg-[#111E16] text-slate-300 hover:text-white border border-emerald-500/20'
                }`}
              >
                <Crosshair size={15} className={locating ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">
                  {locating ? 'Fetching GPS...' : sortByNearest ? 'Nearest (Active)' : 'Near Me'}
                </span>
                <span className="sm:hidden">Near Me</span>
              </button>
            </div>

            {/* Glowing Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value as SpotCategory | 'All')}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#FF6B4A] text-[#0B130E] shadow-[0_0_18px_rgba(255,107,74,0.45)] scale-105'
                        : 'bg-[#111E16] text-slate-400 hover:text-slate-200 hover:bg-[#16281E] border border-emerald-500/15'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PRIMARY INTERACTIVE ROAD TRIP SCROLL JOURNEY */}
      <section id="road-trip-section">
        <RoadTripJourney spots={filteredSpots} />
      </section>

      {/* INTERACTIVE CARTODB DARK MATTER MAP SECTION */}
      <section id="map-section" className="py-16 bg-[#0B130E]/35 backdrop-blur-sm border-t border-b border-emerald-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#00F5A0] text-xs font-bold uppercase tracking-widest">
                <MapPin size={14} />
                <span>Dark Matter Geolocation Grid</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">
                Pakur District Eco-Tourism Map
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Live interactive CartoDB Dark Matter tiles with glowing neon category markers, GPS routing & full district boundary.
              </p>
            </div>

            {/* Glowing Map Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 bg-[#111E16] p-2.5 rounded-xl border border-emerald-500/15">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" /> Waterfalls & Rivers
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F5A0] shadow-[0_0_8px_#00F5A0]" /> Caves & Hills
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFB300] shadow-[0_0_8px_#FFB300]" /> Hot Springs
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA] shadow-[0_0_8px_#A78BFA]" /> Heritage & Temples
              </span>
            </div>
          </div>

          {/* CartoDB Dark Matter Map Container */}
          <div className="h-[460px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-emerald-500/20">
            <DynamicMap spots={filteredSpots} height="460px" zoom={10} />
          </div>
        </div>
      </section>

      {/* CURATED HIGHLIGHTS SHOWCASE (TOP 6 CLEAN CATALOG) */}
      <section id="spots-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#00F5A0] text-xs font-bold uppercase tracking-wider">
              <Trees size={14} />
              <span>{hasRemainingSpots && !showAllSpots ? 'Curated Top Highlights' : 'Pakur Catalog'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">
              {hasRemainingSpots && !showAllSpots
                ? `Must-Visit Highlights (${displayedSpots.length} of ${filteredSpots.length})`
                : `All Pakur Destinations (${filteredSpots.length})`}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {hasRemainingSpots && !showAllSpots
                ? 'Handpicked top landmarks across Pakur District. Tap any card for full details or 1-tap Google Maps directions.'
                : 'Showing all registered destinations across Pakur District.'}
            </p>
            {sortByNearest && userCoords && (
              <p className="text-xs text-[#00F5A0] font-semibold mt-1">
                📍 Sorted by closest distance to your live GPS coordinates
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/spots/new"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#111E16] hover:bg-[#16281E] text-slate-300 hover:text-white px-3.5 py-2.5 rounded-xl border border-emerald-500/20 transition-all shadow-sm"
            >
              <span>+ Add Place</span>
            </Link>

            <Link
              href="/spots"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#16281E] hover:bg-[#00F5A0] text-slate-200 hover:text-[#0B130E] px-4 py-2.5 rounded-xl border border-emerald-500/20 transition-all"
            >
              <span>Full Directory ({filteredSpots.length})</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* 6-Card Uniform Grid with GSAP Stagger Reveal */}
        {displayedSpots.length > 0 ? (
          <>
            <ScrollReveal
              key={`${selectedCategory}-${searchQuery}-${sortByNearest}-${showAllSpots}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
              stagger={0.06}
            >
              {displayedSpots.map((spot, index) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  featured={index === 0 || index === 1}
                />
              ))}
            </ScrollReveal>

            {/* Clean Load More / Explore All Action Bar */}
            {hasRemainingSpots && (
              <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <button
                  onClick={() => setShowAllSpots(!showAllSpots)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#111E16] hover:bg-[#16281E] text-slate-200 hover:text-white text-sm font-bold border border-emerald-500/25 transition-all shadow-md active:scale-98"
                >
                  {showAllSpots ? (
                    <>
                      <ChevronUp size={16} className="text-[#00F5A0]" />
                      <span>Show Less (Top 6 Only)</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="text-[#00F5A0]" />
                      <span>View Remaining {filteredSpots.length - 6} Spots</span>
                    </>
                  )}
                </button>

                <Link
                  href="/spots"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00D287] hover:from-[#00E594] hover:to-[#00C27B] text-[#0B130E] text-sm font-black shadow-[0_2px_15px_rgba(0,245,160,0.3)] hover:shadow-[0_4px_22px_rgba(0,245,160,0.45)] transition-all active:scale-98"
                >
                  <span>Explore Full Map & Directory</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-[#111E16] rounded-2xl border border-emerald-500/15 p-8 space-y-3">
            <p className="text-slate-400 text-base">No destinations match your search &quot;{searchQuery}&quot;.</p>
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
      </section>

      {/* SANTHAL CULTURAL HERITAGE SPOTLIGHT */}
      <section id="heritage-section" className="py-20 bg-[#060B08] text-white relative z-20 overflow-hidden border-t border-emerald-500/20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={13} />
                <span>Indigenous Santhal Heritage</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
                Living Traditions of the Santhal Pargana
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Pakur is an ancient heartland of Santhal culture, legendary tribal heroes Sidho and Kanho Murmu, and time-honored Sohrai art. Experience weekly village haats, authentic stonecraft, and sacred groves (Jaher Than) that have preserved nature in harmony for centuries.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="text-xs bg-[#111E16] text-slate-300 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  🌿 Sacred Sal Groves
                </span>
                <span className="text-xs bg-[#111E16] text-slate-300 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  🎨 Sohrai & Khovar Art
                </span>
                <span className="text-xs bg-[#111E16] text-slate-300 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  🥁 Baha & Sohrai Festivities
                </span>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80"
                  alt="Santhal Heritage Pakur"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B08] via-transparent to-black/30 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
