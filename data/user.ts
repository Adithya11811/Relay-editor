'use server'
import { db } from '@/lib/db'
import { Subreddit } from '@prisma/client'

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } })

    return user
  } catch {
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } })

    return user
  } catch {
    return null
  }
}

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: { userId: userId },
    })
    return account
  } catch (e) {
    return e
  }
}

export const getProjetByAccountId = async (Id: string) => {
  try {
    const account = await db.project.findMany({
      where: { creator: Id },
      orderBy: { updated_at: 'desc' },
    })
    return account
  } catch (e) {
    return e
  }
}

export const getAccountByAccountName = async (name: string) => {
  try {
    const account = await db.account.findFirst({
      where: {
        username: name,
      },
    })
    return account
  } catch (e) {
    return e
  }
}

export const getAccountById = async (fid: string) => {
  try {
    const account = await db.account.findFirst({
      where: {
        id: fid,
      },
    })
    return account
  } catch (e) {
    return e
  }
}

export const getFollowedCommunties = async (id: string) => {
  try {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: id,
      },
      include: {
        subreddit: true,
      },
    })
    return followedCommunities
  } catch (e) {
    return e
  }
}

export const getpostsData = async (followedCommunities: any[]) => {
  try {
    const postsData = await db.post.findMany({
      where: {
        subreddit: {
          name: {
            in: followedCommunities.map((sub) => sub.subreddit.name),
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        votes: true,
        author: true,
        comments: true,
        subreddit: true,
      },
      take: 2,
    })

    return followedCommunities
  } catch (e) {
    return e
  }
}
