import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Proteger rotas da universidade
  if (request.nextUrl.pathname.startsWith('/university')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const userType = user.user_metadata?.user_type;
    if (userType !== 'university') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Proteger rotas da empresa (se houver)
  if (request.nextUrl.pathname.startsWith('/company')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const userType = user.user_metadata?.user_type;
    if (userType !== 'company') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/university/:path*', '/company/:path*'],
};
