
import Navbar from '@/components/ui/navbar'
import Hero from '../components/Hero'
import CustomCursor from '@/components/ui/customCursor'
import Enter from '@/components/ui/Enter/Enter';
import HorizontalScrollCarousel from '@/components/ui/horizontalscroll';
import Footer from '@/components/ui/footer';
import Aboutus from '@/components/ui/Aboutus';


const page = () => {
  return (
    <div className='bg-black'>
      <Navbar/>
      <Hero />
      <Enter/>
      <HorizontalScrollCarousel/>
      {/* <div className='h-screen bg-red-300'></div> */}
      <Aboutus/>
      <Footer/>
      
    </div>
  );
}
export default page
