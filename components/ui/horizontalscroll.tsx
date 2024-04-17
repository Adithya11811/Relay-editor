'use client'
import { motion, useTransform, useScroll } from 'framer-motion'
import { useRef } from 'react'

interface CardProps {
  card: {
    // url: string
    title: string
    id: number
  }
}

const HorizontalScrollCarousel: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ['50%', '-85%'])

  return (
    <section ref={targetRef} className="relative h-[500vh] bg-black">
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
    <motion.div
      key={card.id}
      className="group relative scroll-smooth m-8 border-4 rounded-lg border-green-500 h-[350px] w-[400px] overflow-hidden flex bg-transparent"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }} // Adjust the duration as needed
    >
      {/* Left side content */}
      <div className="flex-1 m-16">
        <div className="grid place-content-center h-full">
          {/* Card ID at top left corner */}
          <div className="absolute top-0 left-0 m-2 opacity-50 text-white text-7xl font-bold">
            0{card.id}
          </div>

          {/* Title at bottom right corner */}
          <motion.div className="absolute bottom-0 opacity-30 left-0 m-2 text-white text-5xl font-bold"
          whileHover={{opacity:1}}
          transition={{duration:0.6}}>
            {card.title}
          </motion.div>
        </div>
      </div>

      {/* Right side photo */}
      {/* Add your photo component here */}
    </motion.div>
  )
}

export default HorizontalScrollCarousel

const cards = [
  {
    // url: '/hsec1.jpg',
    title: 'Interactive Coding Platform',
    id: 1,
  },
  {
    // url: '/hsec2.jpg',
    title: 'Collaborative',
    id: 2,
  },
  {
    // url: '/hsec3.jpg',
    title: 'Integrated with AI',
    id: 3,
  },
  {
    // url: '/hsec4.jpg',
    title: 'diverse coding languages',
    id: 4,
  },
  {
    // url: '/hsec3.jpg',
    title: 'Build strong Community',
    id: 5,
  },
]
      // <div
      //   style={{
      //     backgroundImage: `url(${card.url})`,
      //     backgroundSize: 'cover',
      //     backgroundPosition: 'center',
      //   }}
      //   className="h-full w-1/2 transition-transform duration-300 group-hover:scale-110"
      // ></div>