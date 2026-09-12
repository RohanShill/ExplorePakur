export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { verifyAdminAuth } from '@/lib/adminAuth';
import { NextRequest, NextResponse } from 'next/server';
import { getAllSpotsAsync, getSpotBySlugAsync, createSpotInDb } from '@/lib/spotsDb';

function verifyAuth(request: NextRequest): boolean {
  return verifyAdminAuth(request);
}

// GET /api/admin/spots - Public read access for frontend & admin dashboard (supports ?lang=en|hi)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const lang = searchParams.get('lang') || 'en';

  if (slug) {
    const spot = await getSpotBySlugAsync(slug, lang);
    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }
    return NextResponse.json(
      { spot },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  }

  const spots = await getAllSpotsAsync(lang);
  return NextResponse.json(
    { spots },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    }
  );
}

// POST /api/admin/spots - Create a new spot with persistent Supabase cloud & local storage
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    const { title, slug, category, description, latitude, longitude, coverImage } = body;
    if (!title || !slug || !category || !description || latitude === undefined || longitude === undefined || !coverImage) {
      return NextResponse.json(
        { error: 'Missing required fields: Title, Slug, Category, Description, Latitude, Longitude, Cover Image' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await getSpotBySlugAsync(slug);
    if (existing) {
      return NextResponse.json({ error: 'A location with this slug already exists' }, { status: 409 });
    }

    const newSpot = await createSpotInDb(body);

    return NextResponse.json(
      { spot: newSpot, message: 'Location created and saved successfully!' },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error creating spot:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
