'use client';
import Link from 'next/link'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui//button'
import { FaPlus } from 'react-icons/fa'
import LanguagesDropdown from '../project/languageDropdown'
import { Form } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Input } from './input'
import { useTransition } from 'react'
import { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { languageOptions } from '@/constants/languageOptions'
import { SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { ProjectSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'


export const SideBar = ({ ...props }) => {
    const [open, setOpen] = useState<boolean | undefined>(false)
    const [language, setLanguage] = useState(languageOptions[0])
    const router = useRouter()
    const files = props.files
    const project = props.project
    const directories = props.directories
    // console.log(files)
    console.log(project?.projectName)
    // console.log(directories)
    // const onSelectChange = (
    //   sl: SetStateAction<{
    //     id: number
    //     name: string
    //     label: string
    //     value: string
    //   }>
    // ) => {
    //   console.log('selected Option...', sl)
    //   setLanguage(sl)
    // }

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

    const onSubmit = (values: z.infer<typeof ProjectSchema>) => {
      values.lang = language.value
      values.accountId = props.accountid
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

      // axios
      //   .post('/api/project', values)
      //   .then((response) => {
      //     console.log(response)
      //     const projectId = response.data.data.id
      //     router.push(`/editor?projectId=${projectId}`)
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })
    }
  return (
    <div className="hover:border hover:border-green-600 p-2 bg-gray-800/40 text-md w-72">
      <div className="flex mx-2 flex-col justify-start items-start">
        <div className='text-white'>{project?.projectName}</div>
        {/* <div>
          {' '}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex items-center gap-3 rounded-lg py-2 transition-all  text-gray-400 hover:text-gray-50">
              <FaPlus />
            </DialogTrigger>
            <DialogContent className="w-50 flex flex-col justify-center items-center">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>
                  <Button disabled={isPending} type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div> */}
        
      </div>
    </div>
  )
}
