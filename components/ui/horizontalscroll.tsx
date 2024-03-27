'use client'
import { motion, useTransform, useScroll } from 'framer-motion'
import { useRef } from 'react'

interface CardProps {
  card: {
    url: string
    title: string
    id: number
  }
}

const HorizontalScrollCarousel: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ['1%', '-95%'])

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card) => {
            return <Card card={card} key={card.id} />
          })}
        </motion.div>
      </div>
    </section>
  )
}

const Card: React.FC<CardProps> = ({ card }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-screen overflow-hidden flex bg-gradient-to-br from-white/20 to-white/0"
    >
      {/* Left side content */}
      <div className="flex-1">
        <div className="grid place-content-center h-full">
          <div className="p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
            {card.title}
          </div>
        </div>
      </div>

      {/* Right side photo */}
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="h-full w-1/2 transition-transform duration-300 group-hover:scale-110"
      ></div>
    </div>
  )
}


export default HorizontalScrollCarousel

const cards = [
  {
    url: '/hsec1.jpg',
    title: 'Interactive Coding Platform',
    id: 1,
  },
  {
    url: '/hsec2.jpg',
    title: 'Collaborative',
    id: 2,
  },
  {
    url: '/hsec3.jpg',
    title: 'Supports Multiple Interfaces',
    id: 3,
  },
  {
    url: '/hsec4.jpg',
    title: 'diverse coding languages',
    id: 4,
  },
]
