'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { BiMenuAltRight, BiX } from 'react-icons/bi'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/use-current-user'

type Link = {
  label: string
  url: string
}


const Navbar = () => {
  const user = useCurrentUser();
  const [isMenuActive, setIsMenuActive] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true)
      } else {
        setScrolling(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive)
  }
    
    return (
    
    <div
      className={`fixed w-screen z-50 bg-transparent bg-blend-saturation transition-colors ${
        scrolling ? 'bg-custom-color' : 'bg-transparent'
      }`}
    >
      <div className="mx-8 flex flex-col py-3 text-lg font-bold text-[#25DF74] sm:mx-8 lg:mx-32">
        <div className="flex justify-between">
          <Link
            href="/"
            className="flex items-center justify-center font-extrabold text-xl"
          >
            RELAY
          </Link>
          <div className="hidden space-x-10 ml-32 lg:flex lg:justify-center lg:items-center">
            <Link className="flex font-medium items-center" href="/">
              Home
            </Link>
            <Link className="flex font-medium items-center" href="/about">
              About US
            </Link>
            <Link className="flex font-medium items-center" href="/contact">
              Contact
            </Link>
          </div>
          <div className="space-x-5 hidden lg:flex">
            <Link
              className="flex items-center justify-center"
              href="/auth/login"
            >
              Sign in
            </Link>
            <Link href={'/auth/register'}>
              <Button
                variant="default"
                className="bg-[#393939] my-2 hover:bg-slate-800 rounded-xl font-bold"
              >
                Register
              </Button>
            </Link>
          </div>
          <div
            className="flex items-center text-2xl lg:hidden"
            onClick={toggleMenu}
          >
            {!isMenuActive ? <BiMenuAltRight /> : <BiX />}
          </div>
        </div>
        {isMenuActive && <MobileNav />}
      </div>
    </div>
    )
  }
  
const MobileNav = () => {
  return (
    <div className="z-200 mt-4 w-screen h-screen">
      <div className="flex flex-col space-y-3 py-5 md:hidden">
        <Link className="flex items-center" href="/about">
          About US
        </Link>
        <Link className="flex items-center" href="/contact">
          Contact
        </Link>
        <Link className="flex items-center" href="/signin">
          Sign in
        </Link>
        <Link className="flex items-center" href="/signin">
          Register
        </Link>
      </div>
    </div>
  )
}

export default Navbar
