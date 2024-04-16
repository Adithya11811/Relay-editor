import { getAccountByUserId } from '@/data/user'
import { db } from '@/lib/db'
import { CommentValidator } from '@/lib/validitors/comments'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { postId, text, replyToId,id } = CommentValidator.parse(body)

    // const session = await getAuthSession()
    const acc = await getAccountByUserId(id)

    if (!acc?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    // if no existing vote, create a new vote
    await db.comment.create({
      data: {
        text,
        postId,
        authorId: acc?.id,
        replyToId,
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
