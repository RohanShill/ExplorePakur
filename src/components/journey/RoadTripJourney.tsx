'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
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
  Eye,
  Volume2,
  VolumeX,
  Footprints,
  Maximize2,
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '@/lib/utils';

interface RoadTripJourneyProps {
  spots: TouristSpot[];
}

const CATEGORY_COLORS: Record<string, { accent: string; text: string; bg: string; badge: string; icon: string }> = {
  Waterfall: {
    accent: '#00E5FF',
    text: 'text-cyan-300',
    bg: 'bg-cyan-950/50 border-cyan-500/30',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: '🌊',
  },
  'Cave & Hill': {
    accent: '#00F5A0',
    text: 'text-emerald-300',
    bg: 'bg-emerald-950/50 border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-[#00F5A0] border-emerald-500/40',
    icon: '⛰️',
  },
  'Thermal Spring': {
    accent: '#FFB300',
    text: 'text-amber-300',
    bg: 'bg-amber-950/50 border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: '♨️',
  },
  'Park & Heritage': {
    accent: '#A78BFA',
    text: 'text-purple-300',
    bg: 'bg-purple-950/50 border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: '🏛️',
  },
  'Local Market & Culture': {
    accent: '#FF6B4A',
    text: 'text-rose-300',
    bg: 'bg-rose-950/50 border-rose-500/30',
    badge: 'bg-rose-500/20 text-[#FF6B4A] border-rose-500/40',
    icon: '🛍️',
  },
};

// Smart formatter for stop titles
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

  return cleaned.length > 20 ? cleaned.slice(0, 18) + '…' : cleaned;
};

