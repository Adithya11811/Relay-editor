'use client';
import Profile from '@/components/ui/Profile'
import { AuthProvider } from '@/hooks/AuthProvider';
import { useCurrentUser } from '@/hooks/use-current-user'


const Page = () => {
  // const user=useCurrentUser()
  // console.log(user)
  return (
    <div>
      <Profile />
    </div>
  )
}
export default Page
