import { TouristSpot, TouristSpotTranslation, TranslationStatus } from '@/types';
import fs from 'fs';
import path from 'path';

/**
 * Backend-only Gemini Translation Service (Google AI Studio).
 * - Translates dynamic destination content (title, descriptions, cultural note, highlights).
 * - Uses Gemini Flash Lite for fast, free-tier cost-effective tourism translations.
 * - NEVER calls Gemini API on visitor GET requests.
 * - Stores translations in Supabase and local DB fallback.
 * - Provides graceful fallback and error recovery if Gemini credentials are not yet set or fail.
 */

// Model preference cascade: prefer gemini-3.1-flash-lite, fallback to closest supported Flash Lite
const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
].filter(Boolean) as string[];

const SYSTEM_TRANSLATION_PROMPT = `Translate the provided English content into natural, clear Indian Hindi suitable for a tourism and information website.

Preserve the exact meaning and intent of the original content.

Do not add information.
Do not remove information.
Do not summarize.
Do not explain the translation.

Preserve:
- Names
- Place names
- Organization names
- Brand names
- Numbers
- Dates
- Units
- URLs
- Email addresses
- Phone numbers
- Important formatting

If HTML is present, do not translate HTML tags or attributes. Translate only the visible text.

Return ONLY the translated content.`;

function cleanGeminiOutput(raw: string): string {
  if (!raw) return '';
  let text = raw.trim();

  // Strip markdown code block wrappers if model wrapped response in ```
  text = text.replace(/^```(?:markdown|text|json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // Strip common conversational intros
  text = text.replace(/^(?:Here is the (?:Hindi )?translation[:\s]+|Translation[:\s]+|हिंदी अनुवाद[:\s]+)/i, '').trim();

  return text;
}

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
 * Call Gemini API with model fallback cascade.
 * Tries the preferred model first; if not supported or 404, cascades to the next Flash Lite model.
 */
async function callGeminiApi(
  apiKey: string,
  prompt: string,
  systemInstruction: string = SYSTEM_TRANSLATION_PROMPT
): Promise<{ text: string; success: boolean; modelUsed?: string; error?: string }> {
  let lastError = '';

  for (const model of CANDIDATE_MODELS) {
    try {
      // 1. Try via official @google/genai SDK
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        });

        const outputText = response.text;
        if (outputText && outputText.trim()) {
          console.log(`[Gemini Translation] Successfully generated using model: ${model}`);
          return {
            text: cleanGeminiOutput(outputText),
            success: true,
            modelUsed: model,
          };
        }
      } catch (sdkErr: any) {
        // Fall back to direct REST API if SDK method encounters model resolution variation
        lastError = sdkErr.message || String(sdkErr);
      }

      // 2. Direct Google AI Studio REST API call
      const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const restResponse = await fetch(restUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            temperature: 0.2,
          },
        }),
      });

      if (restResponse.ok) {
        const data = await restResponse.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && candidateText.trim()) {
          return {
            text: cleanGeminiOutput(candidateText),
            success: true,
            modelUsed: model,
          };
        }
      } else {
        const errJson = await restResponse.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${restResponse.status}`;
        lastError = `[${model}] ${errMsg}`;

        // If model not found (404), continue loop to try next model in cascade
        if (restResponse.status === 404 || errMsg.toLowerCase().includes('not found') || errMsg.toLowerCase().includes('not supported')) {
          console.warn(`[Gemini Translation] Model '${model}' not available, trying next candidate in cascade...`);
          continue;
        }
      }
    } catch (err: any) {
      lastError = err.message || String(err);
    }
  }

  return {
    text: '',
    success: false,
    error: lastError || 'All candidate Gemini models failed to generate content.',
  };
}

/**
 * Translate a single English text string to Hindi using Gemini API.
 */
export async function translateToHindi(
  text: string
): Promise<{ text: string; success: boolean; modelUsed?: string; error?: string }> {
  if (!text || text.trim() === '') {
    return { text: '', success: true };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      text: text,
      success: false,
      error: 'GEMINI_API_KEY not configured in environment variables.',
    };
  }

  const result = await callGeminiApi(apiKey, text);
  return result;
}

/**
 * Backward-compatibility alias for single text translation.
 */
export async function translateText(
  text: string,
  targetLang: string = 'hi',
  sourceLang: string = 'en'
): Promise<{ text: string; success: boolean; error?: string }> {
  if (targetLang === 'hi') {
    return translateToHindi(text);
  }
  return { text, success: false, error: 'Only Hindi translation supported by this endpoint.' };
}

/**
 * Automatically translate all dynamic fields of a TouristSpot into Hindi using Gemini.
 * Uses a single structured JSON request to translate all fields in 1 API call for maximum
 * contextual consistency and cost efficiency.
 */
