export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSpotBySlug, getAllSpots, getReviewsForSpot } from "@/lib/dataAccess";
import CategoryBadge from "@/components/ui/CategoryBadge";
import DynamicMap from "@/components/map/DynamicMap";
import InteractivePhotoGallery from "@/components/ui/InteractivePhotoGallery";
import {
  MapPin, Calendar, Clock, Navigation, CheckCircle,
  Star, ArrowLeft, Sparkles, Train, Ticket,
} from "lucide-react";
import { formatCoordinates, getOsmDirectionsUrl, getGpsNavigationUrl } from "@/lib/utils";
import type { Metadata } from "next";

interface SpotDetailsProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const spots = await getAllSpots();
  return spots.map((spot) => ({ slug: spot.slug }));
}

export async function generateMetadata({ params }: SpotDetailsProps): Promise<Metadata> {
  const spot = await getSpotBySlug(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://explorepakur.in";

  if (!spot) return { title: "Destination Not Found - Explore Pakur" };

  const spotUrl = `${siteUrl}/spots/${spot.slug}`;
  const metaDescription =
    spot.longDescription ||
    `${spot.description} Best time to visit: ${spot.bestTimeToVisit}. Located in Pakur district, Jharkhand.`;

  return {
    title: `${spot.title} | Pakur Tourist Spots, Jharkhand`,
    description: metaDescription,
    keywords: [
      spot.title,
      `${spot.title} Pakur`,
      `${spot.title} Jharkhand`,
      `${spot.category} in Pakur`,
      "Pakur tourist places",
      "Places to visit in Pakur",
      "Pakur Jharkhand sightseeing",
      "Explore Pakur"
    ],
    alternates: {
      canonical: spotUrl,
    },
    openGraph: {
      title: `${spot.title} - Pakur Eco-Tourism, Jharkhand`,
      description: metaDescription,
      url: spotUrl,
      siteName: "Explore Pakur",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: spot.coverImage,
          width: 1200,
          height: 630,
          alt: `${spot.title}, Pakur, Jharkhand`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${spot.title} | Explore Pakur`,
      description: metaDescription,
      images: [spot.coverImage],
    },
  };
}

export default async function SpotDetailPage({ params }: SpotDetailsProps) {
  const spot = await getSpotBySlug(params.slug);
  if (!spot) notFound();

  const reviews = await getReviewsForSpot(spot.id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://explorepakur.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristAttraction",
        "@id": `${siteUrl}/spots/${spot.slug}#attraction`,
        "name": spot.title,
        "description": spot.longDescription || spot.description,
        "url": `${siteUrl}/spots/${spot.slug}`,
        "image": [spot.coverImage, ...(spot.galleryImages || [])],
        "touristType": [spot.category, "Eco-Tourism", "Nature Destination"],
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": spot.latitude,
          "longitude": spot.longitude,
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Pakur",
          "addressRegion": "Jharkhand",
          "addressCountry": "IN",
        },
        "isAccessibleForFree": !spot.entryFee || spot.entryFee.toLowerCase().includes("free"),
        "publicAccess": true,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/spots/${spot.slug}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Destinations",
            "item": `${siteUrl}/spots`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": spot.title,
            "item": `${siteUrl}/spots/${spot.slug}`,
          },
        ],
      },
    ],
  };

  const infoItems = [
    { icon: Calendar, label: "Best Months",    value: spot.bestTimeToVisit },
    { icon: Clock,    label: "Visiting Hours",  value: spot.timing || "Daylight Hours (06:00 AM - 05:00 PM)" },
    { icon: Ticket,   label: "Entry",           value: spot.entryFee || "Free Public Access" },
    { icon: Train,    label: "Nearest Railway", value: spot.nearestRailway || "Pakur Railway Station (PKR)" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen pb-24" style={{ background: "var(--bg-base)" }}>

        {/* ── Breadcrumb ── */}
        <div className="border-b border-[rgba(212,169,66,0.1)]" style={{ background: "var(--bg-deep)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <Link
              href="/spots"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7A9180] hover:text-[#D4A942] transition-colors font-body"
            >
              <ArrowLeft size={14} />
              All Destinations
            </Link>
            <span className="text-[10px] sm:text-xs text-[#4A6254] font-body">Pakur • Jharkhand</span>
          </div>
        </div>

        {/* ── Cinematic Hero - shorter on mobile ── */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "clamp(240px, 50vw, 65vh)", background: "var(--bg-deep)" }}
        >
          <img
            src={spot.coverImage}
            alt={spot.title}
            className="w-full h-full object-cover"
            style={{ transform: "scale(1.04)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08110B] via-[#08110B]/40 to-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08110B]/30 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10 space-y-2.5 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={spot.category} size="md" />
                <span className="text-[10px] sm:text-xs text-[#00C785] bg-[rgba(0,199,133,0.1)] border border-[rgba(0,199,133,0.25)] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-md font-semibold font-body">
                  GPS Verified
                </span>
              </div>

              <h1 className="font-serif font-bold text-[#F5F0E8] text-2xl sm:text-4xl md:text-5xl leading-tight drop-shadow-xl">
                {spot.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[rgba(3,8,6,0.8)] backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[rgba(212,169,66,0.2)] text-[11px] sm:text-xs text-[#D4A942] font-body">
                  <MapPin size={11} />
                  {formatCoordinates(spot.latitude, spot.longitude)}
                </span>
                {spot.distanceFromPakurStation && (
                  <span className="inline-flex items-center gap-1.5 bg-[rgba(3,8,6,0.8)] backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[11px] sm:text-xs text-[#7A9180] font-body">
                    <Navigation size={11} />
                    {spot.distanceFromPakurStation}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky mobile CTA bar ── */}
        <div className="sticky top-0 z-30 lg:hidden border-b border-[rgba(212,169,66,0.1)] bg-[var(--bg-deep)]/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2">
            <a
              href={getOsmDirectionsUrl(spot.latitude, spot.longitude)}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#00C785] text-[#030806] py-2.5 rounded-xl font-body"
            >
              <Navigation size={13} /> GPS Directions
            </a>
            <a
              href={getGpsNavigationUrl(spot.latitude, spot.longitude, spot.title)}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#D4A942] text-[#030806] py-2.5 rounded-xl font-body"
            >
              <MapPin size={13} /> Google Maps
            </a>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">

          {/* ── Left: Main Content ── */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">

            {/* Description */}
            <section className="bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.12)] p-5 sm:p-8 space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2 text-[#D4A942] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] font-body">
                <Sparkles size={12} />
                About This Destination
              </div>
              <p className="text-[#7A9180] text-sm sm:text-base leading-relaxed font-body">{spot.description}</p>
              {spot.longDescription && (
                <p className="text-[#7A9180] text-sm sm:text-base leading-relaxed font-body border-t border-[rgba(212,169,66,0.08)] pt-4">
                  {spot.longDescription}
                </p>
              )}
            </section>

            {/* Highlights */}
            {spot.highlights && spot.highlights.length > 0 && (
              <section className="bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.12)] p-5 sm:p-8 space-y-4">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#F5F0E8]">Key Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {spot.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[rgba(212,169,66,0.04)] border border-[rgba(212,169,66,0.1)]">
                      <CheckCircle className="w-4 h-4 text-[#00C785] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[#F5F0E8] font-body">{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Cultural Note */}
            {spot.culturalNote && (
              <section className="bg-[rgba(212,169,66,0.04)] border border-[rgba(212,169,66,0.2)] rounded-2xl p-5 sm:p-7 space-y-2">
                <div className="flex items-center gap-2 text-[#D4A942] text-[10px] sm:text-xs font-semibold uppercase tracking-wider font-body">
                  <Sparkles size={12} /> Cultural Significance
                </div>
                <p className="text-xs sm:text-sm text-[#7A9180] leading-relaxed italic font-body">
                  &ldquo;{spot.culturalNote}&rdquo;
                </p>
              </section>
            )}

            {/* Interactive Photo Gallery with Pop-Zoom & Slide Lightbox */}
            {((spot.galleryImages && spot.galleryImages.length > 0) || spot.coverImage) && (
              <InteractivePhotoGallery
                spotTitle={spot.title}
                coverImage={spot.coverImage}
                galleryImages={spot.galleryImages || []}
              />
            )}

            {/* Interactive Map */}
            <section className="space-y-3">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#F5F0E8]">Location &amp; Access</h3>
              <div className="h-64 sm:h-80 rounded-2xl overflow-hidden border border-[rgba(212,169,66,0.2)]">
                <DynamicMap spots={[spot]} center={[spot.latitude, spot.longitude]} zoom={13} height="100%" />
              </div>
            </section>

            {/* Reviews */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#F5F0E8]">Visitor Experiences</h3>
                <span className="text-xs text-[#7A9180] font-body">{reviews.length} reviews</span>
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="bg-[var(--bg-card)] rounded-xl border border-[rgba(212,169,66,0.1)] p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[rgba(212,169,66,0.15)] text-[#D4A942] text-[10px] font-bold flex items-center justify-center">
                            {rev.userName[0]}
                          </div>
                          <span className="text-xs font-semibold text-[#F5F0E8] font-body">{rev.userName}</span>
                        </div>
                        <div className="flex items-center text-[#D4A942]">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={11} className="fill-[#D4A942]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-[#7A9180] italic leading-relaxed font-body">&ldquo;{rev.comment}&rdquo;</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#4A6254] font-body">No reviews yet. Be the first!</p>
              )}
            </section>
          </div>

          {/* ── Right: Sticky Info Panel - hidden on mobile (sticky CTA bar used instead) ── */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 bg-[var(--bg-card)] rounded-2xl border border-[rgba(212,169,66,0.15)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] space-y-6">
              <h3 className="font-serif text-base font-bold text-[#F5F0E8] border-b border-[rgba(212,169,66,0.1)] pb-3">
                Essential Visitor Info
              </h3>
              <div className="space-y-4">
                {infoItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[rgba(212,169,66,0.08)] shrink-0">
                      <Icon className="w-4 h-4 text-[#D4A942]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-[#D4A942] uppercase tracking-wider block font-body">{label}</span>
                      <span className="text-xs text-[#7A9180] font-body leading-relaxed">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[rgba(212,169,66,0.1)] space-y-2.5">
                <a
                  href={getOsmDirectionsUrl(spot.latitude, spot.longitude)}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#00C785] hover:bg-[#00E596] text-[#030806] font-semibold text-sm py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(0,199,133,0.25)] transition-all active:scale-95 font-body"
                >
                  <Navigation size={15} /> GPS Directions (OSM)
                </a>
                <a
                  href={getGpsNavigationUrl(spot.latitude, spot.longitude, spot.title)}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[rgba(212,169,66,0.08)] hover:bg-[rgba(212,169,66,0.15)] text-[#D4A942] font-medium text-sm py-3 px-4 rounded-xl border border-[rgba(212,169,66,0.25)] transition-all font-body"
                >
                  <MapPin size={14} /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
