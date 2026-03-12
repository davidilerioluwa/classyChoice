import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials"; // 1. Import Credentials
import bcrypt from "bcryptjs"; // 2. Import bcrypt
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import dbConnect from "../../../lib/DBconnect";
import User from "@/app/lib/models/User";
import { MongoClient } from "mongodb";

const clientPromise = dbConnect().then(
  (m) => m.connection.getClient() as unknown as MongoClient,
);

export const authConfig: NextAuthConfig = {
  // 3. FORCE JWT strategy (Required for Credentials)
  session: { strategy: "jwt" },

  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),

    // 4. ADD THE CREDENTIALS PROVIDER
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        console.log(
          (credentials?.email as string)?.toLowerCase(),
          "credentials",
        );

        // Find the user
        const user = await User.findOne({
          email: (credentials?.email as string)?.toLowerCase(),
        });

        if (!user || !user.password) {
          // throw new Error("No user found with this email");
          console.error("No user found with this email");
          return null;
        }

        // Verify OTP/Verification status (from your earlier step)
        if (!user.isVerified) {
          console.error("Please verify your email before logging in.");
          return null;
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordCorrect) {
          console.error("Invalid password");
          return null;
        }

        // Return user for the JWT
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    verifyRequest: "/auth/verify-request",
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // If signing in with credentials, check if verified
      if (account?.provider === "credentials") {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        if (!dbUser?.isVerified) return false;
      }

      return true;
    },
    async session({ session, token }) {
      console.log(session, "session");

      if (session.user && token?.sub) {
        session.user.id = token.sub; // v5 often uses 'sub' for the user ID
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
