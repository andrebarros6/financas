import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication (redirect to landing page if not logged in)
const protectedRoutes = ["/dashboard"];

// Routes locked during waitlist phase (redirect to landing page)
const lockedRoutes = ["/login", "/signup"];

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

  // Use getSession (reads from cookies, no network call) to check auth.
  // getUser() hangs in dev on Windows/Turbopack, so we avoid it here.
  // Client-side auth validates the token properly.
  const { data: { session } } = await supabase.auth.getSession();

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}
