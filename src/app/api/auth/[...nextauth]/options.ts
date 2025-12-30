import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { NextAuthOptions } from "next-auth";
import dbConnect from "../../../lib/DBconnect";
import { session } from "../../../lib/session";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import User from "@/app/lib/models/User";
const clientPromise = dbConnect().then((m) => m.connection.getClient());
export const options: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  debug: true,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: String(process.env.clientId),
      clientSecret: String(process.env.clientSecret),
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
              const newUser = new User({
                name: profile.name,
                email: profile.email,
                accountType: "user",
                provider: "google",
              });
              await newUser.save();
            }
          }
          break;
        case "email":
          console.log("email");
          console.log(account);

          if (!account?.providerAccountId) {
            console.log("no profile email");
            break;
          } else {
            const user = await User.findOneAndUpdate(
              { email: account.providerAccountId },
              {
                provider: "email",
                accountType: "user",
              },
              { new: true, upsert: false } // 'new: true' returns the modified document
            );
            console.log(account.providerAccountId);
            // console.log(user);
            // console.log(x);
          }
        default:
          break;
      }

      return true;
    },
    session,
    async jwt({ token, account }) {
      // user, account,
      if (account) {
        const user = await User.findOne({ email: account.providerAccountId });
        if (!user) {
          throw new Error("No user found");
        }
        token.id = user.id;
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
