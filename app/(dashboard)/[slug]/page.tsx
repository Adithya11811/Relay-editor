'use client';
import { db } from '@/lib/db';
import { usePathname } from 'next/navigation'

const Page = () => {
  const pathname = usePathname()
  const trimmedPathname = pathname.substring(1) 
  // const ans = db.account.findFirst({
  //   where:{
  //     username: trimmedPathname
  //   }
  // })
  // if(ans === null){
  //   return <div>Chuthiya sari hesr haku laude</div>
  // }

  return <div>Hello: {trimmedPathname}</div>
}

export default Page