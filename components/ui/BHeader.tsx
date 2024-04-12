'use client';
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu"
import { Button } from "./button"
import Image from "next/image"
import { LogoutButton } from "../auth/logout-button"
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface profileProps {
    imgUrl: string
    proj: true | false | 'koi mil gaya'

}

const Header: React.FC<profileProps> = ({imgUrl, proj}) => {
  const router = useRouter()
  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 px-6 bg-gray-800/40">
        <Link className="lg:hidden flex items-center gap-2 font-semibold" href="#">
          <span className="">Relay</span>
        </Link>
      {typeof proj !== 'string' && (
        <nav className=" flex flex-1 gap-2 lg:gap-4 justify-center text-sm">
          <Link
            className={`hidden lg:flex items-center gap-2 rounded-lg hover:scale-105 px-3 py-2 tracking-wide transition-all text-gray-400 ${
              !proj ? 'bg-slate-800 hover:text-gray-50' : 'hover:text-gray-50'
            }`}
            href="/profile"
          >
            Profile
          </Link>
          <Link
            className={`flex items-center gap-2 rounded-lg hover:scale-105 px-3 py-2 tracking-wide transition-all text-gray-400 ${
              proj ? 'bg-slate-800 hover:text-gray-50' : ''
            }`}
            href="/profile/projects"
          >
            Projects
          </Link>
        </nav>
      )}
      {typeof proj === 'string' && (
        <Button
          variant={'link'}
          className="rounded-lg px-3 hover:scale-110 py-2 flex items-center gap-2 border-slate-700 border transition-all text-gray-400 hover:text-gray-50"
        >
          <div
            className="flex items-center gap-2 justify-center  transition-all text-gray-400 hover:text-gray-50"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} strokeWidth={0.5} />
            back
          </div>
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={`rounded-full border-2 border-green-600 w-8 h-8 dark:border-gray-800 ${
              typeof proj === 'string' ? 'absolute right-8' : ''
            }`}
            id="user-menu"
            size="icon"
            variant="ghost"
          >
            <Image
              alt="Avatar"
              className="rounded-full"
              height="32"
              src={imgUrl || '/hsec1.jpg'}
              style={{
                aspectRatio: '32/32',
                objectFit: 'cover',
              }}
              width="32"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-slate-800/20  text-gray-400"
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="focus:text-gray-50 focus:bg-slate-800/20">
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:text-gray-50 focus:bg-slate-800/20">
            Support
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem className="focus:text-gray-50 focus:bg-slate-800/60">
            <LogoutButton>Logout</LogoutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
export default Header