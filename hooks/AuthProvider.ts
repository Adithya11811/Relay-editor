import { useSession } from 'next-auth/react'

export const AuthProvider = () => {
  const session = useSession()
  // console.log(session)
  return session.data?.user.id
}
