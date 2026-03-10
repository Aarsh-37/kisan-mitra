import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    providers: [
        ...authConfig.providers.filter(p => typeof p === 'function' || p.id !== 'credentials'),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.phone = user.phone;
                token.location = user.location;
                token.farmSize = user.farmSize;
                token.farmingType = user.farmingType;
                token.bio = user.bio;
            }
            if (trigger === "update" && session) {
                token.name = session.name;
                token.phone = session.phone;
                token.location = session.location;
                token.farmSize = session.farmSize;
                token.farmingType = session.farmingType;
                token.bio = session.bio;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.phone = token.phone;
                session.user.location = token.location;
                session.user.farmSize = token.farmSize;
                session.user.farmingType = token.farmingType;
                session.user.bio = token.bio;
            }
            return session;
        },
    },
});
