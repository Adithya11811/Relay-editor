
import Navbar from '@/components/ui/navbar'
import Hero from '../components/Hero'
import CustomCursor from '@/components/ui/customCursor'
import dynamic from 'next/dynamic'
// import Langs from '@/components/lang'
const Responsive = dynamic( () => import('@/components/3d/responsive'),
  { ssr: false }
)


const page = () => {
  return (
    <>
      <Navbar/>
      <Hero />
      <Responsive/>
    </>
  );
}
export default page
