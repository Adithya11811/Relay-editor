'use client'

import { formatTimeToNow } from '@/lib/utils'
import { Account, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { FC, useRef } from 'react'
import { Prisma } from '@prisma/client'
import EditorOutput from './EditorOutput'
import PostVoteClient from './post-vote/PostVoteClient'
import { AuthProvider } from '@/hooks/AuthProvider'

type PartialVote = Pick<Vote, 'type'>

type Post = {
  id: string
  title: string
  content: Prisma.JsonValue
  createdAt: Date
  updatedAt: Date
  authorId: string
  subredditId: string
}

interface PostProps {
  post: Post & {
    author: Account
    votes: Vote[]
  }
  votesAmt: number
  subredditName: string
  currentVote?: PartialVote
  commentAmt: number
}

const Post: FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subredditName,
  commentAmt,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null)
  const id = AuthProvider()

  return (
    <div className="rounded-md bg-gray-800 shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={_votesAmt}
          initialVote={_currentVote?.type}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  className="underline text-slate-300 text-sm underline-offset-2"
                  href={`discussions/re/${subredditName}`}
                >
                  re/{subredditName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>
              Posted by{' '}
              <Link href={`/${post.author.username}`}>
                u/{post.author.username}
              </Link>
            </span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a
            href={`/discussions/re/${subredditName}/post/${post.id}/${id!}`}
          >
            <h1 className="text-lg font-semibold py-2 leading-6 text-white">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight! >= 160 ? (
              // blur bottom if content is too long
              <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-gray-600/40 to-gray-600/60 blur-sm backdrop-blur-sm"></div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/40 z-20 text-sm px-4 py-4 sm:px-6">
        <Link
          href={`/discussions/re/${subredditName}/post/${post.id}/${id!}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </Link>
      </div>
    </div>
  )
}
export default Post
