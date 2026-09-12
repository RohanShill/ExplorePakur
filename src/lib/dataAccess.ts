import { TouristSpot, VisitorReview } from '@/types';
import { VISITOR_REVIEWS } from './mockData';
import { getAllSpotsAsync, getSpotBySlugAsync, getAllSpotsFromDb, getSpotBySlugFromDb } from './spotsDb';

/**
 * Multilingual data access layer backed by Supabase Cloud PostgreSQL with local offline fallback.
 * Automatically serves translated Hindi fields when locale is 'hi'.
 */

export async function getAllSpots(locale: string = 'en'): Promise<TouristSpot[]> {
  try {
    return await getAllSpotsAsync(locale);
  } catch (err) {
    console.error('Failed to get spots from Supabase, using local DB:', err);
    return getAllSpotsFromDb(locale);
  }
}

export async function getSpotBySlug(slug: string, locale: string = 'en'): Promise<TouristSpot | null> {
  try {
    return await getSpotBySlugAsync(slug, locale);
  } catch (err) {
    console.error('Failed to get spot with slug: ' + slug, err);
    return getSpotBySlugFromDb(slug, locale);
  }
}

export async function getReviewsForSpot(spotId: string): Promise<VisitorReview[]> {
  return VISITOR_REVIEWS.filter((r) => r.spotId === spotId);
}
