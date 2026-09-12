import fs from 'fs';
import path from 'path';
import { TouristSpot, TouristSpotTranslation } from '@/types';
import { TOURIST_SPOTS } from './mockData';
import { getSupabaseAdmin } from './supabase';
import { translateSpotToHindi } from './translationService';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'spots.json');
const TRANSLATIONS_FILE = path.join(DATA_DIR, 'translations.json');

// Ensure directory and files exist
function initLocalDb(): TouristSpot[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(TOURIST_SPOTS, null, 2), 'utf-8');
      return [...TOURIST_SPOTS];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(TOURIST_SPOTS, null, 2), 'utf-8');
    return [...TOURIST_SPOTS];
  } catch (err) {
    console.error('Error in initLocalDb:', err);
    return [...TOURIST_SPOTS];
  }
}

export function getAllTranslationsFromDb(): Record<string, TouristSpotTranslation> {
  try {
    if (!fs.existsSync(TRANSLATIONS_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(TRANSLATIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveTranslationsToDb(translations: Record<string, TouristSpotTranslation>): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving local translations:', err);
    return false;
  }
}

export function getAllSpotsFromDb(locale: string = 'en'): TouristSpot[] {
  const spots = initLocalDb();
  if (locale === 'hi') {
    const translations = getAllTranslationsFromDb();
    return spots.map((spot) => mergeTranslationIntoSpot(spot, translations[spot.id]));
  }
  return spots;
}

export function getSpotBySlugFromDb(slug: string, locale: string = 'en'): TouristSpot | null {
  const spots = getAllSpotsFromDb(locale);
  return spots.find((s) => s.slug === slug) || null;
}

export function getSpotByIdFromDb(id: string, locale: string = 'en'): TouristSpot | null {
  const spots = getAllSpotsFromDb(locale);
  return spots.find((s) => s.id === id) || null;
}

export function saveSpotsToDb(spots: TouristSpot[]): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const jsonStr = JSON.stringify(spots, null, 2);
    try {
      const tempFile = DATA_FILE + '.tmp';
      fs.writeFileSync(tempFile, jsonStr, 'utf-8');
      fs.renameSync(tempFile, DATA_FILE);
    } catch {
      fs.writeFileSync(DATA_FILE, jsonStr, 'utf-8');
    }
    return true;
  } catch (err) {
    console.error('Failed to save spots to DB:', err);
    return false;
  }
}

function mergeTranslationIntoSpot(spot: TouristSpot, translation?: TouristSpotTranslation): TouristSpot {
  if (!translation) {
    return { ...spot, translationStatus: 'pending' };
  }

  return {
    ...spot,
    title: translation.title || spot.title,
    description: translation.description || spot.description,
    longDescription: translation.longDescription || spot.longDescription,
    culturalNote: translation.culturalNote || spot.culturalNote,
    highlights: Array.isArray(translation.highlights) && translation.highlights.length > 0
      ? translation.highlights
      : spot.highlights,
    bestTimeToVisit: translation.bestTimeToVisit || spot.bestTimeToVisit,
    entryFee: translation.entryFee || spot.entryFee,
    timing: translation.timing || spot.timing,
    distanceFromPakurStation: translation.distanceFromPakurStation || spot.distanceFromPakurStation,
    nearestRailway: translation.nearestRailway || spot.nearestRailway,
    translationStatus: translation.translationStatus || 'translated',
    translations: {
      [translation.language]: translation,
    },
  };
}

function mapSupabaseRowToSpot(row: any): TouristSpot {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    description: row.description,
    longDescription: row.long_description || row.description,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    coverImage: row.cover_image,
    galleryImages: row.gallery_images || [],
    bestTimeToVisit: row.best_time_to_visit || 'Oct to Mar',
    distanceFromPakurStation: row.distance_from_pakur_station || '',
    entryFee: row.entry_fee || 'Free Entry',
    timing: row.timing || 'Sunrise to Sunset',
    nearestRailway: row.nearest_railway || 'Pakur (PKR)',
    highlights: row.highlights || [],
    culturalNote: row.cultural_note || '',
    createdAt: row.created_at,
  };
}

export async function getSpotTranslationAsync(spotId: string, language: string = 'hi'): Promise<TouristSpotTranslation | null> {
  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('tourist_spot_translations')
        .select('*')
        .eq('spot_id', spotId)
        .eq('language', language)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          spotId: data.spot_id,
          language: data.language,
          title: data.title,
          description: data.description,
          longDescription: data.long_description,
          culturalNote: data.cultural_note,
          highlights: data.highlights,
          bestTimeToVisit: data.best_time_to_visit,
          distanceFromPakurStation: data.distance_from_pakur_station,
          entryFee: data.entry_fee,
          timing: data.timing,
          nearestRailway: data.nearest_railway,
          seoTitle: data.seo_title,
          seoDescription: data.seo_description,
          translationStatus: data.translation_status,
          sourceUpdatedAt: data.source_updated_at,
          translatedAt: data.translated_at,
        };
      }
    }
  } catch (err) {
    // Supabase table may not exist yet, silently fall back to local
  }

  const local = getAllTranslationsFromDb();
  return local[spotId] || null;
}

