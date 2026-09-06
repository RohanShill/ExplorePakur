'use client';

import React from 'react';
import SpotForm from '@/components/admin/SpotForm';
import { ArrowLeft, MapPinPlus } from 'lucide-react';
import Link from 'next/link';

export default function NewSpotPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#FF6B4A] text-sm transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <MapPinPlus size={22} className="text-[#FF6B4A]" />
          Add New Location
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Fill in the details below to add a new tourist destination to Explore Pakur.
        </p>
      </div>

      <SpotForm mode="create" />
    </div>
  );
}
