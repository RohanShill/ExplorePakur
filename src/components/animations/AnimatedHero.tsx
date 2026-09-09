"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Compass, MapPin, Sparkles, ChevronDown, Mountain, Waves } from "lucide-react";

interface Stats { spots: number; access: number; year: number; km: number; }

const AnimatedHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<Stats>({ spots: 0, access: 0, year: 1800, km: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(badgeRef.current, { opacity: 0, y: 16, duration: 0.6 })
        .from(titleRef.current, { opacity: 0, y: 32, duration: 1 }, "-=0.35")
        .from(subRef.current, { opacity: 0, y: 20, duration: 0.75 }, "-=0.55")
        .from(ctaRef.current, { opacity: 0, y: 16, scale: 0.97, duration: 0.65 }, "-=0.45")
        .from(statsRef.current?.children || [], { opacity: 0, y: 22, stagger: 0.1, duration: 0.65 }, "-=0.35")
        .from([card1Ref.current, card2Ref.current], { opacity: 0, scale: 0.88, stagger: 0.15, duration: 0.75 }, "-=0.5");

      const c = { spots: 0, access: 0, year: 1800, km: 0 };
      gsap.to(c, {
        spots: 6, access: 100, year: 1855, km: 120,
        duration: 2.2, ease: "power2.out",
        onUpdate: () => setStats({ spots: Math.round(c.spots), access: Math.round(c.access), year: Math.round(c.year), km: Math.round(c.km) }),
      });

      gsap.to(card1Ref.current, { y: -12, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(card2Ref.current, { y: 14, duration: 4.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.6 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const words = ["Discover", "the", "Untouched", "Jewel", "of", "Jharkhand"];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #030806 0%, #08110B 60%, #08110B 100%)" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=75')",
          transform: "scale(1.08)",
          opacity: 0.22,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030806]/90 via-[#08110B]/70 to-[#08110B]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030806]/80 via-transparent to-[#030806]/60" />

      {/* Ambient orbs */}
      <div className="absolute top-[25%] left-[15%] w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] bg-[#D4A942]/6 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[15%] right-[10%] w-[300px] sm:w-[450px] h-[250px] sm:h-[350px] bg-[#00C785]/6 blur-[100px] rounded-full pointer-events-none" />

      {/* Floating badges — desktop only */}
      <div
        ref={card1Ref}
        className="hidden lg:flex absolute top-36 left-8 xl:left-16 items-center gap-3 bg-[rgba(13,25,18,0.9)] border border-[rgba(212,169,66,0.25)] px-4 py-3.5 rounded-2xl backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
      >
        <div className="p-2.5 rounded-xl bg-[rgba(212,169,66,0.12)] text-[#D4A942]">
          <Mountain size={20} />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#F5F0E8] block font-body">Singarsi Peak</span>
          <span className="text-[11px] text-[#7A9180] font-body">Rajmahal Hills Vista</span>
        </div>
      </div>

      <div
        ref={card2Ref}
        className="hidden lg:flex absolute bottom-36 right-8 xl:right-16 items-center gap-3 bg-[rgba(13,25,18,0.9)] border border-[rgba(0,199,133,0.2)] px-4 py-3.5 rounded-2xl backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
      >
        <div className="p-2.5 rounded-xl bg-[rgba(0,199,133,0.12)] text-[#00C785]">
          <Waves size={20} />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#F5F0E8] block font-body">Lilatari Falls</span>
          <span className="text-[11px] text-[#7A9180] font-body">Monsoon Cascade</span>
        </div>
      </div>

      {/* ── Central content ── */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-5 sm:px-6 lg:px-8 text-center pt-28 pb-24 sm:pt-32 sm:pb-28 space-y-6 sm:space-y-8">

        {/* Badge */}
        <div ref={badgeRef} className="flex justify-center">
          <div className="inline-flex items-center gap-2 border border-[rgba(212,169,66,0.3)] text-[#D4A942] bg-[rgba(212,169,66,0.07)] px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold backdrop-blur-sm font-body">
            <Sparkles size={12} />
            Santhal Pargana&apos;s Hidden Gem
            <Sparkles size={12} />
          </div>
        </div>

        {/* Headline — responsive scaling */}
        <h1
          ref={titleRef}
          className="font-serif font-bold text-[#F5F0E8] leading-[1.12] text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        >
          {words.map((word, i) => {
            const highlight = word === "Untouched" || word === "Jewel" || word === "Jharkhand";
            return (
              <span key={i} className={highlight ? "text-gold-gradient" : ""}>
                {word}{i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="max-w-xl mx-auto text-[#7A9180] text-sm sm:text-base leading-relaxed font-body px-2"
        >
          Explore hidden basalt caverns, misty Rajmahal viewpoints, thermal springs, and the sacred homeland of the 1855 Santhal Hul rebellion — Pakur, Jharkhand.
        </p>

        {/* CTAs — stacked on small mobile, row on sm+ */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <Link
            href="#spots-section"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#D4A942] hover:bg-[#E8C060] text-[#030806] font-semibold px-7 py-3.5 rounded-xl shadow-[0_0_28px_rgba(212,169,66,0.35)] hover:shadow-[0_0_40px_rgba(212,169,66,0.5)] transition-all duration-300 active:scale-95 text-sm font-body"
          >
            <Compass size={17} />
            Explore Destinations
          </Link>
          <Link
            href="#map-section"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-transparent border border-[rgba(212,169,66,0.3)] text-[#F5F0E8] hover:bg-[rgba(212,169,66,0.07)] hover:border-[rgba(212,169,66,0.6)] font-medium px-7 py-3.5 rounded-xl transition-all duration-300 active:scale-95 text-sm font-body"
          >
            <MapPin size={17} className="text-[#D4A942]" />
            Interactive Map
          </Link>
        </div>

        {/* Stats — 2-col on mobile, 4-col on md+ */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto pt-6 sm:pt-8"
        >
          {[
            { value: `${stats.spots}+`, label: "Prime Eco-Spots",   color: "#D4A942" },
            { value: `${stats.access}%`,label: "Free Public Access", color: "#00C785" },
            { value: `${stats.year}`,   label: "Santhal Hul Legacy", color: "#D4A942" },
            { value: `${stats.km}km`,   label: "Trails & Routes",    color: "#00C785" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center py-3.5 px-2 border border-[rgba(212,169,66,0.1)] rounded-xl bg-[rgba(13,25,18,0.65)] backdrop-blur-sm"
            >
              <span className="text-xl sm:text-2xl font-bold font-serif" style={{ color: s.color }}>{s.value}</span>
              <span className="text-[10px] sm:text-[11px] text-[#7A9180] mt-1 text-center leading-tight font-body">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce text-[#7A9180]">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-body">Scroll</span>
        <ChevronDown size={15} />
      </div>
    </section>
  );
};

export default AnimatedHero;
