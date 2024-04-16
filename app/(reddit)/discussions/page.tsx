// import CustomFeed from '@/components/homepage/CustomFeed'
// import GeneralFeed from '@/components/homepage/GeneralFeed'
import CustomFeed from '@/components/discussions/CustomFeed'
import GeneralFeed from '@/components/discussions/GeneralFeed'
import { buttonVariants } from '@/components/ui/button'
// import { AuthProvider } from '@/hooks/AuthProvider'
import { Home as HomeIcon } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Home() {
//   const session = AuthProvider()

  return (
    <div className="ml-4 mt-4">
      <h1 className="font-bold text-xl uppercase md:text-3xl">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* {session ? <CustomFeed /> : <GeneralFeed />} */}
        <GeneralFeed />

        {/* subreddit info */}
        <div className="overflow-hidden h-fit rounded-lg bg-gray-800/40 border border-gray-200 order-first md:order-last ">
          <div className="bg-green-500/80 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal Relay discussions. Come here to check in with your
                favorite communities.
              </p>
            </div>

            <Link
              className={buttonVariants({
                className: 'w-full mt-4 mb-6',
              })}
              href={`/discussions/re/create`}
            >
              Create Community
            </Link>
          </dl>
        </div>
      </div>
    </div>
  )
}
