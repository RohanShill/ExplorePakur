import { NextRequest } from 'next/server';

export const ADMIN_CONFIG = {
  get EMAIL() {
    return process.env.ADMIN_EMAIL || 'sillrohan@gmail.com';
  },
  get PASSWORD() {
    return process.env.ADMIN_PASSWORD || 'ExploreRohan123@';
  },
};

export function getExpectedAdminToken(): string {
  const email = (process.env.ADMIN_EMAIL || 'sillrohan@gmail.com').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'ExploreRohan123@';
  if (typeof btoa !== 'undefined') {
    return 'pakur_admin_' + btoa(email + ':' + password);
  }
  return 'pakur_admin_' + Buffer.from(email + ':' + password).toString('base64');
}

export function verifyAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cookie = request.cookies.get('admin_token');
  const token = authHeader?.replace('Bearer ', '') || cookie?.value;

  if (!token) return false;

  const expectedToken = getExpectedAdminToken();
  const currentPassword = process.env.ADMIN_PASSWORD || 'ExploreRohan123@';

  return token === expectedToken || token === currentPassword;
}
