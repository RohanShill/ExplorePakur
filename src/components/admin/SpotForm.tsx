'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TouristSpot, SpotCategory } from '@/types';
import ImageUploader from './ImageUploader';
import AdminLocationPicker from './AdminLocationPicker';
import { Save, Loader2, MapPin, Tag, Clock, Train, DollarSign, Sparkles, FileText } from 'lucide-react';

interface SpotFormProps {
  initialData?: TouristSpot;
  mode: 'create' | 'edit';
}

const CATEGORIES: { label: string; value: SpotCategory }[] = [
  { label: '🌊 Waterfall', value: 'Waterfall' },
  { label: '⛰️ Cave & Hill', value: 'Cave & Hill' },
  { label: '♨️ Thermal Spring', value: 'Thermal Spring' },
  { label: '🏛️ Park & Heritage', value: 'Park & Heritage' },
  { label: '🛍️ Local Market & Culture', value: 'Local Market & Culture' },
];

export const SpotForm: React.FC<SpotFormProps> = ({ initialData, mode }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category: (initialData?.category || 'Waterfall') as SpotCategory,
    description: initialData?.description || '',
    longDescription: initialData?.longDescription || '',
    latitude: initialData?.latitude?.toString() || '24.630000',
    longitude: initialData?.longitude?.toString() || '87.840000',
    coverImage: initialData?.coverImage || '',
    galleryImages: initialData?.galleryImages || [] as string[],
    bestTimeToVisit: initialData?.bestTimeToVisit || '',
    distanceFromPakurStation: initialData?.distanceFromPakurStation || '',
    entryFee: initialData?.entryFee || '',
    timing: initialData?.timing || '',
    nearestRailway: initialData?.nearestRailway || '',
    highlights: initialData?.highlights?.join(', ') || '',
    culturalNote: initialData?.culturalNote || '',
  });

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: mode === 'create' ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const latNum = parseFloat(form.latitude);
    const lngNum = parseFloat(form.longitude);

    if (isNaN(latNum) || isNaN(lngNum)) {
      setError('Please provide valid Latitude and Longitude coordinates.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        latitude: latNum,
        longitude: lngNum,
        highlights: form.highlights.split(',').map((h) => h.trim()).filter(Boolean),
        galleryImages: form.galleryImages,
      };

      const url = mode === 'create' ? '/api/admin/spots' : `/api/admin/spots/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save location data');
        return;
      }

      setSuccess(data.message || 'Location saved successfully!');
      setTimeout(() => router.push('/admin'), 1200);
    } catch {
      setError('Network error: Could not reach server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addGalleryImage = (url: string) => {
    setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, url] }));
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Status Messages */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <span>{success}</span>
        </div>
      )}

      {/* SECTION: Basic Info */}
      <div className="bg-[#111E16] border border-emerald-500/15 rounded-2xl p-5 sm:p-6 space-y-5">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <FileText size={16} className="text-[#FF6B4A]" /> Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Location Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Kanchangarh Cave"
              className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">URL Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="kanchangarh-cave"
              className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">
            <Tag size={13} className="inline text-[#FF6B4A] mr-1" /> Category *
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, category: cat.value }))}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  form.category === cat.value
                    ? 'bg-[#FF6B4A] text-[#0B130E] shadow-[0_0_15px_rgba(255,107,74,0.35)]'
                    : 'bg-[#0B130E] text-slate-400 border border-emerald-500/20 hover:border-[#FF6B4A]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">Short Description *</label>
          <textarea
            required
            rows={2}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description for cards and search results"
            className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">Detailed Description</label>
          <textarea
            rows={5}
            value={form.longDescription}
            onChange={(e) => setForm((prev) => ({ ...prev, longDescription: e.target.value }))}
            placeholder="Full description for the detail page..."
            className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all resize-y"
          />
        </div>
      </div>

      {/* SECTION: GPS Coordinates & Interactive Map */}
      <div className="bg-[#111E16] border border-emerald-500/15 rounded-2xl p-5 sm:p-6 space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <MapPin size={16} className="text-[#FF6B4A]" /> Location & Map Coordinates
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Pinpoint your destination directly on the map, search a landmark, or enter coordinates below.
          </p>
        </div>

        {/* Live Interactive Map Picker */}
        <AdminLocationPicker
          latitude={parseFloat(form.latitude) || 24.630000}
          longitude={parseFloat(form.longitude) || 87.840000}
          onChange={(lat, lng) => {
            setForm((prev) => ({
              ...prev,
              latitude: lat.toFixed(6),
              longitude: lng.toFixed(6),
            }));
          }}
          spotTitle={form.title}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-emerald-500/10">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Latitude *</label>
            <input
              type="number"
              step="0.000001"
              required
              value={form.latitude}
              onChange={(e) => setForm((prev) => ({ ...prev, latitude: e.target.value }))}
              placeholder="24.6300"
              className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Longitude *</label>
            <input
              type="number"
              step="0.000001"
              required
              value={form.longitude}
              onChange={(e) => setForm((prev) => ({ ...prev, longitude: e.target.value }))}
              placeholder="87.6200"
              className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* SECTION: Images */}
      <div className="bg-[#111E16] border border-emerald-500/15 rounded-2xl p-5 sm:p-6 space-y-5">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Sparkles size={16} className="text-[#FF6B4A]" /> Images
        </h3>

        <ImageUploader
          label="Cover Image (Card Thumbnail) *"
          currentImage={form.coverImage}
          onImageChange={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
          onImageRemove={() => setForm((prev) => ({ ...prev, coverImage: '' }))}
        />

        {/* Gallery Images */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Gallery Images (up to 6)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {form.galleryImages.map((img, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden border border-emerald-500/20 aspect-video bg-[#0B130E]">
                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="absolute top-1.5 right-1.5 bg-red-900/80 hover:bg-red-800 text-red-200 p-1 rounded-lg border border-red-500/25 transition-colors"
                >
                  <span className="text-xs font-bold">✕</span>
                </button>
              </div>
            ))}
          </div>
          {form.galleryImages.length < 6 && (
            <ImageUploader
              label=""
              onImageChange={addGalleryImage}
            />
          )}
        </div>
      </div>

      {/* SECTION: Visitor Details */}
      <div className="bg-[#111E16] border border-emerald-500/15 rounded-2xl p-5 sm:p-6 space-y-5">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Clock size={16} className="text-[#FF6B4A]" /> Visitor Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Best Time to Visit</label>
            <input
              type="text"
              value={form.bestTimeToVisit}
              onChange={(e) => setForm((prev) => ({ ...prev, bestTimeToVisit: e.target.value }))}
              placeholder="Oct to Mar"
              className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">
              <DollarSign size={13} className="inline text-[#FF6B4A] mr-1" /> Entry Fee
            </label>
            <input
              type="text"
              value={form.entryFee}
              onChange={(e) => setForm((prev) => ({ ...prev, entryFee: e.target.value }))}
              placeholder="Free Public Entry"
              className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Opening Hours</label>
            <input
              type="text"
              value={form.timing}
              onChange={(e) => setForm((prev) => ({ ...prev, timing: e.target.value }))}
              placeholder="06:00 AM - 05:00 PM"
              className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Distance from Pakur Station</label>
            <input
              type="text"
              value={form.distanceFromPakurStation}
              onChange={(e) => setForm((prev) => ({ ...prev, distanceFromPakurStation: e.target.value }))}
              placeholder="28 km from Pakur HQ"
              className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">
              <Train size={13} className="inline text-[#FF6B4A] mr-1" /> Nearest Railway Station
            </label>
            <input
              type="text"
              value={form.nearestRailway}
              onChange={(e) => setForm((prev) => ({ ...prev, nearestRailway: e.target.value }))}
              placeholder="Pakur (PKR)"
              className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">Highlights (comma-separated)</label>
          <input
            type="text"
            value={form.highlights}
            onChange={(e) => setForm((prev) => ({ ...prev, highlights: e.target.value }))}
            placeholder="Natural Cave, Scenic Trek, Forest Canopy"
            className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">Cultural Note</label>
          <textarea
            rows={3}
            value={form.culturalNote}
            onChange={(e) => setForm((prev) => ({ ...prev, culturalNote: e.target.value }))}
            placeholder="Any local cultural or historical significance..."
            className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all resize-y"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 bg-[#FF6B4A] hover:bg-[#ff5530] disabled:opacity-60 disabled:cursor-not-allowed text-[#0B130E] font-bold px-8 py-3 rounded-xl text-sm shadow-[0_0_20px_rgba(255,107,74,0.3)] transition-all active:scale-95"
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        <span>{mode === 'create' ? 'Create Location' : 'Save Changes'}</span>
      </button>
    </form>
  );
};

export default SpotForm;