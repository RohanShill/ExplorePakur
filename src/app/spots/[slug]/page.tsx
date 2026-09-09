export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSpotBySlug, getAllSpots, getReviewsForSpot } from "@/lib/dataAccess";
import CategoryBadge from "@/components/ui/CategoryBadge";
import DynamicMap from "@/components/map/DynamicMap";
import {
  MapPin, Calendar, Clock, Navigation, CheckCircle,
  Star, ArrowLeft, Sparkles, Train, Ticket,
} from "lucide-react";
import { formatCoordinates, getOsmDirectionsUrl, getGpsNavigationUrl } from "@/lib/utils";
import type { Metadata } from "next";

interface SpotDetailsProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const spots = await getAllSpots();
  return spots.map((spot) => ({ slug: spot.slug }));
}

export async function generateMetadata({ params }: SpotDetailsProps): Promise<Metadata> {
  const spot = await getSpotBySlug(params.slug);
  if (!spot) return { title: "Destination Not Found - Explore Pakur" };
  return {
    title: `${spot.title} | Pakur Eco-Tourism, Jharkhand`,
    description: spot.description,
    openGraph: {
      title: `${spot.title} - Explore Pakur`,
      description: spot.description,
      images: [{ url: spot.coverImage, width: 1200, height: 630, alt: spot.title }],
    },
  };
}

