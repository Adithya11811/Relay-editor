import { Button } from '@/components/ui/button'
import { GridBackground } from './ui/herobg'
import { SparklesText } from './ui/text'
import Link from 'next/link'
import BlurryCursor from './ui/cursor'


const Hero = () => {
  return (
    <div>
      {/* <BlurryCursor /> */}
      <GridBackground>
        {/* <BlurryCursor/> */}
        <div className="h-full flex flex-col justify-center items-center">
          <SparklesText>RELAY</SparklesText>
          <div className="text-center -top-6 relative font-semibold text-xl lg:text-3xl mx-[15%] bg-clip-text text-transparent bg-gradient-to-t from-[#25df73a8] from-[150%] to-[#18ec70] to-[-150%]">
            An Online Collaborative Code Editor
          </div>
          {/* <Link href="/auth/register">
            <Button
              variant={'default'}
              className="bg-[#393939] hover:bg-slate-800 rounded-xl font-bold"
            >
              Get Started
            </Button>
          </Link> */}
        </div>
      </GridBackground>
    </div>
  )
}
export default Hero
