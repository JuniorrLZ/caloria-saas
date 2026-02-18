/**
 * Supabase client for Next.js middleware.
 *
 * Refreshes auth tokens and writes updated cookies to the response.
 */
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

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
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session – IMPORTANT: do NOT remove this
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes: redirect to /login if not authenticated
    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/food-diary") ||
        request.nextUrl.pathname.startsWith("/bioimpedance") ||
        request.nextUrl.pathname.startsWith("/community") ||
        request.nextUrl.pathname.startsWith("/progress") ||
        request.nextUrl.pathname.startsWith("/recipes") ||
        request.nextUrl.pathname.startsWith("/training") ||
        request.nextUrl.pathname.startsWith("/calculator") ||
        request.nextUrl.pathname.startsWith("/profile") ||
        request.nextUrl.pathname.startsWith("/subscription");

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // If user is logged in and visits /login or /signup, redirect to dashboard
    const isAuthRoute =
        request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/signup";

    if (user && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
