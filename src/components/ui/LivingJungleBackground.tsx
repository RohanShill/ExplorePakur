'use client';

import React, { useEffect, useRef } from 'react';

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulseSpeed: number;
  phase: number;
  color: { r: number; g: number; b: number };
}

export default function LivingJungleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Glowing firefly colors: neon emerald and warm golden amber
    const colors = [
      { r: 0, g: 245, b: 160 },   // Neon emerald mint
      { r: 52, g: 211, b: 153 },  // Sal leaf green
      { r: 255, g: 190, b: 40 },  // Warm golden amber
      { r: 255, g: 230, b: 90 },  // Bright firefly light
    ];

    const fireflyCount = 35;
    const fireflies: Firefly[] = Array.from({ length: fireflyCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.3 - Math.random() * 0.4,
      radius: 1.8 + Math.random() * 2.4,
      baseAlpha: 0.4 + Math.random() * 0.6,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < fireflies.length; i++) {
        const f = fireflies[i];

        f.x += f.vx + Math.sin(f.phase) * 0.35;
        f.y += f.vy;
        f.phase += f.pulseSpeed;

        if (f.y < -20) {
          f.y = height + 10;
          f.x = Math.random() * width;
        }
        if (f.x < -20) f.x = width + 10;
        if (f.x > width + 20) f.x = -10;

        const pulse = (Math.sin(f.phase) + 1) / 2;
        const currentAlpha = f.baseAlpha * pulse;

        if (currentAlpha > 0.02) {
          const glowRadius = f.radius * 5;
          const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowRadius);
          gradient.addColorStop(0, `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, ${currentAlpha})`);
          gradient.addColorStop(0.4, `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, ${currentAlpha * 0.5})`);
          gradient.addColorStop(1, `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, 0)`);

          ctx.beginPath();
          ctx.arc(f.x, f.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. REAL VIBRANT LUSH JHARKHAND SAL JUNGLE WALLPAPER (Prominently visible with slow breathing scale) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-[0.72] will-change-transform"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=2000&q=80')`,
          animation: 'jungleBreathe 35s ease-in-out infinite alternate',
        }}
      />

      {/* 2. Ambient Drifting Morning Mist / Fog Layers */}
      <div
        className="absolute -inset-x-full h-[600px] top-1/4 opacity-[0.18] pointer-events-none will-change-transform"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(52, 211, 153, 0.6) 0%, transparent 100%)',
          animation: 'mistDriftSlow 45s linear infinite',
        }}
      />

      {/* 3. HTML5 Canvas for Glowing Fireflies (Jugnoo) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 4. Elegant Dark Tint Vignette (Darkens center so cards & text pop, but keeps forest trees and canopy clearly visible) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 95% 85% at 50% 30%, rgba(7, 14, 10, 0.45) 0%, rgba(7, 14, 10, 0.68) 60%, rgba(6, 11, 8, 0.88) 100%)',
        }}
      />

      {/* 5. Smooth Bottom Transition to Footer */}
      <div
        className="absolute bottom-0 inset-x-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(6, 11, 8, 0.7) 60%, #050906 100%)',
        }}
      />
    </div>
  );
}
