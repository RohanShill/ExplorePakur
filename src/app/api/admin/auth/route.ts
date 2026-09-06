import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'explorepakur2024';

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Create response with auth cookie
    const response = NextResponse.json({ message: 'Login successful', authenticated: true });

    response.cookies.set('admin_token', adminPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE — Logout
export async function DELETE() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.delete('admin_token');
  return response;
}
