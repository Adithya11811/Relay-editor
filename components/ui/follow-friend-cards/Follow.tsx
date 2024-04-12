import React, { useEffect, useState } from 'react'
import {
  getAccountByAccountName,
  getProjetByAccountId,
  getAccountByUserId,
} from '@/data/user'
import { useRouter } from 'next/navigation'
// import ProjectCard from './ProjectCard'
import { AuthProvider } from '@/hooks/AuthProvider'
import Fcards from './Fcards'

interface FriendProps {
  username?: string
}

const Follow: React.FC<FriendProps> = ({ username }) => {
  const [account, setAccount] = useState<any>()
  const id = AuthProvider()
    console.log(id)
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        if (username) {
          const response = await getAccountByAccountName(username)
          setAccount(response)
        } else if (id) {
          const response = await getAccountByUserId(id)
          setAccount(response)
        }
      } catch (error) {
        console.error('Error fetching account:', error)
      }
    }

    fetchAccount()
  }, [username, id])
//   console.log(username)
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid items-start justify-center gap-4">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {account?.follow?.length === 0 ? (
              <div>
                {typeof username !== 'string'
                  ? 'You have no-one following you'
                  : 'follow them'}
              </div>
            ) : (
              account?.follow?.map((friendsid: string, index: string) => (
                <Fcards key={index} fid={friendsid} />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Follow
