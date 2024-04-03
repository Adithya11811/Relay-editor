import { cn } from '@/lib/utils'
import { Dialog, DialogTrigger, DialogContent } from './dialog'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { DropdownMenu } from './dropdown-menu'
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
import { Button } from './button'
import { Input } from './input'
import { useForm } from 'react-hook-form'
import { ProjectSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string
    description: string
    
  }[]
  className?: string
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [open, setOpen] = useState<boolean | undefined>(false)
  // const [flag, setFLag] = useState<boolean | undefined>(false)
  const [language, setLanguage] = useState(languageOptions[0])
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

      const [isPending, startTransition] = useTransition()
      const [error, setError] = useState<string | undefined>('')
      const [success, setSuccess] = useState<string | undefined>('')
      const form = useForm<z.infer<typeof ProjectSchema>>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: {
          lang: '',
          pname: '',
          pdescp: '',
        },
      })
      const onSubmit = (values: z.infer<typeof ProjectSchema>) => {
        values.lang = language.name;
        console.log(values)
      }

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:w-2/3',
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?.title}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-all hover:text-gray-900"> */}
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-slate-700 text-green-600 block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <HoverCard>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </HoverCard>
          {/* </DialogTrigger> */}
          {/* <DialogContent className="w-50 flex flex-col justify-center items-center"> */}
          {/* <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >

                  <div className="space-y-4">
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
              </Form> */}
          {/* </DialogContent> */}
          {/* </Dialog> */}
        </div>
      ))}
    </div>
  )
}

export const HoverCard = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl h-full w-full  overflow-hidden bg-gray-800/40 border  border-white/[0.2] relative z-20',
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4 hover:text-black">{children}</div>
      </div>
    </div>
  )
}
export const CardTitle = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <h4 className={cn('text-zinc-100 font-bold tracking-tight', className)}>
      {children}
    </h4>
  )
}
export const CardDescription = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <p
      className={cn(
        'mt-2 text-zinc-400 tracking-wide leading-relaxed text-sm',
        className
      )}
    >
      {children}
    </p>
  )
}
