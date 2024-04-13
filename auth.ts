import NextAuth, {type DefaultSession} from "next-auth"
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById,getAccountByUserId } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  email: string;
  name: string;
  expires:number;
  accessToken?: string;
};
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export const {
  handlers:
   { GET, POST },
  auth,
  signIn,
  signOut,
  // update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {

      const existingUser = await getUserById(user.id as string);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }

      return true;
    },
async session({ token, session }) {
  if (token.sub && session.user) {
    session.user.id = token.sub;
  }

  if (token.role && session.user) {
    session.user.role = token.role as UserRole;
  }

  if (session.user) {
    session.user.isTwoFactorEnabled = !!token.isTwoFactorEnabled; // Ensure proper conversion to boolean
    session.user.expires = token.expires as number; // Ensure proper type assignment
  }

  const account = await getAccountByUserId(session.user.id);
  if (account && account.access_token) {
    session.user.accessToken = account.access_token;
  }

  return session;
},

async jwt({ token }) {
  if (!token.sub) return token;

  const existingUser = await getUserById(token.sub);

  if (!existingUser) return token;

  const existingAccount = await getAccountByUserId(existingUser.id);

  token.isOAuth = !!existingAccount;
  token.name = existingUser.name;
  token.email = existingUser.email;
  token.role = existingUser.role;
  token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
  token.expires = existingAccount?.expires_at ?? null; // Ensure proper handling of null or undefined
  return token;
},

  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});