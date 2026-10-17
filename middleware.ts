import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // On protège toutes les routes qui commencent par /admin, SAUF la page de login
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    // On cherche notre ticket d'entrée (le cookie)
    const session = request.cookies.get('admin_session');
    
    // Si pas de cookie, on renvoie le joueur vers la page de connexion
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// On indique au vigile de ne surveiller que les pages /admin
export const config = {
  matcher: ['/admin/:path*'],
};