'use client'
import axios from 'axios'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FaGithub } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'
import { ChangeEvent } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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
import { useSearchParams,useRouter } from "next/navigation";



export const CreateACC = () => {
  const searchParams = useSearchParams();  
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const router = useRouter();
  // const [fullname, setfullname] = useState<string | undefined>('')
  // const [fallbackname, setfallbackname] = useState<string | undefined>('')
  const [imgSrc, setImgSrc] = useState('')
  const [open, setOpen] = useState<boolean | undefined>(false)

  const [imgUrl, setimgUrl] = useState<string>('')
  const { isUploading, startUpload } = useUploadThing('profilePicture', {
    onClientUploadComplete(res) {
      console.log('Client upload complete', res)
      const fileUrl = res?.[0]?.url
      //if (fileUrl) window.location.href = fileUrl
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
      accountId:'',
      username: '',
      githubLink: '',
      linkedinLink: '',
      profileImage: '',
      banner: '',
    },
  })
  const id = searchParams.get("user");
  console.log(id)
  const onSubmit = (values: z.infer<typeof CreateAccSchema>) => {
    setError('')
    setSuccess('')
    values['profileImage']=imgUrl;
    values['accountId'] = id!;
    console.log(values)
    startTransition(() => {
      axios
        .post('/api/auth/createacc', values)
        .then((data) => {
          console.log(data)
          setSuccess(data.data.success)
          router.push("/settings")
        })
        .catch((error) => {
          setError(error.response.data.error)
        })
    })
  }
  return (
    <CardWrapper
      headerLabel="Create a Profile"
      backButtonHref=""
      backButtonLabel=""
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="space-y-4">
            {/*this is for uploadthing */}
            <Popover open={open} onOpenChange={setOpen}>
              <div className="flex flex-col just-fy-center items-center">
                <PopoverTrigger asChild>
                  <Avatar>
                    {imgUrl && <AvatarImage src={imgUrl} />}
                    <AvatarFallback className="bg-slate-700 scale-3 text-white font-bold text-xl">
                      AV
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
              </div>
              <PopoverContent side="right" sideOffset={40}>
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
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
                        <p>No image selected</p>
                      )}

                      <button
                        onClick={() => void uploadImage()}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </button>
                    </FormItem>
                  )}
                />
              </PopoverContent>
            </Popover>
            {/* 
            <FormField
              control={form.control}
              name="linkedinLink"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      <div className="flex gap-2">
                        <FaLinkedin /> LinkedIn Link
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder=""
                        type="file"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            /> */}
            {/*--------------*/}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="John Doe"
                        type="text"
                        // onChange={handleChange}
                        // value={fullname}
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
                      <div className="flex gap-2">
                        <FaGithub /> Github Link
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder=""
                        type="text"
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
                      <div className="flex gap-2">
                        <FaLinkedin /> LinkedIn Link
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder=""
                        type="text"
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
            Create Account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
export default CreateACC

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
