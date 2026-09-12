export type SpotCategory = 'Waterfall' | 'Cave & Hill' | 'Thermal Spring' | 'Park & Heritage' | 'Local Market & Culture';

export type SupportedLocale = 'en' | 'hi';

export type TranslationStatus = 'pending' | 'translating' | 'translated' | 'failed' | 'outdated';

export interface TouristSpotTranslation {
  id?: string;
  spotId: string;
  language: SupportedLocale | string;
  title: string;
  description: string;
  longDescription?: string;
  culturalNote?: string;
  highlights?: string[];
  bestTimeToVisit?: string;
  distanceFromPakurStation?: string;
  entryFee?: string;
  timing?: string;
  nearestRailway?: string;
  seoTitle?: string;
  seoDescription?: string;
  translationStatus: TranslationStatus;
  sourceUpdatedAt?: string;
  translatedAt?: string;
}

export interface TouristSpot {
  id: string;
  title: string;
  slug: string;
  category: SpotCategory;
  description: string;
  longDescription?: string;
  latitude: number;
  longitude: number;
  coverImage: string;
  galleryImages?: string[];
  bestTimeToVisit: string;
  distanceFromPakurStation?: string;
  entryFee?: string;
  timing?: string;
  nearestRailway?: string;
  highlights?: string[];
  culturalNote?: string;
  createdAt?: string | Date;
  // Multilingual metadata
  translationStatus?: TranslationStatus;
  translations?: Record<string, TouristSpotTranslation>;
}

export interface VisitorReview {
  id: string;
  spotId: string;
  userName: string;
  rating: number;
  comment: string;
  visitDate?: string;
  userLocation?: string;
  createdAt: string | Date;
}

export interface QuickFilterOption {
  label: string;
  value: SpotCategory | 'All';
  icon?: string;
}