export const RoadTripJourney: React.FC<RoadTripJourneyProps> = ({ spots }) => {
  // Use first 8 spots or all available for the expedition tour
  const expeditionSpots = useMemo(() => {
    return spots.length > 0 ? spots.slice(0, 8) : [];
  }, [spots]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundActive, setSoundActive] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Refs for animations
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioOscRef = useRef<OscillatorNode | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const activeSpot = expeditionSpots[currentIndex] || expeditionSpots[0];
  const catStyle = CATEGORY_COLORS[activeSpot?.category] || CATEGORY_COLORS['Cave & Hill'];

  // Calculate next 2 upcoming stops for preview cards
  const upcomingStops = useMemo(() => {
    if (expeditionSpots.length <= 1) return [];
    const next1 = (currentIndex + 1) % expeditionSpots.length;
    const next2 = (currentIndex + 2) % expeditionSpots.length;
    return [
      { spot: expeditionSpots[next1], index: next1 },
      { spot: expeditionSpots[next2], index: next2 },
    ];
  }, [currentIndex, expeditionSpots]);

  // Ambient chime synthesizer for immersive soundscape
  const toggleAmbientSound = () => {
    if (!soundActive) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4 gentle ambient drone

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioCtxRef.current = ctx;
        audioOscRef.current = osc;
        audioGainRef.current = gain;
        setSoundActive(true);
      } catch {
        // AudioContext restricted or unsupported
      }
    } else {
      if (audioOscRef.current) {
        try {
          audioOscRef.current.stop();
          audioOscRef.current.disconnect();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
      setSoundActive(false);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioOscRef.current) {
        try {
          audioOscRef.current.stop();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  // GSAP transition when slide changes
  const animateSlide = useCallback(
    (direction: 'next' | 'prev' = 'next') => {
      if (!imageRef.current || !contentRef.current) return;

      const xOffset = direction === 'next' ? 30 : -30;

      // 1. Cinematic Background Image Zoom & Soft Vignette Focus
      gsap.fromTo(
        imageRef.current,
        {
          scale: 1.15,
          opacity: 0.5,
          filter: 'blur(8px)',
        },
        {
          scale: 1.0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.0,
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
          y: 18,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: 'power3.out',
        }
      );
    },
    []
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
        { width: '100%', duration: 6, ease: 'none' }
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
    <div className="w-full space-y-4 my-2">
      {/* 1. Header Bar with Category Filters Context & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111E16] border border-emerald-500/30 text-[#00F5A0] text-xs font-bold shadow-[0_0_15px_rgba(0,245,160,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-ping" />
            <span className="uppercase tracking-widest text-[10px]">Curated Expedition Portal</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            Pakur Grand Tour Circuit
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Take a cinematic virtual expedition across Pakur's ancient volcanic hills, hidden jungle cascades, and living tribal heritage.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleAmbientSound}
            title={soundActive ? 'Mute ambient sound' : 'Play peaceful ambient sound'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              soundActive
                ? 'bg-emerald-500/20 border-[#00F5A0] text-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.3)]'
                : 'bg-[#111E16] border-emerald-500/20 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundActive ? (
              <>
                <Volume2 size={14} className="text-[#00F5A0] animate-pulse" />
                <span className="hidden md:inline">Wilderness Audio (On)</span>
              </>
            ) : (
              <>
                <VolumeX size={14} />
                <span className="hidden md:inline">Ambient Audio</span>
              </>
            )}
          </button>

          {/* Autoplay Pause / Play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause Auto-tour' : 'Play Auto-tour'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111E16] hover:bg-[#16281E] border border-emerald-500/20 text-xs font-bold text-slate-300 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={14} className="text-[#FF6B4A]" /> : <Play size={14} className="text-[#00F5A0]" />}
            <span className="hidden sm:inline">{isPlaying ? 'Auto-Touring' : 'Paused'}</span>
          </button>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-1 bg-[#111E16] p-1 rounded-xl border border-emerald-500/20">
            <button
              onClick={handlePrev}
              aria-label="Previous Stop"
              className="p-1.5 rounded-lg hover:bg-[#16281E] text-slate-300 hover:text-white active:scale-95 transition-all"
              title="Previous (or Press Left Arrow)"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-400 px-1">
              {currentIndex + 1}/{expeditionSpots.length}
            </span>
            <button
              onClick={handleNext}
              aria-label="Next Stop"
              className="p-1.5 rounded-lg hover:bg-[#16281E] text-slate-300 hover:text-white active:scale-95 transition-all"
              title="Next (or Press Right Arrow)"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Cinematic Stage with Interactive 3D Side-Deck */}
      <div
        ref={slideContainerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full rounded-3xl overflow-hidden bg-[#060B08] border border-emerald-500/25 shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col justify-between"
      >
        {/* Top Seamless Auto-Play Timer Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#00F5A0] via-[#FF6B4A] to-amber-400 shadow-[0_0_12px_#00F5A0]"
            style={{ width: '0%' }}
          />
        </div>

        {/* Dynamic Background Image with Zoom Blur Effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            ref={imageRef}
            src={activeSpot.coverImage}
            alt={activeSpot.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-Angle Atmospheric Gradient Overlays for High-Contrast Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D09] via-[#070D09]/75 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070D09] via-[#070D09]/80 md:via-[#070D09]/60 to-transparent" />
        </div>

        {/* Top Badges & Radar Telemetry */}
        <div className="relative z-20 p-4 sm:p-6 lg:p-8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#FF6B4A] text-[#0B130E] text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-[0_0_18px_rgba(255,107,74,0.5)] flex items-center gap-1.5">
              <span>{catStyle.icon}</span>
              <span>STOP #{currentIndex + 1} OF {expeditionSpots.length}</span>
            </span>

            <span className={`backdrop-blur-md border text-xs font-bold px-3 py-1.5 rounded-full ${catStyle.badge}`}>
              {activeSpot.category}
            </span>
          </div>

          {/* Compass GPS Telemetry Pill */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            <Compass size={13} className="text-[#00F5A0] animate-spin-slow" />
            <span>{activeSpot.latitude.toFixed(4)}° N, {activeSpot.longitude.toFixed(4)}° E</span>
          </div>
        </div>

        {/* Center Stage: Split Screen between Story Card and Interactive Up Next Deck */}
        <div className="relative z-20 px-4 sm:px-6 lg:px-8 py-2 sm:py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Primary Experience Story Card */}
          <div ref={contentRef} className="lg:col-span-7 space-y-4 max-w-2xl">
            <div className="stagger-reveal space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00F5A0] flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#FF6B4A]" />
                <span>Featured Destination</span>
              </span>
              <h3 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight drop-shadow-md">
                {activeSpot.title}
              </h3>
            </div>

            <p className="stagger-reveal text-sm sm:text-base text-slate-200 line-clamp-3 leading-relaxed drop-shadow font-normal">
              {activeSpot.description}
            </p>

            {/* Travel Insights Pill Grid */}
            <div className="stagger-reveal grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {activeSpot.distanceFromPakurStation && (
                <div className="bg-[#111E16]/80 backdrop-blur-md border border-emerald-500/20 rounded-xl p-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin size={12} className="text-amber-400 shrink-0" />
                    <span className="truncate">{activeSpot.distanceFromPakurStation.split(' from')[0]}</span>
                  </span>
                </div>
              )}

              {activeSpot.bestTimeToVisit && (
                <div className="bg-[#111E16]/80 backdrop-blur-md border border-emerald-500/20 rounded-xl p-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Season</span>
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 mt-0.5 truncate">
                    <Calendar size={12} className="text-[#00F5A0] shrink-0" />
                    <span className="truncate">{activeSpot.bestTimeToVisit}</span>
                  </span>
                </div>
              )}

              {activeSpot.timing && (
                <div className="bg-[#111E16]/80 backdrop-blur-md border border-emerald-500/20 rounded-xl p-2.5 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Visiting Hours</span>
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5 truncate">
                    <Clock size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{activeSpot.timing}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Cultural or Highlight Teaser */}
            {activeSpot.culturalNote && (
              <div className="stagger-reveal p-3 rounded-xl bg-[#0B130E]/75 border border-emerald-500/25 text-xs text-slate-300 flex items-start gap-2 backdrop-blur-sm">
                <Footprints size={15} className="text-[#FF6B4A] shrink-0 mt-0.5" />
                <p className="line-clamp-2 leading-relaxed">
                  <strong className="text-slate-200">Local Lore:</strong> {activeSpot.culturalNote}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="stagger-reveal pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={`/spots/${activeSpot.slug}`}
                className="inline-flex items-center gap-2 bg-[#00F5A0] hover:bg-[#00e092] text-[#0B130E] font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-[0_0_25px_rgba(0,245,160,0.4)] active:scale-95 transition-all group"
              >
                <span>Explore Complete Guide</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FF6B4A] hover:bg-[#ff5530] text-[#0B130E] font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-[0_0_25px_rgba(255,107,74,0.35)] active:scale-95 transition-all"
              >
                <Navigation size={16} />
                <span>See on Google Maps</span>
              </a>
            </div>
          </div>

          {/* Right Column: "Up Next" Interactive Preview Deck (Hooks the visitor) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col gap-3 justify-center pl-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5 text-[#00F5A0]">
                <Eye size={13} />
                <span>Coming Up on This Expedition:</span>
              </span>
              <span className="text-[10px] text-slate-500">Tap to jump</span>
            </div>

            {upcomingStops.map(({ spot: upcomingSpot, index: upcomingIdx }, idx) => (
              <div
                key={upcomingSpot.id}
                onClick={() => handleSelectSpot(upcomingIdx)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#0B130E]/85 hover:bg-[#111E16] border border-emerald-500/20 hover:border-[#00F5A0]/60 p-3 flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,245,160,0.2)] backdrop-blur-xl"
              >
                {/* Thumbnail with overlay stop badge */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-emerald-500/20">
                  <img
                    src={upcomingSpot.coverImage}
                    alt={upcomingSpot.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-1 left-1 text-[9px] font-black px-1.5 py-0.5 rounded bg-black/80 text-[#00F5A0] border border-emerald-500/30">
                    #{upcomingIdx + 1}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-bold text-[#FF6B4A] uppercase tracking-wider block">
                    {upcomingSpot.category}
                  </span>
                  <h4 className="text-sm font-black text-slate-100 group-hover:text-[#00F5A0] transition-colors truncate">
                    {upcomingSpot.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {upcomingSpot.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                    <span>Jump to Stop #{upcomingIdx + 1}</span>
                    <ArrowRight size={10} className="text-[#00F5A0] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bottom Interactive Expedition Rail with Visual Postcard Thumbnails */}
        <div className="relative z-20 px-4 sm:px-6 lg:px-8 py-4 bg-[#050A07]/92 backdrop-blur-2xl border-t border-emerald-500/20 mt-4">
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00F5A0] shadow-[0_0_8px_#00F5A0]" />
              <span className="text-slate-400">Expedition Route:</span>
              <span className="text-slate-100 font-bold">
                Stop {currentIndex + 1} of {expeditionSpots.length}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">←</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">→</kbd>
              <span>Keyboard Navigation</span>
            </div>
          </div>

          {/* Postcard Thumbnail Strip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-500/30">
            {expeditionSpots.map((spot, idx) => {
              const isActive = idx === currentIndex;
              const isPassed = idx < currentIndex;
              const shortTitle = formatStopTitle(spot.title);

              return (
                <button
                  key={spot.id}
                  onClick={() => handleSelectSpot(idx)}
                  className={`group relative flex items-center gap-3 p-2 rounded-2xl text-left transition-all duration-300 shrink-0 min-w-[200px] sm:min-w-[220px] ${
                    isActive
                      ? 'bg-[#111E16] border-2 border-[#00F5A0] shadow-[0_0_20px_rgba(0,245,160,0.35)] scale-[1.03]'
                      : isPassed
                      ? 'bg-[#0B130E]/90 border border-emerald-500/25 hover:border-[#00F5A0]/60'
                      : 'bg-[#0B130E]/70 border border-white/5 hover:border-emerald-500/30'
                  }`}
                >
                  {/* Photo Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-emerald-500/20">
                    <img
                      src={spot.coverImage}
                      alt={spot.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      className={`absolute top-0.5 left-0.5 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ${
                        isActive
                          ? 'bg-[#00F5A0] text-[#0B130E]'
                          : isPassed
                          ? 'bg-[#FF6B4A] text-[#0B130E]'
                          : 'bg-black/80 text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  </div>

                  {/* Title & Category Info */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider block truncate ${
                        isActive ? 'text-[#00F5A0]' : 'text-slate-400'
                      }`}
                    >
                      {spot.category}
                    </span>
                    <h5
                      className={`text-xs font-black truncate ${
                        isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {shortTitle}
                    </h5>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {spot.distanceFromPakurStation?.split(' from')[0] || 'Pakur District'}
                    </span>
                  </div>
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