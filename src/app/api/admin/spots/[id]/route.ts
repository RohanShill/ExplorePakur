export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { verifyAdminAuth } from '@/lib/adminAuth';
import { NextRequest, NextResponse } from 'next/server';
import { getSpotByIdAsync, updateSpotInDb, deleteSpotInDb } from '@/lib/spotsDb';

function verifyAuth(request: NextRequest): boolean {
  return verifyAdminAuth(request);
}

// GET /api/admin/spots/[id] - Get single spot with cloud + local fallback
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const spot = await getSpotByIdAsync(params.id);
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

// PUT /api/admin/spots/[id] - Update spot in persistent DB
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updatedSpot = await updateSpotInDb(params.id, body);

    if (!updatedSpot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    return NextResponse.json(
      { spot: updatedSpot, message: 'Location updated and saved successfully!' },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  } catch (err) {
    console.error('Error updating spot:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/admin/spots/[id] - Delete spot from persistent DB
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = await deleteSpotInDb(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Spot removed permanently from database' });
}