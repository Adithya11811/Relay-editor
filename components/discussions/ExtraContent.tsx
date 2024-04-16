'use client';
import { getAccountByUserId } from '@/data/user'
import { AuthProvider } from '@/hooks/AuthProvider'
import { Subreddit } from '@prisma/client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import SubscribeLeaveToggle from './SubscribeLeaveToggle'
import { Link } from 'lucide-react'
import { buttonVariants } from '../ui/button'
import { db } from '@/lib/db';
interface ContentProps {
  subreddit: Subreddit
}

const ExtraContent = ({ subreddit }: ContentProps) => {
  const id = AuthProvider()
  const pathname = usePathname()
  const p = pathname.split('/')
  const slug = p[p.length - 1]
  const [acc, setAcc] = useState()
  const [sub, setSub] = useState()
  useEffect(() => {
    const fetchAcc = async () => {
      const resp = await getAccountByUserId(id!)
      setAcc(resp)
    }

    fetchAcc()
  }, [id])
  useEffect(() => {
    const fetchSub = async () => {
      try {
        let subscription
        if (!acc?.id) {
          subscription = await db.subscription.findFirst({
            where: {
              subreddit: {
                name: slug,
              },
              user: {
                id: acc?.id,
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
  }, [acc, slug])

  const isSubscribed = !!sub

  return (
    <div>
      {' '}
      {subreddit.creatorId === acc?.id ? (
        <div className="flex justify-between text-[12px] gap-x-4">
          <dt className="text-gray-500">You created this community</dt>
        </div>
      ) : null}
      <div className="">
        {subreddit.creatorId !== acc?.id ? (
          <SubscribeLeaveToggle
            isSubscribed={isSubscribed}
            subredditId={subreddit.id}
            subredditName={subreddit.name}
            accid={acc?.id}
          />
        ) : null}
      </div>
    </div>
  )
}
export default ExtraContent
