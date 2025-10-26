import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { loginInActions } from "@/actions/authActions";
import { NEXT_AUTH_SECRET, TOKEN_EXPIRY_DAYS } from "@/constants/authConstants";
import { urlPaths } from "@/constants/pathConstants";
// or import GoogleProvider, GitHubProvider etc (for sso).

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Call your login API
                return loginInActions(credentials);
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: TOKEN_EXPIRY_DAYS * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                const expiryTime = Math.floor(Date.now() / 1000) + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60);

                token.accessToken = (user as any).accessToken;
                token.id = user.id;
                (token as any).exp = expiryTime; // Set expiry time
                (token as any).iat = Math.floor(Date.now() / 1000); // Issued at time
            }
            // Check if token is expired
            const currentTime = Math.floor(Date.now() / 1000);
            const exp = typeof (token as any).exp === "number" ? (token as any).exp : Number((token as any).exp || 0);
            if (exp && currentTime > exp) {
                return {}; // Return empty token to force logout
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                (session as any).accessToken = token.accessToken;
                (session as any).expiresAt = token.exp; // expiry time
                (session as any).issuedAt = token.iat; // issued at time
            }
            return session;
        },
    },
    pages: {
        signIn: urlPaths.LOGIN,
    },
    secret: NEXT_AUTH_SECRET,
};