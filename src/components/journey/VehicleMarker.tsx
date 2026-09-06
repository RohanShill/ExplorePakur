import React from 'react';

interface VehicleMarkerProps {
  rotation?: number;
  isDriving?: boolean;
}

export const VehicleMarker: React.FC<VehicleMarkerProps> = ({
  rotation = 0,
  isDriving = true,
}) => {
  return (
    <div
      className="relative z-30 pointer-events-none transition-transform duration-75 ease-out"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Vehicle Shadow */}
      <div className="absolute -inset-2 bg-black/60 blur-md rounded-full -z-10" />

      {/* Headlights Light Beams */}
      {isDriving && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-20 h-20 pointer-events-none">
          <div
            className="w-full h-full bg-gradient-to-b from-[#00F5A0]/50 via-[#00F5A0]/15 to-transparent blur-md transform"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
            }}
          />
        </div>
      )}

      {/* Eco Safari Jeep SVG (Top-Down View) */}
      <svg
        width="44"
        height="70"
        viewBox="0 0 44 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_12px_rgba(0,245,160,0.4)]"
      >
        {/* Wheels (4x) */}
        <rect x="1" y="10" width="6" height="14" rx="2" fill="#060B08" stroke="#16281E" strokeWidth="1" />
        <rect x="37" y="10" width="6" height="14" rx="2" fill="#060B08" stroke="#16281E" strokeWidth="1" />
        <rect x="1" y="46" width="6" height="14" rx="2" fill="#060B08" stroke="#16281E" strokeWidth="1" />
        <rect x="37" y="46" width="6" height="14" rx="2" fill="#060B08" stroke="#16281E" strokeWidth="1" />

        {/* Main Body */}
        <rect
          x="6"
          y="4"
          width="32"
          height="62"
          rx="7"
          fill="#111E16"
          stroke="#00F5A0"
          strokeWidth="2"
        />

        {/* Hood Accent */}
        <path
          d="M10 12 H34 V22 C34 24 32 26 30 26 H14 C12 26 10 24 10 22 Z"
          fill="#16281E"
        />

        {/* Front Windshield */}
        <path
          d="M11 25 H33 L30 33 H14 L11 25 Z"
          fill="#00F5A0"
          fillOpacity="0.3"
          stroke="#00F5A0"
          strokeWidth="1"
        />

        {/* Roof Rack & Spare Luggage */}
        <rect x="12" y="36" width="20" height="20" rx="3" fill="#1D3528" stroke="#00F5A0" strokeWidth="1" />
        <line x1="12" y1="42" x2="32" y2="42" stroke="#00F5A0" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="12" y1="48" x2="32" y2="48" stroke="#00F5A0" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="12" y1="54" x2="32" y2="54" stroke="#00F5A0" strokeWidth="1" strokeOpacity="0.5" />

        {/* Rear Windshield */}
        <path
          d="M13 58 H31 L29 63 H15 L13 58 Z"
          fill="#00F5A0"
          fillOpacity="0.2"
        />

        {/* Headlights (Glowing Neon) */}
        <circle cx="10" cy="5" r="2.5" fill="#00F5A0" className="animate-pulse" />
        <circle cx="34" cy="5" r="2.5" fill="#00F5A0" className="animate-pulse" />

        {/* Tail Lights */}
        <circle cx="10" cy="65" r="2" fill="#EF4444" />
        <circle cx="34" cy="65" r="2" fill="#EF4444" />
      </svg>
    </div>
  );
};

export default VehicleMarker;
