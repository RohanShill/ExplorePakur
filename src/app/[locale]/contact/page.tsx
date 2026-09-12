import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/contact/ContactForm";
import {
  Mail, Phone, MapPin, Clock, Shield, Sparkles,
  HelpCircle, AlertTriangle, Compass, CheckCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Pakur Tourism Helpdesk | Travel Guidance & Local Guides",
  description: "Connect with the Explore Pakur regional tourism helpdesk. Inquire about travel itineraries, verified local Santhal guides, spot access, road connectivity, and emergency assistance in Pakur district.",
  keywords: [
    "Contact Pakur Tourism",
    "Pakur visitor helpdesk",
    "Pakur tourist guide",
    "Pakur emergency numbers",
    "Pakur police helpline",
    "Pakur travel inquiry",
    "Santhal guide booking Pakur",
    "Explore Pakur contact"
  ],
  alternates: {
    canonical: "https://explorepakur.in/contact",
  },
  openGraph: {
    title: "Contact Pakur Tourism Helpdesk | Explore Pakur",
    description: "Get verified travel guidance, contact local guides, and plan your eco-expedition to Pakur district, Jharkhand.",
    url: "https://explorepakur.in/contact",
    siteName: "Explore Pakur",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Contact Explore Pakur Tourism Facilitation",
      },
    ],
  },
};

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalizedContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isHi = locale === "hi";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://explorepakur.in/contact#webpage",
        "url": "https://explorepakur.in/contact",
        "name": "Contact Pakur Tourism Helpdesk | Travel Guidance & Local Guides",
        "description": "Visitor contact portal for Pakur district eco-tourism inquiries, local guide connections, and district travel assistance.",
        "isPartOf": { "@id": "https://explorepakur.in/#website" },
        "breadcrumb": { "@id": "https://explorepakur.in/contact#breadcrumb" },
        "inLanguage": "en-IN"
      },
      {
        "@type": "TouristInformationCenter",
        "name": "Explore Pakur Tourism Facilitation Desk",
        "image": "https://explorepakur.in/logo.png",
        "url": "https://explorepakur.in/contact",
        "telephone": "+91-6435-222000",
        "email": "contact@explorepakur.in",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Railway Station Road, Near Siddhu Kanhu Park",
          "addressLocality": "Pakur",
          "addressRegion": "Jharkhand",
          "postalCode": "816107",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 24.633,
          "longitude": 87.846
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ],
            "opens": "08:00",
            "closes": "19:00"
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://explorepakur.in/contact#breadcrumb",
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
            "name": "Contact Us",
            "item": "https://explorepakur.in/contact"
          }
        ]
      }
    ]
  };

  const emergencyContacts = [
    { title: "Pakur Police Control Room", phone: "112 / +91-6435-222100", note: "24x7 District Security Assistance" },
    { title: "Railway Protection Force (RPF PKR)", phone: "+91-6435-222233", note: "Pakur Railway Station Security" },
    { title: "Sadar District Hospital Pakur", phone: "108 / +91-6435-222045", note: "Emergency Trauma & Medical Care" },
    { title: "Divisional Forest Office (Pakur)", phone: "+91-6435-222078", note: "Forest Reserves & Wildlife Guidance" },
  ];

  const faqs = [
    {
      q: "Can you help connect visitors with local Santhal village guides?",
      a: "Yes! Our initiative collaborates closely with youth and community members in Littipara, Amrapara, and Hiranpur. Simply submit a message with your expected dates and group size, and we will connect you with a verified community guide."
    },
    {
      q: "Is prior permission required to visit Lilatari Waterfall or Kanchangarh Cave?",
      a: "No prior government permits are required for standard daylight tourism. All featured sites have free public access. We strongly recommend visiting during daylight hours (07:00 AM – 04:30 PM) accompanied by local guidance for remote forest trails."
    },
    {
      q: "Are there good hotel accommodations in Pakur town?",
      a: "Yes. Pakur Town has several comfortable hotels, guesthouses, and government circuit inspection bungalows near the Railway Station and Collectorate road, serving as ideal basecamps for day trips."
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative pt-24 sm:pt-28 pb-20 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden opacity-25">
          <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(212,169,66,0.2)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(0,199,133,0.15)_0%,transparent_70%)] blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#7A9180] font-body">
            <Link href="/" className="hover:text-[#D4A942] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D4A942]">Contact Us</span>
          </nav>

          {/* Page Headline */}
          <div className="max-w-3xl space-y-4 mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(212,169,66,0.3)] bg-[rgba(212,169,66,0.06)] text-xs font-semibold text-[#D4A942] font-body tracking-wide">
              <Sparkles size={13} />
              <span>Direct Tourism Facilitation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#F5F0E8] leading-[1.15] tracking-tight">
              Contact <span className="text-gold-gradient">Explore Pakur</span> Helpdesk
            </h1>

            <p className="text-base text-[#7A9180] font-body leading-relaxed">
              Planning a journey to Pakur&apos;s waterfalls, ancient caves, or tribal festivals? Have questions regarding road routes or local guide arrangements? Our team is dedicated to assisting your journey.
            </p>
          </div>

          {/* Main Grid: Info + Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20">

            {/* Left Column: Contact Channels & Hub Info */}
            <div className="lg:col-span-5 space-y-6">

              {/* Direct Channels Card */}
              <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 border border-[rgba(212,169,66,0.2)]">
                <h3 className="text-lg font-bold font-serif text-[#F5F0E8]">
                  Information Desks
                </h3>

                <ul className="space-y-4 text-sm font-body">
                  <li className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[rgba(212,169,66,0.1)] text-[#D4A942] shrink-0 mt-0.5">
                      <Mail size={17} />
                    </div>
                    <div>
                      <span className="text-xs text-[#4A6254] block uppercase tracking-wider font-semibold">Inquiry &amp; Support Email</span>
                      <a href="mailto:contact@explorepakur.in" className="text-[#F5F0E8] hover:text-[#D4A942] font-medium transition-colors">
                        contact@explorepakur.in
                      </a>
                      <p className="text-[11px] text-[#7A9180] mt-0.5">Response typically within 24 business hours</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[rgba(0,199,133,0.1)] text-[#00C785] shrink-0 mt-0.5">
                      <MapPin size={17} />
                    </div>
                    <div>
                      <span className="text-xs text-[#4A6254] block uppercase tracking-wider font-semibold">Visitor Information Point</span>
                      <span className="text-[#F5F0E8] font-medium block">
                        Station Road, Near Siddhu Kanhu Park
                      </span>
                      <p className="text-[11px] text-[#7A9180] mt-0.5">Pakur Town, Jharkhand — 816107, India</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[rgba(212,169,66,0.1)] text-[#D4A942] shrink-0 mt-0.5">
                      <Clock size={17} />
                    </div>
                    <div>
                      <span className="text-xs text-[#4A6254] block uppercase tracking-wider font-semibold">Travel Assistance Hours</span>
                      <span className="text-[#F5F0E8] font-medium block">
                        08:00 AM – 07:00 PM IST
                      </span>
                      <p className="text-[11px] text-[#7A9180] mt-0.5">Monday through Sunday (All Days)</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Emergency & District Directory */}
              <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-4 border border-[rgba(255,107,74,0.2)]">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#FF6B4A] font-semibold font-body">
                  <AlertTriangle size={15} />
                  <span>District Helplines &amp; Emergency</span>
                </div>
                <h3 className="text-base font-bold font-serif text-[#F5F0E8]">
                  Pakur District Emergency Services
                </h3>
                <div className="space-y-3 pt-1">
                  {emergencyContacts.map((em, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[rgba(8,17,11,0.6)] border border-[rgba(255,107,74,0.15)] flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-[#F5F0E8] font-serif">{em.title}</p>
                        <p className="text-[10px] text-[#7A9180] font-body">{em.note}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#D4A942] shrink-0">
                        {em.phone}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>

          {/* FAQ Section for Traveler Queries */}
          <div className="luxury-card rounded-3xl p-8 sm:p-12 border border-[rgba(212,169,66,0.2)]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#00C785] font-semibold font-body mb-3">
              <HelpCircle size={15} />
              <span>Frequently Asked Inquiries</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold font-serif text-[#F5F0E8] mb-8">
              Everything You Need to Know Before Visiting Pakur
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h3 className="text-sm font-bold font-serif text-[#F5F0E8] leading-snug">
                    {faq.q}
                  </h3>
                  <p className="text-xs text-[#7A9180] font-body leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[rgba(212,169,66,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#7A9180] font-body">
                Need customized group itinerary or school heritage excursion assistance?
              </span>
              <Link
                href="/spots"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#D4A942] hover:text-[#E8C56D] font-body"
              >
                <span>Browse All 16+ Verified Spots</span>
                <Compass size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
