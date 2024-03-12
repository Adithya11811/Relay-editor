'use client'

const AuthLayout = ({
    children
}:{
    children:React.ReactNode
})=>{
    return (
        <div className="h-screen bg-black flex items-center justify-center">
          {children}
        </div>
    )
}

export default AuthLayout;