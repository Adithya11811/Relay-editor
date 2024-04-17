'use client';
import Header from '@/components/ui/BHeader'
import Bsidebar from '@/components/ui/Bsidebar'
import { getAccountByUserId } from '@/data/user'
import { AuthProvider } from '@/hooks/AuthProvider'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react'

const DashLayout = ({ children }: { children: React.ReactNode }) => {
  const id = AuthProvider()
  const [account, setAccount] = useState();
  const pn = usePathname()
  const parr = pn.split('/')
//   console.log(parr[parr.length-1])

    useEffect(() => {
      const fetchAccount = async () => {
        try {
            if(id!==undefined){
              const response = await getAccountByUserId(id)
              setAccount(response)
            }
        } catch (error) {
          console.error('Error fetching account:', error)
        }
      }

      fetchAccount()
    }, [id])
  // console.log(id)
  if (id === undefined) {
    return <div>Loader</div>
  } else {
    return (
      <div className="grid  min-h-screen lg:grid-cols-[240px_1fr]">
        <Bsidebar id={id} proj={false}/>

        <div className="flex flex-col">
          <Header imgUrl={account?.profileImage} proj={parr[parr.length-1]=== 'projects' ? true : false} />
          {children}
        </div>
      </div>
    )
  }
}

export default DashLayout
