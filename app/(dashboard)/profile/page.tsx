'use client'
import Profile from '@/components/ui/Profile'
import { AuthProvider } from '@/hooks/AuthProvider'
import { useRouter } from 'next/navigation'

const Page = () => {
  const id = AuthProvider()

  if (id === undefined) {
    return <div>Loader</div>
  } else {
    return (
      <div>
        <Profile id={id!} />
      </div>
    )
  }
}
export default Page
