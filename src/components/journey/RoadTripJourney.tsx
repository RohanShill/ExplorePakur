'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from "next-intl";
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
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '@/lib/utils';

interface RoadTripJourneyProps {
  spots: TouristSpot[];
}

export const RoadTripJourney: React.FC<RoadTripJourneyProps> = ({ spots }) => {
  const t = useTranslations("home");
  const locale = useLocale();
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
        const percent = (currentIndex / (expeditionSpots.length - 1)) * 100;
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
    activeSpot.longitude,
    activeSpot.title
  );

  return (
    <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[#FF6B4A] text-xs font-black uppercase tracking-widest">
            <Compass size={14} className="animate-spin-slow" />
            <span>{t("safariBadge")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight mt-1">
            {t("safariTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            {t("safariDesc")}
          </p>
        </div>

        {/* Play / Pause & Prev / Next Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111E16] hover:bg-[#16281E] border border-emerald-500/20 text-slate-300 text-xs font-bold transition-all"
            title={isPlaying ? t('autoTour') : t('paused')}
          >
            {isPlaying ? <Pause size={13} className="text-[#00F5A0]" /> : <Play size={13} className="text-[#FF6B4A]" />}
            <span className="hidden sm:inline">{isPlaying ? t('autoTour') : t('paused')}</span>
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
              href={`/${locale}/spots/${activeSpot.slug}`}
              className="inline-flex items-center gap-2 bg-[#00F5A0] hover:bg-[#00e092] text-[#0B130E] font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.35)] active:scale-95 transition-all"
            >
              <span>{t('exploreSpot')}</span>
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
              <span>{t('getDirections')}</span>
            </a>
          </div>
        </div>

        {/* Bottom Horizontal Mini-Highway Track with Animated Safari Vehicle */}
        <div className="relative z-20 px-4 sm:px-8 py-5 bg-[#0B130E]/85 backdrop-blur-xl border-t border-emerald-500/20">
          <div className="relative w-full h-8 flex items-center">
            {/* The Road Surface Strip */}
            <div className="absolute inset-x-0 h-3 bg-[#111E16] rounded-full border border-emerald-900/40 overflow-hidden">
              {/* Dashed Center Road Line */}
              <div className="w-full h-full border-b border-dashed border-[#FF6B4A]/50 -mt-1.5" />
            </div>

            {/* Animated 4x4 Safari Jeep Icon (GSAP position tracking) */}
            <div
              ref={vehicleRef}
              className="absolute -top-3.5 -translate-x-1/2 z-20 transition-transform pointer-events-none"
              style={{ left: '0%' }}
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#111E16] border-2 border-[#00F5A0] shadow-[0_0_15px_#00F5A0] text-sm animate-bounce-subtle">
                <span>🚙</span>
              </div>
            </div>

            {/* Milestone Checkpoint Dots along the road */}
            <div className="relative w-full flex items-center justify-between z-10">
              {expeditionSpots.map((spot, idx) => {
                const isActive = idx === currentIndex;
                const isPassed = idx < currentIndex;
                return (
                  <button
                    key={spot.id}
                    onClick={() => handleSelectSpot(idx)}
                    title={spot.title}
                    className="group relative flex flex-col items-center focus:outline-none"
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-[#00F5A0] ring-4 ring-[#00F5A0]/30 scale-125'
                          : isPassed
                          ? 'bg-[#FF6B4A]'
                          : 'bg-zinc-700 hover:bg-zinc-500'
                      }`}
                    />
                    <span
                      className={`hidden md:block absolute top-5 text-[10px] font-bold tracking-tight whitespace-nowrap transition-colors ${
                        isActive ? 'text-[#00F5A0]' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {spot.title.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadTripJourney;
