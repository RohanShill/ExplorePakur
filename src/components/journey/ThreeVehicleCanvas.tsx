'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import ThreeSafariJeep from './ThreeSafariJeep';

interface ThreeVehicleCanvasProps {
  rotationZ?: number; // In radians
  tiltRoll?: number;  // Banking tilt in radians
  isDriving?: boolean;
}

export const ThreeVehicleCanvas: React.FC<ThreeVehicleCanvasProps> = ({
  rotationZ = Math.PI,
  tiltRoll = 0,
  isDriving = true,
}) => {
  return (
    <div className="relative w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]">
      <Canvas
        camera={{ position: [0, 6.5, 4.5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        {/* Natural Atmospheric Lighting */}
        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#e2e8f0" />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#FF6B4A" />

        {/* 3D Safari Adventure Vehicle */}
        <ThreeSafariJeep rotationZ={rotationZ} tiltRoll={tiltRoll} isDriving={isDriving} />
      </Canvas>
    </div>
  );
};

export default ThreeVehicleCanvas;
