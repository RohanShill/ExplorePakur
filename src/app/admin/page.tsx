'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TouristSpot } from '@/types';
import {
  LayoutDashboard,
  Plus,
  Search,
  Edit3,
  Trash2,
  MapPin,
  Compass,
  ChevronRight,
  ExternalLink,
  Loader2,
  ImageIcon,
  Mountain,
  Droplets,
  Thermometer,
  TreePine,
} from 'lucide-react';

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  Waterfall: <Droplets size={13} className="text-sky-400" />,
  'Cave & Hill': <Mountain size={13} className="text-amber-400" />,
  'Thermal Spring': <Thermometer size={13} className="text-rose-400" />,
  'Park & Heritage': <TreePine size={13} className="text-emerald-400" />,
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const res = await fetch('/api/admin/spots');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setSpots(data.spots || []);
    } catch {
      console.error('Failed to fetch spots');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (spot: TouristSpot) => {
    if (!confirm(`Are you sure you want to delete "${spot.title}"? This action cannot be undone.`)) return;

    setDeletingId(spot.id);
    try {
      const res = await fetch(`/api/admin/spots/${spot.id}`, { method: 'DELETE' });
      if (res.ok) {
        setSpots((prev) => prev.filter((s) => s.id !== spot.id));
      }
    } catch {
      alert('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = spots.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || s.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <LayoutDashboard size={22} className="text-[#FF6B4A]" />
            Locations Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {spots.length} location{spots.length !== 1 ? 's' : ''} registered
          </p>
        </div>

        <Link
          href="/admin/spots/new"
          className="inline-flex items-center gap-2 bg-[#FF6B4A] hover:bg-[#ff5530] text-[#0B130E] font-bold px-5 py-2.5 rounded-xl text-sm shadow-[0_0_20px_rgba(255,107,74,0.3)] transition-all active:scale-95 self-start"
        >
          <Plus size={16} />
          <span>Add New Location</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111E16] border border-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['All', 'Waterfall', 'Cave & Hill', 'Thermal Spring', 'Park & Heritage'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterCat === cat
                  ? 'bg-[#FF6B4A] text-[#0B130E]'
                  : 'bg-[#111E16] text-slate-400 border border-emerald-500/15 hover:border-[#FF6B4A]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Location Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="text-[#FF6B4A] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111E16] border border-emerald-500/15 rounded-2xl p-12 text-center">
          <ImageIcon size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No locations found</p>
          <Link href="/admin/spots/new" className="text-xs text-[#FF6B4A] hover:underline mt-2 inline-block">
            Create your first location →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((spot) => (
            <div
              key={spot.id}
              className="bg-[#111E16] border border-emerald-500/15 rounded-2xl overflow-hidden hover:border-[#FF6B4A]/30 transition-all group"
            >
              {/* Cover Image */}
              <div className="relative h-40 bg-[#0B130E] overflow-hidden">
                {spot.coverImage ? (
                  <img
                    src={spot.coverImage}
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon size={28} className="text-slate-600" />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5">
                  <span className="inline-flex items-center gap-1 bg-[#0B130E]/80 backdrop-blur-sm text-[10px] font-bold text-slate-200 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {CATEGORY_ICON[spot.category]}
                    {spot.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 line-clamp-1">{spot.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{spot.description}</p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <MapPin size={11} />
                  <span>{spot.latitude}, {spot.longitude}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-emerald-500/10">
                  <Link
                    href={`/admin/spots/${spot.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#0B130E] hover:bg-[#16281E] text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold border border-emerald-500/20 hover:border-[#FF6B4A]/40 transition-all"
                  >
                    <Edit3 size={12} />
                    Edit
                  </Link>
                  <Link
                    href={`/spots/${spot.slug}`}
                    target="_blank"
                    className="inline-flex items-center justify-center p-2 bg-[#0B130E] hover:bg-[#16281E] text-slate-400 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
                    title="View on site"
                  >
                    <ExternalLink size={12} />
                  </Link>
                  <button
                    onClick={() => handleDelete(spot)}
                    disabled={deletingId === spot.id}
                    className="inline-flex items-center justify-center p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-xl border border-red-500/15 hover:border-red-500/40 transition-all disabled:opacity-50"
                    title="Delete location"
                  >
                    {deletingId === spot.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
