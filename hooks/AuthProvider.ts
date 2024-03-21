import { useSession } from 'next-auth/react'

export const AuthProvider = () => {
  const session = useSession()
  return session.data?.user.id
}
