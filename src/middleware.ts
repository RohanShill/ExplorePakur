import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  const isProtectedAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  // Protect /api/admin routes (except /api/admin/auth)
  const isProtectedAdminApi = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth');

  const adminToken = request.cookies.get('admin_token')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || 'explorepakur2024';

  if (isProtectedAdminPage) {
    if (!adminToken || adminToken !== adminPassword) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isProtectedAdminApi) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || adminToken;

    if (!token || token !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
