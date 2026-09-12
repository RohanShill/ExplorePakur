"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { TouristSpot } from "@/types";
import CategoryBadge from "./CategoryBadge";
import { MapPin, Calendar, ArrowRight, Compass, Sparkles, Navigation } from "lucide-react";

interface ExtendedTouristSpot extends TouristSpot {
  distanceKm?: number | null;
}

interface SpotCardProps {
  spot: ExtendedTouristSpot;
  featured?: boolean;
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot, featured = false }) => {
  const locale = useLocale();
  const isHi = locale === "hi";
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}&travelmode=driving`;
  const detailUrl = `/${locale}/spots/${spot.slug}`;

  return (
    <div className="group relative flex flex-col bg-[#0D1912] rounded-2xl border border-[rgba(212,169,66,0.12)] hover:border-[rgba(212,169,66,0.35)] transition-all duration-500 overflow-hidden hover:-translate-y-2 card-shadow hover:card-shadow-hover">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#070D09]">
        <img
          src={spot.coverImage}
          alt={spot.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1912] via-[#0D1912]/30 to-black/20 pointer-events-none" />

        {/* Category & distance badges */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
          <CategoryBadge category={spot.category} />
          {spot.distanceKm != null && (
            <span className="inline-flex items-center gap-1 bg-[#00C785] text-[#030806] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md">
              {spot.distanceKm.toFixed(1)} {isHi ? "किमी दूर" : "km away"}
            </span>
          )}
        </div>

        {/* Top pick badge */}
        {featured && (
          <div className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1 bg-[rgba(212,169,66,0.15)] border border-[rgba(212,169,66,0.4)] text-[#D4A942] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md">
            <Sparkles size={10} />
            {isHi ? "विशेष चयन" : "Top Pick"}
          </div>
        )}

        {/* Bottom metadata */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          {spot.bestTimeToVisit && (
            <span className="inline-flex items-center gap-1 bg-[rgba(3,8,6,0.85)] backdrop-blur-md px-2.5 py-1 rounded-lg border border-[rgba(212,169,66,0.15)] text-[11px] font-medium text-[#D4A942]">
              <Calendar size={10} className="text-[#D4A942]" />
              {spot.bestTimeToVisit}
            </span>
          )}
          {spot.distanceFromPakurStation && (
            <span className="inline-flex items-center gap-1 bg-[rgba(3,8,6,0.85)] backdrop-blur-md px-2.5 py-1 rounded-lg border border-[rgba(255,255,255,0.08)] text-[11px] font-medium text-[#7A9180]">
              <MapPin size={10} className="text-[#7A9180]" />
              {spot.distanceFromPakurStation.split(" from")[0]}
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div className="space-y-2">
          <Link href={detailUrl} className="block group/title">
            <h3 className="text-lg font-bold text-[#F5F0E8] group-hover/title:text-[#D4A942] transition-colors line-clamp-1 font-serif">
              {spot.title}
            </h3>
          </Link>
          <p className="text-sm text-[#7A9180] line-clamp-2 leading-relaxed font-body min-h-[2.5rem]">
            {spot.description}
          </p>

          {spot.highlights && spot.highlights.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1.5">
              {spot.highlights.slice(0, 3).map((h, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium bg-[rgba(212,169,66,0.07)] text-[#D4A942] px-2.5 py-0.5 rounded-md border border-[rgba(212,169,66,0.18)] truncate max-w-[150px] font-body"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-[rgba(212,169,66,0.08)] flex items-center gap-2.5">
          <Link
            href={detailUrl}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#F5F0E8] bg-[rgba(212,169,66,0.07)] hover:bg-[#D4A942] hover:text-[#030806] py-2.5 px-3 rounded-xl border border-[rgba(212,169,66,0.2)] hover:border-[#D4A942] transition-all duration-300 active:scale-95 group/btn font-body"
          >
            <Compass size={14} className="text-[#D4A942] group-hover/btn:text-[#030806] transition-colors" />
            <span>{isHi ? "संपूर्ण विवरण" : "Full Guide"}</span>
            <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#00C785] hover:bg-[#00E596] text-[#030806] py-2.5 px-3.5 rounded-xl shadow-[0_2px_14px_rgba(0,199,133,0.3)] hover:shadow-[0_4px_20px_rgba(0,199,133,0.45)] transition-all active:scale-95 whitespace-nowrap font-body"
          >
            <Navigation size={13} />
            {isHi ? "दिशा-निर्देश" : "Directions"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SpotCard;