export async function saveSpotTranslationAsync(translation: TouristSpotTranslation): Promise<boolean> {
  // 1. Save to local fallback
  const local = getAllTranslationsFromDb();
  local[translation.spotId] = translation;
  saveTranslationsToDb(local);

  // 2. Try saving to Supabase
  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from('tourist_spot_translations').upsert(
        {
          spot_id: translation.spotId,
          language: translation.language,
          title: translation.title,
          description: translation.description,
          long_description: translation.longDescription,
          cultural_note: translation.culturalNote,
          highlights: translation.highlights,
          best_time_to_visit: translation.bestTimeToVisit,
          distance_from_pakur_station: translation.distanceFromPakurStation,
          entry_fee: translation.entryFee,
          timing: translation.timing,
          nearest_railway: translation.nearestRailway,
          seo_title: translation.seoTitle,
          seo_description: translation.seoDescription,
          translation_status: translation.translationStatus,
          source_updated_at: translation.sourceUpdatedAt,
          translated_at: translation.translatedAt || new Date().toISOString(),
        },
        { onConflict: 'spot_id, language' }
      );

      if (error) {
        console.warn('[Supabase Translation Upsert Notice]:', error.message);
      }
    }
  } catch (err) {
    console.warn('[Supabase Translation Save Warning]:', err);
  }

  return true;
}

export async function getAllSpotsAsync(locale: string = 'en'): Promise<TouristSpot[]> {
  let mappedSpots: TouristSpot[] = [];

  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('tourist_spots')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        mappedSpots = data.map(mapSupabaseRowToSpot);
        saveSpotsToDb(mappedSpots);
      }
    }
  } catch (err) {
    console.warn('[Supabase Sync] Fetching fallback from local DB:', err);
  }

  if (mappedSpots.length === 0) {
    mappedSpots = getAllSpotsFromDb();
  }

  if (locale === 'hi') {
    const localTranslations = getAllTranslationsFromDb();
    return mappedSpots.map((spot) => mergeTranslationIntoSpot(spot, localTranslations[spot.id]));
  }

  // Attach translation status for admin convenience
  const localTranslations = getAllTranslationsFromDb();
  return mappedSpots.map((spot) => ({
    ...spot,
    translationStatus: localTranslations[spot.id]?.translationStatus || 'pending',
    translations: localTranslations[spot.id] ? { hi: localTranslations[spot.id] } : undefined,
  }));
}

export async function getSpotBySlugAsync(slug: string, locale: string = 'en'): Promise<TouristSpot | null> {
  let spot: TouristSpot | null = null;

  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('tourist_spots')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        spot = mapSupabaseRowToSpot(data);
      }
    }
  } catch (err) {
    console.warn('[Supabase Slug Sync] Fallback to local DB:', err);
  }

  if (!spot) {
    spot = getSpotBySlugFromDb(slug);
  }

  if (!spot) return null;

  if (locale === 'hi') {
    const translation = await getSpotTranslationAsync(spot.id, 'hi');
    return mergeTranslationIntoSpot(spot, translation || undefined);
  }

  const translation = await getSpotTranslationAsync(spot.id, 'hi');
  return {
    ...spot,
    translationStatus: translation?.translationStatus || 'pending',
    translations: translation ? { hi: translation } : undefined,
  };
}

export async function getSpotByIdAsync(id: string, locale: string = 'en'): Promise<TouristSpot | null> {
  let spot: TouristSpot | null = null;

  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('tourist_spots')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        spot = mapSupabaseRowToSpot(data);
      }
    }
  } catch (err) {
    console.warn('[Supabase Id Sync] Fallback to local DB:', err);
  }

  if (!spot) {
    spot = getSpotByIdFromDb(id);
  }

  if (!spot) return null;

  const translation = await getSpotTranslationAsync(spot.id, 'hi');
  if (locale === 'hi') {
    return mergeTranslationIntoSpot(spot, translation || undefined);
  }

  return {
    ...spot,
    translationStatus: translation?.translationStatus || 'pending',
    translations: translation ? { hi: translation } : undefined,
  };
}

