import type { Post, Subreddit, Vote, Comment, Account } from '@prisma/client'

export type ExtendedPost = Post & {
  subreddit: Subreddit
  votes: Vote[]
  author: Account
  comments: Comment[]
}
