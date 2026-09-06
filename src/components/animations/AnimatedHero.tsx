'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Compass, Sparkles, MapPin, Trees, Mountain, ArrowRight } from 'lucide-react';

export const AnimatedHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const floatCard1Ref = useRef<HTMLDivElement>(null);
  const floatCard2Ref = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  // Counter values for stats
  const [stats, setStats] = useState({
    spots: 0,
    access: 0,
    historyYear: 1800,
  });

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Ambient Drifting Glow Orbs
      gsap.to(orb1Ref.current, {
        x: '+=60',
        y: '+=40',
        scale: 1.15,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(orb2Ref.current, {
        x: '-=50',
        y: '-=30',
        scale: 0.9,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      });

      // Split words inside title
      const titleWords = titleContainerRef.current?.querySelectorAll('.hero-word');

      tl.from(badgeRef.current, {
        opacity: 0,
        y: -25,
        duration: 0.8,
      })
        .from(
          titleWords || [],
          {
            opacity: 0,
            y: 40,
            duration: 0.9,
            stagger: 0.05,
            ease: 'power4.out',
          },
          '-=0.4'
        )
        .from(
          subtitleRef.current,
          {
            opacity: 0,
            y: 25,
            duration: 0.8,
          },
          '-=0.5'
        )
        .from(
          ctaRef.current,
          {
            opacity: 0,
            y: 20,
            scale: 0.95,
            duration: 0.7,
          },
          '-=0.5'
        )
        .from(
          statsRef.current?.children || [],
          {
            opacity: 0,
            y: 30,
            stagger: 0.1,
            duration: 0.7,
          },
          '-=0.4'
        )
        .from(
          [floatCard1Ref.current, floatCard2Ref.current],
          {
            opacity: 0,
            scale: 0.85,
            stagger: 0.15,
            duration: 0.8,
          },
          '-=0.5'
        );

      // Smooth number counter animation
      const countTarget = { spots: 0, access: 0, historyYear: 1800 };
      gsap.to(countTarget, {
        spots: 6,
        access: 100,
        historyYear: 1855,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => {
          setStats({
            spots: Math.round(countTarget.spots),
            access: Math.round(countTarget.access),
            historyYear: Math.round(countTarget.historyYear),
          });
        },
      });

      // Subtle ambient float on side badges
      gsap.to(floatCard1Ref.current, {
        y: -12,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(floatCard2Ref.current, {
        y: 14,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      });
    },
    { scope: containerRef }
  );

  const headline = "Explore Waterfalls, Caves & Santhal Heritage in Pakur";
  const words = headline.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#060B08] via-[#0B130E] to-[#0B130E] text-white pt-24 pb-28 md:pt-32 md:pb-40 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/10"
    >
      {/* Drifting Ambient Background Glow Orbs */}
      <div
        ref={orb1Ref}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#00F5A0]/10 blur-[140px] pointer-events-none rounded-full"
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-[#10B981]/15 blur-[120px] pointer-events-none rounded-full"
      />

      {/* Floating Decorative Badges (Desktop) */}
      <div
        ref={floatCard1Ref}
        className="hidden lg:flex absolute top-28 left-6 xl:left-20 items-center gap-3 bg-[#111E16]/80 border border-emerald-500/25 p-3.5 rounded-2xl backdrop-blur-xl shadow-2xl shadow-black/80 hover:border-[#00F5A0]/50 transition-colors"
      >
        <div className="p-2.5 rounded-xl bg-emerald-500/15 text-[#00F5A0]">
          <Mountain size={20} />
        </div>
        <div className="text-left pr-2">
          <span className="text-xs font-bold text-slate-100 block">Singarsi Peak</span>
          <span className="text-[11px] text-emerald-400 font-medium">Rajmahal Hills Vista</span>
        </div>
      </div>

      <div
        ref={floatCard2Ref}
        className="hidden lg:flex absolute bottom-24 right-6 xl:right-20 items-center gap-3 bg-[#111E16]/80 border border-emerald-500/25 p-3.5 rounded-2xl backdrop-blur-xl shadow-2xl shadow-black/80 hover:border-[#00F5A0]/50 transition-colors"
      >
        <div className="p-2.5 rounded-xl bg-[#00F5A0]/15 text-[#00F5A0]">
          <Trees size={20} />
        </div>
        <div className="text-left pr-2">
          <span className="text-xs font-bold text-slate-100 block">Lilatari Falls</span>
          <span className="text-[11px] text-emerald-400 font-medium">Monsoon Cascade</span>
        </div>
      </div>

      {/* Central Content Container */}
      <div className="relative max-w-4xl mx-auto text-center space-y-7">
        {/* Animated Badge */}
        <div ref={badgeRef} className="inline-block">
          <div className="inline-flex items-center gap-2 bg-[#111E16] border border-emerald-500/30 text-[#00F5A0] px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl shadow-lg shadow-black/50">
            <Sparkles size={14} className="text-[#00F5A0]" />
            <span>Discover The Untouched Jewel of Santhal Pargana</span>
          </div>
        </div>

        {/* Text Split Word Reveal Title */}
        <h1
          ref={titleContainerRef}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-100 leading-[1.15] flex flex-wrap justify-center gap-x-3 gap-y-1"
        >
          {words.map((word, idx) => {
            const isHighlight = word === "Waterfalls," || word === "Caves" || word === "Santhal" || word === "Pakur";
            return (
              <span
                key={idx}
                className={`hero-word inline-block ${
                  isHighlight
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#00F5A0] via-teal-300 to-emerald-400 font-extrabold"
                    : "text-slate-100"
                }`}
              >
                {word}
              </span>
            );
          })}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-normal"
        >
          Discover hidden basalt caverns, misty Rajmahal viewpoints, natural thermal springs, and the sacred homeland of the 1855 Santhal rebellion.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="pt-3 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="#spots-section"
            className="inline-flex items-center gap-2 bg-[#00F5A0] hover:bg-[#00e092] text-[#0B130E] font-black px-7 py-3.5 rounded-xl shadow-[0_0_25px_rgba(0,245,160,0.35)] transition-all active:scale-95 text-sm"
          >
            <Compass size={18} />
            <span>Explore Destinations</span>
          </Link>

          <Link
            href="#map-section"
            className="inline-flex items-center gap-2 bg-[#111E16] hover:bg-[#16281E] text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-emerald-500/25 shadow-md transition-all active:scale-95 text-sm"
          >
            <MapPin size={18} className="text-[#00F5A0]" />
            <span>Interactive Map</span>
          </Link>
        </div>

        {/* Stats Badges with Smooth GSAP Number Counter */}
        <div
          ref={statsRef}
          className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto border-t border-emerald-500/15"
        >
          <div className="flex flex-col items-center bg-[#111E16]/60 border border-emerald-500/10 p-3 rounded-xl backdrop-blur-sm">
            <span className="text-2xl sm:text-3xl font-black text-slate-100">{stats.spots}+</span>
            <span className="text-xs text-slate-400 mt-0.5">Prime Eco-Spots</span>
          </div>
          <div className="flex flex-col items-center bg-[#111E16]/60 border border-emerald-500/10 p-3 rounded-xl backdrop-blur-sm">
            <span className="text-2xl sm:text-3xl font-black text-[#00F5A0]">{stats.access}%</span>
            <span className="text-xs text-slate-400 mt-0.5">Free Public Access</span>
          </div>
          <div className="flex flex-col items-center bg-[#111E16]/60 border border-emerald-500/10 p-3 rounded-xl backdrop-blur-sm">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{stats.historyYear}</span>
            <span className="text-xs text-slate-400 mt-0.5">Santhal Hul Legacy</span>
          </div>
          <div className="flex flex-col items-center bg-[#111E16]/60 border border-emerald-500/10 p-3 rounded-xl backdrop-blur-sm">
            <span className="text-2xl sm:text-3xl font-black text-teal-300">0</span>
            <span className="text-xs text-slate-400 mt-0.5">Zero API Cost Maps</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero;