export async function createSpotInDb(data: Partial<TouristSpot> & { hindiTranslation?: Partial<TouristSpotTranslation> }): Promise<TouristSpot> {
  const spots = getAllSpotsFromDb();
  const id = crypto.randomUUID();
  const lat = typeof data.latitude === 'string' ? parseFloat(data.latitude) : Number(data.latitude);
  const lng = typeof data.longitude === 'string' ? parseFloat(data.longitude) : Number(data.longitude);

  const newSpot: TouristSpot = {
    id,
    title: data.title || '',
    slug: data.slug || '',
    category: data.category || 'Waterfall',
    description: data.description || '',
    longDescription: data.longDescription || '',
    latitude: !isNaN(lat) ? lat : 24.63,
    longitude: !isNaN(lng) ? lng : 87.84,
    coverImage: data.coverImage || '',
    galleryImages: data.galleryImages || [],
    bestTimeToVisit: data.bestTimeToVisit || 'Oct to Mar',
    distanceFromPakurStation: data.distanceFromPakurStation || '',
    entryFee: data.entryFee || 'Free Entry',
    timing: data.timing || 'All day',
    nearestRailway: data.nearestRailway || 'Pakur (PKR)',
    highlights: data.highlights || [],
    culturalNote: data.culturalNote || '',
    createdAt: new Date().toISOString(),
  };

  const updated = [newSpot, ...spots];
  saveSpotsToDb(updated);

  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from('tourist_spots').insert({
        id: newSpot.id,
        title: newSpot.title,
        slug: newSpot.slug,
        category: newSpot.category,
        description: newSpot.description,
        long_description: newSpot.longDescription,
        latitude: newSpot.latitude,
        longitude: newSpot.longitude,
        cover_image: newSpot.coverImage,
        gallery_images: newSpot.galleryImages,
        best_time_to_visit: newSpot.bestTimeToVisit,
        distance_from_pakur_station: newSpot.distanceFromPakurStation,
        entry_fee: newSpot.entryFee,
        timing: newSpot.timing,
        nearest_railway: newSpot.nearestRailway,
        highlights: newSpot.highlights,
        cultural_note: newSpot.culturalNote,
      });
      if (error) {
        console.error('[Supabase Insert Error]', error.message);
      }
    }
  } catch (err) {
    console.warn('[Supabase Sync] Insert sync failed, local copy active:', err);
  }

  // Handle Hindi translation: if provided by admin, use it; otherwise auto-translate
  try {
    if (data.hindiTranslation && data.hindiTranslation.title) {
      const manualTrans: TouristSpotTranslation = {
        spotId: newSpot.id,
        language: 'hi',
        title: data.hindiTranslation.title,
        description: data.hindiTranslation.description || newSpot.description,
        longDescription: data.hindiTranslation.longDescription || newSpot.longDescription,
        culturalNote: data.hindiTranslation.culturalNote || newSpot.culturalNote,
        highlights: data.hindiTranslation.highlights || newSpot.highlights,
        bestTimeToVisit: data.hindiTranslation.bestTimeToVisit || newSpot.bestTimeToVisit,
        entryFee: data.hindiTranslation.entryFee || newSpot.entryFee,
        timing: data.hindiTranslation.timing || newSpot.timing,
        distanceFromPakurStation: data.hindiTranslation.distanceFromPakurStation || newSpot.distanceFromPakurStation,
        nearestRailway: data.hindiTranslation.nearestRailway || newSpot.nearestRailway,
        translationStatus: 'translated',
        sourceUpdatedAt: new Date().toISOString(),
        translatedAt: new Date().toISOString(),
      };
      await saveSpotTranslationAsync(manualTrans);
    } else {
      // Auto-translate in background
      translateSpotToHindi(newSpot).then((trans) => {
        saveSpotTranslationAsync(trans);
      }).catch((e) => console.warn('[Auto-translate failed]:', e));
    }
  } catch (err) {
    console.warn('[Auto-translate trigger warning]:', err);
  }

  return newSpot;
}

