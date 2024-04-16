'use client'
import Bsidebar from '@/components/ui/Bsidebar'
import DHeader from '@/components/discussions/discheader'
import { getAccountByUserId } from '@/data/user'
import { AuthProvider } from '@/hooks/AuthProvider'
import { useEffect, useState } from 'react'

const DiscLayout = ({ children }: { children: React.ReactNode }) => {
  const id = AuthProvider()
  const [account, setAccount] = useState()

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        if (id !== undefined) {
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
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <Bsidebar id={id} proj={false} />

        <div className="flex flex-col">
          <DHeader imgUrl={account?.profileImage} />
          {children}
        </div>
      </div>
    )
  }
}

export default DiscLayout
