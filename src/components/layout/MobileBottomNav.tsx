"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Map, Navigation, Sparkles, ArrowUp } from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("explore");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      if (pathname === "/spots") { setActiveTab("spots"); return; }
      const mapSection = document.getElementById("map-section");
      const roadTripSection = document.getElementById("road-trip-section");
      if (mapSection) {
        const rect = mapSection.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) { setActiveTab("map"); return; }
      }
      if (roadTripSection) {
        const rect = roadTripSection.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) { setActiveTab("roadtrip"); return; }
      }
      setActiveTab("explore");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    {
      key: "explore",
      icon: Compass,
      label: "Explore",
      isActive: () => activeTab === "explore" && pathname === "/",
      onClick: () => { if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" }); },
      href: "/",
      isLink: true,
    },
    {
      key: "spots",
      icon: Sparkles,
      label: "Spots",
      isActive: () => pathname === "/spots",
      href: "/spots",
      isLink: true,
    },
    {
      key: "map",
      icon: Map,
      label: "Map",
      isActive: () => activeTab === "map" && pathname === "/",
      onClick: () => pathname === "/" ? scrollToSection("map-section") : (window.location.href = "/#map-section"),
      isLink: false,
    },
    {
      key: "roadtrip",
      icon: Navigation,
      label: "Road Trip",
      isActive: () => activeTab === "roadtrip" && pathname === "/",
      onClick: () => pathname === "/" ? scrollToSection("road-trip-section") : (window.location.href = "/#road-trip-section"),
      isLink: false,
    },
  ];

  return (
    <>
      {/* Back to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to Top"
          className="md:hidden fixed bottom-20 right-4 z-40 p-2.5 rounded-full bg-[rgba(13,25,18,0.92)] border border-[rgba(212,169,66,0.3)] text-[#D4A942] shadow-[0_0_15px_rgba(212,169,66,0.2)] backdrop-blur-md active:scale-95 transition-transform"
        >
          <ArrowUp size={17} />
        </button>
      )}

      {/* Bottom nav dock */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-3 left-3 right-3 z-50 max-w-sm mx-auto"
      >
        <div
          className="backdrop-blur-2xl border border-[rgba(212,169,66,0.2)] shadow-[0_12px_40px_rgba(0,0,0,0.85)] rounded-2xl p-1.5 flex items-center"
          style={{ background: "rgba(3,8,6,0.94)" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive();
            const baseClass = `flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
              active
                ? "bg-[rgba(212,169,66,0.12)] text-[#D4A942] shadow-inner"
                : "text-[#4A6254] hover:text-[#7A9180]"
            }`;

            if (item.isLink) {
              return (
                <Link key={item.key} href={item.href!} onClick={item.onClick} className={baseClass}>
                  <Icon size={18} />
                  <span className="text-[9px] font-semibold mt-1 tracking-tight font-body">{item.label}</span>
                  {active && <span className="w-1 h-1 rounded-full bg-[#D4A942] mt-0.5" />}
                </Link>
              );
            }
            return (
              <button key={item.key} onClick={item.onClick} className={baseClass}>
                <Icon size={18} />
                <span className="text-[9px] font-semibold mt-1 tracking-tight font-body">{item.label}</span>
                {active && <span className="w-1 h-1 rounded-full bg-[#D4A942] mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
