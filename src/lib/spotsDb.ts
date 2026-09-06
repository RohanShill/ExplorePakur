import fs from 'fs';
import path from 'path';
import { TouristSpot } from '@/types';
import { TOURIST_SPOTS } from './mockData';
import { getSupabaseAdmin } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'spots.json');

// Ensure directory and file exist
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

export function getAllSpotsFromDb(): TouristSpot[] {
  return initLocalDb();
}

export function getSpotBySlugFromDb(slug: string): TouristSpot | null {
  const spots = getAllSpotsFromDb();
  return spots.find((s) => s.slug === slug) || null;
}

export function getSpotByIdFromDb(id: string): TouristSpot | null {
  const spots = getAllSpotsFromDb();
  return spots.find((s) => s.id === id) || null;
}

export function saveSpotsToDb(spots: TouristSpot[]): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = DATA_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(spots, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
    return true;
  } catch (err) {
    console.error('Failed to save spots to DB:', err);
    return false;
  }
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

export async function getAllSpotsAsync(): Promise<TouristSpot[]> {
  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('tourist_spots')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapSupabaseRowToSpot);
        saveSpotsToDb(mapped);
        return mapped;
      }
    }
  } catch (err) {
    console.warn('[Supabase Sync] Fetching fallback from local DB:', err);
  }
  return getAllSpotsFromDb();
}

export async function getSpotBySlugAsync(slug: string): Promise<TouristSpot | null> {
  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('tourist_spots')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return mapSupabaseRowToSpot(data);
      }
    }
  } catch (err) {
    console.warn('[Supabase Slug Sync] Fallback to local DB:', err);
  }
  return getSpotBySlugFromDb(slug);
}

export async function createSpotInDb(data: Partial<TouristSpot>): Promise<TouristSpot> {
  const spots = getAllSpotsFromDb();
  const id = crypto.randomUUID();
  const newSpot: TouristSpot = {
    id,
    title: data.title || '',
    slug: data.slug || '',
    category: data.category || 'Waterfall',
    description: data.description || '',
    longDescription: data.longDescription || '',
    latitude: typeof data.latitude === 'string' ? parseFloat(data.latitude) : (data.latitude || 24.63),
    longitude: typeof data.longitude === 'string' ? parseFloat(data.longitude) : (data.longitude || 87.84),
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

  return newSpot;
}

export async function updateSpotInDb(id: string, data: Partial<TouristSpot>): Promise<TouristSpot | null> {
  const spots = getAllSpotsFromDb();
  const index = spots.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const existing = spots[index];
  const updatedSpot: TouristSpot = {
    ...existing,
    ...data,
    id,
    latitude: data.latitude !== undefined
      ? (typeof data.latitude === 'string' ? parseFloat(data.latitude) : data.latitude)
      : existing.latitude,
    longitude: data.longitude !== undefined
      ? (typeof data.longitude === 'string' ? parseFloat(data.longitude) : data.longitude)
      : existing.longitude,
  };

  spots[index] = updatedSpot;
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

  return updatedSpot;
}

export async function deleteSpotInDb(id: string): Promise<TouristSpot | null> {
  const spots = getAllSpotsFromDb();
  const index = spots.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const deleted = spots.splice(index, 1)[0];
  saveSpotsToDb(spots);

  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
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
