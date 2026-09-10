"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { TOURIST_SPOTS, CATEGORY_OPTIONS } from "@/lib/mockData";
import { SpotCategory, TouristSpot } from "@/types";
import SpotCard from "@/components/ui/SpotCard";
import DynamicMap from "@/components/map/DynamicMap";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedHero from "@/components/animations/AnimatedHero";
import RoadTripJourney from "@/components/journey/RoadTripJourney";
import {
  MapPin, ArrowRight, Search, Crosshair, Sparkles,
  ChevronDown, ChevronUp, Trees, Map, Shield,
} from "lucide-react";
import { calculateDistanceKm } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const [spots, setSpots] = useState<TouristSpot[]>(TOURIST_SPOTS);
  const [selectedCategory, setSelectedCategory] = useState<SpotCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllSpots, setShowAllSpots] = useState(false);
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
      () => { setLocating(false); alert("Please enable GPS location permissions."); },
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
        (spot.highlights && spot.highlights.some((h) => h.toLowerCase().includes(q)));
      return matchesCat && matchesSearch;
    });
    if (sortByNearest && userCoords) result.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    return result;
  }, [spots, selectedCategory, searchQuery, userCoords, sortByNearest]);

  const displayedSpots = showAllSpots ? filteredSpots : filteredSpots.slice(0, 6);
  const hasRemainingSpots = filteredSpots.length > 6;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <AnimatedHero />
      <RoadTripJourney spots={spots} />

      {/* ── Map Section ── */}
      <section id="map-section" className="py-14 sm:py-20 border-t border-[rgba(212,169,66,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D4A942] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] font-body">
              <Map size={13} />
              Interactive District Map
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="font-serif font-bold text-[#F5F0E8] text-2xl sm:text-3xl md:text-4xl leading-tight">
                Explore Pakur&apos;s{" "}
                <span className="text-gold-gradient italic">Hidden Gems</span>
              </h2>

              {/* Search & GPS — full width on mobile */}
              <div className="flex items-center gap-2 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A6254]" size={14} />
                  <input
                    type="text"
                    placeholder="Search spots..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--bg-card)] border border-[rgba(212,169,66,0.15)] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#F5F0E8] placeholder-[#4A6254] focus:outline-none focus:ring-1 focus:ring-[#D4A942] transition-all font-body"
                  />
                </div>
                <button
                  onClick={handleNearMe}
                  disabled={locating}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all font-body shrink-0 ${
                    sortByNearest
                      ? "bg-[#D4A942] text-[#030806]"
                      : "bg-[var(--bg-card)] text-[#7A9180] hover:text-[#F5F0E8] border border-[rgba(212,169,66,0.15)]"
                  }`}
                >
                  <Crosshair size={14} className={locating ? "animate-spin" : ""} />
                  <span className="hidden xs:inline sm:inline">{locating ? "…" : sortByNearest ? "✓ Near Me" : "Near Me"}</span>
                </button>
              </div>
            </div>

            {/* Category pills — horizontal scroll on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {CATEGORY_OPTIONS.map((cat) => {
                const active = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value as SpotCategory | "All")}
                    className={`whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all font-body border ${
                      active
                        ? "bg-[#D4A942] text-[#030806] border-[#D4A942]"
                        : "border-[rgba(212,169,66,0.15)] text-[#7A9180] hover:text-[#F5F0E8] bg-[var(--bg-card)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map — shorter on mobile */}
          <div className="h-[300px] sm:h-[400px] md:h-[460px] w-full rounded-2xl overflow-hidden shadow-2xl border border-[rgba(212,169,66,0.15)]">
            <DynamicMap spots={filteredSpots} height="100%" zoom={10} />
          </div>
        </div>
      </section>

      {/* ── Spots Grid ── */}
      <section id="spots-section" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#D4A942] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] font-body">
              <Trees size={13} />
              {hasRemainingSpots && !showAllSpots ? "Curated Highlights" : "Full Catalog"}
            </div>
            <h2 className="font-serif font-bold text-[#F5F0E8] text-2xl sm:text-3xl md:text-4xl leading-tight">
              {hasRemainingSpots && !showAllSpots ? "Must-Visit Destinations" : `All ${filteredSpots.length} Destinations`}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A9180] max-w-xl font-body">
              {hasRemainingSpots && !showAllSpots
                ? `Showing ${displayedSpots.length} of ${filteredSpots.length} handpicked landmarks.`
                : "All registered eco-tourism destinations across Pakur District."}
            </p>
            {sortByNearest && userCoords && (
              <p className="text-xs text-[#D4A942] font-semibold font-body flex items-center gap-1">
                <MapPin size={11} /> Sorted by nearest GPS location
              </p>
            )}
          </div>
          <Link
            href="/spots"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold border border-[rgba(212,169,66,0.3)] text-[#D4A942] hover:bg-[rgba(212,169,66,0.08)] px-4 py-2.5 rounded-xl transition-all font-body shrink-0"
          >
            Full Directory ({filteredSpots.length})
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="divider-gold" />

        {displayedSpots.length > 0 ? (
          <>
            <ScrollReveal
              key={`${selectedCategory}-${searchQuery}-${sortByNearest}-${showAllSpots}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              stagger={0.07}
            >
              {displayedSpots.map((spot, index) => (
                <SpotCard key={spot.id} spot={spot} featured={index === 0 || index === 1} />
              ))}
            </ScrollReveal>

            {hasRemainingSpots && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowAllSpots(!showAllSpots)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[#F5F0E8] text-sm font-semibold border border-[rgba(212,169,66,0.15)] hover:border-[rgba(212,169,66,0.35)] transition-all font-body"
                >
                  {showAllSpots
                    ? <><ChevronUp size={15} className="text-[#D4A942]" /><span>Show Less</span></>
                    : <><ChevronDown size={15} className="text-[#D4A942]" /><span>View {filteredSpots.length - 6} More</span></>}
                </button>
                <Link
                  href="/spots"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D4A942] hover:bg-[#E8C060] text-[#030806] text-sm font-semibold shadow-[0_2px_15px_rgba(212,169,66,0.35)] transition-all font-body"
                >
                  Full Map &amp; Directory
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-14 bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.12)] space-y-3">
            <p className="text-[#7A9180] font-body text-sm">No destinations match &ldquo;{searchQuery}&rdquo;.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); setSortByNearest(false); }}
              className="text-sm font-semibold text-[#D4A942] hover:underline font-body"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ── Heritage Section ── */}
      <section
        id="heritage-section"
        className="relative py-16 sm:py-24 border-t border-[rgba(212,169,66,0.1)] overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--bg-base) 0%, #030806 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-[5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[400px] bg-[#D4A942]/4 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-[5%] w-[250px] sm:w-[400px] h-[200px] sm:h-[300px] bg-[#00C785]/3 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(212,169,66,0.3)] text-[#D4A942] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] font-body bg-[rgba(212,169,66,0.06)]">
                <Sparkles size={11} />
                Indigenous Santhal Heritage
              </div>
              <h2 className="font-serif font-bold text-[#F5F0E8] text-3xl sm:text-4xl md:text-5xl leading-[1.15]">
                Living Traditions of the{" "}
                <span className="text-gold-gradient italic">Santhal Pargana</span>
              </h2>
              <p className="text-[#7A9180] text-sm sm:text-base leading-relaxed font-body">
                Pakur is the ancient heartland of Santhal culture — home of legendary tribal heroes Sidho and Kanho Murmu, time-honored Sohrai art, and weekly village haats. Sacred groves have preserved nature and tradition for centuries.
              </p>
              {/* Tags — 3-col grid on mobile */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "Sacred Sal Groves",    icon: "🌿" },
                  { label: "Sohrai & Khovar Art",  icon: "🎨" },
                  { label: "Baha Festivities",      icon: "🥁" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-xl bg-[var(--bg-card)] border border-[rgba(212,169,66,0.12)] text-center"
                  >
                    <span className="text-xl sm:text-2xl">{item.icon}</span>
                    <span className="text-[10px] sm:text-[11px] text-[#7A9180] leading-tight font-body">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-[#00C785] shrink-0" />
                <span className="text-xs text-[#7A9180] font-body">UNESCO-recognized tribal heritage zone</span>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[rgba(212,169,66,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <img
                  src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80"
                  alt="Santhal Heritage Pakur"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030806]/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 bg-[rgba(3,8,6,0.85)] backdrop-blur-md border border-[rgba(212,169,66,0.25)] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 space-y-0.5">
                  <p className="text-[10px] sm:text-xs text-[#D4A942] font-semibold font-body uppercase tracking-wider">1855 Santhal Hul</p>
                  <p className="text-xs sm:text-sm text-[#F5F0E8] font-body">The Great Rebellion of Jharkhand</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── SEO FAQ & Travel Guide Section ── */}
      <section
        id="faq-section"
        className="relative py-16 sm:py-24 border-t border-[rgba(212,169,66,0.1)]"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(212,169,66,0.3)] text-[#D4A942] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] font-body bg-[rgba(212,169,66,0.06)]">
              <Sparkles size={11} />
              Traveler Information Guide
            </div>
            <h2 className="font-serif font-bold text-[#F5F0E8] text-2xl sm:text-4xl md:text-5xl">
              Essential Guide to <span className="text-gold-gradient">Pakur, Jharkhand</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#7A9180] font-body">
              Frequently asked questions about sightseeing, connectivity, and cultural heritage in Pakur district.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            <div className="luxury-card rounded-2xl p-6 border border-[rgba(212,169,66,0.15)] space-y-2.5">
              <h3 className="font-serif font-bold text-base text-[#F5F0E8] flex items-center gap-2">
                <span className="text-[#D4A942]">Q.</span> What is Pakur famous for?
              </h3>
              <p className="text-xs sm:text-sm text-[#7A9180] font-body leading-relaxed">
                Pakur is renowned for its prehistoric Rajmahal basalt rock formations (&ldquo;Black Stone City&rdquo;), the historic 1856 Martello Tower commemorating the 1855 Santhal Rebellion, untouched cascading waterfalls like Lilatari and Amrapara, natural geothermal hot springs at Sidpur, and rich Santhal tribal folklore.
              </p>
            </div>

            <div className="luxury-card rounded-2xl p-6 border border-[rgba(212,169,66,0.15)] space-y-2.5">
              <h3 className="font-serif font-bold text-base text-[#F5F0E8] flex items-center gap-2">
                <span className="text-[#D4A942]">Q.</span> What are the top places to visit in Pakur?
              </h3>
              <p className="text-xs sm:text-sm text-[#7A9180] font-body leading-relaxed">
                Key destinations include Singarsi Viewpoint (the highest peak in the district), Lilatari Waterfall, Kanchangarh Ancient Caves, Siddhu Kanhu Park &amp; Martello Tower, Sidpur Natural Sulfur Hot Springs, Nityakalyani Shakti Temple, and the vibrant weekly tribal haats of Hiranpur and Littipara.
              </p>
            </div>

            <div className="luxury-card rounded-2xl p-6 border border-[rgba(212,169,66,0.15)] space-y-2.5">
              <h3 className="font-serif font-bold text-base text-[#F5F0E8] flex items-center gap-2">
                <span className="text-[#D4A942]">Q.</span> How can tourists reach Pakur?
              </h3>
              <p className="text-xs sm:text-sm text-[#7A9180] font-body leading-relaxed">
                Pakur has a prominent Eastern Railway station (Station Code: PKR) with daily express trains from Kolkata (Howrah &amp; Sealdah), Bhagalpur, Patna, and Ranchi. By road, state highways connect Pakur directly to Dumka (65 km), Sahibganj (75 km), and Deoghar Airport (135 km).
              </p>
            </div>

            <div className="luxury-card rounded-2xl p-6 border border-[rgba(212,169,66,0.15)] space-y-2.5">
              <h3 className="font-serif font-bold text-base text-[#F5F0E8] flex items-center gap-2">
                <span className="text-[#D4A942]">Q.</span> When is the best time to visit Pakur?
              </h3>
              <p className="text-xs sm:text-sm text-[#7A9180] font-body leading-relaxed">
                The best season is from October to March. Autumn and winter offer pleasant, cool weather perfect for nature treks and outdoor exploration, with post-monsoon waterfalls flowing abundantly. November to January is also the season of traditional Santhal harvest festivities.
              </p>
            </div>
          </div>

          {/* Quick CTA Banner for About & Contact */}
          <div className="mt-12 max-w-5xl mx-auto luxury-card rounded-3xl p-6 sm:p-10 border border-[rgba(212,169,66,0.25)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#F5F0E8]">
                Planning an Eco-Expedition to Pakur?
              </h3>
              <p className="text-xs sm:text-sm text-[#7A9180] font-body">
                Learn more about our sustainable tourism mission or connect directly with our regional helpdesk.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl border border-[rgba(212,169,66,0.3)] text-[#D4A942] hover:bg-[rgba(212,169,66,0.08)] transition-all font-body"
              >
                About Pakur
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A942] to-[#E8C56D] text-[#08110B] hover:opacity-95 transition-all shadow-md font-body"
              >
                Contact Helpdesk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
