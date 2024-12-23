"use server"
import { User, getServerSession } from 'next-auth'

export const session = async ({ session, token }: any) => {
  session.user.id = token.id
  session.user.tenant = token.tenant
  return session
}

export const getUserSession = async (): Promise<User> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session
    }
  })
  if (!authUserSession) {
    console.log(authUserSession);
    return {
      id:""
    }
  }else{
    return authUserSession.user
  }
 
}