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
  Globe,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
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
  const [batchTranslating, setBatchTranslating] = useState(false);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const res = await fetch('/api/admin/spots', { cache: 'no-store' });
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

  // 1-Click single spot translation
  const handleTranslateSpot = async (spot: TouristSpot) => {
    setTranslatingId(spot.id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/spots/${spot.id}/translate`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: `✓ "${spot.title}" successfully translated to Hindi!` });
        await fetchSpots();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Translation failed' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to request translation' });
    } finally {
      setTranslatingId(null);
    }
  };

  // Batch translate all spots (Migration tool for existing content)
  const handleBatchTranslate = async () => {
    if (!confirm('Run Google Cloud batch translation for all destinations missing Hindi translations?')) return;

    setBatchTranslating(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/translate/batch', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: 'success',
          message: `✓ Batch translation completed! Translated: ${data.translatedCount}, Skipped: ${data.skippedCount}, Total: ${data.totalSpots}`,
        });
        await fetchSpots();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Batch translation failed' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to perform batch translation' });
    } finally {
      setBatchTranslating(false);
    }
  };

  const filtered = spots.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || s.category === filterCat;
    return matchSearch && matchCat;
  });

  const translatedCount = spots.filter((s) => s.translationStatus === 'translated' || s.translations?.hi).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <LayoutDashboard size={22} className="text-[#FF6B4A]" />
            Locations & Translation Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {spots.length} location{spots.length !== 1 ? 's' : ''} registered • Multilingual Production System
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleBatchTranslate}
            disabled={batchTranslating}
            className="inline-flex items-center gap-2 bg-[#0A1A12] hover:bg-[#11261B] text-[#00C785] border border-[#00C785]/40 font-bold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-95 disabled:opacity-50"
            title="Translate all destinations missing Hindi versions"
          >
            {batchTranslating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Translating Batch...</span>
              </>
            ) : (
              <>
                <Globe size={14} />
                <span>Batch Translate to Hindi</span>
              </>
            )}
          </button>

          <Link
            href="/admin/spots/new"
            className="inline-flex items-center gap-2 bg-[#FF6B4A] hover:bg-[#ff5530] text-[#0B130E] font-bold px-5 py-2.5 rounded-xl text-xs shadow-[0_0_20px_rgba(255,107,74,0.3)] transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add New Location</span>
          </Link>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`px-4 py-3 rounded-xl text-sm flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-900/30 border border-emerald-500/40 text-emerald-300'
              : 'bg-red-900/30 border border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Translation & Stats Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111E16] border border-emerald-500/15 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 block font-body">Total Destinations</span>
          <span className="text-2xl font-black text-slate-100 mt-1 block font-serif">{spots.length}</span>
        </div>
        <div className="bg-[#111E16] border border-emerald-500/15 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 block font-body">🇬🇧 English Active</span>
          <span className="text-2xl font-black text-[#D4A942] mt-1 block font-serif">{spots.length}</span>
        </div>
        <div className="bg-[#111E16] border border-emerald-500/15 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 block font-body">🇮🇳 Hindi Translated</span>
          <span className="text-2xl font-black text-[#00C785] mt-1 block font-serif">{translatedCount}</span>
        </div>
        <div className="bg-[#111E16] border border-emerald-500/15 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 block font-body">Translation Coverage</span>
          <span className="text-2xl font-black text-slate-100 mt-1 block font-serif">
            {spots.length > 0 ? Math.round((translatedCount / spots.length) * 100) : 0}%
          </span>
        </div>
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
          {['All', 'Waterfall', 'Cave & Hill', 'Thermal Spring', 'Park & Heritage', 'Local Market & Culture'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterCat === cat
                  ? 'bg-[#FF6B4A] text-[#0B130E] font-bold shadow-sm'
                  : 'bg-[#111E16] text-slate-400 hover:text-slate-200 border border-emerald-500/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Location List / Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="text-[#FF6B4A] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#111E16] rounded-2xl border border-emerald-500/10 space-y-3">
          <Compass size={36} className="mx-auto text-slate-600" />
          <p className="text-slate-400 text-sm">No locations found matching your filter.</p>
        </div>
      ) : (
        <div className="bg-[#111E16] rounded-2xl border border-emerald-500/15 overflow-hidden">
          <div className="divide-y divide-emerald-500/10">
            {filtered.map((spot) => {
              const isTranslated = spot.translationStatus === 'translated' || spot.translations?.hi;
              const isTranslatingCurrent = translatingId === spot.id;

              return (
                <div
                  key={spot.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#15251C] transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#0D1912] border border-emerald-500/20 shrink-0">
                      {spot.coverImage ? (
                        <img src={spot.coverImage} alt={spot.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>

                    {/* Title, Category & Badges */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-[#FF6B4A] transition-colors">
                          {spot.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-[#0A120D] px-2 py-0.5 rounded-md border border-emerald-500/10">
                          {CATEGORY_ICON[spot.category] || null}
                          {spot.category}
                        </span>

                        {/* Translation status badge */}
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isTranslated
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {isTranslated ? '✓ 🇮🇳 HI Translated' : '⚠ 🇮🇳 HI Pending'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1">
                        {spot.description}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span>{spot.latitude?.toFixed(4)}, {spot.longitude?.toFixed(4)}</span>
                        <span>•</span>
                        <span>{spot.galleryImages?.length || 0} photos</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!isTranslated && (
                      <button
                        onClick={() => handleTranslateSpot(spot)}
                        disabled={isTranslatingCurrent}
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        title="Translate to Hindi using Google Cloud API"
                      >
                        {isTranslatingCurrent ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <RefreshCw size={13} />
                        )}
                        <span>Translate</span>
                      </button>
                    )}

                    <Link
                      href={`/en/spots/${spot.slug}`}
                      target="_blank"
                      className="p-2 text-slate-400 hover:text-slate-200 hover:bg-[#111E16] rounded-lg transition-colors"
                      title="View live page (EN)"
                    >
                      <ExternalLink size={15} />
                    </Link>

                    <Link
                      href={`/admin/spots/${spot.id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B4A]/10 hover:bg-[#FF6B4A]/20 text-[#FF6B4A] rounded-lg text-xs font-semibold border border-[#FF6B4A]/20 transition-colors"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(spot)}
                      disabled={deletingId === spot.id}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete location"
                    >
                      {deletingId === spot.id ? (
                        <Loader2 size={15} className="animate-spin text-red-400" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
