import NextAuth, { type NextAuthConfig } from "next-auth"; // Changed this
import Google from "next-auth/providers/google"; // Note: v5 often uses 'Google' instead of 'GoogleProvider'
import Email from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import dbConnect from "../../../lib/DBconnect";
import User from "@/app/lib/models/User";
import { sendVerificationRequest } from "./sendVerificationRequest";
import { MongoClient } from "mongodb";

const clientPromise = dbConnect().then(
  (m) => m.connection.getClient() as unknown as MongoClient,
);

export const authConfig: NextAuthConfig = {
  // session: { strategy: "jwt" }, // Optional: v5 defaults to JWT if no adapter is present, but with an adapter it defaults to "database"
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  pages: {
    verifyRequest: "/auth/verify-request",
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      // 1. Basic security check (Necessary)
      if (!user.email) return false;
      await dbConnect();
      return true;
    },
    // In v5, you'll likely use the session callback directly here
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const userProfile = await User.findOne({ email: user.email });
        if (userProfile) token.id = userProfile.id;
      }
      return token;
    },
  },
};

// V5 Initialization
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
