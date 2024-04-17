'use client';
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CgProfile } from 'react-icons/cg'
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'
import { useTransition } from 'react'
import { useEffect, useState } from 'react'
import { BellIcon, Router, SettingsIcon } from 'lucide-react'
import { RiDiscussFill, RiUserFollowFill } from 'react-icons/ri'
import { GrProjects } from 'react-icons/gr'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import { useCurrentUser } from '@/hooks/use-current-user'
import { LogoutButton } from '../auth/logout-button'
import { getAccountByUserId } from '@/data/user'
import { AuthProvider } from '@/hooks/AuthProvider'
import { redirect, useRouter } from 'next/navigation'
import { HoverEffect } from './hoverCard'
import { Dialog, DialogContent, DialogTrigger } from './dialog'
import { FaPlus } from 'react-icons/fa'
import { IoIosNotifications } from 'react-icons/io'
import { FaLinkedinIn } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'
import LanguagesDropdown from '../project/languageDropdown'
import { languageOptions } from '@/constants/languageOptions'
import { SetStateAction } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from './input'
import { useForm } from 'react-hook-form'
import { ProjectSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import Header from './BHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card'
import { AlertDialog, AlertDialogContent, AlertDialogCancel, AlertDialogAction } from './alert-dialog';
import { TbFriends } from 'react-icons/tb';

interface ProfileProps {
  id: string
  proj : boolean
  username?: string
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

const Bsidebar: React.FC<ProfileProps> = ({ id, proj, username}) => {
  const [account, setAccount] = useState<unknown>(null)
  const [open, setOpen] = useState<boolean | undefined>(false)
  const [language, setLanguage] = useState(languageOptions[0])
  const [invitations, setInvitations] = useState<any[]>([]);
  const [invitedProjects, setInvitedProjects] = useState<any[]>([]);
  const [sender,setSender] = useState<any[]>([]);
  const [showInvitationDialog, setShowInvitationDialog] = useState<boolean>(false);
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null);

  const router = useRouter()
  const onSelectChange = (
    sl: SetStateAction<{
      id: number
      name: string
      label: string
      value: string
    }>
  ) => {
    console.log('selected Option...', sl)
    setLanguage(sl)
  }
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
  const [isPending, startTransition] = useTransition()
  // const [error, setError] = useState<string | undefined>('')
  // const [success, setSuccess] = useState<string | undefined>('')
  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      lang: '',
      pname: '',
      pdescp: '',
      extension: '',
      accountId: '',
    },
  })
  let invicnt;
  if(invitations === undefined){
    invicnt = 0;
  }else{
    invicnt = invitations.length
  }
  const onSubmit = (values: z.infer<typeof ProjectSchema>) => {
    values.lang = language.value
    values.accountId = account?.id
    console.log(values)
    switch (values.lang) {
      case 'python':
        values.extension = 'py'
        break
      case 'cpp':
        values.extension = 'cpp'
        break
      case 'c':
        values.extension = 'c'
        break
      case 'javascript':
        values.extension = 'js'
        break
      case 'typescript':
        values.extension = 'ts'
        break
    }

    axios
      .post('/api/project', values)
      .then((response) => {
        console.log(response)
        const projectId = response.data.project.projectId
        router.push(`/editor?projectId=${projectId}`)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    axios.post("/api/getInvite", { account})
      .then((response) => {
        setInvitations(response.data.invitations);
        setInvitedProjects(response.data.invitedProjects)
        setSender(response.data.senders)
      }).catch((error) => {
        console.log(error)
      })
  })


  
  const handleAcceptInvitation = (id : string)=>{
    axios.post("/api/acceptInvitation", { id })
      .then((response) => {
        if(response.data.projectId){
          router.push(`/editor?projectId=${response.data.projectId}`)
        }
      }).catch((error) => {
          console.log(error)
      })
  }
    const handleDeclineInvitation = (id :string)=>{
    axios.post("/api/rejectInvitation", { id })
      .then((response) => {
        
      }).catch((error) => {
          console.log(error)
      })
  }
  
  return (
    <div className="hidden  lg:block bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-[60px] items-center  px-6">
          <Link
            className="flex items-center gap-2 font-semibold"
            href="/profile"
          >
            <span className="text-xl">Relay</span>
          </Link>
          {!proj && (
            <div>
              <Button
                className="ml-auto h-9 w-9 relative z-1 left-20 rounded-full"
                size="icon"
                variant="runner"
                onClick={() => setShowInvitationDialog(true)}
              >
                <div className="relative left-1">
                  <IoIosNotifications size={20} />
                </div>
                <span className="sr-only">Toggle notifications</span>
                <div className="w-2 h-2 flex justify-center items-center bottom-[6px] z-2 relative text-white  text-[10px] rounded-full">
                  {invicnt > 9 ? '9+' : invicnt}
                </div>
              </Button>
              {/* <div className="w-2 h-2 flex justify-center items-center right-44 z-10 relative text-white  text-[10px] rounded-full">
                {invicnt > 9 ? '9+' : invicnt}
              </div> */}
            </div>
          )}
          {invicnt > 0 && showInvitationDialog && (
            <Dialog open={true} onOpenChange={setShowInvitationDialog}>
              <DialogContent className="w-fit flex flex-col justify-center items-center">
                <h2 className="text-2xl font-semibold mb-4">Invitations</h2>
                {invitations.map((invitation, index) => (
                  <div key={index} className="my-2 text-black">
                    <p>
                      You are invited to {invitedProjects[index]} by{' '}
                      {sender[index]}
                    </p>
                    <div className="flex flex-row justify-center items-center space-x-4">
                      <Button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleDeclineInvitation(invitation.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="flex-1 overflow-clip py-2">
          {!proj && (
            <nav className="grid items-start mt-10 pl-6 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg  py-2  transition-all  text-gray-400 hover:text-gray-50"
                href="/profile"
              >
                <CgProfile />
                Home
              </Link>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="flex items-center gap-3 rounded-lg py-2 transition-all  text-gray-400 hover:text-gray-50">
                  <FaPlus />
                  Create Project
                </DialogTrigger>
                <DialogContent className="w-50 flex flex-col justify-center items-center text-green-500 bg-gray-800">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-2 "
                    >
                      <LanguagesDropdown onSelectChange={onSelectChange} />
                      <div className=" space-y-6 m-2">
                        <FormField
                          control={form.control}
                          name="pname"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>Project Name:</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder=""
                                    type="text"
                                    className="text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )
                          }}
                        />
                        <FormField
                          control={form.control}
                          name="pdescp"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>Project description:</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="Interactive project"
                                    type="text"
                                    className="text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )
                          }}
                        />
                      </div>
                      <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                      >
                        Submit
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Link
                className="flex items-center gap-3 rounded-lg  py-2 transition-all text-gray-400 hover:text-gray-50"
                href="/profile/projects"
              >
                <GrProjects />
                Projects
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg py-2 transition-all text-gray-400 hover:text-gray-50"
                href="/profile/follow"
              >
                <RiUserFollowFill />
                Follow
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg py-2 transition-all text-gray-400 hover:text-gray-50"
                href="/profile/friends"
              >
                <TbFriends />
                Friends
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg  py-2 transition-all text-gray-400 hover:text-gray-50"
                href="/discussions"
              >
                <RiDiscussFill className="h-4 w-4" />
                Discussions
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg  py-2 transition-all text-gray-400 hover:text-gray-50"
                href={`/profile/settings/${id}`}
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          )}
          {proj && (
            <nav className="grid items-start mt-10 pl-6 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg  py-2  transition-all  text-gray-400 hover:text-gray-50"
                href={`/${username}`}
              >
                <CgProfile size={16} />
                Profile
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg  py-2 transition-all text-gray-400 hover:text-gray-50"
                href={`/${username}/projects`}
              >
                <GrProjects />
                Projects
              </Link>

              <Link
                className="flex items-center gap-3 rounded-lg py-2 transition-all text-gray-400 hover:text-gray-50"
                href={`/${username}/follow`}
              >
                <RiUserFollowFill />
                Follow
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg py-2 transition-all text-gray-400 hover:text-gray-50"
                href={`/${username}/friends`}
              >
                <TbFriends />
                Friends
              </Link>
            </nav>
          )}
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
  )
}
export default Bsidebar
