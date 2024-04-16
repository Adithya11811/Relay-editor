// import { getAuthSession } from '@/lib/auth'
import { getAccountByUserId } from '@/data/user'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
  const url = new URL(req.url)
const id = url.searchParams.get('id')
const acc = await getAccountByUserId(id)

  let followedCommunitiesIds: string[] = []

  if (acc?.id) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: acc?.id,
      },
      include: {
        subreddit: true,
      },
    })

    followedCommunitiesIds = followedCommunities.map((sub) => sub.subreddit.id)
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      })

    let whereClause = {}

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      }
    } else if (acc?.id) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response('Could not fetch posts', { status: 500 })
  }
}
