export const SideBar = ({...props})=>{
    return (
      <div className="hover:border hover:border-green-600 p-2 bg-gray-800/40 text-lg w-60">
        {props.fileName}
      </div>
    )
}