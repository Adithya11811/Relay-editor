import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { LoginSchema } from "@/schema";
import { getUserByEmail } from "@/data/user";
import { createAccessToken, createRefreshToken } from "./lib/tokens";
import { db } from "./lib/db";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // Generate access and refresh tokens
            const access_token = await createAccessToken(user);
            const refresh_token = await createRefreshToken(user);

            // Update or create Account record with tokens and expiration
            await db.account.update({
              where: { userId: user.id },
              data: {
                userId: user.id,
                access_token:access_token,
                refresh_token:refresh_token,
                expires_at: new Date(Date.now()+3600*1000),

              },
            });

            return { ...user, access_token, refresh_token }; // Include tokens in user object
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig