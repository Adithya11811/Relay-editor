import { db } from '@/lib/db'
import { SubredditSubscriptionValidator } from '@/lib/validitors/subreddit'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { subredditId, accid } = SubredditSubscriptionValidator.parse(body)

    // check if user has already subscribed or not
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: accid,
      },
    })

    if (!subscriptionExists) {
      return new Response(
        "You've not been subscribed to this subreddit, yet.",
        {
          status: 400,
        }
      )
    }

    // create subreddit and associate it with the user
    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: accid,
        },
      },
    })

    return new Response(subredditId)
  } catch (error) {
    error
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not unsubscribe from subreddit at this time. Please try later',
      { status: 500 }
    )
  }
}
