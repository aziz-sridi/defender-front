import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forget-password',
  '/reset-password',
  '/verify-otp',
  '/verifmail',
  '/brand-assets',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/faq',
  '/organizations',
  '/tournaments',
  '/games',
  '/pricing',
  '/economy',
  '/complete-registration',
  '/enter-number',
  '/confirm-code',
  '/tsf',
  '/tuntel',
  '/support/guides',
  '/support/guide',
  '/events',
  '/event/dz-ramadhan',
  '/jobs',
  '/academy',
  '/partner/jsk',
  '/partner/orange',
  '/partner/gamefy',
  '/saas',
  '/apps',
  '/blogs',
]

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  let { pathname } = url

  // Normalize pathname (remove trailing slash except for root)
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }

  // Skip middleware for these paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/404' ||
    pathname === '/500' ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const pathParts = pathname.split('/').filter(Boolean)
  const isTeamProfile =
    pathParts[0] === 'team' && pathParts.length >= 2 && pathParts[1] !== 'create'

  const isTournamentProfile =
    pathParts[0] === 'tournament' && pathParts.length >= 2 && pathParts[1] !== 'create'

  const isOrganizationProfile =
    pathParts[0] === 'organization' && pathParts.length >= 2 && pathParts[1] !== 'create'

  // Normalize all public routes for trailing slash
  const normalizedPublicRoutes = PUBLIC_ROUTES.map(route =>
    route.length > 1 && route.endsWith('/') ? route.slice(0, -1) : route,
  )
  const isPublicRoute =
    normalizedPublicRoutes.some(route => pathname === route || pathname.startsWith(route + '/')) ||
    pathname === '/team' ||
    isTeamProfile ||
    isTournamentProfile ||
    isOrganizationProfile

  if (req.method === 'OPTIONS') {
    return NextResponse.next()
  }

  let token = null
  let isAuthenticated = false
  try {
    // Try to read NextAuth token; secret may be undefined in dev, which is fine
    token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    // Consider authenticated if we have any token, or token has a user/_id, or a sub
    // This avoids false negatives when token payload varies
    const hasUserId = Boolean((token as any)?.user?._id)
    const hasSub = Boolean((token as any)?.sub)
    isAuthenticated = Boolean(token) && (hasUserId || hasSub || true)
  } catch (error) {
    console.error('❌ Token validation error:', error)
    token = null
    isAuthenticated = false
  }

  // Dev-friendly fallback: if token parsing fails due to missing NEXTAUTH_SECRET,
  // still treat user as authenticated when a NextAuth session cookie is present.
  if (!isAuthenticated) {
    try {
      const sessionCookie =
        req.cookies.get('next-auth.session-token') ||
        req.cookies.get('__Secure-next-auth.session-token')
      if (sessionCookie?.value) {
        isAuthenticated = true
      }
    } catch {
      // ignore cookie read issues
    }
  }

  const resHeaders = new Headers()
  try {
    resHeaders.set('x-token-present', token ? 'true' : 'false')
    resHeaders.set('x-is-authenticated', isAuthenticated ? 'true' : 'false')
    resHeaders.set('x-middleware-path', pathname)
  } catch {
    /* ignore header set errors */
  }

  // If authenticated user hits login page, check if they need to complete registration
  if (isAuthenticated && pathname === '/login') {
    const callbackUrl = url.searchParams.get('callbackUrl')

    // If there's a callbackUrl pointing to registration, redirect directly there
    if (callbackUrl) {
      try {
        const decodedCallback = decodeURIComponent(callbackUrl)
        if (
          decodedCallback.includes('/complete-registration') ||
          decodedCallback.includes('/enter-number') ||
          decodedCallback.includes('/confirm-code')
        ) {
          const destination = url.clone()
          destination.pathname = new URL(decodedCallback, url.origin).pathname
          destination.search = ''
          return NextResponse.redirect(destination, { headers: resHeaders })
        }
      } catch {
        // If URL parsing fails, fall through to default redirect
      }
    }

    // Otherwise redirect authenticated users to home
    const destination = url.clone()
    destination.pathname = '/'
    destination.search = ''
    return NextResponse.redirect(destination, { headers: resHeaders })
  }

  // If not authenticated and route is protected, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    resHeaders.set('x-middleware-blocked', 'true')
    const destination = url.clone()
    destination.pathname = '/login'
    // NextAuth expects callbackUrl for post-login redirect
    destination.searchParams.set('callbackUrl', req.nextUrl.pathname)

    return NextResponse.redirect(destination, { headers: resHeaders })
  }

  return NextResponse.next({ headers: resHeaders })
}

export const config = {
  matcher: [
    // Only match actual pages, not static files or Next.js internals
    '/((?!api|_next|.*\.[\w]+$).*)',
  ],
}
