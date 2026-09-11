import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // ✅ Redirect common paths
  const redirectMap: Record<string, string> = {
    '/profile': '/user-dashboard/profile',
    '/orders': '/user-dashboard/orders',
    '/wishlist': '/user-dashboard/wishlist',
    '/reviews': '/user-dashboard/reviews',
    '/addresses': '/user-dashboard/addresses',
    '/saved-cards': '/user-dashboard/saved-cards',
    '/notifications': '/user-dashboard/notifications',
    '/categories': '/products', // ✅ Categories redirect to products
  };

  // Check if path needs redirect
  if (pathname in redirectMap) {
    return NextResponse.redirect(new URL(redirectMap[pathname], request.url));
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/user-dashboard', '/admin-dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/user-dashboard/:path*',
    '/admin-dashboard/:path*',
    '/profile',
    '/orders',
    '/wishlist',
    '/reviews',
    '/addresses',
    '/saved-cards',
    '/notifications',
    '/categories', // ✅ Add categories to matcher
  ],
};