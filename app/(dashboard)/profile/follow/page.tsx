'use client'
import Follow from '@/components/ui/follow-friend-cards/Follow'
// import Friends from '@/components/ui/follow-friend-cards/Friends'
// import Projects from '@/components/ui/projects'
import { AuthProvider } from '@/hooks/AuthProvider'

const page = () => {
  const id = AuthProvider()
  if (id === undefined) {
    return <div>Loader</div>
  } else {
    return (
      <div>
        <Follow />
      </div>
    )
  }
}
export default page
