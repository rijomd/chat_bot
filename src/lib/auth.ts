import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { loginInActions } from "@/actions/authActions";
import { NEXT_AUTH_SECRET } from "@/constants/authConstants";
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
        maxAge: 1 * 24 * 60 * 60, // 1 days
    },
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.accessToken = (user as any).accessToken;
                token.id = user.id;
                // Set expiry time
                (token as any).exp = Math.floor(Date.now() / 1000) + (1 * 24 * 60 * 60);
            }
            // Check if token is expired
            const exp = typeof (token as any).exp === "number" ? (token as any).exp : Number((token as any).exp || 0);
            if (exp && (Date.now() / 1000) > exp) {
                (token as any).error = "TokenExpired";
            }
            return token;
        },
        async session({ session, token }) {
            // Add custom fields to session
            if (token) {
                (session.user as any).id = token.id;
                (session as any).accessToken = token.accessToken;
                const exp = typeof token.exp === "number" ? token.exp : Number((token as any).exp);
                (session as any).expires = new Date(exp * 1000).toISOString();
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: NEXT_AUTH_SECRET,
};