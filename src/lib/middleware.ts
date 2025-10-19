import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

import { DEFAULT_PATH, urlPaths } from "@/constants/pathConstants";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith(urlPaths.LOGIN) ||
            req.nextUrl.pathname.startsWith(urlPaths.SIGNUP);

        if (isAuthPage && isAuth) {
            return NextResponse.redirect(new URL(DEFAULT_PATH, req.url));
        }

        if (!isAuthPage && !isAuth) {
            return NextResponse.redirect(new URL(urlPaths.LOGIN, req.url));
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
            signIn: urlPaths.LOGIN,
        },
    }
);