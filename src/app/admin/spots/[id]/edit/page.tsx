'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SpotForm from '@/components/admin/SpotForm';
import { TouristSpot } from '@/types';
import { ArrowLeft, Edit3, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditSpotPage() {
  const params = useParams();
  const router = useRouter();
  const [spot, setSpot] = useState<TouristSpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id) return;

    const fetchSpot = async () => {
      try {
        const res = await fetch(`/api/admin/spots/${params.id}`);
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        if (!res.ok) {
          setError('Location not found');
          return;
        }
        const data = await res.json();
        setSpot(data.spot);
      } catch {
        setError('Failed to load location');
      } finally {
        setLoading(false);
      }
    };

    fetchSpot();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="text-[#FF6B4A] animate-spin" />
      </div>
    );
  }

  if (error || !spot) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#FF6B4A] text-sm transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
        <div className="bg-red-900/30 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl text-sm">
          {error || 'Location not found'}
        </div>
      </div>
    );
  }

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
          <Edit3 size={22} className="text-[#FF6B4A]" />
          Edit: {spot.title}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Update the details for this location.
        </p>
      </div>

      <SpotForm mode="edit" initialData={spot} />
    </div>
  );
}
