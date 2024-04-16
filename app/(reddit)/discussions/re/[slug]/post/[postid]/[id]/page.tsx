// import CommentsSection from '@/components/CommentsSection'
import CommentsSection from '@/components/discussions/CommentsSection'
import EditorOutput from '@/components/discussions/EditorOutput'
import PostVoteServer from '@/components/discussions/post-vote/PostVoteServer'
import { buttonVariants } from '@/components/ui/button'
import { getAccountByUserId } from '@/data/user'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedPost } from '@/types/redis'
import { Account, Post, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
// import { useRouter } from 'next/router'

interface SubRedditPostPageProps {
  params: {
    postid: string,
    id: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const SubRedditPostPage = async ({ params }: SubRedditPostPageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postid}`
  )) as CachedPost

  
  const acc = await getAccountByUserId(params.id!)

  let post: (Post & { votes: Vote[]; author: Account }) | null = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postid,
      },
      include: {
        votes: true,
        author: true,
      },
    })
  }

  if (!post && !cachedPost) return notFound()

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postid,
                },
                include: {
                  votes: true,
                },
              })
            }}
            id={params.id!}
          />
        </Suspense>

        <div className="sm:w-0 w-full flex-1 bg-gray-800 p-4 rounded-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted by{' '}
            <Link
              href={`/${post?.author.username ?? cachedPost.authorUsername}`}
            >
              u/{post?.author.username ?? cachedPost.authorUsername}
            </Link>{' '}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-300">
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />
          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            {/* @ts-expect-error Server Component */}
            <CommentsSection
              postId={post?.id ?? cachedPost.id}
              id={params.id!}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      {/* upvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      {/* score */}
      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  )
}

export default SubRedditPostPage
