import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// or import GoogleProvider, GitHubProvider etc (for sso).

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                // Replace with real DB check
                if (
                    credentials.email === "admin@example.com" &&
                    credentials.password === "admin"
                ) {
                    return { id: "1", name: "Admin", email: "admin@example.com" };
                }

                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) token.user = user;
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (token?.user) {
                session.user = token.user as any;
            }
            return session;
        },
    },
};
