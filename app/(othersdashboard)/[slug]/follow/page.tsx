'use client'
import Follow from '@/components/ui/follow-friend-cards/Follow'
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
        <Follow username={name} />
      </div>
    )
  }
}
export default Page
