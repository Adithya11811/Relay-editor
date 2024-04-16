'use server'
import { getAccountByUserId } from '@/data/user'
// import { useSession } from 'next-auth/react'
import { db } from '@/lib/db'
import { SubredditValidator } from '@/lib/validitors/subreddit'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, id } = SubredditValidator.parse(body)
    console.log(id)

    const account = await getAccountByUserId(id)

    // check if subreddit already exists
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    })

    if (subredditExists) {
      return new Response('Subreddit already exists', { status: 409 })
    }

    // create subreddit and associate it with the user
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: account?.id
      },
    })

    // creator also has to be subscribed
    await db.subscription.create({
      data: {
        userId: account?.id,
        subredditId: subreddit.id,
      },
    })

    return new Response(subreddit.name)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response(`${error.message}`, {
      status: 500,
    })
  }
}
