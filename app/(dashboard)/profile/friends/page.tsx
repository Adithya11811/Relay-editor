'use client'
import Friends from '@/components/ui/follow-friend-cards/Friends'
import { AuthProvider } from '@/hooks/AuthProvider'

const page = () => {
  const id = AuthProvider()
  if (id === undefined) {
    return <div>Loader</div>
  } else {
    return (
      <div>
        <Friends/>
      </div>
    )
  }
}
export default page
