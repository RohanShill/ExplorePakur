import React from 'react';
import Link from 'next/link';
import { TouristSpot } from '@/types';
import CategoryBadge from './CategoryBadge';
import { MapPin, Calendar, ArrowRight, Compass, Sparkles, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExtendedTouristSpot extends TouristSpot {
  distanceKm?: number | null;
}

interface SpotCardProps {
  spot: ExtendedTouristSpot;
  featured?: boolean;
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot, featured = false }) => {
  // Mobile-friendly Google Maps driving directions intent URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}&travelmode=driving`;

  return (
    <div
      className={cn(
        'group relative flex flex-col bg-[#0e1913] rounded-2xl border transition-all duration-500 overflow-hidden',
        featured
          ? 'border-emerald-500/35 shadow-[0_4px_24px_rgba(0,245,160,0.08)] hover:border-[#00F5A0]/60 hover:shadow-[0_10px_32px_rgba(0,245,160,0.2)]'
          : 'border-emerald-500/15 shadow-lg hover:border-[#00F5A0]/45 hover:shadow-[0_10px_28px_rgba(0,245,160,0.12)]',
        'hover:-translate-y-1.5'
      )}
    >
      {/* Top Image Container with Smooth Cinematic Hover Zoom */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#070D09]">
        <img
          src={spot.coverImage}
          alt={spot.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Multi-stop Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1913] via-[#0e1913]/25 to-black/35 pointer-events-none" />

        {/* Top Floating Badges: Category & Live GPS Distance */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          <CategoryBadge category={spot.category} />
          {spot.distanceKm != null && (
            <span className="inline-flex items-center gap-1 bg-[#00F5A0] text-[#0B130E] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md animate-pulse">
              📍 {spot.distanceKm} km away
            </span>
          )}
        </div>

        {/* Featured / Top Pick Pill */}
        {featured && (
          <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 bg-black/70 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md shadow-md">
            <Sparkles size={11} className="text-amber-400" />
            <span>Top Pick</span>
          </div>
        )}

        {/* Bottom Floating Metadata Overlays */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-xs text-slate-200 pointer-events-none">
          {spot.bestTimeToVisit && (
            <span className="inline-flex items-center gap-1 bg-[#0B130E]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/25 text-[11px] font-semibold text-emerald-200 shadow-sm">
              <Calendar size={11} className="text-[#00F5A0]" />
              <span>{spot.bestTimeToVisit}</span>
            </span>
          )}
          {spot.distanceFromPakurStation && (
            <span className="inline-flex items-center gap-1 bg-[#0B130E]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/25 text-[11px] font-semibold text-amber-200 shadow-sm">
              <MapPin size={11} className="text-[#FFB300]" />
              <span>{spot.distanceFromPakurStation.split(' from')[0]}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col p-5 justify-between space-y-4">
        <div className="space-y-2">
          <Link href={`/spots/${spot.slug}`} className="focus:outline-none block group/title">
            <h3 className="text-lg sm:text-xl font-black text-slate-100 group-hover/title:text-[#00F5A0] transition-colors line-clamp-1 tracking-tight">
              {spot.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-normal min-h-[2.5rem]">
            {spot.description}
          </p>

          {/* Curated Highlight Tags */}
          {spot.highlights && spot.highlights.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1.5">
              {spot.highlights.slice(0, 3).map((h, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium bg-[#14241A] text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/15 truncate max-w-[150px]"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons: 1-Tap Google Maps & Guide */}
        <div className="pt-3 border-t border-emerald-500/10 flex items-center gap-2.5">
          <Link
            href={`/spots/${spot.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-200 bg-[#16281E] hover:bg-[#00F5A0] hover:text-[#0B130E] py-2.5 px-3 rounded-xl border border-emerald-500/20 hover:border-[#00F5A0] transition-all duration-300 shadow-sm active:scale-95 group/btn"
          >
            <Compass size={14} className="text-[#00F5A0] group-hover/btn:text-[#0B130E] transition-colors" />
            <span>Guide</span>
            <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-1" />
          </Link>

          {/* Prominent "See on Google Maps" Action Button */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black bg-gradient-to-r from-[#FF6B4A] to-[#FF8A65] hover:from-[#ff5530] hover:to-[#ff7043] text-[#0B130E] py-2.5 px-3.5 rounded-xl shadow-[0_2px_14px_rgba(255,107,74,0.35)] hover:shadow-[0_4px_20px_rgba(255,107,74,0.5)] transition-all active:scale-95 whitespace-nowrap"
            title="Open in Google Maps for turn-by-turn driving directions"
          >
            <Navigation size={13} />
            <span>See on Map</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SpotCard;
