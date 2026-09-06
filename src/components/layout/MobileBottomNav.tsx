'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Map, Navigation, MessageSquareShare, ArrowUp } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/utils';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Simple active tab detector
      const mapSection = document.getElementById('map-section');
      const roadTripSection = document.getElementById('road-trip-section');

      if (mapSection) {
        const rect = mapSection.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          setActiveTab('map');
          return;
        }
      }

      if (roadTripSection) {
        const rect = roadTripSection.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          setActiveTab('roadtrip');
          return;
        }
      }

      if (pathname === '/spots') {
        setActiveTab('spots');
      } else {
        setActiveTab('explore');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl = buildWhatsAppLink(
    '919431100001',
    'Johar! I am visiting Pakur district and need help with eco-tourism spots, taxi routes, and local guides.'
  );

  return (
    <>
      {/* Floating Back to Top Button (Mobile Only) */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to Top"
          className="md:hidden fixed bottom-20 right-4 z-40 p-2.5 rounded-full bg-[#111E16]/90 border border-emerald-500/30 text-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.25)] backdrop-blur-md active:scale-95 transition-transform"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* Modern App-Style Bottom Navigation Dock */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-3 left-3 right-3 z-50 max-w-md mx-auto"
      >
        <div className="bg-[#0B130E]/92 backdrop-blur-2xl border border-emerald-500/25 shadow-[0_12px_40px_rgba(0,0,0,0.85)] rounded-2xl p-1.5 flex items-center justify-between">
          {/* 1. Explore / Home */}
          <Link
            href="/"
            onClick={() => {
              if (pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
              activeTab === 'explore' && pathname === '/'
                ? 'bg-[#111E16] text-[#00F5A0] shadow-[0_0_12px_rgba(0,245,160,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass size={19} className={activeTab === 'explore' && pathname === '/' ? 'text-[#00F5A0]' : ''} />
            <span className="text-[10px] font-bold mt-1 tracking-tight">Explore</span>
          </Link>

          {/* 2. District Map */}
          <button
            onClick={() => {
              if (pathname === '/') {
                scrollToSection('map-section');
              } else {
                window.location.href = '/#map-section';
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
              activeTab === 'map'
                ? 'bg-[#111E16] text-[#00F5A0] shadow-[0_0_12px_rgba(0,245,160,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map size={19} className={activeTab === 'map' ? 'text-[#00F5A0]' : ''} />
            <span className="text-[10px] font-bold mt-1 tracking-tight">Map</span>
          </button>

          {/* 3. Road Trip */}
          <button
            onClick={() => {
              if (pathname === '/') {
                scrollToSection('road-trip-section');
              } else {
                window.location.href = '/#road-trip-section';
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
              activeTab === 'roadtrip'
                ? 'bg-[#111E16] text-[#00F5A0] shadow-[0_0_12px_rgba(0,245,160,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation size={19} className={activeTab === 'roadtrip' ? 'text-[#00F5A0]' : ''} />
            <span className="text-[10px] font-bold mt-1 tracking-tight">Road Trip</span>
          </button>

          {/* 4. WhatsApp Local Guide Help Desk */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[#00F5A0] bg-[#111E16] border border-emerald-500/30 hover:bg-[#16281E] shadow-[0_0_14px_rgba(0,245,160,0.15)] active:scale-95 transition-all"
          >
            <MessageSquareShare size={19} className="text-[#00F5A0]" />
            <span className="text-[10px] font-bold mt-1 tracking-tight text-[#00F5A0]">Guide Help</span>
          </a>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