export async function translateSpotToHindi(
  spot: TouristSpot
): Promise<TouristSpotTranslation> {
  const curated = getCuratedTranslations();
  const existingCurated = curated[spot.id];
  const apiKey = process.env.GEMINI_API_KEY;

  // If no Gemini API key is configured yet, use local curated dictionary for offline testing
  if (!apiKey) {
    if (existingCurated) {
      return {
        ...existingCurated,
        spotId: spot.id,
        language: 'hi',
        sourceUpdatedAt: typeof spot.createdAt === 'string' ? spot.createdAt : new Date().toISOString(),
        translatedAt: new Date().toISOString(),
        translationStatus: 'translated',
      };
    }

    return {
      spotId: spot.id,
      language: 'hi',
      title: spot.title,
      description: spot.description,
      longDescription: spot.longDescription || '',
      culturalNote: spot.culturalNote || '',
      highlights: spot.highlights || [],
      bestTimeToVisit: spot.bestTimeToVisit || '',
      distanceFromPakurStation: spot.distanceFromPakurStation || '',
      entryFee: spot.entryFee || '',
      timing: spot.timing || '',
      nearestRailway: spot.nearestRailway || '',
      translationStatus: 'pending',
      sourceUpdatedAt: new Date().toISOString(),
      translatedAt: new Date().toISOString(),
    };
  }

  // Prepare structured payload for 1-shot complete destination translation
  const sourcePayload = {
    title: spot.title,
    description: spot.description,
    longDescription: spot.longDescription || '',
    culturalNote: spot.culturalNote || '',
    highlights: Array.isArray(spot.highlights) ? spot.highlights : [],
    bestTimeToVisit: spot.bestTimeToVisit || '',
    entryFee: spot.entryFee || '',
    timing: spot.timing || '',
    distanceFromPakurStation: spot.distanceFromPakurStation || '',
    nearestRailway: spot.nearestRailway || '',
  };

  const structuredPrompt = `Translate the string values of the following JSON object from English into natural, clear Indian Hindi suitable for a travel and tourism website.
Follow all translation rules: preserve place names, historic names (e.g. Martello Tower, Lilatari, Singhashi, Santhal, Pakur), dates, numbers, and formatting.
Do not alter the JSON keys.
Return ONLY the raw, valid JSON object with the exact same keys and translated values:

${JSON.stringify(sourcePayload, null, 2)}`;

  const geminiResult = await callGeminiApi(
    apiKey,
    structuredPrompt,
    SYSTEM_TRANSLATION_PROMPT + ' Return strictly valid JSON with no conversational prefix or markdown formatting.'
  );

  if (geminiResult.success && geminiResult.text) {
    try {
      let jsonStr = geminiResult.text.trim();
      // Remove any json code block markdown wrapper if present
      jsonStr = jsonStr.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(jsonStr);

      return {
        spotId: spot.id,
        language: 'hi',
        title: parsed.title || spot.title,
        description: parsed.description || spot.description,
        longDescription: parsed.longDescription || spot.longDescription || '',
        culturalNote: parsed.culturalNote || spot.culturalNote || '',
        highlights: Array.isArray(parsed.highlights) ? parsed.highlights : (spot.highlights || []),
        bestTimeToVisit: parsed.bestTimeToVisit || spot.bestTimeToVisit || 'अक्टूबर से मार्च',
        entryFee: parsed.entryFee || spot.entryFee || 'निःशुल्क सार्वजनिक प्रवेश',
        timing: parsed.timing || spot.timing || 'सूर्योदय से सूर्यास्त',
        distanceFromPakurStation: parsed.distanceFromPakurStation || spot.distanceFromPakurStation || '',
        nearestRailway: parsed.nearestRailway || spot.nearestRailway || 'पाकुड़ जंक्शन (PKR)',
        seoTitle: `${parsed.title || spot.title} पाकुड़ | पर्यटन स्थल, झारखंड`,
        seoDescription: parsed.description || spot.description,
        translationStatus: 'translated',
        sourceUpdatedAt: new Date().toISOString(),
        translatedAt: new Date().toISOString(),
      };
    } catch (parseErr) {
      console.warn('[Gemini Translation] JSON parsing failed, falling back to field translation:', parseErr);
    }
  }

  // Fallback field-by-field translation if structured JSON parse encountered an issue
  try {
    const [titleRes, descRes, cultRes] = await Promise.all([
      translateToHindi(spot.title),
      translateToHindi(spot.description),
      spot.culturalNote ? translateToHindi(spot.culturalNote) : Promise.resolve({ text: '', success: true }),
    ]);

    const isSuccessful = titleRes.success && descRes.success;

    if (!isSuccessful && existingCurated) {
      // PRESERVE previous valid translation on failure (Section 12)
      return {
        ...existingCurated,
        spotId: spot.id,
        language: 'hi',
        translationStatus: 'failed',
        translatedAt: existingCurated.translatedAt || new Date().toISOString(),
      };
    }

    return {
      spotId: spot.id,
      language: 'hi',
      title: titleRes.text || existingCurated?.title || spot.title,
      description: descRes.text || existingCurated?.description || spot.description,
      longDescription: spot.longDescription ? (await translateToHindi(spot.longDescription)).text : (existingCurated?.longDescription || ''),
      culturalNote: cultRes.text || existingCurated?.culturalNote || spot.culturalNote || '',
      highlights: existingCurated?.highlights || spot.highlights || [],
      bestTimeToVisit: existingCurated?.bestTimeToVisit || spot.bestTimeToVisit || 'अक्टूबर से मार्च',
      entryFee: existingCurated?.entryFee || spot.entryFee || 'निःशुल्क सार्वजनिक प्रवेश',
      timing: existingCurated?.timing || spot.timing || 'सूर्योदय से सूर्यास्त',
      distanceFromPakurStation: existingCurated?.distanceFromPakurStation || spot.distanceFromPakurStation || '',
      nearestRailway: existingCurated?.nearestRailway || spot.nearestRailway || 'पाकुड़ जंक्शन (PKR)',
      seoTitle: `${titleRes.text || spot.title} पाकुड़ | पर्यटन स्थल, झारखंड`,
      seoDescription: descRes.text || spot.description,
      translationStatus: isSuccessful ? 'translated' : 'failed',
      sourceUpdatedAt: new Date().toISOString(),
      translatedAt: new Date().toISOString(),
    };
  } catch (fieldErr) {
    console.error('[Gemini Translation Failure]:', fieldErr);

    if (existingCurated) {
      return {
        ...existingCurated,
        spotId: spot.id,
        language: 'hi',
        translationStatus: 'failed',
      };
    }

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
