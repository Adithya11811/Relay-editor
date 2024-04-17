/**
 * v0 by Vercel.
 * @see https://v0.dev/t/pIbDD2TaFib
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="flex flex-col shrink-0 w-full border-t-2 border-green-500/20 bg-gray-950 dark:border-gray-950 dark:bg-gray-50">
      <div className="container grid max-w-6xl min-h-[200px] grid-cols-12 items-center gap-4 py-6 text-sm md:gap-8 md:py-10">
        <div className="col-span-12 flex flex-col gap-1">
          <Link
            className="inline-flex items-center space-x-2 font-semibold text-gray-100 hover:text-gray-100 dark:text-gray-900 dark:hover:text-gray-900"
            href="#"
          >
            <FlagIcon className="w-5 h-5 fill-current" />
            Relay
          </Link>
          <p className="text-gray-400 dark:text-gray-400">
            The modern Coding platform.
          </p>
        </div>
        <nav className="col-span-12 flex flex-col gap-2 md:flex-row md:col-start-4 md:col-span-2 lg:gap-4 lg:col-start-5 lg:col-span-3 xl:col-start-6 xl:col-span-2">
          <Link
            className="text-gray-100 hover:underline dark:text-gray-900"
            href="#about"
          >
            About
          </Link>
          <Link
            className="text-gray-100 hover:underline dark:text-gray-900"
            href="#"
          >
            Contact
          </Link>
        </nav>
        <div className="col-span-12 flex flex-col gap-2 md:col-start-8 md:col-span-4 lg:col-start-11 lg:col-span-2 xl:col-start-10 xl:col-span-3">
          <div className="flex items-center gap-5">
            <Link
              className="rounded-xl  scale-150 text-white"
              href="https://github.com/Adithya11811/Relay-editor"
            >
              {/* <Image
                alt="Avatar"
                className="rounded-full"
                height="32"
                src="/placeholder.svg"
                style={{
                  aspectRatio: '32/32',
                  objectFit: 'cover',
                }}
                width="32"
              /> */}
              <FaGithub />
            </Link>
            <Link
              className="rounded-xl  scale-150 text-white"
              href="https://www.linkedin.com/in/adithya-rao-k/"
            >
              {/* <Image
                alt="Avatar"
                className="rounded-full"
                height="32"
                src="/placeholder.svg"
                style={{
                  aspectRatio: '32/32',
                  objectFit: 'cover',
                }}
                width="32"
              /> */}
              <FaLinkedin />
            </Link>
          </div>
        </div>
        <div className="col-span-12 flex flex-col gap-2 md:col-start-6 md:col-span-6 lg:col-start-1 lg:col-span-4 xl:col-start-4 xl:col-span-6 -ml-48">
          <Link
            className="text-gray-100 hover:underline dark:text-gray-900"
            href="#"
          >
            Terms & Conditions
          </Link>
          <Link
            className="text-gray-100 hover:underline dark:text-gray-900"
            href="#"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="col-span-12 -ml-54 flex flex-col gap-2 md:col-start-12 md:col-span-12 items-start justify-center text-center md:text-right lg:items-center lg:gap-4 lg:flex-row xl:col-start-12 xl:col-span-12">
          <p className="text-gray-100 text-xs dark:text-gray-900">
            Made By Adithya Rao K and Arshad Sheikh
          </p>
          <p className="text-gray-100 text-xs dark:text-gray-900">
            © 2024 Relay Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FlagIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  )
}
