import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  if (!req.auth) {
    const url = new URL('/login', req.nextUrl);
    url.searchParams.set('callbackUrl', pathname + search);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith('/admin') && !can(req.auth.user.role, 'loan:review')) {
    return NextResponse.redirect(new URL('/forbidden', req.nextUrl));
  }
});

export const config = { matcher: ['/loans/:path*', '/admin/:path*'] };
