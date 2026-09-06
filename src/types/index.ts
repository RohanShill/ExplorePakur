export type SpotCategory = 'Waterfall' | 'Cave & Hill' | 'Thermal Spring' | 'Park & Heritage';

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
