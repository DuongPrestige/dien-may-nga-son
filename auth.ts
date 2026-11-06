import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import {
  getActiveSessionUser,
  verifyAdminCredentials,
} from "@/src/features/auth/services/auth.service";
import { loginSchema } from "@/src/features/auth/validators/auth.validator";
import {
  consumeRateLimit,
  getClientIp,
  RATE_LIMIT_RULES,
  resetRateLimit,
} from "@/src/lib/rate-limit";

export const LOGIN_RATE_LIMITED_CODE = "rate_limited";

class LoginRateLimitedError extends CredentialsSignin {
  code = LOGIN_RATE_LIMITED_CODE;
}

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
      async authorize(credentials, request) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        // Counted inside authorize so both the login form and direct POSTs
        // to the NextAuth callback endpoint are throttled.
        const [ipLimit, emailLimit] = await Promise.all([
          consumeRateLimit(
            RATE_LIMIT_RULES.loginByIp,
            getClientIp(request.headers),
          ),
          consumeRateLimit(
            RATE_LIMIT_RULES.loginByEmail,
            parsedCredentials.data.email,
          ),
        ]);

        if (!ipLimit.allowed || !emailLimit.allowed) {
          throw new LoginRateLimitedError();
        }

        const user = await verifyAdminCredentials(
          parsedCredentials.data.email,
          parsedCredentials.data.password,
        );

        if (user) {
          await resetRateLimit(
            RATE_LIMIT_RULES.loginByEmail,
            parsedCredentials.data.email,
          );
        }

        return user;
      },
    }),
  ],
});