export default async function SpotDetailPage({ params }: SpotDetailsProps) {
  const spot = await getSpotBySlug(params.slug);
  if (!spot) notFound();

  const reviews = await getReviewsForSpot(spot.id);

  const infoItems = [
    { icon: Calendar, label: "Best Months",    value: spot.bestTimeToVisit },
    { icon: Clock,    label: "Visiting Hours",  value: spot.timing || "Daylight Hours (06:00 AM – 05:00 PM)" },
    { icon: Ticket,   label: "Entry",           value: spot.entryFee || "Free Public Access" },
    { icon: Train,    label: "Nearest Railway", value: spot.nearestRailway || "Pakur Railway Station (PKR)" },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg-base)" }}>

      {/* ── Breadcrumb ── */}
      <div className="border-b border-[rgba(212,169,66,0.1)]" style={{ background: "var(--bg-deep)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            href="/spots"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7A9180] hover:text-[#D4A942] transition-colors font-body"
          >
            <ArrowLeft size={14} />
            All Destinations
          </Link>
          <span className="text-[10px] sm:text-xs text-[#4A6254] font-body">Pakur · Jharkhand</span>
        </div>
      </div>

      {/* ── Cinematic Hero — shorter on mobile ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(240px, 50vw, 65vh)", background: "var(--bg-deep)" }}
      >
        <img
          src={spot.coverImage}
          alt={spot.title}
          className="w-full h-full object-cover"
          style={{ transform: "scale(1.04)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08110B] via-[#08110B]/40 to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08110B]/30 via-transparent to-transparent pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10 space-y-2.5 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={spot.category} size="md" />
              <span className="text-[10px] sm:text-xs text-[#00C785] bg-[rgba(0,199,133,0.1)] border border-[rgba(0,199,133,0.25)] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-md font-semibold font-body">
                GPS Verified
              </span>
            </div>

            <h1 className="font-serif font-bold text-[#F5F0E8] text-2xl sm:text-4xl md:text-5xl leading-tight drop-shadow-xl">
              {spot.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[rgba(3,8,6,0.8)] backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[rgba(212,169,66,0.2)] text-[11px] sm:text-xs text-[#D4A942] font-body">
                <MapPin size={11} />
                {formatCoordinates(spot.latitude, spot.longitude)}
              </span>
              {spot.distanceFromPakurStation && (
                <span className="inline-flex items-center gap-1.5 bg-[rgba(3,8,6,0.8)] backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[11px] sm:text-xs text-[#7A9180] font-body">
                  <Navigation size={11} />
                  {spot.distanceFromPakurStation}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky mobile CTA bar ── */}
      <div className="sticky top-0 z-30 lg:hidden border-b border-[rgba(212,169,66,0.1)] bg-[var(--bg-deep)]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2">
          <a
            href={getOsmDirectionsUrl(spot.latitude, spot.longitude)}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#00C785] text-[#030806] py-2.5 rounded-xl font-body"
          >
            <Navigation size={13} /> GPS Directions
          </a>
          <a
            href={getGpsNavigationUrl(spot.latitude, spot.longitude, spot.title)}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#D4A942] text-[#030806] py-2.5 rounded-xl font-body"
          >
            <MapPin size={13} /> Google Maps
          </a>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">

        {/* ── Left: Main Content ── */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">

          {/* Description */}
          <section className="bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.12)] p-5 sm:p-8 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 text-[#D4A942] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] font-body">
              <Sparkles size={12} />
              About This Destination
            </div>
            <p className="text-[#7A9180] text-sm sm:text-base leading-relaxed font-body">{spot.description}</p>
            {spot.culturalNote && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-[rgba(212,169,66,0.05)] border border-[rgba(212,169,66,0.15)]">
                <p className="text-[10px] sm:text-xs font-semibold text-[#D4A942] uppercase tracking-wider mb-1.5 font-body">Cultural Note</p>
                <p className="text-xs sm:text-sm text-[#7A9180] italic leading-relaxed font-body">{spot.culturalNote}</p>
              </div>
            )}
          </section>

          {/* Highlights */}
          {spot.highlights && spot.highlights.length > 0 && (
            <section className="bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.12)] p-5 sm:p-8 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#F5F0E8] font-serif">Highlights &amp; Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {spot.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-[rgba(212,169,66,0.04)] border border-[rgba(212,169,66,0.1)]">
                    <CheckCircle size={14} className="text-[#00C785] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#7A9180] font-body">{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Gallery */}
          {spot.galleryImages && spot.galleryImages.length > 0 && (
            <section className="bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.12)] p-5 sm:p-8 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#F5F0E8] font-serif">Photo Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {spot.galleryImages.map((img, idx) => (
                  <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-[rgba(212,169,66,0.1)]">
                    <img
                      src={img}
                      alt={`${spot.title} gallery ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Map */}
          <section className="bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.12)] p-5 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#F5F0E8] font-serif">Location &amp; Geolocation</h2>
                <p className="text-[11px] text-[#4A6254] mt-0.5 font-body">CartoDB Dark Matter map</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <a href={getOsmDirectionsUrl(spot.latitude, spot.longitude)} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[rgba(0,199,133,0.1)] hover:bg-[rgba(0,199,133,0.2)] text-[#00C785] border border-[rgba(0,199,133,0.25)] px-3 py-2 rounded-xl transition-all font-body">
                  <Navigation size={12} /> OSM Route
                </a>
                <a href={getGpsNavigationUrl(spot.latitude, spot.longitude, spot.title)} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#D4A942] hover:bg-[#E8C060] text-[#030806] px-3.5 py-2 rounded-xl transition-all font-body">
                  <MapPin size={12} /> Google Maps
                </a>
              </div>
            </div>
            <div className="h-[260px] sm:h-[320px] w-full rounded-xl overflow-hidden border border-[rgba(212,169,66,0.1)]">
              <DynamicMap spots={[spot]} center={[spot.latitude, spot.longitude]} zoom={13} selectedSpotId={spot.id} height="100%" />
            </div>
          </section>

          {/* Reviews */}
          <section className="bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.12)] p-5 sm:p-8 space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-[#F5F0E8] font-serif">Visitor Experiences</h2>
              <span className="text-[11px] sm:text-xs font-semibold text-[#D4A942] bg-[rgba(212,169,66,0.1)] border border-[rgba(212,169,66,0.2)] px-2.5 py-1 rounded-lg font-body">
                {reviews.length} Reviews
              </span>
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 sm:p-4 rounded-xl bg-[rgba(212,169,66,0.04)] border border-[rgba(212,169,66,0.1)] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[rgba(212,169,66,0.15)] text-[#D4A942] border border-[rgba(212,169,66,0.25)] flex items-center justify-center font-bold text-xs font-body shrink-0">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-[#F5F0E8] font-body">{rev.userName}</h4>
                          {rev.userLocation && <span className="text-[10px] text-[#4A6254] font-body">{rev.userLocation}</span>}
                        </div>
                      </div>
                      <div className="flex items-center text-[#D4A942]">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={11} className="fill-[#D4A942]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#7A9180] italic leading-relaxed font-body">&ldquo;{rev.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#4A6254] font-body">No reviews yet. Be the first!</p>
            )}
          </section>
        </div>

        {/* ── Right: Sticky Info Panel — hidden on mobile (sticky CTA bar used instead) ── */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.15)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] space-y-6">
            <h3 className="font-serif text-base font-bold text-[#F5F0E8] border-b border-[rgba(212,169,66,0.1)] pb-3">
              Essential Visitor Info
            </h3>
            <div className="space-y-4">
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[rgba(212,169,66,0.08)] shrink-0">
                    <Icon className="w-4 h-4 text-[#D4A942]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#D4A942] uppercase tracking-wider block font-body">{label}</span>
                    <span className="text-xs text-[#7A9180] font-body leading-relaxed">{value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-[rgba(212,169,66,0.1)] space-y-2.5">
              <a
                href={getOsmDirectionsUrl(spot.latitude, spot.longitude)}
                target="_blank" rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#00C785] hover:bg-[#00E596] text-[#030806] font-semibold text-sm py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(0,199,133,0.25)] transition-all active:scale-95 font-body"
              >
                <Navigation size={15} /> GPS Directions (OSM)
              </a>
              <a
                href={getGpsNavigationUrl(spot.latitude, spot.longitude, spot.title)}
                target="_blank" rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[rgba(212,169,66,0.08)] hover:bg-[rgba(212,169,66,0.15)] text-[#D4A942] font-medium text-sm py-3 px-4 rounded-xl border border-[rgba(212,169,66,0.25)] transition-all font-body"
              >
                <MapPin size={14} /> Open in Google Maps
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
