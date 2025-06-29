import { ROUTES } from '@/src/constants/routes';
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';
import { NextResponse } from 'next/server';

const isAuthRoute = createRouteMatcher([ROUTES.AUTH]);
const isProtectedRoute = createRouteMatcher(['/']);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();

  if (isAuthRoute(request) && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, '/');
  }

  if (isProtectedRoute(request) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(request, ROUTES.AUTH);
  }

  return NextResponse.next();
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
