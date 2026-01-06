import { NextRequest, NextResponse } from "next/server";

// Custom middleware for route protection
const publicRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath = publicRoutes.includes(path);

    // Get token from cookies - try both dev and prod cookie names
    const devToken = request.cookies.get("next-auth.session-token")?.value;
    const prodToken = request.cookies.get("__Secure-next-auth.session-token")?.value;
    const token = devToken || prodToken;

    console.log(`[Middleware] Path: ${path}`);
    console.log(`[Middleware] Is public path: ${isPublicPath}`);
    console.log(`[Middleware] Token found: ${token ? "✅" : "❌"}`);
    if (token) {
        console.log(`[Middleware] Token preview: ${token.substring(0, 50)}...`);
    }

    // Redirect to login if accessing protected route without token
    if (!isPublicPath && !token) {
        console.log(`[Middleware] ↪️  Redirect to /login (no token)`);
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect to dashboard if accessing public auth pages with valid token
    if (isPublicPath && token) {
        console.log(`[Middleware] ↪️  Redirect to / (token exists)`);
        return NextResponse.redirect(new URL("/", request.url));
    }

    console.log(`[Middleware] ✅ Allow request`);
    return NextResponse.next();
}

// Specify which routes to protect
export const config = {
    matcher: [
        "/",
        "/chat/:path*",
    ],
};
