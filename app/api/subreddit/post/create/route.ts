import { getAccountByUserId } from '@/data/user'
import { db } from '@/lib/db'
import { BackPostValidator } from '@/lib/validitors/post'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { title, content, subredditId, id } = BackPostValidator.parse(body)

    const account  = await getAccountByUserId(id);
    // console.log(account?.id)
    // verify user is subscribed to passed subreddit id
    const subscription = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: account?.id,
      },
    })

    if (!subscription) {
      return new Response('Subscribe to post', { status: 403 })
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: account?.id,
        subredditId,
      },
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not post to subreddit at this time. Please try later',
      { status: 500 }
    )
  }
}
