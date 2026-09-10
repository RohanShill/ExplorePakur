import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Compass, MapPin, Shield, Heart, Trees, History,
  Sparkles, Train, Mountain, Users, ArrowRight, BookOpen, CheckCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Pakur, Jharkhand | History, Culture, Geography & Tourism Guide",
  description: "Learn about Pakur district, Jharkhand — The Land of Black Stone, 1855 Martello Tower, Santhal Hool rebellion, pristine waterfalls, geothermal springs, and our sustainable eco-tourism mission.",
  keywords: [
    "About Pakur",
    "Pakur Jharkhand",
    "Pakur history",
    "Martello Tower Pakur",
    "Santhal Hool Pakur",
    "Pakur geography",
    "Santhal Pargana tourism",
    "Places to visit in Pakur",
    "Pakur district overview",
    "Explore Pakur initiative"
  ],
  alternates: {
    canonical: "https://explorepakur.in/about",
  },
  openGraph: {
    title: "About Pakur, Jharkhand | History, Culture & Eco-Tourism",
    description: "Discover the deep history, tribal Santhal heritage, and natural wonders of Pakur district in Jharkhand, India.",
    url: "https://explorepakur.in/about",
    siteName: "Explore Pakur",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Scenic landscape of Pakur district, Jharkhand",
      },
    ],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://explorepakur.in/about#webpage",
        "url": "https://explorepakur.in/about",
        "name": "About Pakur, Jharkhand | History, Culture, Geography & Tourism Guide",
        "description": "Comprehensive guide to Pakur district, Jharkhand. Explore its history, the 1855 Santhal Rebellion, Martello Tower, and eco-tourism initiatives.",
        "isPartOf": { "@id": "https://explorepakur.in/#website" },
        "breadcrumb": { "@id": "https://explorepakur.in/about#breadcrumb" },
        "inLanguage": "en-IN"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://explorepakur.in/about#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://explorepakur.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About Pakur",
            "item": "https://explorepakur.in/about"
          }
        ]
      }
    ]
  };

  const blocks = [
    {
      name: "Pakur Sadar",
      highlight: "District Headquarters",
      desc: "Administrative nerve center, historic 1856 Martello Tower, Siddhu Kanhu Park, and major Eastern Railway junction connecting Kolkata to North India.",
      tag: "Heritage & Hub"
    },
    {
      name: "Hiranpur",
      highlight: "Crafts & Tribal Haat",
      desc: "Famous for its vibrant weekly rural Haat, traditional bell-metal craft artisans, and indigenous weekly commerce of organic forest produce.",
      tag: "Culture & Market"
    },
    {
      name: "Littipara",
      highlight: "Eco-Valley & Hill Ranges",
      desc: "Picturesque ghat roads carving through dense sal, mahua, and teak canopies, home to traditional Santhal hamlets and pristine mountain air.",
      tag: "Nature & Hills"
    },
    {
      name: "Amrapara",
      highlight: "Jungle Waterfalls",
      desc: "South-western plateau corridor boasting secluded seasonal forest cascades, rocky river rapids, and centuries-old timber reserves.",
      tag: "Waterfalls & Trek"
    },
    {
      name: "Maheshpur",
      highlight: "Royal Palace & Antiquities",
      desc: "Steeped in royal history with ruins of the historic Maheshpur Raj Palace, ancient Devi shrines, and historical folklore of the borderlands.",
      tag: "Palace & Temples"
    },
    {
      name: "Pakuria",
      highlight: "Undulating Countryside",
      desc: "Tranquil agrarian landscapes, rocky knolls, tranquil village ponds, and hospitable Santhal village communities living in ecological rhythm.",
      tag: "Rural Peace"
    }
  ];

  const highlights = [
    { stat: "16+", label: "Documented Spots", desc: "Waterfalls, caves, hilltops, hot springs & historic sites" },
    { stat: "6", label: "Civic Blocks", desc: "Spanning across 1,806 sq km of diverse topography" },
    { stat: "1855", label: "Historic Hool", desc: "The epic Santhal rebellion commemorated at Martello Tower" },
    { stat: "100%", label: "Free & Open", desc: "Independent public initiative for conscious travel" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative pt-24 sm:pt-28 pb-20 overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden opacity-30">
          <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(212,169,66,0.2)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute top-10 right-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(0,199,133,0.15)_0%,transparent_70%)] blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#7A9180] font-body">
            <Link href="/" className="hover:text-[#D4A942] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D4A942]">About Pakur</span>
          </nav>

          {/* Header & Hero Intro */}
          <div className="max-w-3xl space-y-4 mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(212,169,66,0.3)] bg-[rgba(212,169,66,0.06)] text-xs font-semibold text-[#D4A942] font-body tracking-wide">
              <Sparkles size={13} />
              <span>Sanctuary of Santhal Pargana, Jharkhand</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif text-[#F5F0E8] leading-[1.15] tracking-tight">
              About <span className="text-gold-gradient">Pakur</span> &amp; The Eco-Tourism Portal
            </h1>

            <p className="text-base sm:text-lg text-[#7A9180] font-body leading-relaxed">
              Nestled on the eastern fringe of Jharkhand, Pakur is a land of dramatic basalt landscapes, timeless tribal culture, whispering sal forests, and sacred spring waters. Explore Pakur is an open-access platform built to celebrate, preserve, and showcase this hidden jewel to conscious travelers across India and the globe.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="luxury-card p-6 sm:p-7 rounded-2xl relative overflow-hidden group hover:border-[rgba(212,169,66,0.4)] transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4A942] to-transparent opacity-60" />
                <span className="text-3xl sm:text-4xl font-bold font-serif text-gold-gradient block mb-1">
                  {item.stat}
                </span>
                <span className="text-sm font-semibold text-[#F5F0E8] font-body block mb-1">
                  {item.label}
                </span>
                <p className="text-xs text-[#7A9180] font-body leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Core Story & Geography Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-24">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#00C785] font-semibold font-body">
                <Mountain size={14} />
                <span>Geographic Wonder &amp; Black Stone Heritage</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#F5F0E8] leading-snug">
                Where the Rajmahal Volcanic Traps Meet the Fertile Bengal Plains
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#7A9180] font-body leading-relaxed">
                <p>
                  Pakur district covers 1,806 square kilometers along the eastern edge of Jharkhand. Geologically unique, it forms part of the ancient Rajmahal Traps formed by prehistoric volcanic eruptions over 110 million years ago. This volcanic legacy gifted Pakur its renowned high-density black basalt stone, celebrated across the subcontinent.
                </p>
                <p>
                  Bounded by Sahibganj to the north, Dumka to the west, and the historical Murshidabad and Birbhum districts of West Bengal to the east and south, Pakur represents an extraordinary confluence of Jharkhand&apos;s tribal plateau biodiversity and Bengal&apos;s agrarian serenity.
                </p>
                <p>
                  Hidden within this undulating terrain are seasonal cascades like Lilatari and Amrapara waterfalls, mystic caves of Kanchangarh, natural sulfur hot springs at Sidpur, and the panoramic 360-degree hill viewpoint of Singhashi.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[rgba(212,169,66,0.25)] shadow-[0_12px_40px_rgba(0,0,0,0.8)] aspect-[4/3] group">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                  alt="Scenic hills and forest in Pakur Jharkhand"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08110B] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[rgba(8,17,11,0.85)] backdrop-blur-md border border-[rgba(212,169,66,0.2)]">
                  <p className="text-xs font-semibold text-[#D4A942] uppercase tracking-wider font-body mb-0.5">District Profile</p>
                  <p className="text-sm font-serif font-bold text-[#F5F0E8]">Pakur, Santhal Pargana Division, Jharkhand, India</p>
                  <p className="text-xs text-[#7A9180] mt-0.5">Coordinates: 24.63° N, 87.84° E | Elevation: 110 m above sea level</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Legacy: 1855 Santhal Rebellion & Martello Tower */}
          <div className="luxury-card rounded-3xl p-8 sm:p-12 mb-24 relative overflow-hidden border border-[rgba(212,169,66,0.25)]">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-[radial-gradient(circle,rgba(212,169,66,0.1)_0%,transparent_70%)] blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4A942] font-semibold font-body">
                  <History size={15} />
                  <span>The Legacy of 1855</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#F5F0E8]">
                  The Epic Santhal Hool &amp; The Historic Martello Tower
                </h2>
                <div className="space-y-3.5 text-sm sm:text-base text-[#7A9180] font-body leading-relaxed">
                  <p>
                    Long before the 1857 war of independence, the courage of the Santhal people ignited the legendary <strong className="text-[#F5F0E8]">Santhal Hool (Rebellion) of 1855</strong>. Led by revered freedom fighters <span className="text-[#D4A942]">Siddhu, Kanhu, Chand, and Bhairav</span>, indigenous tribes rose bravely against the oppressive British colonial taxation and exploitative moneylenders.
                  </p>
                  <p>
                    In response to the fierce armed uprising of Santhal warriors who besieged the British settlement, the East India Company built the iconic <strong className="text-[#F5F0E8]">Martello Tower</strong> in 1856. Standing 30 feet tall with a 20-foot diameter and 52 defensive loopholes, this circular stone fortification remains one of the rarest Martello-style structures in all of Asia.
                  </p>
                  <p>
                    Today, the tower rests within the tranquil greenery of Siddhu Kanhu Park in Pakur Town, preserved as an eternal symbol of tribal sovereignty, sacrifice, and resilience.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/spots/siddhu-kanhu-park"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#D4A942] hover:text-[#E8C56D] group font-body"
                  >
                    <span>Explore the Martello Tower &amp; Siddhu Kanhu Park Guide</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative p-3 rounded-2xl border border-[rgba(212,169,66,0.3)] bg-[rgba(8,17,11,0.6)] backdrop-blur-md max-w-sm w-full">
                  <div className="relative rounded-xl overflow-hidden aspect-square">
                    <img
                      src="/logo.png"
                      alt="Historic Martello Tower Emblem of Pakur"
                      className="w-full h-full object-cover p-4"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A942] font-body">Pakur Emblem</span>
                    <h4 className="text-base font-bold font-serif text-[#F5F0E8] mt-1">Martello Tower (1856)</h4>
                    <p className="text-xs text-[#7A9180] font-body mt-1">
                      Official district heritage monument symbolizing centuries of indomitable courage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The 6 Blocks of Pakur Grid */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#00C785] font-semibold font-body">
                <Compass size={14} />
                <span>Geographical Divisions</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#F5F0E8]">
                Explore Pakur&apos;s 6 Administrative Blocks
              </h2>
              <p className="text-sm text-[#7A9180] font-body">
                Each block offers distinct cultural tapestry, scenic topography, and untouched heritage waiting to be discovered.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blocks.map((b, idx) => (
                <div
                  key={idx}
                  className="luxury-card rounded-2xl p-6 relative overflow-hidden group hover:border-[rgba(212,169,66,0.4)] transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#D4A942] bg-[rgba(212,169,66,0.1)] px-3 py-1 rounded-full font-body">
                      {b.tag}
                    </span>
                    <span className="text-xs text-[#4A6254] font-body">Block #{idx + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-[#F5F0E8] mb-1 group-hover:text-[#D4A942] transition-colors">
                    {b.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#00C785] font-body mb-3">
                    {b.highlight}
                  </p>
                  <p className="text-xs text-[#7A9180] font-body leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission & Ethical Eco-Tourism Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4A942] font-semibold font-body">
                <Shield size={14} />
                <span>Our Principles</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#F5F0E8]">
                Committed to Ethical, Community-Led Eco-Tourism
              </h2>
              <div className="space-y-4 text-sm text-[#7A9180] font-body leading-relaxed">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#00C785] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#F5F0E8] font-serif">100% Free &amp; Open Access</h4>
                    <p className="text-xs text-[#7A9180] mt-0.5">Explore Pakur provides completely unmonetized, unbiased travel intelligence, GPS routes, and honest guidance to all visitors.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#00C785] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#F5F0E8] font-serif">Leave No Trace</h4>
                    <p className="text-xs text-[#7A9180] mt-0.5">We strictly advocate for zero-plastic travel, respecting local water sources, and protecting wildlife habitats across forest reserves.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#00C785] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#F5F0E8] font-serif">Empowering Local Communities</h4>
                    <p className="text-xs text-[#7A9180] mt-0.5">By driving conscious footfall to village haats, local homestays, and tribal guides, we foster direct rural economic upliftment.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 luxury-card rounded-3xl p-8 border border-[rgba(0,199,133,0.2)]">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-[rgba(0,199,133,0.1)] text-[#00C785]">
                  <Train size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-[#F5F0E8]">Getting to Pakur</h3>
                  <p className="text-xs text-[#7A9180] font-body">Seamless Rail &amp; Road Connectivity</p>
                </div>
              </div>
              <div className="space-y-3 text-xs text-[#7A9180] font-body leading-relaxed">
                <p>
                  <strong className="text-[#F5F0E8]">By Train:</strong> Pakur Railway Station (PKR) is a prominent A-grade station on Eastern Railway&apos;s Sahibganj loop. Frequent express trains link Pakur directly with Kolkata (Howrah/Sealdah), Bhagalpur, Patna, Ranchi, and Guwahati.
                </p>
                <p>
                  <strong className="text-[#F5F0E8]">By Road:</strong> Well-maintained National &amp; State Highways connect Pakur to Dumka (65 km), Sahibganj (75 km), Deoghar (135 km), and Malda (85 km).
                </p>
                <p>
                  <strong className="text-[#F5F0E8]">Nearest Airports:</strong> Deoghar Airport (DGH, ~135 km), Kazi Nazrul Islam Airport (RND/Andal, ~140 km), and Kolkata Netaji Subhash Chandra Bose Airport (CCU, ~290 km).
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-[rgba(212,169,66,0.15)] flex flex-wrap gap-3">
                <Link
                  href="/spots"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4A942] to-[#E8C56D] hover:from-[#c29636] hover:to-[#d4af54] text-[#08110B] font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md font-body"
                >
                  <Compass size={14} />
                  <span>Explore 16+ Destinations</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-[rgba(212,169,66,0.35)] text-[#D4A942] hover:bg-[rgba(212,169,66,0.08)] font-semibold text-xs px-5 py-2.5 rounded-xl transition-all font-body"
                >
                  <span>Contact Tourism Helpdesk</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
