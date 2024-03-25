// // Import React and useEffect
// 'use client'
// // Import GSAP and ScrollTrigger
// import { gsap } from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { clamp, mapRange } from '@/lib/math'
// import { useEffect, useRef, useState } from 'react'
// import { useFrame, useRect } from '@studio-freight/hamo'
// import { button, useControls } from 'leva'
// import cn from 'clsx'
// import { useScroll } from '@/hooks/useScroll'
// import { useIntersection, useWindowSize } from 'react-use'

// // Register the ScrollTrigger plugin
// gsap.registerPlugin(ScrollTrigger)

// // Define the Langs component
// const Langs = () => {
//   const zoomRef = useRef(null)
//   const [hasScrolled, setHasScrolled] = useState<boolean>(false)
//   const [zoomWrapperRectRef, zoomWrapperRect] = useRect()
//    const { height: windowHeight } = useWindowSize()

//   useScroll(({ scroll }: { scroll: number }) => {
//     setHasScrolled(scroll > 10)
//     if (!zoomWrapperRect.top) return

//     const start = zoomWrapperRect.top + windowHeight * 0.5
//     const end = zoomWrapperRect.top + zoomWrapperRect.height - windowHeight

//     const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)
//     const center = 0.6
//     const progress1 = clamp(0, mapRange(0, center, progress, 0, 1), 1)
//     const progress2 = clamp(0, mapRange(center - 0.055, 1, progress, 0, 1), 1)
//     // setTheme(progress2 === 1 ? 'light' : 'dark')

//     if (zoomRef && zoomRef.current) {
//       zoomRef.current.style.setProperty('--progress1', String(progress1))
//       zoomRef.current.style.setProperty('--progress2', String(progress2))

//       // if (progress === 1) {
//       //   zoomRef.current.style.setProperty('background-color', 'currentColor')
//       // } else {
//       //   zoomRef.current.style.removeProperty('background-color')
//       // }
//     }
//   })

//   return (
//     <div className="h-[600vh] bg-black">
//       <div className="h-screen flex flex-col lg:-pt-8 lg:pb-6 lg:p-16 px-8 py-16 bg-black lg:px-28 overflow-hidden zoomin">
//         <div className="flex flex-col h-1/3 my-2 dcl">
//           <span className="font-bold text-white text-3xl lg:text-4xl">
//             DIVERSE
//           </span>
//           <span className="font-bold text-4xl lg:text-5xl text-[#25df73a8]">
//             CODING <br /> LANGUAGES
//           </span>
//         </div>
//         <div className="h-1/3 flex flex-col justify-end items-center text-center font-bold text-[#ccc7c7] relative text-6xl main">
//           <span className="tracking-widest">ENTER</span>
//           <span className="tracking-tight">RELAY</span>
//         </div>
//         <div className="h-1/3 flex flex-col justify-end items-end si">
//           <span className="font-bold text-white text-3xl lg:text-4xl">
//             SLEEK
//           </span>
//           <span className="font-bold text-4xl lg:text-5xl text-[#25df73a8]">
//             INTERFACE
//           </span>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Export the Langs component as default
// export default Langs

// // 'use client';
// // import { useRef, useState, useEffect } from 'react'
// // import cn from 'clsx'
// // import s from './lang.module.scss'
// // import { useRect } from '@studio-freight/hamo'
// // import { useScroll } from '@/lib/use-scroll';
// // import { clamp, mapRange } from '@/lib/math'
// // import { useStore } from '@/lib/store'

// // interface WindowSize {
// //   height: number
// // }

// // interface LangProps {
// //   className?: string
// // }

// // const Lang: React.FC<LangProps> = ({ className }) => {
// //   const zoomRef = useRef<HTMLElement | null>(null)
// //   const [hasScrolled, setHasScrolled] = useState<boolean>(false)
// //       const [zoomWrapperRectRef, zoomWrapperRect] = useRect()

// //   const windowHeight = window.innerHeight

// //   const clamp = (min: number, value: number, max: number): number => {
// //     return Math.min(Math.max(min, value), max)
// //   }

// //   const mapRange = (
// //     inputStart: number,
// //     inputEnd: number,
// //     outputStart: number,
// //     outputEnd: number,
// //     input: number
// //   ): number => {
// //     return (
// //       outputStart +
// //       ((outputEnd - outputStart) / (inputEnd - inputStart)) *
// //         (input - inputStart)
// //     )
// //   }

// // useScroll(({ scroll }: { scroll: number }) => {
// //   // Logic for scroll event
// //   setHasScrolled(scroll > 10)
// //   if (!zoomWrapperRect?.top) return

// //   const start: number = zoomWrapperRect.top + windowHeight * 0.5
// //   const end: number =
// //     zoomWrapperRect.top + zoomWrapperRect.height - windowHeight

// //   const progress: number = clamp(0, mapRange(start, end, scroll, 0, 1), 1)
// //   const center: number = 0.6
// //   const progress1: number = clamp(0, mapRange(0, center, progress, 0, 1), 1)
// //   const progress2: number = clamp(
// //     0,
// //     mapRange(center - 0.055, 1, progress, 0, 1),
// //     1
// //   )

// //   if (zoomRef.current) {
// //     zoomRef.current.style.setProperty('--progress1', progress1.toString())
// //     zoomRef.current.style.setProperty('--progress2', progress2.toString())

// //     if (progress === 1) {
// //       zoomRef.current.style.setProperty('background-color', 'currentColor')
// //     } else {
// //       zoomRef.current.style.removeProperty('background-color')
// //     }
// //   }
// // })

// //   return (

// //     <section
// //       ref={(node) => {
// //         zoomWrapperRectRef(node)
// //         zoomRef.current = node
// //       }}
// //       className={s.solution}
// //     >
// //       <div className={s.inner}>
// //         <div className={s.zoom}>
// //           <h2 className={cn(s.first, 'h1 vh')}>
// //             so we built <br />
// //             <span className="contrast">web scrolling</span>
// //           </h2>
// //           <h2 className={cn(s.enter, 'h3 vh')}>
// //             Enter <br /> Lenis
// //           </h2>
// //           <h2 className={`${cn(s.second, 'h1 vh')}`}>As it should be</h2>
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }

// // export default Lang

// // Use useEffect to run code after the component mounts
// // useEffect(() => {
// //   // Create a GSAP timeline for the scroll-triggered animation
// //   const zoomscroll = gsap.timeline({
// //     scrollTrigger: {
// //       trigger: '.zoomin', // The trigger element
// //       start: '0% 0%',
// //       end: '100% 0%',
// //       scrub: 2.2, // Scrubbing effect
// //       pin: true,
// //     },
// //   })

// //   // Add animations to the timeline
// //   // zoomscroll
// //   //   .to('.zoomin .dcl', { scale: 15, duration: 40 }, 0)
// //   //   .to('.zoomin .main', { scale: 12,  duration: 40 }, 0)
// //   //   .to('.zoomin .si', { scale: 15, duration: 40 }, 0)
// //   //   .from('.zoomin .dcl', { scale: 1, duration: 2 }, 0)
// //   //   .from('.zoomin .main', { scale: 0.7,opacity:0.2, duration: 20 }, 0)
// //   //   .from('.zoomin .si', { scale: 1, duration: 2 }, 0)

// // }, [])

// // Return the JSX for the Langs component
