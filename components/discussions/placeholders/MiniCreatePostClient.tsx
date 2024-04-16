'use client';

import { AuthProvider } from "@/hooks/AuthProvider";
import MiniCreatePost from "../MiniCreatePost";
import { Subreddit } from "@prisma/client";

interface MiniProps{
  subreddit : Subreddit
}

export default function MiniCreatePostClient({subreddit}:MiniProps) {
  const id = AuthProvider()
  return <MiniCreatePost subreddit={subreddit} id={id!} />
}