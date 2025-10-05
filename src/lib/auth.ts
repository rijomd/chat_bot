import { loginInActions } from "@/actions/authActions";
import { NEXT_AUTH_SECRET } from "@/constants/authConstants";
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
                try {
                    const data = await loginInActions({
                        email: credentials?.email || "",
                        password: credentials?.password || "",
                    });

                    if (data?.user) {
                        return {
                            id: data.user.id,
                            email: data.user.email,
                            token: data.token,
                        };
                    }
                    return null;
                } catch (err) {
                    console.error("Authorize error:", err);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: NEXT_AUTH_SECRET,
    },
    // pages: {
    //     signIn: "/login",
    // },
    callbacks: {
        async jwt({ token, user }) {
            console.log(user, "user cllack");
            // if (user) {
            //     token.accessToken = user?.token;
            // }
            return token;
        },
        async session({ session, token }) {
            // Expose token to client
            (session as any).accessToken = token.accessToken;
            return session;
        },
    },
    secret: NEXT_AUTH_SECRET,
};
