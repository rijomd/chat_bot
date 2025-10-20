import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
            req.nextUrl.pathname.startsWith("/signup");

        if (isAuthPage && isAuth) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (!isAuthPage && !isAuth) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                return true;
            },
        },
        pages: {
            signIn: "/login",
        },
    }
);

// Specify which routes to protect
export const config = {
    matcher: [
        "/profile/:path*",
        "/login",
        "/signup",
    ],
};