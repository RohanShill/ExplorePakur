'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass, Map, BookOpen, Trees } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Destinations', href: '/spots', icon: Compass },
    { name: 'District Map', href: '/#map-section', icon: Map },
    { name: 'Santhal Heritage', href: '/#heritage-section', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0B130E]/80 border-b border-emerald-900/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF6B4A] via-emerald-600 to-emerald-800 flex items-center justify-center text-slate-100 shadow-md shadow-[#FF6B4A]/25 group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-100 font-sans">
                Explore<span className="text-[#FF6B4A]">Pakur</span>
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-400/90 -mt-1">
                Jharkhand Eco-Tourism
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-[#111E16] text-[#00F5A0] border border-emerald-500/30 shadow-[0_0_15px_rgba(0,245,160,0.15)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#111E16]/60'
                  )}
                >
                  <Icon size={16} className={isActive ? 'text-[#00F5A0]' : 'text-slate-400'} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Direct CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/spots"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#00F5A0] hover:bg-[#00e092] text-[#0B130E] px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.25)] transition-all active:scale-95"
            >
              <Trees size={14} />
              <span>Explore All Spots</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-[#111E16] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-emerald-900/30 bg-[#0B130E]/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-[#111E16] text-[#00F5A0] border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-[#111E16]'
                )}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              href="/spots"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full text-sm font-bold bg-[#FF6B4A] hover:bg-[#ff5530] text-[#0B130E] px-4 py-3 rounded-xl shadow-lg shadow-[#FF6B4A]/25 active:scale-98 transition-all"
            >
              <Compass size={16} />
              <span>Browse All 6 Destinations</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
