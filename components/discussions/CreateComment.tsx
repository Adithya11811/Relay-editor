'use client'

import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { CommentRequest } from '@/lib/validitors/comments'

// import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { redirect, useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AuthProvider } from '@/hooks/AuthProvider'

interface CreateCommentProps {
  postId: string
  replyToId?: string
}

interface profanity { 
  isProfanity: boolean
  score: Number
  FlaggedFor?: Array<string>
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = useState<string>('')
  const router = useRouter()
//   const { loginToast } = useCustomToasts()
const id = AuthProvider()
if(id === undefined){
  redirect('/')
}

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, replyToId, id }
      // try {
      const res = await fetch('https://vector.profanity.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const profanedata = await res.json()
      console.log(profanedata.isProfanity)
      console.log(text) // Log the response data

      if (profanedata.isProfanity === true) {
        return toast({
          title: 'Profane speech detected.',
          description: 'Kindly restrict yourself from using bad words',
          variant: 'destructive',
        })
      }

      const { data } = await axios.patch(
        `/api/subreddit/post/Comment/`,
        payload
      )
      return data
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return redirect('/')
        }
      }

      return toast({
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
    },
  })

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
        />

        <div className="mt-2 flex justify-end">
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => comment({ postId, text: input, replyToId, id })}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment
