"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

interface LogoutButtonProps{
    children?:React.ReactNode;
    
}

export const LogoutButton = ({
    children
}:LogoutButtonProps)=>{
        const router = useRouter();
        const onClick = ()=>{
        axios.post("/api/auth/logout").then((data)=>{
            router.push("/auth/login");
        }).catch((error)=>{
            console.log(error);
        });
    }
    return(
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}