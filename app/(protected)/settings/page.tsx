"use client";
import { LogoutButton } from "@/components/auth/logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";
const SettingsPage = () =>{
    const user = useCurrentUser();


    return(
        <div className="h-full flex flex-col items-center justify-center p-52">
            
            <LogoutButton>
                SignOut
            </LogoutButton>
        </div>
    )
}

export default SettingsPage;