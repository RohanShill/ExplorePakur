import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Builds a direct WhatsApp click-to-chat URL with pre-filled message
 */
export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Formats GPS coordinates to standard decimal string
 */
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
}

/**
 * Generates direct OpenStreetMap navigation link
 */
export function getOsmDirectionsUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${lat}%2C${lng}#map=14/${lat}/${lng}`;
}

/**
 * Generates direct Google Maps driving navigation intent URL
 * On mobile devices (Android/iOS), this triggers the native Google Maps app directly!
 */
export function getGoogleMapsDirectionsUrl(lat: number, lng: number, title?: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

/**
 * Standard Google Maps search pin fallback
 */
export function getGpsNavigationUrl(lat: number, lng: number, title?: string): string {
  return getGoogleMapsDirectionsUrl(lat, lng, title);
}

/**
 * Haversine formula to compute straight-line GPS distance between two coordinates in kilometers
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}
