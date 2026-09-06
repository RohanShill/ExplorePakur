'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThreeSafariJeepProps {
  rotationZ?: number; // Steering angle in radians
  tiltRoll?: number;  // Banking tilt into curves
  isDriving?: boolean;
}

export const ThreeSafariJeep: React.FC<ThreeSafariJeepProps> = ({
  rotationZ = Math.PI, // Facing forward down the road
  tiltRoll = 0,
  isDriving = true,
}) => {
  const jeepGroupRef = useRef<THREE.Group>(null);
  const frontLeftWheelRef = useRef<THREE.Mesh>(null);
  const frontRightWheelRef = useRef<THREE.Mesh>(null);
  const rearLeftWheelRef = useRef<THREE.Mesh>(null);
  const rearRightWheelRef = useRef<THREE.Mesh>(null);

  // Smooth frame interpolation
  useFrame((_, delta) => {
    if (!jeepGroupRef.current) return;

    // Smoothly interpolate rotation heading and roll tilt
    jeepGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      jeepGroupRef.current.rotation.y,
      rotationZ,
      0.15
    );

    // Roll banking into curves (tilt around Z axis)
    jeepGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      jeepGroupRef.current.rotation.z,
      tiltRoll * 0.5,
      0.1
    );

    // Spin wheels when driving
    if (isDriving) {
      const wheelSpin = delta * 12;
      if (frontLeftWheelRef.current) frontLeftWheelRef.current.rotation.x += wheelSpin;
      if (frontRightWheelRef.current) frontRightWheelRef.current.rotation.x += wheelSpin;
      if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x += wheelSpin;
      if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x += wheelSpin;
    }
  });

  return (
    <group ref={jeepGroupRef} scale={[0.85, 0.85, 0.85]}>
      {/* VEHICLE BODY CHASSIS */}
      {/* Lower Chassis Frame */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.7, 0.45, 3.4]} />
        <meshStandardMaterial color="#111E16" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Hood & Engine Bay */}
      <mesh position={[0, 0.7, 0.8]} castShadow>
        <boxGeometry args={[1.6, 0.38, 1.4]} />
        <meshStandardMaterial color="#16281E" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Cabin / Cockpit */}
      <mesh position={[0, 0.95, -0.4]} castShadow>
        <boxGeometry args={[1.55, 0.75, 1.6]} />
        <meshStandardMaterial color="#0B130E" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windshield (Tinted Green Glass) */}
      <mesh position={[0, 0.98, 0.41]} rotation={[-0.25, 0, 0]}>
        <planeGeometry args={[1.4, 0.55]} />
        <meshStandardMaterial
          color="#00F5A0"
          transparent
          opacity={0.45}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Rear Window */}
      <mesh position={[0, 0.98, -1.21]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[1.3, 0.5]} />
        <meshStandardMaterial color="#00F5A0" transparent opacity={0.35} roughness={0.1} />
      </mesh>

      {/* Heavy-Duty Front Bumper */}
      <mesh position={[0, 0.35, 1.78]} castShadow>
        <boxGeometry args={[1.8, 0.22, 0.25]} />
        <meshStandardMaterial color="#060B08" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Safari Roof Expedition Rack */}
      <group position={[0, 1.38, -0.4]}>
        <mesh>
          <boxGeometry args={[1.5, 0.1, 1.5]} />
          <meshStandardMaterial color="#00F5A0" metalness={0.8} roughness={0.2} wireframe />
        </mesh>
        {/* Expedition Cargo Box 1 (Forest Emerald) */}
        <mesh position={[-0.3, 0.15, 0.2]} castShadow>
          <boxGeometry args={[0.55, 0.25, 0.6]} />
          <meshStandardMaterial color="#059669" roughness={0.6} />
        </mesh>
        {/* Expedition Cargo Box 2 (Terracotta Rust) */}
        <mesh position={[0.3, 0.15, -0.1]} castShadow>
          <boxGeometry args={[0.55, 0.25, 0.7]} />
          <meshStandardMaterial color="#FF6B4A" roughness={0.5} />
        </mesh>
      </group>

      {/* Rear Mounted Spare Wheel */}
      <mesh position={[0, 0.7, -1.82]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.22, 16]} />
        <meshStandardMaterial color="#060B08" roughness={0.8} />
      </mesh>

      {/* 4 3D WHEELS */}
      {/* Front Left Wheel */}
      <mesh ref={frontLeftWheelRef} position={[-0.92, 0.32, 1.0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.28, 16]} />
        <meshStandardMaterial color="#060B08" roughness={0.8} />
      </mesh>
      {/* Front Right Wheel */}
      <mesh ref={frontRightWheelRef} position={[0.92, 0.32, 1.0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.28, 16]} />
        <meshStandardMaterial color="#060B08" roughness={0.8} />
      </mesh>
      {/* Rear Left Wheel */}
      <mesh ref={rearLeftWheelRef} position={[-0.92, 0.32, -0.9]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.28, 16]} />
        <meshStandardMaterial color="#060B08" roughness={0.8} />
      </mesh>
      {/* Rear Right Wheel */}
      <mesh ref={rearRightWheelRef} position={[0.92, 0.32, -0.9]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.28, 16]} />
        <meshStandardMaterial color="#060B08" roughness={0.8} />
      </mesh>

      {/* 3D WARM AMBER-GOLD HEADLIGHTS WITH LIGHT BEAMS */}
      {/* Left Headlight */}
      <mesh position={[-0.55, 0.55, 1.62]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#FFD166" />
      </mesh>
      <spotLight
        position={[-0.55, 0.55, 1.7]}
        target-position={[-0.55, 0, 8]}
        color="#FFD166"
        intensity={3.8}
        distance={12}
        angle={0.45}
        penumbra={0.6}
      />

      {/* Right Headlight */}
      <mesh position={[0.55, 0.55, 1.62]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#FFD166" />
      </mesh>
      <spotLight
        position={[0.55, 0.55, 1.7]}
        target-position={[0.55, 0, 8]}
        color="#FFD166"
        intensity={3.8}
        distance={12}
        angle={0.45}
        penumbra={0.6}
      />

      {/* Tail Lights */}
      <mesh position={[-0.6, 0.48, -1.72]}>
        <boxGeometry args={[0.18, 0.1, 0.05]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <mesh position={[0.6, 0.48, -1.72]}>
        <boxGeometry args={[0.18, 0.1, 0.05]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>

      {/* Warm Terracotta Ground Underglow */}
      <pointLight position={[0, 0.1, 0]} color="#FF6B4A" intensity={2.4} distance={3.8} />
    </group>
  );
};

export default ThreeSafariJeep;
