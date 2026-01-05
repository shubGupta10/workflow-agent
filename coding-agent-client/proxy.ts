import { NextResponse, NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url)
  
  const publicRoutes = ['/', '/login', '/auth/callback', '/']
  const isPublicRoute = publicRoutes.includes(pathname)
  
  const tokenInUrl = searchParams.get('token')
  
  const tokenInCookie = request.cookies.get('coding_agent_token')?.value
  
  const hasToken = !!tokenInUrl || !!tokenInCookie
  
  if (hasToken && isPublicRoute && pathname !== '/auth/callback') {
    return NextResponse.redirect(new URL('/chat', request.url))
  }
  
  if (!hasToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.ico$).*)',
}