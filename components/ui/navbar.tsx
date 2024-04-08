'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { BiMenuAltRight, BiX } from 'react-icons/bi'
import { Button } from '@/components/ui/button'

// Define the type for the navigation links
type NavLink = {
  label: string
  url: string
}

// Main Navbar component
const Navbar = () => {  
  // State to manage the mobile menu visibility
  const [isMenuActive, setIsMenuActive] = useState(false)
  
  // State to manage the scrolling behavior
  const [scrolling, setScrolling] = useState(false)
  
  // Effect to update scrolling state based on window scroll position
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

  // Function to toggle mobile menu visibility
  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive)
  }
    
  return (
    <div
      className={`absolute overflow-clip w-full z-50 bg-transparent bg-blend-saturation transition-colors`}
    >
      <div className="mx-8 flex flex-col py-3 text-lg font-bold text-[#25DF74] sm:mx-8 lg:mx-32">
        <div className="flex justify-between">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex items-center justify-center font-extrabold text-xl"
          >
            RELAY
          </Link>
          
          {/* Main Navigation Links (Desktop) */}
          <div className="hidden space-x-10 ml-32 lg:flex lg:justify-center lg:items-center">
            <Link className="flex font-medium items-center" href="/">
              Home
            </Link>
            <Link className="flex font-medium items-center" href="#about">
              About US
            </Link>
            <Link className="flex font-medium items-center" href="/contact">
              Contact
            </Link>
          </div>
          
          {/* Sign-in/Register Buttons (Desktop) */}
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
          
          {/* Mobile Menu Toggle Button */}
          <div
            className="flex items-center text-2xl lg:hidden"
            onClick={toggleMenu}
          >
            {!isMenuActive ? <BiMenuAltRight /> : <BiX />}
          </div>
        </div>
        
        {/* Mobile Navigation (Conditional rendering) */}
        {isMenuActive && <MobileNav />}
      </div>
    </div>
  )
}

// MobileNav component for rendering mobile menu links
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
