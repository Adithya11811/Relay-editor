import { RegisterForm } from '@/components/auth/register-form'
import CloseModal from '@/components/ui/CloseModal'
import { FC } from 'react'

const Page: FC = () => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm z-[60]">
      <div className="container flex justify-center items-center h-full max-w-lg mx-auto">
        <div className="relative w-full h-fit py-16 px-5 rounded-lg">
          <div className="relative z-2 w-full text-xl text-green-500 top-10 left-[23rem]">
            <CloseModal />
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default Page
