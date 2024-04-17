'use client'
import axios from 'axios'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FaGithub } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import { useState, useTransition, useRef } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CreateAccSchema } from '@/schema'
import 'react-image-crop/dist/ReactCrop.css'
import type { Crop, PixelCrop } from 'react-image-crop'
import ReactCrop from 'react-image-crop'
import { useUploadThing } from '@/utils/uploadthing'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
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
interface UpdateACCProps{
    acc:account
}

export const UpdateACC = ({acc}:UpdateACCProps) => {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const router = useRouter()
  const [imgSrc, setImgSrc] = useState('')
  const [open, setOpen] = useState<boolean | undefined>(false)

  const [imgUrl, setimgUrl] = useState<string>('')
  const { isUploading, startUpload } = useUploadThing('profilePicture', {
    onClientUploadComplete(res) {
      console.log('Client upload complete', res)
      const fileUrl = res?.[0]?.url
      setimgUrl(fileUrl)
    },
  })

  const [crop, setCrop] = useState<Crop>()
  const [storedCrop, setStoredCrop] = useState<PixelCrop>()
  const imageRef = useRef<HTMLImageElement>(null)

  async function uploadImage() {
    if (!imageRef.current || !storedCrop) return
    const canvas = cropImage(imageRef.current, storedCrop)

    const blob = await new Promise<Blob>((res, rej) => {
      canvas.toBlob((blob) => {
        blob ? res(blob) : rej('No blob')
      })
    })
    const file = new File([blob], 'cropped.png', { type: 'image/png' })
    setOpen(false)

    await startUpload([file])
  }

  const form = useForm<z.infer<typeof CreateAccSchema>>({
    resolver: zodResolver(CreateAccSchema),
    defaultValues: {
      accountId: '',
      username: '',
      githubLink: '',
      linkedinLink: '',
      profileImage: '',
      banner: '',
    },
  })

  const id = searchParams.get('user')
  const onSubmit = (values: z.infer<typeof CreateAccSchema>) => {
    setError('')
    setSuccess('')
    values['profileImage'] = imgUrl
    values['accountId'] = id!
    console.log(values)
    startTransition(() => {
      axios
        .post('/api/auth/updateeacc', values)
        .then((data) => {
          console.log(data)
          setSuccess(data.data.success)
          router.push('/settings')
        })
        .catch((error) => {
          setError(error.response.data.error)
        })
    })
  }
  return (
    <CardWrapper
      headerLabel="Update Profile"
      backButtonHref=""
      backButtonLabel=""
      bg="dark"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="space-y-4">
            {/*this is for uploadthing */}
            <Dialog open={open} onOpenChange={setOpen}>
              <div className="flex flex-col just-fy-center items-center">
                <DialogTrigger asChild>
                  <Avatar>
                    {imgUrl && <AvatarImage src={imgUrl} />}
                    {!imgUrl && <AvatarImage src={acc.profileImage} />}
                    <AvatarFallback className="bg-slate-700 scale-3 text-white font-bold text-xl">
                      AV
                    </AvatarFallback>
                  </Avatar>
                </DialogTrigger>
              </div>
              <DialogContent className="w-50 bg-gray-800/60 flex flex-col justify-center items-center">
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-center items-center">
                      <FormControl>
                        <Input
                          {...field}
                          className="w-60"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) return

                            const reader = new FileReader()
                            reader.addEventListener('load', () => {
                              setImgSrc(reader.result?.toString() ?? '')
                            })
                            reader.readAsDataURL(file)
                          }}
                        />
                      </FormControl>
                      {imgSrc ? (
                        <ReactCrop
                          aspect={1}
                          crop={crop}
                          onChange={(_, percent) => setCrop(percent)}
                          onComplete={(c) => setStoredCrop(c)}
                          className="flex flex-col justify-center items-center"
                        >
                          <Image
                            ref={imageRef}
                            src={imgSrc}
                            alt="Crop me"
                            height={400}
                            width={400}
                          />
                        </ReactCrop>
                      ) : (
                        <div className="flex flex-col justify-center items-center">
                          No image selected
                        </div>
                      )}

                      <Button
                        onClick={() => void uploadImage()}
                        disabled={isUploading}
                        className="flex flex-col justify-center items-center"
                      >
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </FormItem>
                  )}
                />
              </DialogContent>
            </Dialog>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      <span className="text-slate-500">User Name</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="John Doe"
                        type="text"
                        // onChange={handleChange}
                        value={acc.username}
                        className="text-slate-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="githubLink"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      <div className="flex gap-2 text-slate-500">
                        <FaGithub /> Github Link
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder=""
                        type="text"
                        value={acc.githubLink}
                        className="text-slate-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="linkedinLink"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      <div className="flex gap-2 text-slate-500">
                        <FaLinkedin /> LinkedIn Link
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder=""
                        type="text"
                        value={acc.linkedinLink}
                        className="text-slate-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Update Account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
export default UpdateACC

function cropImage(image: HTMLImageElement, crop: PixelCrop) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2d context')

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const pixelRatio = window.devicePixelRatio

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2

  ctx.save()

  ctx.translate(-cropX, -cropY)
  ctx.translate(centerX, centerY)
  ctx.translate(-centerX, -centerY)
  ctx.drawImage(
    image,
    40,
    40,
    image.naturalWidth,
    image.naturalHeight,
    40,
    40,
    image.naturalWidth,
    image.naturalHeight
  )

  ctx.restore()

  return canvas
}
