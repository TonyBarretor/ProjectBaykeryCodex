import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const providers = [
  EmailProvider({
    from: process.env.EMAIL_FROM,
    sendVerificationRequest: async ({ url, identifier }) => {
      console.log("Magic link", { url, identifier });
    }
  })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/sign-in"
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token.sub) {
        const user = await prisma.user.findUnique({ where: { id: token.sub } });
        if (user) {
          session.user = {
            ...session.user,
            id: user.id,
            role: user.role
          } as any;
        }
      }
      return session;
    }
  },
  providers
};
