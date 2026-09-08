import { NextRequest, NextResponse } from 'next/server';
import { getExpectedAdminToken, verifyAdminAuth, ADMIN_CONFIG } from '@/lib/adminAuth';

// GET - Verify current session
export async function GET(request: NextRequest) {
  if (verifyAdminAuth(request)) {
    return NextResponse.json({ authenticated: true, email: ADMIN_CONFIG.EMAIL });
  }

  return NextResponse.json({ authenticated: false, error: 'Unauthorized' }, { status: 401 });
}

// POST - Login with Email & Password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const expectedEmail = ADMIN_CONFIG.EMAIL.trim().toLowerCase();
    const expectedPassword = ADMIN_CONFIG.PASSWORD;

    const providedEmail = (email || '').trim().toLowerCase();
    const providedPassword = password || '';

    if (providedEmail !== expectedEmail || providedPassword !== expectedPassword) {
      return NextResponse.json(
        { error: 'Galat Email ya Password! Kripya sahi credentials daalein.' },
        { status: 401 }
      );
    }

    const sessionToken = getExpectedAdminToken();

    // Create response with secure auth cookie
    const response = NextResponse.json({
      message: 'Login successful',
      authenticated: true,
      user: { email: expectedEmail },
    });

    response.cookies.set('admin_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE - Logout
export async function DELETE() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.delete('admin_token');
  return response;
}
