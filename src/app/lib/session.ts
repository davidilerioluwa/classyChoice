"use server";
import { auth } from "../api/auth/[...nextauth]/options"; // Path to your auth.ts
import type { User } from "next-auth";

export const getUserSession = async (): Promise<User> => {
  const authUserSession = await auth();

  if (!authUserSession?.user) {
    return {
      id: "",
      // Note: You may need to add other required fields like email: ""
      // depending on your TypeScript User interface
    } as User;
  }

  return authUserSession.user;
};
