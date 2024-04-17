'use client'
import Profile from '@/components/ui/Profile'
import { AuthProvider } from '@/hooks/AuthProvider'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter();
  router.refresh()
  const id = AuthProvider()
  
  // console.log(id)
  if (id === undefined) {
    return <div>Loader</div>
  } else {
    
    return (
      <div>
        <Profile id={id}/>
      </div>
    )
  }
}
export default Page
