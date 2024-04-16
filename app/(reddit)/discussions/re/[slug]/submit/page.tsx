// import { Editor } from '@/components/Editor'
import { Editor } from '@/components/discussions/Editor'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
    },
  })

  if (!subreddit) return notFound()

  return (
    <div className="m-5 flex flex-col items-start gap-4">
      {/* heading */}
      <div className="pb-1">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-green-500">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-700">
            in re/{params.slug}
          </p>
        </div>
      </div>

      {/* form */}
      <Editor subredditId={subreddit.id} />

      <div className="w-full flex justify-start">
        <Button type="submit" className="w-56" form="subreddit-post-form">
          Post
        </Button>
      </div>
    </div>
  )
}

export default page
