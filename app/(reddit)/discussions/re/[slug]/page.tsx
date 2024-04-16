import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import MiniCreatePostClient from '@/components/discussions/placeholders/MiniCreatePostClient'
import { format } from 'date-fns'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import ExtraContent from '@/components/discussions/ExtraContent'
import PostFeed from '@/components/discussions/PostFeed'

interface PageProps {
  params: {
    slug: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params


  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 2,
      },
    },
  })

  if (!subreddit) return notFound()

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  })

  return (
    <div className="ml-4 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <ul className="flex flex-col col-span-2 space-y-6">
          <MiniCreatePostClient subreddit={subreddit} />
          <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
        </ul>
        <div className="overflow-hidden h-fit rounded-lg border border-green-200 order-first md:order-last">
          <div className="px-6 py-4">
            <div className="w-full">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex gap-2 justify-start items-center ">
                      <h1 className="font-semibold text-2xl md:text-3xl">
                        <span className="text-green-500">re/</span>
                        {subreddit.name}
                      </h1>
                      <div className="text-white text-[12px] flex justify-center items-center bg-green-500 rounded-full w-6 h-6 text-sm">
                        {memberCount}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex text-[12px] gap-4">
                      <dt className="text-gray-500">Created at</dt>
                      <dd className="text-gray-700">
                        <time dateTime={subreddit.createdAt.toDateString()}>
                          {format(subreddit.createdAt, 'MMMM d, yyyy')}
                        </time>
                      </dd>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <ExtraContent subreddit={subreddit}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
