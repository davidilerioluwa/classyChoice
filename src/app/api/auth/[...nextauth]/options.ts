import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { NextAuthOptions } from "next-auth";
import dbConnect from "../../../lib/DBconnect";
import { session } from "../../../lib/session";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";

import User from "@/app/lib/models/User";
const clientPromise = dbConnect().then(
  (m) => m.connection.getClient() as unknown as MongoClient
);
export const options: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  debug: true,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
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
    }),
    GoogleProvider({
      clientId: String(process.env.clientId),
      clientSecret: String(process.env.clientSecret),
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      await dbConnect();

      switch (account?.provider) {
        case "google":
          if (!profile?.email) {
            // throw new Error("No Profile");
            console.error("no profile");
          } else {
            console.log("logged in");

            const user = await User.findOne({ email: profile.email });
            if (user) {
              // console.log(user);
            } else {
              // const newUser = new User({
              //   name: profile.name,
              //   email: profile.email,
              //   accountType: "user",
              //   provider: "google",
              // });
              // await newUser.save();
            }
          }
          break;
        case "email":
          if (!account?.providerAccountId) {
            console.log("no profile email");
            break;
          } else {
            const user = await User.findOne({
              email: account.providerAccountId,
            });
            console.log(account.providerAccountId);

            console.log(user);
            if (user) {
              if (user.signInCount === 0 || user.signInCount === undefined) {
                const user = await User.findOneAndUpdate(
                  { email: account.providerAccountId },
                  {
                    provider: "email",
                    accountType: "user",
                    signInCount: 1,
                  },
                  { new: true, upsert: false }
                );
                console.log(user);
              } else {
                const user = await User.findOne({
                  email: account.providerAccountId,
                });
                const newUser = await User.findOneAndUpdate(
                  { email: account.providerAccountId },
                  {
                    signInCount: (user.signInCount || 0) + 1,
                  },
                  { new: true, upsert: false }
                );
                console.log(newUser);
              }
            }
          }
        default:
          break;
      }

      return true;
    },
    session,
    async jwt({ token, user }) {
      // user, account,

      if (user) {
        const userProfile = await User.findOne({ email: user.email });
        if (!userProfile) {
          throw new Error("No user found");
        }
        token.id = userProfile.id;
      }
      return token;
    },
  },
};
// CredentialsProvider({
//   name: "Credentials",
//   credentials: {
//     email: { label: "Email", type: "email" },
//     password: { label: "Password", type: "password" },
//   },
//   async authorize(credentials) {
//     if (!credentials?.email || !credentials?.password) return null;

//     const user = await User.findOne({ email: credentials.email });

//     if (!user || !user.password) return null;

//     // 2. Check password
//     const isValid = await bcrypt.compare(
//       credentials.password as string,
//       user.password
//     );

//     if (!isValid) return null;

//     return { id: user.id, email: user.email };
//   },
// }),
