"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Mail, Globe, Heart, Compass, Github } from "lucide-react";

export const Footer: React.FC = () => {
  const locale = useLocale();
  const tNav = useTranslations("navigation");
  const isHi = locale === "hi";

  const destinations = [
    { name: isHi ? "लिलातरी जलप्रपात" : "Lilatari Waterfall", slug: "lilatari-waterfall" },
    { name: isHi ? "मार्टेलो टावर" : "Martello Tower", slug: "martello-tower" },
    { name: isHi ? "सिंगाड़शी चोटी" : "Singhashi Hilltop", slug: "singhashi-hilltop" },
    { name: isHi ? "कंचनगढ़ गुफाएं" : "Kanchangarh Caves", slug: "kanchangarh-caves" },
    { name: isHi ? "सिद्धू कान्हू पार्क" : "Siddhu Kanhu Park", slug: "siddhu-kanhu-park" },
    { name: isHi ? "महेशपुर राजबाड़ी" : "Maheshpur Rajbari", slug: "maheshpur-rajbari" },
  ];

  const quickLinks = [
    { name: tNav("about"),        href: `/${locale}/about` },
    { name: tNav("contact"),      href: `/${locale}/contact` },
    { name: tNav("allDestinations"), href: `/${locale}/spots` },
    { name: tNav("map"),          href: `/${locale}#map-section` },
    { name: tNav("santhalHeritage"), href: `/${locale}#heritage-section` },
  ];

  const blocks = isHi
    ? ["पाकुड़ सदर", "हिरणपुर", "लिट्टीपाड़ा", "अमड़ापाड़ा", "महेशपुर", "पाकुड़िया"]
    : ["Pakur Sadar", "Hiranpur", "Littipara", "Amrapara", "Maheshpur", "Pakuria"];

  return (
    <footer className="relative z-20 border-t border-[rgba(212,169,66,0.15)]" style={{ background: "#030806" }}>
      <div className="divider-gold w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10">

          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-[rgba(212,169,66,0.35)] shadow-[0_0_20px_rgba(212,169,66,0.2)] shrink-0">
                <img src="/logo.png" alt="ExplorePakur Logo" className="h-full w-full object-cover" />
              </div>
              <div>
                <span className="text-xl font-bold text-[#F5F0E8] font-serif leading-none">
                  Explore<span className="text-gold-gradient">Pakur</span>
                </span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#4A6254] mt-0.5 font-body">
                  {isHi ? "झारखंड ईको-टूरिज्म" : "Jharkhand Eco-Tourism"}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#7A9180] leading-relaxed max-w-sm font-body">
              {isHi
                ? "पाकुड़ जिले के जलप्रपातों, गुफाओं, गर्म झरनों और संथाली सांस्कृतिक विरासत को समर्पित एक स्वतंत्र, मुक्त-पहुंच ईको-टूरिज्म पोर्टल।"
                : "An independent, open-access eco-tourism portal dedicated to showcasing Pakur district's waterfalls, caves, thermal springs, and Santhal cultural heritage."}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#00C785] bg-[rgba(0,199,133,0.07)] border border-[rgba(0,199,133,0.2)] px-3.5 py-2 rounded-xl max-w-fit font-body">
              <Globe size={14} />
              {isHi ? "100% निःशुल्क खुला पर्यटन गाइड" : "100% Free Open-Source Tourism Guide"}
            </div>
          </div>

          {/* Destinations Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4A942] font-body border-b border-[rgba(212,169,66,0.15)] pb-2">
              {isHi ? "प्रमुख स्थल" : "Top Destinations"}
            </h4>
            <ul className="space-y-2.5">
              {destinations.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/${locale}/spots/${d.slug}`}
                    className="text-sm text-[#7A9180] hover:text-[#D4A942] transition-colors font-body flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[rgba(212,169,66,0.4)] group-hover:bg-[#D4A942] transition-colors shrink-0" />
                    {d.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href={`/${locale}/spots`}
                  className="text-xs font-semibold text-[#D4A942] hover:underline font-body flex items-center gap-1.5"
                >
                  <Compass size={13} />
                  <span>{tNav("allDestinations")} →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4A942] font-body border-b border-[rgba(212,169,66,0.15)] pb-2">
              {isHi ? "त्वरित लिंक" : "Explore Portal"}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((ql) => (
                <li key={ql.name}>
                  <Link
                    href={ql.href}
                    className="text-sm text-[#7A9180] hover:text-[#D4A942] transition-colors font-body flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[rgba(212,169,66,0.4)] group-hover:bg-[#D4A942] transition-colors shrink-0" />
                    {ql.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connectivity & Helpdesk Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4A942] font-body border-b border-[rgba(212,169,66,0.15)] pb-2">
              {isHi ? "पर्यटक सहायता व संपर्क" : "Visitor Info & Access"}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#D4A942] shrink-0 mt-0.5" />
                <span className="text-sm text-[#7A9180] font-body">
                  {isHi ? "पाकुड़ रेलवे जंक्शन (PKR), पूर्व रेलवे" : "Pakur Railway Station (PKR), Eastern Railway"}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="text-[#D4A942] shrink-0 mt-0.5" />
                <a href="mailto:contact@explorepakur.in" className="text-sm text-[#7A9180] hover:text-[#D4A942] font-body">
                  contact@explorepakur.in
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe size={15} className="text-[#D4A942] shrink-0 mt-0.5" />
                <span className="text-sm text-[#7A9180] font-body">GPS: 24.63° N, 87.84° E</span>
              </li>
              <li className="text-xs text-[#4A6254] pt-1 leading-relaxed font-body">
                {isHi
                  ? "हावड़ा, सियालदह, मालदा, भागलपुर और रांची से सीधी रेल कनेक्टिविटी।"
                  : "Direct express train connectivity from Kolkata, Malda Town, Bhagalpur, Sahibganj, and Ranchi."}
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Regional Keyword Anchor Bar */}
        <div className="mt-10 pt-6 border-t border-[rgba(212,169,66,0.1)]">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#4A6254] font-body">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#7A9180] font-semibold">
                {isHi ? "पाकुड़ जिले के 6 प्रखंड:" : "Pakur District Blocks:"}
              </span>
              {blocks.map((block, idx) => (
                <React.Fragment key={block}>
                  <Link href={`/${locale}/spots`} className="hover:text-[#D4A942] transition-colors">
                    {block}
                  </Link>
                  {idx < blocks.length - 1 && <span>•</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="text-[11px] text-[#4A6254]">
              {isHi ? "संथाल परगना प्रमंडल • झारखंड ईको-टूरिज्म" : "Santhal Pargana Division • Jharkhand Eco-Tourism"}
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-6 pt-5 border-t border-[rgba(212,169,66,0.06)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#4A6254] font-body">
          <p>
            © {new Date().getFullYear()} explorepakur.in — {isHi ? "अछूते झारखंड की खोज करें" : "Discover Untouched Jharkhand"}
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/about`} className="hover:text-[#D4A942] transition-colors">
              {tNav("about")}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-[#D4A942] transition-colors">
              {tNav("contact")}
            </Link>
            <a
              href="https://github.com/RohanShill/ExplorePakur"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#4A6254] hover:text-[#D4A942] transition-colors"
            >
              <Github size={14} />
              <span>GitHub</span>
            </a>
            <div className="flex items-center gap-1.5 text-[#4A6254]">
              <span>{isHi ? "पाकुड़ के लिए समर्पित" : "Crafted for Pakur"}</span>
              <Heart size={13} className="text-[#D4A942] fill-[#D4A942]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