export async function updateSpotInDb(
  id: string,
  data: Partial<TouristSpot> & { hindiTranslation?: Partial<TouristSpotTranslation> }
): Promise<TouristSpot | null> {
  let spots = getAllSpotsFromDb();
  let index = spots.findIndex((s) => s.id === id);

  let existing = index !== -1 ? spots[index] : null;
  if (!existing) {
    const supabaseSpot = await getSpotByIdAsync(id);
    if (supabaseSpot) {
      spots = getAllSpotsFromDb();
      index = spots.findIndex((s) => s.id === id);
      existing = index !== -1 ? spots[index] : supabaseSpot;
    }
  }

  if (!existing) return null;

  const parsedLat = data.latitude !== undefined
    ? (typeof data.latitude === 'string' ? parseFloat(data.latitude) : Number(data.latitude))
    : existing.latitude;
  const parsedLng = data.longitude !== undefined
    ? (typeof data.longitude === 'string' ? parseFloat(data.longitude) : Number(data.longitude))
    : existing.longitude;

  const updatedSpot: TouristSpot = {
    ...existing,
    ...data,
    id,
    latitude: !isNaN(parsedLat) ? parsedLat : existing.latitude,
    longitude: !isNaN(parsedLng) ? parsedLng : existing.longitude,
  };

  if (index !== -1) {
    spots[index] = updatedSpot;
  } else {
    spots.unshift(updatedSpot);
  }
  saveSpotsToDb(spots);

  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from('tourist_spots').update({
        title: updatedSpot.title,
        slug: updatedSpot.slug,
        category: updatedSpot.category,
        description: updatedSpot.description,
        long_description: updatedSpot.longDescription,
        latitude: updatedSpot.latitude,
        longitude: updatedSpot.longitude,
        cover_image: updatedSpot.coverImage,
        gallery_images: updatedSpot.galleryImages,
        best_time_to_visit: updatedSpot.bestTimeToVisit,
        distance_from_pakur_station: updatedSpot.distanceFromPakurStation,
        entry_fee: updatedSpot.entryFee,
        timing: updatedSpot.timing,
        nearest_railway: updatedSpot.nearestRailway,
        highlights: updatedSpot.highlights,
        cultural_note: updatedSpot.culturalNote,
      }).eq('id', id);
      if (error) {
        console.error('[Supabase Update Error]', error.message);
      }
    }
  } catch (err) {
    console.warn('[Supabase Sync] Update sync failed:', err);
  }

  // Handle Hindi translation on update
  try {
    if (data.hindiTranslation && data.hindiTranslation.title) {
      const manualTrans: TouristSpotTranslation = {
        spotId: id,
        language: 'hi',
        title: data.hindiTranslation.title,
        description: data.hindiTranslation.description || updatedSpot.description,
        longDescription: data.hindiTranslation.longDescription || updatedSpot.longDescription,
        culturalNote: data.hindiTranslation.culturalNote || updatedSpot.culturalNote,
        highlights: data.hindiTranslation.highlights || updatedSpot.highlights,
        bestTimeToVisit: data.hindiTranslation.bestTimeToVisit || updatedSpot.bestTimeToVisit,
        entryFee: data.hindiTranslation.entryFee || updatedSpot.entryFee,
        timing: data.hindiTranslation.timing || updatedSpot.timing,
        distanceFromPakurStation: data.hindiTranslation.distanceFromPakurStation || updatedSpot.distanceFromPakurStation,
        nearestRailway: data.hindiTranslation.nearestRailway || updatedSpot.nearestRailway,
        translationStatus: 'translated',
        sourceUpdatedAt: new Date().toISOString(),
        translatedAt: new Date().toISOString(),
      };
      await saveSpotTranslationAsync(manualTrans);
    } else {
      // Check if English content changed significantly
      const englishChanged =
        existing.title !== updatedSpot.title ||
        existing.description !== updatedSpot.description ||
        existing.culturalNote !== updatedSpot.culturalNote;

      if (englishChanged) {
        // Auto-translate to update Hindi
        translateSpotToHindi(updatedSpot).then((trans) => {
          saveSpotTranslationAsync(trans);
        }).catch((e) => console.warn('[Auto-translate update failed]:', e));
      }
    }
  } catch (err) {
    console.warn('[Auto-translate update error]:', err);
  }

  return updatedSpot;
}

export async function deleteSpotInDb(id: string): Promise<TouristSpot | null> {
  let deleted: TouristSpot | null = null;
  const spots = getAllSpotsFromDb();
  const index = spots.findIndex((s) => s.id === id);
  if (index !== -1) {
    deleted = spots.splice(index, 1)[0];
    saveSpotsToDb(spots);
  }

  // Remove local translation
  const local = getAllTranslationsFromDb();
  if (local[id]) {
    delete local[id];
    saveTranslationsToDb(local);
  }

  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      if (!deleted) {
        const { data: supaRow } = await supabase
          .from('tourist_spots')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (supaRow) {
          deleted = mapSupabaseRowToSpot(supaRow);
        }
      }
      await supabase.from('tourist_spot_translations').delete().eq('spot_id', id);
      const { error } = await supabase.from('tourist_spots').delete().eq('id', id);
      if (error) {
        console.error('[Supabase Delete Error]', error.message);
      }
    }
  } catch (err) {
    console.warn('[Supabase Sync] Delete sync failed:', err);
  }

  return deleted;
}
