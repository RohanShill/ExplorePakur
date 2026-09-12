export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { verifyAdminAuth } from '@/lib/adminAuth';
import { NextRequest, NextResponse } from 'next/server';
import { getSpotByIdAsync, saveSpotTranslationAsync } from '@/lib/spotsDb';
import { translateSpotToHindi } from '@/lib/translationService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const spot = await getSpotByIdAsync(params.id, 'en');
    if (!spot) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const translation = await translateSpotToHindi(spot);
    await saveSpotTranslationAsync(translation);

    return NextResponse.json({
      success: true,
      translation,
      message: 'Hindi translation generated and saved successfully!',
    });
  } catch (err: any) {
    console.error('Error regenerating translation:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate translation' }, { status: 500 });
  }
}
