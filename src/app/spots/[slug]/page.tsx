export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSpotBySlug, getAllSpots, getReviewsForSpot } from '@/lib/dataAccess';
import CategoryBadge from '@/components/ui/CategoryBadge';
import DynamicMap from '@/components/map/DynamicMap';
import {
  MapPin,
  Calendar,
  Clock,
  Navigation,
  CheckCircle,
  Star,
  ArrowLeft,
  Info,
  Sparkles,
  Train,
  Ticket,
} from 'lucide-react';
import { formatCoordinates, getOsmDirectionsUrl, getGpsNavigationUrl } from '@/lib/utils';
import type { Metadata } from 'next';

interface SpotDetailsProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const spots = await getAllSpots();
  return spots.map((spot) => ({
    slug: spot.slug,
  }));
}

export async function generateMetadata({ params }: SpotDetailsProps): Promise<Metadata> {
  const spot = await getSpotBySlug(params.slug);
  if (!spot) return { title: 'Destination Not Found - Explore Pakur' };

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

  if (!spot) {
    notFound();
  }

  // Find reviews for this spot
  const reviews = await getReviewsForSpot(spot.id);

  return (
    <div className="min-h-screen pb-20 bg-[#0B130E] text-slate-100">
      {/* Back Navigation Bar */}
      <div className="bg-[#060B08] border-b border-emerald-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/spots"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#00F5A0] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Destinations</span>
          </Link>

          <span className="text-xs text-slate-500 font-medium">Pakur District • Jharkhand</span>
        </div>
      </div>

      {/* Hero Visual Section */}
      <div className="relative h-[380px] sm:h-[480px] w-full bg-[#060B08] overflow-hidden">
        <img
          src={spot.coverImage}
          alt={spot.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B130E] via-[#0B130E]/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={spot.category} size="lg" />
            <span className="text-xs text-[#00F5A0] bg-[#111E16]/90 border border-emerald-500/30 px-3 py-1 rounded-full backdrop-blur-md font-semibold">
              GPS Verified Destination
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-100 tracking-tight">
            {spot.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
            <span className="inline-flex items-center gap-1.5 bg-[#0B130E]/80 px-3 py-1 rounded-lg border border-emerald-500/20 backdrop-blur-sm">
              <MapPin size={15} className="text-[#00F5A0]" />
              <span>{formatCoordinates(spot.latitude, spot.longitude)}</span>
            </span>
            {spot.distanceFromPakurStation && (
              <span className="inline-flex items-center gap-1.5 bg-[#0B130E]/80 px-3 py-1 rounded-lg border border-emerald-500/20 backdrop-blur-sm">
                <Navigation size={15} className="text-teal-400" />
                <span>{spot.distanceFromPakurStation}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 8 Columns: Details, Highlights, Gallery, Map, Reviews */}
        <div className="lg:col-span-8 space-y-10">
          {/* Overview & Long Description */}
          <section className="bg-[#111E16] rounded-2xl border border-emerald-500/15 p-6 sm:p-8 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-slate-100">About {spot.title}</h2>
            <p className="text-slate-300 leading-relaxed text-base">
              {spot.longDescription || spot.description}
            </p>

            {/* Cultural / Historical Heritage Callout */}
            {spot.culturalNote && (
              <div className="mt-4 p-4.5 rounded-xl bg-[#16281E] border border-amber-500/30 flex items-start gap-3.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Cultural & Historical Heritage
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {spot.culturalNote}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Highlights & Key Features */}
          {spot.highlights && spot.highlights.length > 0 && (
            <section className="bg-[#111E16] rounded-2xl border border-emerald-500/15 p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-xl font-bold text-slate-100">Key Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {spot.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#16281E] border border-emerald-500/15 text-sm font-medium text-slate-200"
                  >
                    <CheckCircle size={16} className="text-[#00F5A0] shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Photo Gallery */}
          {spot.galleryImages && spot.galleryImages.length > 0 && (
            <section className="bg-[#111E16] rounded-2xl border border-emerald-500/15 p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-xl font-bold text-slate-100">Photo Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {spot.galleryImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-[#0B130E] group border border-emerald-500/15">
                    <img
                      src={img}
                      alt={`${spot.title} gallery photo ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interactive Spot Map */}
          <section className="bg-[#111E16] rounded-2xl border border-emerald-500/15 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Location & Geolocation</h2>
                <p className="text-xs text-slate-400">CartoDB Dark Matter map with OpenStreetMap routing</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getOsmDirectionsUrl(spot.latitude, spot.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#00F5A0] hover:bg-[#00e092] text-[#0B130E] px-3.5 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(0,245,160,0.25)]"
                >
                  <Navigation size={13} />
                  <span>Open OSM Route</span>
                </a>
                <a
                  href={getGpsNavigationUrl(spot.latitude, spot.longitude, spot.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#FF6B4A] hover:bg-[#ff5530] text-[#0B130E] font-bold px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,107,74,0.35)] active:scale-95"
                >
                  <MapPin size={13} className="text-[#00F5A0]" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

            <div className="h-[340px] w-full rounded-xl overflow-hidden border border-emerald-500/20">
              <DynamicMap
                spots={[spot]}
                center={[spot.latitude, spot.longitude]}
                zoom={13}
                selectedSpotId={spot.id}
                height="340px"
              />
            </div>
          </section>

          {/* Visitor Reviews */}
          <section className="bg-[#111E16] rounded-2xl border border-emerald-500/15 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100">Visitor Experiences</h2>
              <span className="text-xs font-semibold text-[#00F5A0] bg-[#16281E] px-2.5 py-1 rounded-lg border border-emerald-500/20">
                {reviews.length} Verified Reviews
              </span>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4.5 rounded-xl bg-[#16281E] border border-emerald-500/15 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-[#00F5A0]/20 text-[#00F5A0] border border-[#00F5A0]/40 flex items-center justify-center font-bold text-xs">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{rev.userName}</h4>
                          {rev.userLocation && (
                            <span className="text-[11px] text-slate-400">{rev.userLocation}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={13} className="fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No reviews yet for this spot. Be the first traveler to share your experience!</p>
            )}
          </section>
        </div>

        {/* Right 4 Columns: Sticky Quick Travel Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-20 bg-[#111E16] rounded-2xl border border-emerald-500/15 p-6 shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-slate-100 border-b border-emerald-500/15 pb-3">
              Essential Visitor Information
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#00F5A0] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-100">Best Visiting Months</span>
                  <span className="text-slate-400">{spot.bestTimeToVisit}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#00F5A0] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-100">Recommended Hours</span>
                  <span className="text-slate-400">{spot.timing || 'Daylight Hours (06:00 AM – 05:00 PM)'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ticket className="w-4 h-4 text-[#00F5A0] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-100">Entry Ticket</span>
                  <span className="text-slate-400">{spot.entryFee || 'Free Public Access'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Train className="w-4 h-4 text-[#00F5A0] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-100">Railway Connectivity</span>
                  <span className="text-slate-400">{spot.nearestRailway || 'Pakur Railway Station (PKR)'}</span>
                </div>
              </div>
            </div>

            {/* Travel Directions Action */}
            <div className="pt-4 border-t border-emerald-500/15 space-y-2.5">
              <a
                href={getOsmDirectionsUrl(spot.latitude, spot.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#00F5A0] hover:bg-[#00e092] text-[#0B130E] font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all active:scale-95"
              >
                <Navigation size={15} />
                <span>Get GPS Directions (Free OSM)</span>
              </a>

              <a
                href={getGpsNavigationUrl(spot.latitude, spot.longitude, spot.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#16281E] hover:bg-[#1D3528] text-slate-200 font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all border border-emerald-500/20"
              >
                <MapPin size={14} className="text-[#00F5A0]" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
