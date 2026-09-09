import React from "react";
import Link from "next/link";
import { MapPin, Globe, Heart, Github } from "lucide-react";

export const Footer: React.FC = () => {
  const destinations = [
    { name: "Singarsi Viewpoint",    slug: "singarsi-viewpoint" },
    { name: "Lilatari Waterfall",    slug: "lilatari-waterfall" },
    { name: "Kanchangarh Cave",      slug: "kanchangarh-cave" },
    { name: "Dharni Pahar & Caves",  slug: "dharni-pahar" },
    { name: "Martello Tower & Park", slug: "siddhu-kanhu-park" },
    { name: "Sidpur Hot Spring",     slug: "sidpur-hot-spring" },
  ];

  return (
    <footer className="relative z-20 border-t border-[rgba(212,169,66,0.15)]" style={{ background: "#030806" }}>
      {/* Gold divider line */}
      <div className="divider-gold w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">

          {/* Brand */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-[rgba(212,169,66,0.35)] shadow-[0_0_20px_rgba(212,169,66,0.2)] shrink-0">
                <img src="/logo.png" alt="ExplorePakur Logo" className="h-full w-full object-cover" />
              </div>
              <div>
                <span className="text-xl font-bold text-[#F5F0E8] font-serif leading-none">
                  Explore<span className="text-gold-gradient">Pakur</span>
                </span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#4A6254] mt-0.5 font-body">Jharkhand Eco-Tourism</p>
              </div>
            </div>

            <p className="text-sm text-[#7A9180] leading-relaxed max-w-sm font-body">
              An independent, open-access eco-tourism portal dedicated to showcasing Pakur district&apos;s waterfalls, caves, thermal springs, and Santhal cultural heritage.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#00C785] bg-[rgba(0,199,133,0.07)] border border-[rgba(0,199,133,0.2)] px-3.5 py-2 rounded-xl max-w-fit font-body">
              <Globe size={14} />
              100% Free Open-Source Tourism Guide
            </div>
          </div>

          {/* Destinations */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4A942] font-body border-b border-[rgba(212,169,66,0.15)] pb-2">
              Destinations
            </h4>
            <ul className="space-y-2.5">
              {destinations.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/spots/${d.slug}`}
                    className="text-sm text-[#7A9180] hover:text-[#D4A942] transition-colors font-body flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[rgba(212,169,66,0.4)] group-hover:bg-[#D4A942] transition-colors shrink-0" />
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connectivity */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4A942] font-body border-b border-[rgba(212,169,66,0.15)] pb-2">
              Connectivity
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#D4A942] shrink-0 mt-0.5" />
                <span className="text-sm text-[#7A9180] font-body">Pakur Railway Station (PKR), Eastern Railway</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe size={15} className="text-[#D4A942] shrink-0 mt-0.5" />
                <span className="text-sm text-[#7A9180] font-body">GPS: 24.63° N, 87.84° E</span>
              </li>
              <li className="text-xs text-[#4A6254] pt-1 leading-relaxed font-body">
                Direct train connectivity from Howrah (Kolkata), Malda Town, Bhagalpur, Sahibganj, and Ranchi.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-14 pt-5 sm:pt-6 border-t border-[rgba(212,169,66,0.08)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#4A6254] font-body">
          <p>
            © {new Date().getFullYear()} explorepakur.in
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#4A6254] hover:text-[#D4A942] transition-colors"
            >
              <Github size={15} />
              <span>GitHub</span>
            </a>
            <div className="flex items-center gap-1.5 text-[#4A6254]">
              <span>Crafted with</span>
              <Heart size={13} className="text-[#D4A942] fill-[#D4A942]" />
              <span>for Jharkhand</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


