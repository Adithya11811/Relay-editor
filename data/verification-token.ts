import { db } from "@/lib/db";
export const getVerificatonTokenByEmail = async(email: string)=>{
    try{
        const verificationToken = await db.verificationToken.findFirst({
            where:{email}
        });
        return verificationToken;
    }catch{
        return null;
    }
}
export const getVerificatonTokenByToken = async(token: string)=>{
    try{
        const verificationToken = await db.verificationToken.findFirst({
            where:{token}
        });
        return verificationToken;
    }catch{
        return null;
    }
}