import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en-US', 'ar-AE'];
const DEFAULT_LOCALE = 'ar-AE';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, LOCALES, DEFAULT_LOCALE);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip if request is for static files or API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with our supported locales
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}`) || pathname.startsWith(`/${locale.split('-')[0]}`)
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  // Add RTL support for Arabic
  const response = NextResponse.redirect(request.nextUrl);
  if (locale.startsWith('ar')) {
    response.headers.set('Content-Language', 'ar');
    response.headers.set('dir', 'rtl');
  }

  return response;
}
