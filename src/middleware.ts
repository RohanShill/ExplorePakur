import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminAuth } from './lib/adminAuth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  const isProtectedAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  // Allow public GET on /api/admin/spots for the frontend website to load spots
  const isPublicApiGet = request.method === 'GET' && (
    pathname === '/api/admin/spots' || pathname.startsWith('/api/admin/spots/')
  );

  // Protect all mutating /api/admin routes (and all other admin APIs except public GET and auth)
  const isProtectedAdminApi =
    pathname.startsWith('/api/admin') &&
    !pathname.startsWith('/api/admin/auth') &&
    !isPublicApiGet;

  if (isProtectedAdminPage) {
    if (!verifyAdminAuth(request)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isProtectedAdminApi) {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
