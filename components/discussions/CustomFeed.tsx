'use client';
import { useEffect, useState } from 'react'
import { db } from '@/lib/db'
import PostFeed from './PostFeed'
import { notFound } from 'next/navigation'
import { AuthProvider } from '@/hooks/AuthProvider'
import { getAccountByUserId, getFollowedCommunties, getpostsData } from '@/data/user'

const CustomFeed = () => {
  const [posts, setPosts] = useState([])
  const id = AuthProvider()

  useEffect(() => {
    const fetchData = async () => {
      const acc = await getAccountByUserId(id!)

      const followedCommunities = await getFollowedCommunties(id!)

        const postsData = await getpostsData(followedCommunities)

      setPosts(postsData)
    }

    fetchData()
  }, [id])

  return <PostFeed initialPosts={posts} />
}

export default CustomFeed
