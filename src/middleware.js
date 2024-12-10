import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req });
  const protectedPaths = ['/dashboard', '/purchases', '/settings'];

  if (protectedPaths.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/purchases/:path*', '/settings/:path*'],
};
