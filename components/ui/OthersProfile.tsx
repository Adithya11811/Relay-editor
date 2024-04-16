'use client'
import Header from './BHeader'
import Bsidebar from './Bsidebar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getAccountByUserId } from '@/data/user'
import { redirect, useRouter } from 'next/navigation'
import { HoverEffect } from './hoverCard'
import { Dialog, DialogContent, DialogTrigger } from './dialog'
import { FaLinkedinIn } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'
import LanguagesDropdown from '../project/languageDropdown'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from './input'
import axios from 'axios'
import { AuthProvider } from '@/hooks/AuthProvider'
import { signOut } from '@/auth'

interface Others_Profile_props {
  account: account
}

interface account {
  access_token: string
  banner: string
  created_at: Date
  expires_at: number
  githubLink: string
  id: string
  id_token: string | null
  linkedinLink: string
  profileImage: string
  provider: string
  providerAccountId: string
  refresh_token: string
  scope: string | null
  session_state: string | null
  token_type: string | null
  type: string
  updated_at: Date
  userId: string
  username: string
  friends: string[]
  follow: string[]
}

const Others_Profile: React.FC<Others_Profile_props> = ({ account }) => {
  const id = AuthProvider()
  const [flag, setFlag] = useState(false)
  const addFriend = () => {
    axios
      .post('/api/addFriend', { account, id })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
        if (error.response.data.error === 'Not logged In') {
          signOut()
        }
      })
  }

  useEffect(() => {
    // Check if the id is present in the array
    if (id !== undefined) {
      const checkFriend = account?.follow || []
      const isIdPresent = checkFriend.includes(id)
      setFlag(isIdPresent)
    }
  }, [id, account])

  const [open, setOpen] = useState<boolean | undefined>(false)
  return (
    <div className="w-full  bg-grid-white/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black  [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black)]"></div>
      <div className="relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-green-600">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid items-start justify-center gap-4">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <div className="flex flex-col justify-center items-center gap-2 md:gap-4">
                <Image
                  alt="Avatar"
                  className="rounded-full"
                  height="150"
                  src={account?.profileImage || '/placeholder.svg'}
                  style={{
                    aspectRatio: '150/150',
                    objectFit: 'cover',
                  }}
                  width="150"
                />
                <div className="grid items-center gap-1 text-center md:flex md:gap-1 md:text-left">
                  <h1 className="text-xl font-medium">@{account?.username}</h1>
                </div>
                <div className="flex gap-5 items-center">
                  <div className="text-xl ml-3 text-gray-500 dark:text-gray-400 focus:text-white">
                    <Link href={account?.linkedinLink || '#'}>
                      <FaLinkedinIn size={30} />
                    </Link>
                  </div>
                  <div className="text-xl text-gray-500 dark:text-gray-400 focus:text-white">
                    <Link href={account?.githubLink || '#'}>
                      <FaGithub size={30} />
                    </Link>
                  </div>
                </div>
                {flag ? (
                  <Button onClick={addFriend}>
                    Add friend
                  </Button>
                ) : (
                  <Button >
                    Already a friend
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="h-[25vh] flex flex-col justify-center items-center max-w-5xl mx-auto px-8"></div>
        </main>
      </div>
    </div>
  )
}
export default Others_Profile
