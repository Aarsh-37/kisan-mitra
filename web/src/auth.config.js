import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isProtected = ["/dashboard", "/crop-advisor", "/pest-analyzer", "/yield-predictor", "/settings"].some(
                (route) => nextUrl.pathname.startsWith(route)
            );

            if (isProtected) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                if (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup") {
                    const callbackUrl = nextUrl.searchParams.get("callbackUrl");
                    if (callbackUrl && callbackUrl !== nextUrl.pathname) {
                        return Response.redirect(new URL(callbackUrl, nextUrl));
                    }
                    return Response.redirect(new URL("/dashboard", nextUrl));
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
};
