export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { verifyAdminAuth } from '@/lib/adminAuth';
import { NextRequest, NextResponse } from 'next/server';
import { getAllSpotsAsync, saveSpotTranslationAsync, getAllTranslationsFromDb } from '@/lib/spotsDb';
import { translateSpotToHindi } from '@/lib/translationService';

export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const spots = await getAllSpotsAsync('en');
    const existingTranslations = getAllTranslationsFromDb();

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (const spot of spots) {
      const existing = existingTranslations[spot.id];
      // If already translated and not failed, keep unless forced
      if (existing && existing.translationStatus === 'translated' && existing.title) {
        skipped++;
        continue;
      }

      try {
        const translation = await translateSpotToHindi(spot);
        await saveSpotTranslationAsync(translation);
        if (translation.translationStatus === 'failed') {
          failed++;
        } else {
          updated++;
        }
      } catch (e) {
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      total: spots.length,
      updated,
      skipped,
      failed,
      message: `Batch translation complete: ${updated} translated, ${skipped} already current, ${failed} failed.`,
    });
  } catch (err: any) {
    console.error('Error during batch translation:', err);
    return NextResponse.json({ error: err.message || 'Batch translation failed' }, { status: 500 });
  }
}
