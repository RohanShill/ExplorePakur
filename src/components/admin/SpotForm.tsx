'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TouristSpot, SpotCategory, TouristSpotTranslation, TranslationStatus } from '@/types';
import ImageUploader from './ImageUploader';
import AdminLocationPicker from './AdminLocationPicker';
import {
  Save, Loader2, MapPin, Tag, Clock, Train, DollarSign,
  Sparkles, FileText, Globe, CheckCircle, AlertTriangle, XCircle, RefreshCw,
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'en' | 'hi'>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hiData = initialData?.translations?.hi;

  // English Form State
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

  // Hindi Form State
  const [hindiForm, setHindiForm] = useState({
    title: hiData?.title || '',
    description: hiData?.description || '',
    longDescription: hiData?.longDescription || '',
    highlights: hiData?.highlights?.join(', ') || '',
    culturalNote: hiData?.culturalNote || '',
    bestTimeToVisit: hiData?.bestTimeToVisit || '',
    distanceFromPakurStation: hiData?.distanceFromPakurStation || '',
    entryFee: hiData?.entryFee || '',
    timing: hiData?.timing || '',
    nearestRailway: hiData?.nearestRailway || '',
  });

  const [translationStatus, setTranslationStatus] = useState<TranslationStatus>(
    initialData?.translationStatus || (hiData ? 'translated' : 'pending')
  );

  const addGalleryImage = (url: string) => {
    setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, url] }));
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: mode === 'create' ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
    }));
  };

  // Trigger server-side Gemini Translation (Google AI Studio) for this spot
  const handleAutoTranslate = async () => {
    if (!form.title || !form.description) {
      setError('Please fill in English Title and Description before auto-translating.');
      return;
    }

    setIsTranslating(true);
    setError('');

    try {
      if (mode === 'edit' && initialData?.id) {
        // Call backend translation endpoint
        const res = await fetch(`/api/admin/spots/${initialData.id}/translate`, {
          method: 'POST',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.translation) {
            const tr = data.translation;
            setHindiForm({
              title: tr.title || '',
              description: tr.description || '',
              longDescription: tr.longDescription || '',
              highlights: tr.highlights?.join(', ') || '',
              culturalNote: tr.culturalNote || '',
              bestTimeToVisit: tr.bestTimeToVisit || '',
              distanceFromPakurStation: tr.distanceFromPakurStation || '',
              entryFee: tr.entryFee || '',
              timing: tr.timing || '',
              nearestRailway: tr.nearestRailway || '',
            });
            setTranslationStatus(tr.translationStatus || 'translated');
            setSuccess('Hindi translation generated successfully via Gemini API (Google AI Studio)!');
            setActiveTab('hi');
            return;
          }
        }
      }

      // Fallback for new spots: draft translation
      setHindiForm({
        title: form.title,
        description: form.description,
        longDescription: form.longDescription,
        highlights: form.highlights,
        culturalNote: form.culturalNote,
        bestTimeToVisit: form.bestTimeToVisit,
        distanceFromPakurStation: form.distanceFromPakurStation,
        entryFee: form.entryFee,
        timing: form.timing,
        nearestRailway: form.nearestRailway,
      });
      setSuccess('Draft populated. Gemini will automatically translate upon saving!');
      setActiveTab('hi');
    } catch (err) {
      console.error('Auto-translate error:', err);
      setError('Translation request failed. Please check connection.');
    } finally {
      setIsTranslating(false);
    }
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
      const payload: any = {
        ...form,
        latitude: latNum,
        longitude: lngNum,
        highlights: form.highlights.split(',').map((h) => h.trim()).filter(Boolean),
        galleryImages: form.galleryImages,
      };

      // Attach Hindi translation if provided
      if (hindiForm.title.trim()) {
        payload.hindiTranslation = {
          ...hindiForm,
          highlights: hindiForm.highlights.split(',').map((h) => h.trim()).filter(Boolean),
        };
      }

      const url = mode === 'create' ? '/api/admin/spots' : `/api/admin/spots/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save location');
        setIsSubmitting(false);
        return;
      }

      setSuccess(mode === 'create' ? 'Location created successfully with Hindi translation!' : 'Location and translations updated successfully!');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1200);
    } catch {
      setError('An unexpected network error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Notifications */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <XCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Language Tabs & Auto-Translate Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A120D] border border-emerald-500/15 p-2 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'en'
                ? 'bg-[#FF6B4A] text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#111E16]'
            }`}
          >
            <span>🇬🇧 English Content</span>
            <span className="text-[10px] opacity-80">(Source)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hi'
                ? 'bg-[#FF6B4A] text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#111E16]'
            }`}
          >
            <span>🇮🇳 हिंदी अनुवाद</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              translationStatus === 'translated'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              {translationStatus === 'translated' ? '✓ अनुवादित' : 'लंबित'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={isTranslating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {isTranslating ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Gemini अनुवाद हो रहा है...</span>
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                <span>Auto-Translate to Hindi</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: ENGLISH CONTENT */}
      {activeTab === 'en' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Basic Info */}
          <div className="bg-[#0A120D] rounded-2xl border border-emerald-500/15 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
              <FileText size={16} className="text-[#FF6B4A]" />
              Basic Information (English)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Location Title <span className="text-[#FF6B4A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Lilatari Waterfall"
                  className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  URL Slug <span className="text-[#FF6B4A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. lilatari-waterfall"
                  className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category <span className="text-[#FF6B4A]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.value })}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      form.category === cat.value
                        ? 'border-[#FF6B4A] bg-[#FF6B4A]/15 text-[#FF6B4A] font-bold'
                        : 'border-emerald-500/15 bg-[#0D1912] text-slate-400 hover:border-emerald-500/30'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Short Description (Cards & Previews) <span className="text-[#FF6B4A]">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="A scenic cascade surrounded by lush green forests..."
                className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Detailed Description (Detail Page)
              </label>
              <textarea
                rows={4}
                value={form.longDescription}
                onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                placeholder="Provide a rich narrative about the location, walking trails, viewpoints, and experience..."
                className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Location / Coordinates */}
          <div className="bg-[#0A120D] rounded-2xl border border-emerald-500/15 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
              <MapPin size={16} className="text-[#FF6B4A]" />
              Geographic Coordinates
            </h2>

            <AdminLocationPicker
              latitude={parseFloat(form.latitude) || 24.63}
              longitude={parseFloat(form.longitude) || 87.84}
              onChange={(lat, lng) => setForm((prev) => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }))}
            />
          </div>

          {/* Photography & Media */}
          <div className="bg-[#0A120D] rounded-2xl border border-emerald-500/15 p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
              <Sparkles size={16} className="text-[#FF6B4A]" />
              Photography & Media
            </h2>

            <ImageUploader
              label="Cover Image (Card Thumbnail) *"
              currentImage={form.coverImage}
              onImageChange={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
              onImageRemove={() => setForm((prev) => ({ ...prev, coverImage: '' }))}
            />

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

          {/* Visitor Info */}
          <div className="bg-[#0A120D] rounded-2xl border border-emerald-500/15 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
              <Clock size={16} className="text-[#FF6B4A]" />
              Visitor Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Best Time to Visit</label>
                <input
                  type="text"
                  value={form.bestTimeToVisit}
                  onChange={(e) => setForm({ ...form, bestTimeToVisit: e.target.value })}
                  placeholder="e.g. October to March"
                  className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Entry Fee</label>
                <input
                  type="text"
                  value={form.entryFee}
                  onChange={(e) => setForm({ ...form, entryFee: e.target.value })}
                  placeholder="e.g. Free Entry or ₹20"
                  className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Visiting Hours</label>
                <input
                  type="text"
                  value={form.timing}
                  onChange={(e) => setForm({ ...form, timing: e.target.value })}
                  placeholder="e.g. Sunrise to Sunset"
                  className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Distance from Pakur (km)</label>
                <input
                  type="text"
                  value={form.distanceFromPakurStation}
                  onChange={(e) => setForm({ ...form, distanceFromPakurStation: e.target.value })}
                  placeholder="e.g. 45"
                  className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nearest Railway</label>
                <input
                  type="text"
                  value={form.nearestRailway}
                  onChange={(e) => setForm({ ...form, nearestRailway: e.target.value })}
                  placeholder="e.g. Pakur Junction (PKR)"
                  className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Key Highlights (comma-separated)
              </label>
              <input
                type="text"
                value={form.highlights}
                onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                placeholder="e.g. Natural Waterfall, Forest Trail, Picnic Spot"
                className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cultural Significance Note</label>
              <textarea
                rows={2}
                value={form.culturalNote}
                onChange={(e) => setForm({ ...form, culturalNote: e.target.value })}
                placeholder="Sacred tribal gathering grove for Baha and Sohrai festivities..."
                className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HINDI TRANSLATION (ADMIN EDITABLE DRAFT) */}
      {activeTab === 'hi' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Status Banner */}
          <div className="bg-[#0D1912] border border-[rgba(212,169,66,0.25)] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[rgba(212,169,66,0.1)] text-[#D4A942] flex items-center justify-center shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F5F0E8] flex items-center gap-2 font-serif">
                  <span>Gemini API (Google AI Studio)</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-body ${
                    translationStatus === 'translated'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {translationStatus === 'translated' ? '✓ अनुवादित' : 'लंबित'}
                  </span>
                </h3>
                <p className="text-xs text-[#7A9180] font-body mt-0.5">
                  यह अनुवाद Gemini AI द्वारा स्वचालित रूप से तैयार किया गया है। आवश्यकतानुसार इसमें संशोधन किया जा सकता है।
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoTranslate}
              disabled={isTranslating}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#D4A942] hover:bg-[#c29636] text-[#030806] transition-all active:scale-95 disabled:opacity-50"
            >
              {isTranslating ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>अनुवाद हो रहा है...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={13} />
                  <span>पुनः अनुवाद करें (Regenerate)</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#0A120D] rounded-2xl border border-emerald-500/15 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
              <Globe size={16} className="text-[#00C785]" />
              हिंदी विवरण एवं अनुवादित फ़ील्ड्स (Hindi Fields)
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                स्थान का नाम (Hindi Title)
              </label>
              <input
                type="text"
                value={hindiForm.title}
                onChange={(e) => setHindiForm({ ...hindiForm, title: e.target.value })}
                placeholder="उदा. लिलातरी जलप्रपात"
                className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                संक्षिप्त विवरण (Hindi Short Description)
              </label>
              <textarea
                rows={2}
                value={hindiForm.description}
                onChange={(e) => setHindiForm({ ...hindiForm, description: e.target.value })}
                placeholder="हरियाली और शांत वादियों के बीच स्थित मनोरम जलप्रपात..."
                className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                विस्तृत विवरण (Hindi Long Description)
              </label>
              <textarea
                rows={4}
                value={hindiForm.longDescription}
                onChange={(e) => setHindiForm({ ...hindiForm, longDescription: e.target.value })}
                placeholder="इस पर्यटन स्थल के प्राकृतिक सौंदर्य, ट्रेकिंग मार्गों और अनुभव का संपूर्ण विवरण..."
                className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">घूमने का समय (Best Time)</label>
                <input
                  type="text"
                  value={hindiForm.bestTimeToVisit}
                  onChange={(e) => setHindiForm({ ...hindiForm, bestTimeToVisit: e.target.value })}
                  placeholder="उदा. अक्टूबर से मार्च"
                  className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">प्रवेश शुल्क (Entry Fee)</label>
                <input
                  type="text"
                  value={hindiForm.entryFee}
                  onChange={(e) => setHindiForm({ ...hindiForm, entryFee: e.target.value })}
                  placeholder="उदा. निःशुल्क प्रवेश"
                  className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">खुलने का समय (Timings)</label>
                <input
                  type="text"
                  value={hindiForm.timing}
                  onChange={(e) => setHindiForm({ ...hindiForm, timing: e.target.value })}
                  placeholder="उदा. सूर्योदय से सूर्यास्त"
                  className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">निकटतम रेलवे स्टेशन</label>
                <input
                  type="text"
                  value={hindiForm.nearestRailway}
                  onChange={(e) => setHindiForm({ ...hindiForm, nearestRailway: e.target.value })}
                  placeholder="उदा. पाकुड़ जंक्शन (PKR)"
                  className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                प्रमुख आकर्षण (Highlights, कॉमा से अलग करें)
              </label>
              <input
                type="text"
                value={hindiForm.highlights}
                onChange={(e) => setHindiForm({ ...hindiForm, highlights: e.target.value })}
                placeholder="उदा. प्राकृतिक जलप्रपात, वन ट्रेक, पिकनिक स्थल"
                className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">सांस्कृतिक महत्व (Cultural Note)</label>
              <textarea
                rows={2}
                value={hindiForm.culturalNote}
                onChange={(e) => setHindiForm({ ...hindiForm, culturalNote: e.target.value })}
                placeholder="संथाली बाहा व सोहराय पर्व का पवित्र उत्सव स्थल..."
                className="w-full bg-[#0D1912] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-[#FF6B4A] focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Form Submission Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-emerald-500/15">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-[#FF6B4A] hover:bg-[#ff5530] text-[#0B130E] font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(255,107,74,0.35)] active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving Location & Translations...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>{mode === 'create' ? 'Create Location & Auto-Translate' : 'Save Changes'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SpotForm;
