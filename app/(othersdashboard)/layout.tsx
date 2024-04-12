'use client'
import Header from '@/components/ui/BHeader'
import Bsidebar from '@/components/ui/Bsidebar'
import { getAccountByAccountName, getAccountByUserId } from '@/data/user'
import { AuthProvider } from '@/hooks/AuthProvider'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const DashLayout = ({ children }: { children: React.ReactNode }) => {
  const id = AuthProvider()
  const [account, setAccount] = useState()
  const [uraccount, setUraccount] = useState()
  const pn = usePathname()
  const parr = pn.split('/')
  let name;
  if(parr.length === 2){
    name = parr[parr.length - 1]
  }else{
    name = parr[parr.length - 2]
  }
  
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        if (name !== undefined) {
          const response = await getAccountByAccountName(name)
          setAccount(response)
        }
      } catch (error) {
        console.error('Error fetching account:', error)
      }
    }

    fetchAccount()
  }, [name])

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        if (id !== undefined) {
          const response = await getAccountByUserId(id)
          setUraccount(response)
        }
      } catch (error) {
        console.error('Error fetching account:', error)
      }
    }

    fetchAccount()
  }, [id])
  // console.log(id)
  if (name === undefined ) {
    return <div>Loader</div>
  } else {
    return (
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <Bsidebar id={account?.id} proj={true} username={account?.username} />

        <div className="flex flex-col">
          <Header imgUrl={uraccount?.profileImage} proj={'koi mil gaya'} />
          {children}
        </div>
      </div>
    )
  }
}

export default DashLayout
