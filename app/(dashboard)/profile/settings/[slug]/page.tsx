import UpdateACC from "@/components/auth/updateacc"
import { getAccountByUserId } from "@/data/user"
interface SettingsProps {
  params:{
    slug:string
  }
} 

const page:React.FC<SettingsProps> = async ({params}) => {
  const id = params.slug
  const acc = await getAccountByUserId(id)
  return (
    <div className="w-full h-full flex justify-center items-center"><UpdateACC acc={acc}/></div>
  )
}
export default page