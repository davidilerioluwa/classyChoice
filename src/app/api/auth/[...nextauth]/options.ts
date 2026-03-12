import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";

import dbConnect from "../../../lib/DBconnect";
import { sendVerificationRequest } from "./sendVerificationRequest";
import User from "@/app/lib/models/User";

// Initialize the MongoDB client for the adapter
const clientPromise = dbConnect().then(
  (m) => m.connection.getClient() as unknown as MongoClient,
);

export const authConfig: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    verifyRequest: "/auth/verify-request",
  },
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
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
  callbacks: {
    async signIn({ account, profile }) {
      await dbConnect();

      switch (account?.provider) {
        case "google":
          if (!profile?.email) {
            console.error("no profile");
          } else {
            console.log("logged in via google");
            // Optional: Manual logic for existing users
            const user = await User.findOne({ email: profile.email });
            if (user) {
              // Logic for existing user
            }
          }
          break;

        case "email":
          // In v5, providerAccountId is often the email for the Email provider
          const email = account?.providerAccountId;
          if (!email) {
            console.log("no profile email");
            break;
          } else {
            const user = await User.findOne({ email });

            if (user) {
              const currentCount = user.signInCount || 0;
              await User.findOneAndUpdate(
                { email },
                {
                  provider: "email",
                  accountType: "user",
                  signInCount: currentCount + 1,
                },
                { new: true, upsert: false },
              );
            }
          }
          break;

        default:
          break;
      }

      return true;
    },
    // Note: ensure your custom session logic is compatible with NextAuthConfig
    // @ts-ignore - ignoring if your custom session helper has a different signature
    async session({ session, token }) {
      // console.log(session, "session");

      if (session.user && token?.sub) {
        session.user.id = token.sub; // v5 often uses 'sub' for the user ID
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        await dbConnect();
        const userProfile = await User.findOne({ email: user.email });
        if (!userProfile) {
          throw new Error("No user found in database");
        }
        token.id = userProfile._id.toString();
      }
      return token;
    },
  },
};

// Export the handlers for Next.js App Router (if applicable)
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
