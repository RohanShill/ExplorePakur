"use client";

import React, { useState, useMemo, useEffect } from "react";
import { TOURIST_SPOTS, CATEGORY_OPTIONS } from "@/lib/mockData";
import { SpotCategory, TouristSpot } from "@/types";
import SpotCard from "@/components/ui/SpotCard";
import DynamicMap from "@/components/map/DynamicMap";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Search, MapPin, Map, Grid, Crosshair, Compass } from "lucide-react";
import { calculateDistanceKm } from "@/lib/utils";

export default function SpotsDirectoryClient({ initialSpots = [] }: { initialSpots: TouristSpot[] }) {
  const [spots, setSpots] = useState<TouristSpot[]>(initialSpots.length > 0 ? initialSpots : TOURIST_SPOTS);
  const [selectedCategory, setSelectedCategory] = useState<SpotCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [sortByNearest, setSortByNearest] = useState(false);

  useEffect(() => {
    async function loadSpots() {
      try {
        const res = await fetch("/api/admin/spots", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.spots && Array.isArray(data.spots)) setSpots(data.spots);
        }
      } catch (err) {
        console.error("Failed to load spots:", err);
      }
    }
    loadSpots();
  }, []);

  const handleNearMe = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
    if (sortByNearest) { setSortByNearest(false); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocating(false); setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setSortByNearest(true); },
      () => { setLocating(false); alert("Please allow location permissions."); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const filteredSpots = useMemo(() => {
    let result = spots.map((spot) => ({
      ...spot,
      distanceKm: userCoords ? calculateDistanceKm(userCoords.lat, userCoords.lng, spot.latitude, spot.longitude) : null,
    }));
    result = result.filter((spot) => {
      const matchesCat = selectedCategory === "All" || spot.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesSearch =
        spot.title.toLowerCase().includes(q) ||
        spot.description.toLowerCase().includes(q) ||
        spot.category.toLowerCase().includes(q) ||
        (spot.distanceFromPakurStation && spot.distanceFromPakurStation.toLowerCase().includes(q)) ||
        (spot.highlights && spot.highlights.some((h) => h.toLowerCase().includes(q)));
      return matchesCat && matchesSearch;
    });
    if (sortByNearest && userCoords) result.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    return result;
  }, [spots, selectedCategory, searchQuery, userCoords, sortByNearest]);

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-20 sm:pb-16" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* ── Page Header ── */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-[#D4A942] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] font-body">
            <Compass size={13} />
            Pakur District Eco-Tourism Directory
          </div>
          <h1 className="font-serif font-bold text-[#F5F0E8] text-3xl sm:text-4xl md:text-5xl leading-tight">
            All Destinations &amp;{" "}
            <span className="text-gold-gradient italic">Attractions</span>
          </h1>
          <p className="text-[#7A9180] text-sm max-w-2xl font-body">
            Browse verified waterfalls, cave trails, thermal springs, and historical monuments with live CartoDB geolocation.
          </p>
        </div>

        <div className="divider-gold" />

        {/* ── Filter Bar ── */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.15)] p-4 sm:p-5 space-y-3 sm:space-y-4">

          {/* Row 1: search + GPS + view toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A6254]" size={14} />
              <input
                type="text"
                placeholder="Search spots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-base)] border border-[rgba(212,169,66,0.12)] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#F5F0E8] placeholder-[#4A6254] focus:outline-none focus:ring-1 focus:ring-[#D4A942] transition-all font-body"
              />
            </div>

            {/* GPS */}
            <button
              onClick={handleNearMe}
              disabled={locating}
              title="Sort by nearest"
              className={`flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl text-xs font-semibold transition-all font-body shrink-0 ${
                sortByNearest
                  ? "bg-[#D4A942] text-[#030806]"
                  : "bg-[var(--bg-base)] text-[#7A9180] hover:text-[#F5F0E8] border border-[rgba(212,169,66,0.12)]"
              }`}
            >
              <Crosshair size={14} className={locating ? "animate-spin" : ""} />
              <span className="hidden sm:inline text-[11px]">{locating ? "…" : sortByNearest ? "✓ Near" : "Near Me"}</span>
            </button>

            {/* View toggle */}
            <div className="flex items-center gap-0.5 bg-[var(--bg-base)] p-1 rounded-xl border border-[rgba(212,169,66,0.1)] shrink-0">
              {[
                { mode: "grid" as const, icon: Grid  },
                { mode: "map"  as const, icon: Map   },
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center justify-center h-8 w-8 rounded-lg text-xs transition-all ${
                    viewMode === mode
                      ? "bg-[#D4A942] text-[#030806]"
                      : "text-[#7A9180] hover:text-[#F5F0E8]"
                  }`}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: category pills — horizontal scroll */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-[rgba(212,169,66,0.08)] pt-3">
            {CATEGORY_OPTIONS.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value as SpotCategory | "All")}
                  className={`whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all font-body border ${
                    isSelected
                      ? "bg-[#D4A942] text-[#030806] border-[#D4A942]"
                      : "border-[rgba(212,169,66,0.12)] text-[#7A9180] hover:text-[#F5F0E8] bg-[var(--bg-base)]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {sortByNearest && userCoords && (
          <p className="text-xs text-[#D4A942] font-semibold font-body flex items-center gap-1">
            <MapPin size={11} /> Sorted by distance from your GPS location
          </p>
        )}

        {/* ── Content ── */}
        {viewMode === "grid" ? (
          filteredSpots.length > 0 ? (
            <ScrollReveal
              key={`${selectedCategory}-${searchQuery}-${sortByNearest}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              stagger={0.07}
            >
              {filteredSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </ScrollReveal>
          ) : (
            <div className="text-center py-16 bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.12)] space-y-3">
              <p className="text-[#7A9180] font-body text-sm">No destinations match your criteria.</p>
              <button
                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); setSortByNearest(false); }}
                className="text-sm font-semibold text-[#D4A942] hover:underline font-body"
              >
                Reset Filters
              </button>
            </div>
          )
        ) : (
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.15)] p-3 sm:p-4 shadow-2xl">
            <div className="h-[400px] sm:h-[520px] w-full rounded-xl overflow-hidden">
              <DynamicMap spots={filteredSpots} height="100%" zoom={10} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
