'use client'

import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { Button } from './button'

interface CloseModalProps {}

const CloseModal: FC<CloseModalProps> = ({}) => {
  const router = useRouter()

  return (
    <Button variant='runner' className='h-6 w-6 p-0 rounded-md' onClick={() => router.back()}>
      <X aria-label='close modal' className='h-4 w-4 text-white' />
    </Button>
  )
}

export default CloseModal