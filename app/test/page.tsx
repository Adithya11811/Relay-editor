import dynamic from "next/dynamic"

const Screens = dynamic(()=>import('@/components/threed/screens'), {ssr: false})
const page = () => {
  return (
    <div className="h-screen">
      <Screens />
    </div>
  )
}
export default page