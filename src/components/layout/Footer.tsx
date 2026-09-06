import React from 'react';
import Link from 'next/link';
import { Compass, Heart, ShieldCheck, MapPin, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 bg-[#050906] text-slate-300 border-t border-emerald-500/20 mt-20 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#00F5A0] to-emerald-700 flex items-center justify-center text-[#0B130E] shadow-md shadow-[#00F5A0]/20">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Explore<span className="text-[#00F5A0]">Pakur</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed font-normal">
              An independent, open-access eco-tourism portal dedicated to showcasing the waterfalls, hills, caves, thermal springs, and Santhal cultural heritage of Pakur district, Jharkhand.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#00F5A0] bg-[#0E1912] border border-emerald-500/30 px-3.5 py-2 rounded-xl max-w-fit shadow-sm font-semibold">
              <ShieldCheck size={16} className="text-[#00F5A0]" />
              <span>100% Free Open-Source Tourism Guide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Destinations</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/spots/singarsi-viewpoint" className="hover:text-[#00F5A0] transition-colors font-medium">
                  Singarsi Viewpoint
                </Link>
              </li>
              <li>
                <Link href="/spots/lilatari-waterfall" className="hover:text-[#00F5A0] transition-colors font-medium">
                  Lilatari Waterfall
                </Link>
              </li>
              <li>
                <Link href="/spots/kanchangarh-cave" className="hover:text-[#00F5A0] transition-colors font-medium">
                  Kanchangarh Cave
                </Link>
              </li>
              <li>
                <Link href="/spots/dharni-pahar" className="hover:text-[#00F5A0] transition-colors font-medium">
                  Dharni Pahar & Caves
                </Link>
              </li>
              <li>
                <Link href="/spots/siddhu-kanhu-park" className="hover:text-[#00F5A0] transition-colors font-medium">
                  Martello Tower & Park
                </Link>
              </li>
              <li>
                <Link href="/spots/sidpur-hot-spring" className="hover:text-[#00F5A0] transition-colors font-medium">
                  Sidpur Hot Spring
                </Link>
              </li>
            </ul>
          </div>

          {/* Geographical Connectivity */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Connectivity</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-[#00F5A0] shrink-0 mt-0.5" />
                <span className="font-medium text-slate-200">Pakur Railway Station (PKR), Eastern Railway</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe size={16} className="text-[#00F5A0] shrink-0" />
                <span className="font-medium text-slate-200">GPS: 24.63° N, 87.84° E</span>
              </li>
              <li className="text-xs text-slate-400 pt-1 leading-relaxed">
                Direct train connectivity from Howrah (Kolkata), Malda Town, Bhagalpur, Sahibganj, and Ranchi.
              </li>
            </ul>
          </div>
        </div>

        {/* DMFT & Legal Note */}
        <div className="mt-12 pt-8 border-t border-emerald-500/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>
            © {new Date().getFullYear()} explorepakur.in • Supported by District Mineral Foundation Trust (DMFT) & Community Tourism Initiatives.
          </p>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span>Crafted with</span>
            <Heart size={14} className="text-[#00F5A0] fill-[#00F5A0]" />
            <span>for Jharkhand Eco-Tourism</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
