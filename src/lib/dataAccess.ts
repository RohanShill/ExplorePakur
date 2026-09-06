import { TouristSpot, VisitorReview } from '@/types';
import { VISITOR_REVIEWS } from './mockData';
import { getAllSpotsAsync, getSpotBySlugAsync, getAllSpotsFromDb, getSpotBySlugFromDb } from './spotsDb';

/**
 * Data access layer backed by Supabase Cloud PostgreSQL with local offline fallback.
 * Changes made in the Admin panel reflect instantly across all pages.
 */

export async function getAllSpots(): Promise<TouristSpot[]> {
  try {
    return await getAllSpotsAsync();
  } catch (err) {
    console.error('Failed to get spots from Supabase, using local DB:', err);
    return getAllSpotsFromDb();
  }
}

export async function getSpotBySlug(slug: string): Promise<TouristSpot | null> {
  try {
    return await getSpotBySlugAsync(slug);
  } catch (err) {
    console.error('Failed to get spot with slug: ' + slug, err);
    return getSpotBySlugFromDb(slug);
  }
}

export async function getReviewsForSpot(spotId: string): Promise<VisitorReview[]> {
  return VISITOR_REVIEWS.filter((r) => r.spotId === spotId);
}
