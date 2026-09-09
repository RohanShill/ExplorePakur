'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { TouristSpot } from '@/types';
import {
  Compass,
  Navigation,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '@/lib/utils';

interface RoadTripJourneyProps {
  spots: TouristSpot[];
}

// Smart formatter for stop titles to avoid duplicates and awkward truncations
const formatStopTitle = (title: string): string => {
  let cleaned = title
    .replace(/^Hiranpur\s+/i, '')
    .replace(/\s*&\s*Forest Ashram/i, '')
    .replace(/\s*&\s*Tribal Craft Hub/i, '')
    .replace(/\s*&\s*Shrine/i, '')
    .replace(/\s*&\s*Caves/i, '')
    .replace(/Heritage Palace/i, 'Palace')
    .replace(/Murmu Park/i, 'Park')
    .replace(/Reserve & Stream/i, '')
    .replace(/Forest Reserve/i, '')
    .trim();

  if (cleaned.length < 3) {
    cleaned = title.split(' ').slice(0, 2).join(' ');
  }

  return cleaned.length > 18 ? cleaned.slice(0, 16) + '…' : cleaned;
};

export const RoadTripJourney: React.FC<RoadTripJourneyProps> = ({ spots }) => {
  // Use first 8 spots or all available for the expedition tour
  const expeditionSpots = React.useMemo(() => {
    return spots.length > 0 ? spots.slice(0, 8) : [];
  }, [spots]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Refs for GSAP animations
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const vehicleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const activeSpot = expeditionSpots[currentIndex] || expeditionSpots[0];

  // GSAP transition when slide changes
  const animateSlide = useCallback(
    (direction: 'next' | 'prev' = 'next') => {
      if (!imageRef.current || !contentRef.current) return;

      const xOffset = direction === 'next' ? 40 : -40;

      // 1. Cinematic Background Image Zoom & Soft Blur Focus
      gsap.fromTo(
        imageRef.current,
        {
          scale: 1.12,
          opacity: 0.6,
          filter: 'blur(6px)',
        },
        {
          scale: 1.0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
        }
      );

      // 2. Staggered Content Entrance Reveal
      const elements = contentRef.current.querySelectorAll('.stagger-reveal');
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          x: xOffset,
          y: 15,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power3.out',
        }
      );

      // 3. Drive the Mini Safari Vehicle on Highway Track
      if (vehicleRef.current && expeditionSpots.length > 0) {
        const percent = (currentIndex / Math.max(expeditionSpots.length - 1, 1)) * 100;
        gsap.to(vehicleRef.current, {
          left: `${percent}%`,
          duration: 0.7,
          ease: 'power2.out',
        });
      }
    },
    [currentIndex, expeditionSpots.length]
  );

  useEffect(() => {
    animateSlide();
  }, [currentIndex, animateSlide]);

  // Auto-play progress bar loop with GSAP
  useEffect(() => {
    if (!isPlaying || expeditionSpots.length <= 1) return;

    if (progressBarRef.current) {
      timelineRef.current = gsap.timeline({
        onComplete: () => {
          setCurrentIndex((prev) => (prev + 1) % expeditionSpots.length);
        },
      });

      timelineRef.current.fromTo(
        progressBarRef.current,
        { width: '0%' },
        { width: '100%', duration: 5, ease: 'none' }
      );
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [currentIndex, isPlaying, expeditionSpots.length]);

  const handleNext = () => {
    if (timelineRef.current) timelineRef.current.kill();
    setCurrentIndex((prev) => (prev + 1) % expeditionSpots.length);
  };

  const handlePrev = () => {
    if (timelineRef.current) timelineRef.current.kill();
    setCurrentIndex((prev) => (prev - 1 + expeditionSpots.length) % expeditionSpots.length);
  };

  const handleSelectSpot = (index: number) => {
    if (index === currentIndex) return;
    if (timelineRef.current) timelineRef.current.kill();
    setCurrentIndex(index);
  };

  // Touch handlers for mobile thumb-swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expeditionSpots.length]);

  if (!activeSpot) return null;

  const googleMapsUrl = getGoogleMapsDirectionsUrl(
    activeSpot.latitude,
    activeSpot.longitude
  );

  return (
    <div className="w-full space-y-4">
      {/* Expedition Journey Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111E16] border border-emerald-500/30 text-[#00F5A0] text-xs font-bold shadow-[0_0_12px_rgba(0,245,160,0.2)]">
            <Compass size={14} className="animate-spin-slow text-[#FF6B4A]" />
            <span className="uppercase tracking-wider">Scenic Circuit Route</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Pakur Road Trip Expedition
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A curated virtual voyage connecting Pakur's top waterfalls, ancient caves, and heritage landmarks.
          </p>
        </div>

        {/* Carousel Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause Auto-tour' : 'Play Auto-tour'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111E16] hover:bg-[#16281E] border border-emerald-500/20 text-xs font-bold text-slate-300 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={14} className="text-[#FF6B4A]" /> : <Play size={14} className="text-[#00F5A0]" />}
            <span>{isPlaying ? 'Pause Tour' : 'Resume'}</span>
          </button>

          <button
            onClick={handlePrev}
            aria-label="Previous Stop"
            className="p-2.5 rounded-xl bg-[#111E16] hover:bg-[#16281E] border border-emerald-500/20 text-slate-200 active:scale-95 transition-all"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Stop"
            className="p-2.5 rounded-xl bg-[#111E16] hover:bg-[#16281E] border border-emerald-500/20 text-slate-200 active:scale-95 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Cinematic Carousel Stage */}
      <div
        ref={slideContainerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full min-h-[480px] sm:min-h-[520px] rounded-3xl overflow-hidden bg-[#060B08] border border-emerald-500/25 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between"
      >
        {/* Auto-Play Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#00F5A0] via-[#FF6B4A] to-amber-400 shadow-[0_0_10px_#00F5A0]"
            style={{ width: '0%' }}
          />
        </div>

        {/* Dynamic Background Image with Smooth GSAP Zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            ref={imageRef}
            src={activeSpot.coverImage}
            alt={activeSpot.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Cinematic Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B130E] via-[#0B130E]/60 to-black/20" />
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#0B130E]/80 via-[#0B130E]/30 to-transparent" />
        </div>

        {/* Top Badges & Stop Indicator */}
        <div className="relative z-20 p-5 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#FF6B4A] text-[#0B130E] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,107,74,0.4)]">
              Stop #{currentIndex + 1} of {expeditionSpots.length}
            </span>
            <span className="bg-[#111E16]/90 backdrop-blur-md border border-emerald-500/30 text-[#00F5A0] text-xs font-bold px-3 py-1 rounded-full">
              {activeSpot.category}
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-slate-400 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            {activeSpot.latitude.toFixed(4)}° N, {activeSpot.longitude.toFixed(4)}° E
          </span>
        </div>

        {/* Center Content with GSAP Stagger Animations */}
        <div ref={contentRef} className="relative z-20 px-5 sm:px-8 py-4 max-w-2xl space-y-4">
          <h3 className="stagger-reveal text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-none drop-shadow-md">
            {activeSpot.title}
          </h3>

          <p className="stagger-reveal text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed drop-shadow">
            {activeSpot.description}
          </p>

          {/* Highlights & Distance Tags */}
          <div className="stagger-reveal flex flex-wrap items-center gap-2 pt-1 text-xs">
            {activeSpot.distanceFromPakurStation && (
              <span className="inline-flex items-center gap-1.5 bg-[#111E16]/90 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-lg backdrop-blur-md font-semibold">
                <MapPin size={13} className="text-amber-400" />
                <span>{activeSpot.distanceFromPakurStation}</span>
              </span>
            )}

            {activeSpot.bestTimeToVisit && (
              <span className="inline-flex items-center gap-1.5 bg-[#111E16]/90 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg backdrop-blur-md font-semibold">
                <Calendar size={13} className="text-[#00F5A0]" />
                <span>Season: {activeSpot.bestTimeToVisit}</span>
              </span>
            )}
          </div>

          {/* Action Navigation Buttons */}
          <div className="stagger-reveal pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/spots/${activeSpot.slug}`}
              className="inline-flex items-center gap-2 bg-[#00F5A0] hover:bg-[#00e092] text-[#0B130E] font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.35)] active:scale-95 transition-all"
            >
              <span>Explore Complete Guide</span>
              <ArrowRight size={15} />
            </Link>

            {/* 1-Tap Mobile Google Maps Navigation */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FF6B4A] hover:bg-[#ff5530] text-[#0B130E] font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(255,107,74,0.35)] active:scale-95 transition-all"
            >
              <Navigation size={15} />
              <span>See on Google Maps</span>
            </a>
          </div>
        </div>

        {/* Bottom Luxury Highway Track & Interactive Waypoints */}
        <div className="relative z-20 px-5 sm:px-8 py-5 bg-[#08100B]/90 backdrop-blur-2xl border-t border-emerald-500/20">
          {/* Active Stop Status Caption */}
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-ping" />
              <span className="text-slate-400">Current Milestone:</span>
              <span className="text-[#00F5A0] font-bold">
                Stop #{currentIndex + 1} — {activeSpot.title}
              </span>
            </div>
            <span className="text-slate-500 text-[11px] hidden sm:inline">
              Tap any waypoint or chip to travel directly
            </span>
          </div>

          {/* Highway Progress Track Line */}
          <div className="relative w-full h-8 flex items-center">
            {/* The Base Road Channel */}
            <div className="absolute inset-x-0 h-2 bg-[#060B08] rounded-full border border-emerald-500/20 overflow-hidden shadow-inner">
              {/* Dynamic Illuminating Progress Gradient Fill */}
              <div
                className="h-full bg-gradient-to-r from-[#00F5A0] via-emerald-400 to-[#FF6B4A] transition-all duration-500 ease-out shadow-[0_0_12px_rgba(0,245,160,0.5)]"
                style={{
                  width: `${(currentIndex / Math.max(expeditionSpots.length - 1, 1)) * 100}%`,
                }}
              />
            </div>

            {/* Glowing Safari Rover Indicator (GSAP smoothly slides along the line) */}
            <div
              ref={vehicleRef}
              className="absolute -top-3.5 -translate-x-1/2 z-30 transition-transform pointer-events-none"
              style={{ left: '0%' }}
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0B130E] border-2 border-[#00F5A0] shadow-[0_0_20px_rgba(0,245,160,0.6)] text-[#00F5A0]">
                {/* Sleek Off-road 4x4 Rover SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                  <circle cx="7.5" cy="14.5" r="1.5"/>
                  <circle cx="16.5" cy="14.5" r="1.5"/>
                </svg>
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#00F5A0] shadow-[0_0_6px_#00F5A0]" />
              </div>
            </div>

            {/* Milestone Checkpoint Nodes */}
            <div className="relative w-full flex items-center justify-between z-10 px-1">
              {expeditionSpots.map((spot, idx) => {
                const isActive = idx === currentIndex;
                const isPassed = idx < currentIndex;
                const shortTitle = formatStopTitle(spot.title);

                return (
                  <button
                    key={spot.id}
                    onClick={() => handleSelectSpot(idx)}
                    title={`Stop #${idx + 1}: ${spot.title}`}
                    className="group relative flex flex-col items-center focus:outline-none -my-2 py-2"
                  >
                    {/* Node Dot / Halo */}
                    <div
                      className={`relative flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'w-5 h-5 rounded-full bg-[#00F5A0] ring-4 ring-[#00F5A0]/25 shadow-[0_0_16px_#00F5A0] scale-110'
                          : isPassed
                          ? 'w-3.5 h-3.5 rounded-full bg-[#FF6B4A] shadow-[0_0_8px_rgba(255,107,74,0.4)] hover:scale-125'
                          : 'w-3 h-3 rounded-full bg-[#16281E] border border-emerald-500/30 hover:border-[#00F5A0] hover:scale-125'
                      }`}
                    >
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#0B130E]" />
                      )}
                    </div>

                    {/* Milestone Stop Name (Desktop) */}
                    <span
                      className={`hidden lg:block absolute top-7 text-[11px] font-bold tracking-tight whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'text-[#00F5A0] font-black scale-105 drop-shadow-[0_0_8px_rgba(0,245,160,0.5)]'
                          : isPassed
                          ? 'text-slate-300'
                          : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    >
                      {shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Waypoint Chips Rail (Smooth scrollable on mobile & desktop) */}
          <div className="mt-7 pt-3 border-t border-emerald-500/10 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {expeditionSpots.map((spot, idx) => {
              const isActive = idx === currentIndex;
              const shortTitle = formatStopTitle(spot.title);
              return (
                <button
                  key={`chip-${spot.id}`}
                  onClick={() => handleSelectSpot(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#00F5A0] text-[#0B130E] font-bold shadow-[0_0_15px_rgba(0,245,160,0.3)] scale-105'
                      : 'bg-[#0B130E] text-slate-400 border border-emerald-500/15 hover:border-emerald-500/40 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                      isActive ? 'bg-[#0B130E] text-[#00F5A0]' : 'bg-[#111E16] text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>{shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadTripJourney;