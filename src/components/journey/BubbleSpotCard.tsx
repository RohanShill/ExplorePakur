'use client';

import React from 'react';
import Link from 'next/link';
import { TouristSpot } from '@/types';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { MapPin, Calendar, ArrowRight, Compass, Sparkles, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BubbleSpotCardProps {
  spot: TouristSpot;
  isActive?: boolean;
  hasBeenVisited?: boolean;
  side?: 'left' | 'right';
  milestoneIndex?: number;
}

export const BubbleSpotCard: React.FC<BubbleSpotCardProps> = ({
  spot,
  isActive = false,
  hasBeenVisited = false,
  side = 'right',
  milestoneIndex = 1,
}) => {
  const isRevealed = isActive || hasBeenVisited;

  return (
    <div
      className={cn(
        'relative group w-full max-w-[285px] sm:max-w-sm md:max-w-md transition-all duration-700 ease-out',
        // Dynamic GSAP-style Pop-In physics
        isActive
          ? 'scale-100 opacity-100 translate-y-0 filter drop-shadow-[0_0_25px_rgba(255,107,74,0.35)]'
          : isRevealed
          ? 'scale-[0.98] opacity-90 translate-y-0'
          : 'scale-[0.85] opacity-25 translate-y-6 blur-[1px]'
      )}
    >
      {/* Dynamic Animated Arrow (Visible on Mobile & Desktop) */}
      <div
        className={cn(
          'flex items-center absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-500',
          side === 'right'
            ? '-left-6 sm:-left-14 lg:-left-20 flex-row'
            : '-right-6 sm:-right-14 lg:-right-20 flex-row-reverse',
          isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        )}
      >
        {/* Glowing Terracotta Arrow Beam Line */}
        <div className="w-5 sm:w-10 lg:w-16 h-[2.5px] sm:h-[3.5px] bg-gradient-to-r from-transparent via-[#FF6B4A] to-[#FF6B4A] shadow-[0_0_12px_#FF6B4A] animate-pulse" />
        
        {/* Arrowhead pointing into the card */}
        <div
          className={cn(
            'w-0 h-0 drop-shadow-[0_0_8px_#FF6B4A]',
            'border-y-[5px] sm:border-y-[7px] border-y-transparent',
            side === 'right'
              ? 'border-l-[10px] sm:border-l-[14px] border-l-[#FF6B4A]'
              : 'border-r-[10px] sm:border-r-[14px] border-r-[#FF6B4A]'
          )}
        />
      </div>

      {/* Cloud / Bubble Shaped Destination Card */}
      <div
        className={cn(
          'relative bg-[#111E16]/95 backdrop-blur-2xl rounded-2xl sm:rounded-[2.2rem] p-3.5 sm:p-5 md:p-6 border transition-all duration-500 shadow-2xl overflow-hidden',
          isActive
            ? 'border-[#FF6B4A] ring-2 ring-[#FF6B4A]/40 shadow-[0_0_35px_rgba(255,107,74,0.25)]'
            : isRevealed
            ? 'border-emerald-500/25 hover:border-[#FF6B4A]/50'
            : 'border-dashed border-emerald-500/20'
        )}
      >
        {/* Top Floating Cloud Pill & Live Trigger Badge */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <div className="inline-flex items-center gap-1 bg-[#0B130E] border border-amber-500/30 px-2 sm:px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400 shadow-md">
            <Sparkles size={9} className={isActive ? 'animate-spin text-[#FF6B4A]' : 'text-slate-400'} />
            <span>Stop #{milestoneIndex}</span>
          </div>

          {/* Pop-In Indicator (Terracotta Contrast) */}
          {isActive && (
            <div className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#0B130E] bg-[#FF6B4A] px-2 py-0.5 rounded-full shadow-[0_0_12px_#FF6B4A] animate-bounce">
              <Navigation size={9} />
              <span>Popped In!</span>
            </div>
          )}
        </div>

        <div className="flex flex-row items-center gap-3 sm:gap-4 pt-0.5">
          {/* Circular Glowing Image Bubble */}
          <div className="relative shrink-0 w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26 rounded-full p-1 bg-gradient-to-br from-[#FF6B4A] via-emerald-500 to-[#111E16] shadow-[0_0_20px_rgba(255,107,74,0.35)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0B130E]">
              <img
                src={spot.coverImage}
                alt={spot.title}
                loading="lazy"
                className={cn(
                  'w-full h-full object-cover transition-transform duration-700',
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                )}
              />
            </div>
            
            {/* Pop-up Pulse Ring in Terracotta */}
            {isActive && (
              <span className="absolute -inset-1 rounded-full border-2 border-[#FF6B4A] animate-ping opacity-60 pointer-events-none" />
            )}
          </div>

          {/* Card Content */}
          <div className="flex-1 min-w-0 text-left space-y-1 sm:space-y-1.5">
            <div className="flex flex-wrap items-center gap-1">
              <CategoryBadge category={spot.category} size="sm" />
              {spot.bestTimeToVisit && (
                <span className="hidden sm:inline-flex text-[9px] font-medium bg-[#16281E] text-slate-300 px-1.5 py-0.5 rounded border border-amber-500/20 items-center gap-0.5">
                  <Calendar size={9} className="text-[#FF6B4A]" />
                  <span>{spot.bestTimeToVisit}</span>
                </span>
              )}
            </div>

            <Link href={`/spots/${spot.slug}`} className="block group-hover:text-[#FF6B4A] transition-colors">
              <h3 className="text-xs sm:text-base md:text-lg font-black text-slate-100 truncate">
                {spot.title}
              </h3>
            </Link>

            <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-2 leading-tight font-normal">
              {spot.description}
            </p>

            {spot.distanceFromPakurStation && (
              <div className="flex items-center gap-1 text-[10px] text-amber-400 font-medium truncate">
                <MapPin size={10} className="shrink-0" />
                <span className="truncate">{spot.distanceFromPakurStation.split(' from')[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action CTA */}
        <div className="mt-3 pt-2.5 border-t border-emerald-500/15 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-medium hidden md:inline-block">
            GPS: {spot.latitude.toFixed(2)}°N, {spot.longitude.toFixed(2)}°E
          </span>

          <Link
            href={`/spots/${spot.slug}`}
            className="w-full md:w-auto inline-flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold bg-[#16281E] hover:bg-[#FF6B4A] text-slate-200 hover:text-[#0B130E] py-1.5 px-3 rounded-lg border border-emerald-500/25 hover:border-[#FF6B4A] transition-all duration-300 shadow-sm ml-auto"
          >
            <Compass size={11} />
            <span>Explore</span>
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BubbleSpotCard;
