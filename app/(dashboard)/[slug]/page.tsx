'use client';
import { getAccountByAccountName } from '@/data/user'
import { AuthProvider } from '@/hooks/AuthProvider'
import { redirect, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
  const pathname = usePathname()
  const [account, setAccount] = useState<unknown | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const id = AuthProvider()
  const router = useRouter()

  useEffect(() => {
    const trimmedPathname = pathname.substring(1)
    const fetchData = async () => {
      try {
        const acc = await getAccountByAccountName(trimmedPathname)
        setAccount(acc)
        setIsLoaded(true)
      } catch (error) {
        setIsLoaded(true) // Set isLoaded to true even if fetching fails to avoid infinite loop
        console.error('Error fetching account:', error)
      }
    }
    fetchData()
  }, [pathname])

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    if (account?.userId === undefined || id === undefined) {
      return 
    }

    if (account.userId === id) {
      redirect('/profile')
    } else {
      console.log(account)
      if(account === null){
        router.push('/1/404')
      }
    }
  }, [isLoaded, account, id, router])

  if (!isLoaded || id === undefined) {
    return <div>Loader....</div>
  }
  if(account === null){
    router.push('/1/404')
  }
  
  return <div>Hello: {account?.id}</div>
}

export default Page

