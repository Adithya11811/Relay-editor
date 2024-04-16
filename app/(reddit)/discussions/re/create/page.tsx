'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthProvider } from '@/hooks/AuthProvider'
import { toast } from '@/hooks/use-toast'
// import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { CreateSubredditPayload } from '@/lib/validitors/subreddit'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
// import { QueryClient, QueryClientProvider, useQuery } from 'react-query'




const Page = () => {
  const router = useRouter()
  const [input, setInput] = useState<string>('')
  // const queryClient = new QueryClient()
  // const { loginToast } = useCustomToasts()
  const id = AuthProvider()
  

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
        id : id!
      }

      const { data } = await axios.post('/api/subreddit', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Subreddit already exists.',
            description: 'Please choose a different name.',
            variant: 'destructive',
          })
        }

        if (err.response?.status === 422) {
          return toast({
            title: 'Invalid subreddit name.',
            description: 'Please choose a name between 3 and 21 letters.',
            variant: 'destructive',
          })
        }

        if (err.response?.status === 401) {
          redirect('/')
        }
      }

      toast({
        title: 'There was an error.',
        description: 'Could not create subreddit.',
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      router.push(`discussions/re/${data}`)
    },
  })

  return (
      <div className="container flex items-center h-full max-w-3xl mx-auto">
        <div className="relative bg-gray-800/40 w-full h-fit p-4 rounded-lg space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Create a Community</h1>
          </div>

          <hr className="bg-green-500 h-px" />

          <div>
            <p className="text-lg font-medium">Name</p>
            <p className="text-xs text-gray-500 pb-2">
              Community names including capitalization cannot be changed.
            </p>
            <div className="relative">
              <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
                re/
              </p>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex justify-end gap-8">
            <Button
              disabled={isLoading}
              variant="runner"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              disabled={input.length === 0}
              onClick={() => createCommunity()}
            >
              Create Community
            </Button>
          </div>
        </div>
      </div>
  )
}

export default Page
