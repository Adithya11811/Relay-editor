import Link from 'next/link'
interface HeaderProps{
    label:string;
}


export const Header = ({label}:HeaderProps)=>{
    return(
        <div className="w-full flex flex-col items-center justify-center">
            <Link href='/' className="text-3xl font-semibold">Relay-Editor</Link>
            <div className=" text-sm text-green-500">
                {label}
            </div>
        </div>
    )   
}