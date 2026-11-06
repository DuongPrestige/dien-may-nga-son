import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import {
  getActiveSessionUser,
  verifyAdminCredentials,
} from "@/src/features/auth/services/auth.service";
import { loginSchema } from "@/src/features/auth/validators/auth.validator";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
        return token;
      }

      if (!token.id) {
        return null;
      }

      // Re-check on every server-side auth() call so disabled users lose
      // access immediately and role changes apply without re-login.
      try {
        const activeUser = await getActiveSessionUser(token.id);

        if (!activeUser) {
          return null;
        }

        token.role = activeUser.role;
        token.name = activeUser.name;
        token.email = activeUser.email;
        return token;
      } catch (error) {
        console.error("Failed to refresh admin session", error);
        return null;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) {
          session.user.id = token.id;
        }

        if (token.role) {
          session.user.role = token.role;
        }
      }

      return session;
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        return verifyAdminCredentials(
          parsedCredentials.data.email,
          parsedCredentials.data.password,
        );
      },
    }),
  ],
});
