'use client'
import Projects from '@/components/ui/projects'
import { AuthProvider } from '@/hooks/AuthProvider'


const page = () => {
  const id = AuthProvider()
  if (id === undefined) {
    return <div>Loader</div>
  } else {
    return (
      <div>
        <Projects />
      </div>
    )
  }
}
export default page
