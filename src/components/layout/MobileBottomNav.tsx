"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Compass, Map, Navigation, Sparkles, ArrowUp } from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("navigation");
  const [activeTab, setActiveTab] = useState<string>("explore");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const homePath = `/${locale}`;
  const spotsPath = `/${locale}/spots`;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      if (pathname === spotsPath || pathname?.includes("/spots")) { setActiveTab("spots"); return; }
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
  }, [pathname, spotsPath]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const isHome = pathname === homePath || pathname === `/${locale}/` || pathname === "/";

  const navItems = [
    {
      key: "explore",
      icon: Compass,
      label: t("home"),
      isActive: () => activeTab === "explore" && isHome,
      onClick: () => { if (isHome) window.scrollTo({ top: 0, behavior: "smooth" }); },
      href: homePath,
      isLink: true,
    },
    {
      key: "spots",
      icon: Sparkles,
      label: t("spots"),
      isActive: () => pathname === spotsPath || pathname?.includes("/spots"),
      href: spotsPath,
      isLink: true,
    },
    {
      key: "map",
      icon: Map,
      label: t("map"),
      isActive: () => activeTab === "map" && isHome,
      onClick: () => isHome ? scrollToSection("map-section") : (window.location.href = `${homePath}#map-section`),
      isLink: false,
    },
    {
      key: "roadtrip",
      icon: Navigation,
      label: locale === "hi" ? "रोड ट्रिप" : "Road Trip",
      isActive: () => activeTab === "roadtrip" && isHome,
      onClick: () => isHome ? scrollToSection("road-trip-section") : (window.location.href = `${homePath}#road-trip-section`),
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
