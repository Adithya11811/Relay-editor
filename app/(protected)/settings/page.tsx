"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
const SettingsPage = () =>{
    const user = useCurrentUser();


    return(
        <div className="h-full flex flex-col items-center justify-center p-52">
            {
                JSON.stringify(user)
            }
            
        </div>
    )
}

export default SettingsPage;