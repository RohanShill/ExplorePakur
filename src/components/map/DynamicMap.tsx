'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { TouristSpot } from '@/types';
import { MapPin } from 'lucide-react';

interface DynamicMapProps {
  spots: TouristSpot[];
  center?: [number, number];
  zoom?: number;
  selectedSpotId?: string;
  className?: string;
  height?: string;
}

// Dark matter skeleton fallback while Leaflet loads client-side
const MapLoadingSkeleton: React.FC<{ height?: string }> = ({ height = '400px' }) => (
  <div
    style={{ height }}
    className="w-full rounded-2xl bg-[#0B130E] animate-pulse flex flex-col items-center justify-center border border-emerald-500/15 text-slate-400 gap-3 shadow-inner"
  >
    <div className="p-3 bg-[#111E16] border border-emerald-500/30 rounded-full shadow-[0_0_15px_rgba(0,245,160,0.2)]">
      <MapPin className="h-6 w-6 text-[#00F5A0] animate-bounce" />
    </div>
    <span className="text-xs font-semibold text-slate-400 tracking-wide">
      Loading Dark Matter Geolocation Grid...
    </span>
  </div>
);

// Dynamic import with SSR disabled to strictly prevent "window is not defined" error
const MapComponentWithNoSSR = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  }
);

export const DynamicMap: React.FC<DynamicMapProps> = (props) => {
  return <MapComponentWithNoSSR {...props} />;
};

export default DynamicMap;
