import { NextRequest, NextResponse } from 'next/server';
import { getSpotByIdFromDb, updateSpotInDb, deleteSpotInDb } from '@/lib/spotsDb';

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cookie = request.cookies.get('admin_token');
  const token = authHeader?.replace('Bearer ', '') || cookie?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || 'explorepakur2024';
  return token === adminPassword;
}

// GET /api/admin/spots/[id] - Get single spot
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const spot = getSpotByIdFromDb(params.id);
  if (!spot) {
    return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
  }
  return NextResponse.json({ spot });
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

    return NextResponse.json({ spot: updatedSpot, message: 'Spot updated successfully in cloud database!' });
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

  return NextResponse.json({ message: 'Spot removed permanently from cloud database' });
}
