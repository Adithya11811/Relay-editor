'use client';
import { useRef, useEffect } from 'react'
import styles from './styles.module.css'
import HorizontalScrollCarousel from '../horizontalscroll';

interface HomeProps {}

const Enter: React.FC<HomeProps> = () => {
  const container = useRef<HTMLDivElement>(null)
  const stickyMask = useRef<HTMLDivElement>(null)

  const initialMaskSize: number = 0.8
  const targetMaskSize: number = 30
  const easing: number = 0.15
  let easedScrollProgress: number = 0

  useEffect(() => {
    requestAnimationFrame(animate)
  }, [])

  const animate = (): void => {
    const maskSizeProgress: number = targetMaskSize * getScrollProgress()
    if (stickyMask.current)
      stickyMask.current.style.webkitMaskSize =
        (initialMaskSize + maskSizeProgress) * 100 + '%'
    requestAnimationFrame(animate)
  }

  const getScrollProgress = (): number => {
    if (!stickyMask.current || !container.current) return 0
    const scrollProgress: number =
      stickyMask.current.offsetTop /
      (container.current.getBoundingClientRect().height - window.innerHeight)
    const delta: number = scrollProgress - easedScrollProgress
    easedScrollProgress += delta * easing
    return easedScrollProgress
  }

  return (
    <main className={styles.main}>
      <div ref={container} className={styles.container}>
        <div ref={stickyMask} className={styles.stickyMask}>
          <video autoPlay muted loop>
            <source src="/medias/nature.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      {/* <HorizontalScrollCarousel/> */}
    </main>
  )
}

export default Enter
