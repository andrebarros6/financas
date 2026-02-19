import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication (redirect to landing page if not logged in)
const protectedRoutes = ["/dashboard"];

// Routes locked during waitlist phase (redirect to landing page)
const lockedRoutes: string[] = [];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  // Block login/signup during waitlist-only phase
  const isLockedRoute = lockedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isLockedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Verify JWT with Supabase auth server (cryptographic verification).
  // Wrapped in a 5s timeout — if it hangs, fail closed (redirect to login).
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  let user = null;
  try {
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Auth timeout")), 5000)
      ),
    ]);
    user = result.data.user;
  } catch {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}
