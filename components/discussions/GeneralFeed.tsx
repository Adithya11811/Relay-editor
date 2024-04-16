import { db } from '@/lib/db'
import PostFeed from './PostFeed'

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: 2, // 4 to demonstrate infinite scroll, should be higher in production
  })

  return <PostFeed initialPosts={posts} />
}

export default GeneralFeed
