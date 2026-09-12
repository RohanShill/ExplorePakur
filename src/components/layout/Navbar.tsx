"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, Compass, MapPin, BookOpen, Info, Mail, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("navigation");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close drawer on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const navLinks = [
    { name: t("destinations"), href: `/${locale}/spots`,             icon: Compass  },
    { name: t("map"),          href: `/${locale}#map-section`,      icon: MapPin   },
    { name: t("santhalHeritage"), href: `/${locale}#heritage-section`, icon: BookOpen },
    { name: t("about"),        href: `/${locale}/about`,             icon: Info     },
    { name: t("contact"),      href: `/${locale}/contact`,           icon: Mail     },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled || isOpen
          ? "glass-nav shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Brand */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative h-9 w-9 sm:h-11 sm:w-11 rounded-xl overflow-hidden border border-[rgba(212,169,66,0.35)] shadow-[0_0_18px_rgba(212,169,66,0.2)] group-hover:shadow-[0_0_28px_rgba(212,169,66,0.35)] transition-all duration-300">
              <img src="/logo.png" alt="ExplorePakur Logo" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-[1.15rem] font-bold tracking-tight text-[#F5F0E8] font-serif leading-none">
                Explore<span className="text-gold-gradient">Pakur</span>
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase font-semibold tracking-[0.18em] text-[#7A9180] mt-0.5 font-body">
                {locale === 'hi' ? 'झारखंड ईको-टूरिज्म' : 'Jharkhand Eco-Tourism'}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 font-body group",
                    isActive ? "text-[#D4A942]" : "text-[#7A9180] hover:text-[#F5F0E8]"
                  )}
                >
                  <Icon size={14} />
                  <span>{link.name}</span>
                  <span className={cn(
                    "absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#D4A942] to-transparent transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  )} />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA + Language Switcher + Mobile toggle */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher variant="desktop" />

            <Link
              href={`/${locale}/spots`}
              className="hidden lg:inline-flex items-center gap-2 text-xs font-semibold bg-transparent border border-[rgba(212,169,66,0.4)] text-[#D4A942] hover:bg-[rgba(212,169,66,0.08)] hover:border-[rgba(212,169,66,0.7)] px-3.5 py-2 rounded-xl transition-all duration-300 font-body"
            >
              <Compass size={13} />
              {locale === 'hi' ? 'देखें' : 'Explore'}
              <ChevronRight size={12} />
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex md:hidden items-center justify-center h-9 w-9 rounded-xl text-[#7A9180] hover:text-[#F5F0E8] hover:bg-[rgba(212,169,66,0.08)] border border-transparent hover:border-[rgba(212,169,66,0.15)] transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="border-t border-[rgba(212,169,66,0.1)] px-4 py-3 space-y-2 bg-[rgba(3,8,6,0.98)] backdrop-blur-xl">
          <LanguageSwitcher variant="mobile" />

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all font-body",
                  isActive
                    ? "text-[#D4A942] bg-[rgba(212,169,66,0.08)] border border-[rgba(212,169,66,0.2)]"
                    : "text-[#7A9180] hover:text-[#F5F0E8] hover:bg-[rgba(255,255,255,0.04)]"
                )}
              >
                <Icon size={16} />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href={`/${locale}/spots`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold border border-[rgba(212,169,66,0.35)] text-[#D4A942] hover:bg-[rgba(212,169,66,0.1)] px-4 py-2.5 rounded-xl transition-all font-body"
            >
              <Compass size={15} />
              {t("allDestinations")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
