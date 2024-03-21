import { cn } from '@/lib/utils'
import { Dialog, DialogTrigger, DialogContent } from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

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
  

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  py-5',
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
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-neutral-200 block  rounded-3xl"
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
        'rounded-2xl h-full w-full overflow-hidden bg-slate-700 border border-black dark:border-white/[0.2] group-hover:border-slate-300 relative z-20',
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
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
    <h4 className={cn('text-zinc-100 font-bold tracking-wide', className)}>
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
