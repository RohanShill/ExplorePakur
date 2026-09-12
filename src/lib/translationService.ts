import { TouristSpot, TouristSpotTranslation, TranslationStatus } from '@/types';
import fs from 'fs';
import path from 'path';

/**
 * Backend-only Google Cloud Translation Service.
 * - Translates destination content (title, descriptions, cultural note, highlights).
 * - Never calls Google Cloud API on visitor GET requests.
 * - Stores translations in Supabase and local DB fallback.
 * - Provides graceful fallback and error recovery if Google credentials are not yet set.
 */

// In-memory / file curated translations fallback for development & offline resilience
function getCuratedTranslations(): Record<string, TouristSpotTranslation> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'translations.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.warn('[Translation Service] Failed to read local translations file:', err);
  }
  return {};
}

/**
 * Translate a single text string using Google Cloud Translation API.
 * Supports GOOGLE_TRANSLATE_API_KEY or GOOGLE_APPLICATION_CREDENTIALS.
 */
export async function translateText(
  text: string,
  targetLang: string = 'hi',
  sourceLang: string = 'en'
): Promise<{ text: string; success: boolean; error?: string }> {
  if (!text || text.trim() === '') {
    return { text: '', success: true };
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

  // 1. Try Google Cloud Translation REST API via API Key
  if (apiKey) {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: 'text',
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const translated = data?.data?.translations?.[0]?.translatedText;
        if (translated) {
          return { text: translated, success: true };
        }
      } else {
        const errData = await response.text();
        console.warn('[Google Cloud API Error]', response.status, errData);
      }
    } catch (err: any) {
      console.warn('[Google Cloud API Network Error]:', err.message);
    }
  }

  // 2. Try Google Cloud SDK via Service Account Credentials
  if (credentialsPath || projectId) {
    try {
      const { v2 } = await import('@google-cloud/translate');
      const translateClient = new v2.Translate({
        projectId: projectId,
        keyFilename: credentialsPath,
      });

      const [translation] = await translateClient.translate(text, {
        from: sourceLang,
        to: targetLang,
      });

      if (translation) {
        return { text: translation, success: true };
      }
    } catch (err: any) {
      console.warn('[Google Cloud SDK Error]:', err.message);
    }
  }

  // 3. Fallback when credentials are not configured or request fails
  return {
    text: text, // Return source as fallback
    success: false,
    error: 'Google Cloud Translation credentials not configured or API call failed.',
  };
}

/**
 * Automatically translate all dynamic fields of a TouristSpot into Hindi.
 */
export async function translateSpotToHindi(
  spot: TouristSpot
): Promise<TouristSpotTranslation> {
  const curated = getCuratedTranslations();
  const existingCurated = curated[spot.id];

  // If Google credentials are not set and we have a curated translation, use it!
  const hasGoogleCreds = Boolean(
    process.env.GOOGLE_TRANSLATE_API_KEY ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.GOOGLE_CLOUD_PROJECT_ID
  );

  let status: TranslationStatus = 'translated';

  if (!hasGoogleCreds && existingCurated) {
    return {
      ...existingCurated,
      spotId: spot.id,
      language: 'hi',
      sourceUpdatedAt: typeof spot.createdAt === 'string' ? spot.createdAt : new Date().toISOString(),
      translatedAt: new Date().toISOString(),
      translationStatus: 'translated',
    };
  }

  try {
    const [titleRes, descRes, longDescRes, cultRes] = await Promise.all([
      translateText(spot.title, 'hi', 'en'),
      translateText(spot.description, 'hi', 'en'),
      spot.longDescription ? translateText(spot.longDescription, 'hi', 'en') : Promise.resolve({ text: '', success: true }),
      spot.culturalNote ? translateText(spot.culturalNote, 'hi', 'en') : Promise.resolve({ text: '', success: true }),
    ]);

    // Translate highlights array
    let translatedHighlights: string[] = [];
    if (Array.isArray(spot.highlights) && spot.highlights.length > 0) {
      const highlightResults = await Promise.all(
        spot.highlights.map((h) => translateText(h, 'hi', 'en'))
      );
      translatedHighlights = highlightResults.map((r, i) => (r.success ? r.text : spot.highlights![i]));
    }

    const anyFailed = !titleRes.success || !descRes.success;
    if (anyFailed && existingCurated) {
      // Fallback to curated if Google API failed
      return {
        ...existingCurated,
        spotId: spot.id,
        language: 'hi',
        translationStatus: 'outdated',
        translatedAt: new Date().toISOString(),
      };
    }

    if (anyFailed) {
      status = 'failed';
    }

    return {
      spotId: spot.id,
      language: 'hi',
      title: titleRes.text || existingCurated?.title || spot.title,
      description: descRes.text || existingCurated?.description || spot.description,
      longDescription: longDescRes.text || existingCurated?.longDescription || spot.longDescription || '',
      culturalNote: cultRes.text || existingCurated?.culturalNote || spot.culturalNote || '',
      highlights: translatedHighlights.length > 0 ? translatedHighlights : (existingCurated?.highlights || spot.highlights || []),
      bestTimeToVisit: existingCurated?.bestTimeToVisit || 'अक्टूबर से मार्च',
      entryFee: existingCurated?.entryFee || 'निःशुल्क सार्वजनिक प्रवेश',
      timing: existingCurated?.timing || spot.timing || 'सूर्योदय से सूर्यास्त तक',
      distanceFromPakurStation: existingCurated?.distanceFromPakurStation || spot.distanceFromPakurStation || '',
      nearestRailway: existingCurated?.nearestRailway || 'पाकुड़ रेलवे स्टेशन (PKR)',
      seoTitle: `${titleRes.text || spot.title} पाकुड़ | पर्यटन स्थल, झारखंड`,
      seoDescription: descRes.text || spot.description,
      translationStatus: status,
      sourceUpdatedAt: new Date().toISOString(),
      translatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[Translation Service Exception]:', err);
    if (existingCurated) return existingCurated;

    return {
      spotId: spot.id,
      language: 'hi',
      title: spot.title,
      description: spot.description,
      longDescription: spot.longDescription || '',
      culturalNote: spot.culturalNote || '',
      highlights: spot.highlights || [],
      translationStatus: 'failed',
      sourceUpdatedAt: new Date().toISOString(),
      translatedAt: new Date().toISOString(),
    };
  }
}
