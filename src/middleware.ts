import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminAuth } from './lib/adminAuth';

const LOCALES = ['en', 'hi'] as const;
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Admin Security Checks
  const isProtectedAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  const isPublicApiGet = request.method === 'GET' && (
    pathname === '/api/admin/spots' || pathname.startsWith('/api/admin/spots/')
  );

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

  // 2. Bypass locale prefixing for admin, APIs, and static assets
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/icon.png' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 3. Check if pathname already has a supported locale prefix (/en or /hi)
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 4. Determine preferred locale: Cookie -> Accept-Language -> Default
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  let preferredLocale = DEFAULT_LOCALE;

  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    preferredLocale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get('accept-language') || '';
    if (acceptLanguage.toLowerCase().includes('hi')) {
      preferredLocale = 'hi';
    }
  }

  // Redirect to localized URL preserving query params
  const targetUrl = new URL(
    `/${preferredLocale}${pathname === '/' ? '' : pathname}${search}`,
    request.url
  );

  return NextResponse.redirect(targetUrl);
}

export const config = {
  // Match all request paths except _next/static, _next/image, and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
