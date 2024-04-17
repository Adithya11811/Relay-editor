import Link from 'next/link'
interface HeaderProps{
    label:string;
    bg?:'dark'

}


export const Header = ({label, bg}:HeaderProps)=>{
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <Link
          href="/"
          className={`text-3xl  font-semibold ${
            bg === 'dark' ? 'text-slate-300' : ''
          }`}
        >
          Relay-Editor
        </Link>
        <div className=" text-sm text-green-500">{label}</div>
      </div>
    )   
}