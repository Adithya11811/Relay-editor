'use client'
import { getAccountByUserId } from '@/data/user'
import { ImageIcon, Link2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button, buttonVariants } from '../ui/button'
import { Input } from '../ui/input'
import { usePathname, useRouter } from 'next/navigation'
import { UserAvatar } from '../ui/userAvatar'
import { Subreddit } from '@prisma/client'
import SubscribeLeaveToggle from './SubscribeLeaveToggle'
import { db } from '@/lib/db'
import Link from 'next/link'

interface PostProps {
  id: string
  subreddit: Subreddit
}

const MiniCreatePost = ({ id, subreddit }: PostProps) => {
  const [acc, setAcc] = useState()
  const [sub, setSub] = useState()
  const router = useRouter()
  const pathname = usePathname()
  const p = pathname.split('/')
  const slug = p[p.length - 1]
  useEffect(() => {
    const fetchAcc = async () => {
      const resp = await getAccountByUserId(id)
      setAcc(resp)
    }

    fetchAcc()
  }, [id])

  useEffect(() => {
    const fetchSub = async () => {
      try {
        let subscription
        if (!id) {
          subscription = await db.subscription.findFirst({
            where: {
              subreddit: {
                name: slug,
              },
              user: {
                id: id,
              },
            },
          })
        }
        // Do something with 'subscription' if needed
      } catch (error) {
        console.error('Error fetching subscription:', error)
      }
    }

    fetchSub()
  }, [id, slug])

  const isSubscribed = !!sub

  return (
      <li className="overflow-hidden rounded-md bg-gray-800/20 shadow">
        <div className="h-full px-6 py-2 flex justify-between gap-6">
          <div className="relative">
            <UserAvatar
              user={{
                username: acc?.username || null,
                profileImage: acc?.profileImage || null,
              }}
            />

            <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
          </div>
          <Input
            onClick={() => router.push(pathname + '/submit')}
            readOnly
            placeholder="Create post"
          />
          {/* <Button
          onClick={() => router.push(pathname + '/submit')}
          variant="ghost"
        >
          <ImageIcon className="text-zinc-600" />
        </Button> */}
          <Button
            onClick={() => router.push(pathname + '/submit')}
            variant="ghost"
            className="hover:bg-green-500"
          >
            <Link2 className="text-zinc-600 " />
          </Button>
        </div>
      </li>
  )
}

export default MiniCreatePost
