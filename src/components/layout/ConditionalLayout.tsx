'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import LivingJungleBackground from '@/components/ui/LivingJungleBackground';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Admin pages get a clean layout
    return <>{children}</>;
  }

  // Public pages get the full living Jharkhand forest treatment
  return (
    <SmoothScrollProvider>
      <LivingJungleBackground />
      <Navbar />
      <main className="relative z-10 flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </SmoothScrollProvider>
  );
}
