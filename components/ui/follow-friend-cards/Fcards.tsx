import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaJs, FaPython } from 'react-icons/fa'
import { TbBrandCpp } from 'react-icons/tb'
import { SiCodio, SiTypescript } from 'react-icons/si'
import { motion } from 'framer-motion'
import { IoLogoJavascript } from 'react-icons/io'
import { getAccountById } from '@/data/user'

interface FriendCardProps {
  fid: string
}

const Fcards: React.FC<FriendCardProps> = ({ fid }) => {
        const [account, setAccount] = useState()
        // console.log(fid)
      useEffect(() => {
        const fetchAccount = async () => {
          try {
            if (fid !== undefined) {
              const response = await getAccountById(fid)
              setAccount(response)
            }
          } catch (error) {
            console.error('Error fetching account:', error)
          }
        }

        fetchAccount()
      }, [fid])
    if(account?.username === undefined){
      return(<div>Loader</div>)
    }
  return (
    <Link href={`/${account?.username}`}>
      <motion.div
        className="bg-gray-800/40 rounded-lg shadow-md p-4 m-4 flex items-center justify-center w-[200px] hover:border-2 gap-3 hover:border-green-500"
        whileHover={{ scale: 1.1, borderColor: '#10B981' }}
        transition={{ duration: 0.5 }}
      >
        
        <Image
          alt="Avatar"
          className="rounded-full"
          height="48"
          src={`${account?.profileImage}` || '/hsec1.jpg'}
          style={{
            aspectRatio: '48/48',
            objectFit: 'cover',
          }}
          width="48"
        />
        <div>
          <h2 className="text-sm text-green-500 opacity-75 hover:shadow-xl font-semibold">
            {`${account?.username}`}
          </h2>
        </div>
      </motion.div>
    </Link>
  )
}

export default Fcards
