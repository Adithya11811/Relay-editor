'use client'
import Projects from '@/components/ui/projects'
import { AuthProvider } from '@/hooks/AuthProvider'
import { usePathname } from 'next/navigation'

const Page = () => {
  const pn = usePathname()
  const parr = pn.split('/')
  const name = parr[parr.length - 2]

  if (name === undefined) {
    return <div>Loader</div>
  } else {
    return (
      <div>
        <Projects username={name}/>
      </div>
    )
  }
}
export default Page
