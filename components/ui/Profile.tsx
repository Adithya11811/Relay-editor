import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card'
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'
import { useEffect, useState } from 'react'
import { BellIcon, SettingsIcon } from 'lucide-react'
import { RiUserFollowFill } from 'react-icons/ri'
import { GrProjects } from 'react-icons/gr'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import { useCurrentUser } from '@/hooks/use-current-user'
import { LogoutButton } from '../auth/logout-button'
import { getAccountByUserId } from '@/data/user'
import { AuthProvider } from '@/hooks/AuthProvider'
import { redirect } from 'next/navigation'
import { HoverEffect } from './hoverCard'
import { Dialog, DialogContent, DialogTrigger } from './dialog'
import { FaPlus } from 'react-icons/fa'

interface ProfileProps {
  id: string
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
}

const Profile: React.FC<ProfileProps> = ({ id }) => {
  const [account, setAccount] = useState<unknown>(null)
  const [open, setOpen] = useState<boolean | undefined>(false)

   useEffect(() => {
     const fetchAccount = async () => {
       try {
         const response = await getAccountByUserId(id)
         setAccount(response)
       } catch (error) {
         console.error('Error fetching account:', error)
       }
     }

     fetchAccount()
   }, [id])
  console.log(account)
  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <span className="">Relay</span>
            </Link>
            <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
              <BellIcon />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                Home
              </Link>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                  <FaPlus />
                  Create Project
                </DialogTrigger>
                <DialogContent className='w-50 flex flex-col justify-center items-center'>
                  Hello
                </DialogContent>
              </Dialog>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                <GrProjects />
                Projects
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                <RiUserFollowFill />
                Follow
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
          {/* <div className="mt-auto p-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link
            className="lg:hidden flex items-center gap-2 font-semibold"
            href="#"
          >
            <span className="">Relay Editor</span>
          </Link>
          <nav className="hidden lg:flex lg:flex-1 lg:gap-4 lg:justify-center lg:text-sm">
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              Home
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
              href="#"
            >
              My Profile
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="#"
            >
              Settings
            </Link>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                id="user-menu"
                size="icon"
                variant="ghost"
              >
                <Image
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  src={account?.profileImage || '/placeholder.svg'}
                  style={{
                    aspectRatio: '32/32',
                    objectFit: 'cover',
                  }}
                  width="32"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogoutButton>Logout</LogoutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
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
                  <h1 className="text-lg font-bold">{account?.username}</h1>
                  {/* <Button className="rounded-full" size="icon">
                  <span className="sr-only">Edit</span>
                </Button> */}
                </div>
              </div>
              <div className="flex flex-col mb-12 ml-4 gap-5 items-center">
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  <Link href="#">
                    <LinkedInLogoIcon />
                  </Link>
                </p>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  <Link href="#">
                    <GitHubLogoIcon />
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-center items-center max-w-5xl mx-auto px-8">
            <HoverEffect items={projects} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile

export const projects = [
  {
    title: 'Start Relay',
    description:
      'A technology company that builds economic infrastructure for the internet.',
  },
  {
    title: 'Import from Github',
    description:
      'A streaming service that offers a wide variety of award-winning',
  },
]
