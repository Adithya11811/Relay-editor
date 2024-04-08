'use client'
import Profile from '@/components/ui/Profile'
import { AuthProvider } from '@/hooks/AuthProvider'

const Page = () => {
  // const search_query = 
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
