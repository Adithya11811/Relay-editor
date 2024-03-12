import { useSession } from 'next-auth/react'

export const AuthProvider = async () => {
  const session = useSession()
  return session.data?.user.id
}
