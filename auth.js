// ─────────────────────────────────────────────────────────────────────────────
// AUTH CONFIG (NextAuth v5)
//
// Sets up two sign-in methods:
//   1. Google OAuth (uses GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET env vars)
//   2. Email + Password (Credentials provider, bcrypt-hashed passwords)
// Stores users in MongoDB via the @auth/mongodb-adapter.
// JWT session strategy: id, role (user/admin), and plan (free/pro/business)
// are attached to the token so dashboard/admin pages can read them quickly.
// Exports: handlers, auth, signIn, signOut  (used everywhere via @/auth).
// ─────────────────────────────────────────────────────────────────────────────

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { verifyPassword } from "@/lib/auth/password";
import { findUserByEmail } from "@/lib/models/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const client = await clientPromise;
        const db = client.db();
        const user = await findUserByEmail(db, String(credentials.email).toLowerCase());

        if (!user?.passwordHash) return null;

        const valid = await verifyPassword(
          String(credentials.password),
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.name ?? null,
          email: user.email,
          role: user.role ?? "user",
          plan: user.plan ?? "free",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.plan = user.plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.plan = token.plan;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
