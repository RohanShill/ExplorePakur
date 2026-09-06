'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  stagger = 0.12,
  delay = 0.05,
  duration = 0.85,
  yOffset = 35,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const elements = containerRef.current.children;
      if (elements.length === 0) return;

      gsap.from(elements, {
        opacity: 0,
        y: yOffset,
        duration: duration,
        stagger: stagger,
        delay: delay,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
