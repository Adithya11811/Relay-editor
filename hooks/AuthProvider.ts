import { signOut, useSession } from 'next-auth/react'

export const AuthProvider = () => {
  const session = useSession()
  // const sessionExpiration =session.data?.user.expires;
  // if (sessionExpiration && sessionExpiration< new Date(Date.now())) {
  //   // Session has expired, redirect to login page
  //   signOut();
  // }
  return session.data?.user.id
}
