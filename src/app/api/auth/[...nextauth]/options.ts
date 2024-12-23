
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth"
import dbConnect from "../../../lib/DBconnect";
import {session} from "../../../lib/session"

import User from "@/app/lib/models/User";
export const options: NextAuthOptions={
    session:{
        strategy:"jwt"
    },
    providers: [
        GoogleProvider({
          clientId: String(process.env.clientId),
          clientSecret: String(process.env.clientSecret),
        })
      ],
      callbacks:{
        async signIn({profile}){
          // account,
            dbConnect()
            if(!profile?.email){
                throw new Error("No Profile")
            }else{
              console.log("logged in");
              
              const user= await User.findOne({email
                :profile.email})
              if(user){
                console.log(user);
              
              }else{
                  const newUser =new User({name:profile.name,email:profile.email,accountType:"user"})
                  newUser.save();
                  
                  
              }
              
            }
           
            return true;
        },
        session,
        async jwt({ token,  profile }) {
          // user, account,
            if (profile) {
              const user = await User.findOne({email: profile.email})
              if (!user) {
                throw new Error('No user found')
              }
              token.id = user.id
              
            }
            return token
          },
      }

}